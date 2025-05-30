// Example: /app/api/user/update-username/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { username } = await request.json();
        const userId = session.user.id;

        if (!username || username.trim().length < 3) {
            return NextResponse.json({ message: "Username must be at least 3 characters long." }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { username }
        });        // Return updated user data (excluding password)
        const { ...userWithoutPassword } = updatedUser;
        return NextResponse.json({ user: userWithoutPassword });

    } catch (error) {
        console.error("Update username error:", error);
        if (error instanceof Error && 'code' in error && error.code === 'P2002') { // Prisma unique constraint error
            return NextResponse.json({ message: "Username already taken." }, { status: 409 });
        }
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ message: "Error updating username.", error: errorMessage }, { status: 500 });
    }
}