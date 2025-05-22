import { connectToDatabase } from '@/lib/db';
import User from '@/app/models/User';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    console.log("Starting signup process...");
    
    try {
        // Connect to the database
        await connectToDatabase();

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
        }        // Type assertions after validation
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
        }        // Validate password strength
        if (passwordStr.length < 6) {
            console.log("Signup validation failed: Password too short");
            return NextResponse.json(
                { success: false, message: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // Check if user already exists
        console.log("Checking if user already exists...");        const existingUser = await User.findOne({
            $or: [{ email: emailStr }, { username: usernameStr }]
        });

        if (existingUser) {
            console.log("Signup failed: User already exists");
            return NextResponse.json(
                { success: false, message: 'User with that email or username already exists' },
                { status: 409 }
            );
        }        // Hash the password with bcrypt before storing
        console.log("Hashing password...");
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwordStr, saltRounds);
        
        console.log("Creating new user...");        // Create new user with the hashed password
        const newUser = new User({
            username: usernameStr,
            email: emailStr,
            password: hashedPassword
        });
        
        // Save the user to database
        const savedUser = await newUser.save();
        console.log("User created successfully with ID:", savedUser._id);

        // Exclude password from the response
        const userWithoutPassword = {
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            createdAt: savedUser.createdAt
        };

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                user: userWithoutPassword
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Signup error:', error);

        // MongoDB duplicate key error
        if ((error as { code?: number }).code === 11000) { // Replace `any` with a specific type
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