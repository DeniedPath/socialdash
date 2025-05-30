import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createMockDataForUser } from '@/lib/mockData';

export async function POST(request: NextRequest) {
    console.log("Starting signup process...");
    
    try {
        // Parse the request body
        const body: Record<string, unknown> = await request.json();
        console.log("Signup request received:", {
            email: body.email,
            username: body.username,
            passwordProvided: !!body.password
        });
        
        const { username, email, password } = body;

        // Validate input
        if (!username || !email || !password) {
            console.log("Signup validation failed: Missing required fields");
            return NextResponse.json(
                { success: false, message: 'Please provide all required fields: username, email, and password' },
                { status: 400 }
            );
        }

        // Type assertions after validation
        const usernameStr = username as string;
        const emailStr = email as string;
        const passwordStr = password as string;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailStr)) {
            console.log("Signup validation failed: Invalid email format");
            return NextResponse.json(
                { success: false, message: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (passwordStr.length < 6) {
            console.log("Signup validation failed: Password too short");
            return NextResponse.json(
                { success: false, message: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // Check if user already exists
        console.log("Checking if user already exists...");
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailStr },
                    { username: usernameStr }
                ]
            }
        });

        if (existingUser) {
            console.log("Signup failed: User already exists");
            return NextResponse.json(
                { success: false, message: 'User with that email or username already exists' },
                { status: 409 }
            );
        }

        // Hash the password with bcrypt before storing
        console.log("Hashing password...");
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwordStr, saltRounds);
          console.log("Creating new user...");
        // Create new user with Prisma
        const newUser = await prisma.user.create({
            data: {
                username: usernameStr,
                email: emailStr,
                password: hashedPassword
            }
        });
        
        // Create mock analytics data for the new user
        await createMockDataForUser(newUser.id);
        
        console.log("User created successfully with ID:", newUser.id);
        // Exclude password from the response
        const { password: _password, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                user: userWithoutPassword
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Signup error:', error);        // Prisma unique constraint violation
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
            return NextResponse.json(
                { 
                    success: false, 
                    message: 'A user with that email or username already exists' 
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { 
                success: false, 
                message: 'Error registering user', 
                error: error instanceof Error ? error.message : "Unknown error" 
            },
            { status: 500 }
        );
    }
}