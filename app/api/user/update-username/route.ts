// Example: /app/api/user/update-username/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path
import dbConnect from "@/lib/mongoose"; // Adjust path
import User from "@/app/models/User"; // Adjust path
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) { // Or POST
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { username } = await request.json();
        // @ts-ignore
        const userId = session.user.id;

        if (!username || username.trim().length < 3) {
            return NextResponse.json({ message: "Username must be at least 3 characters long." }, { status: 400 });
        }

        await dbConnect();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username: username.trim() },
            { new: true, runValidators: true } // runValidators to ensure schema rules are checked
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Username updated successfully.", user: { username: updatedUser.username } }, { status: 200 });

    } catch (error: any) {
        console.error("Update username error:", error);
        if (error.code === 11000) { // MongoDB duplicate key error
            return NextResponse.json({ message: "Username already taken." }, { status: 409 });
        }
        return NextResponse.json({ message: "Error updating username.", error: error.message }, { status: 500 });
    }
}