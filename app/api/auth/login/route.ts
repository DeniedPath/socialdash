
// /app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/app/models/User';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    console.log("Starting login process...");
    
    try {
        // Connect to database
        await connectToDatabase();
        
        // Parse the request body
        const body = await req.json();
        const { email, password } = body;
        
        console.log(`Login attempt for email: ${email || 'not provided'}`);

        // Validate request data
        if (!email || !password) {
            console.log("Login failed: Missing email or password");
            return NextResponse.json({ 
                success: false, 
                message: 'Email and password are required' 
            }, { status: 400 });
        }

        // Find user by email and explicitly select password field
        console.log(`Looking up user with email: ${email}`);
        const user = await User.findOne({ email }).select('+password');

        // If no user found, return generic error (for security)
        if (!user) {
            console.log(`Login failed: No user found with email ${email}`);
            return NextResponse.json({ 
                success: false, 
                message: 'Invalid email or password' 
            }, { status: 401 });
        }

        console.log(`User found with ID: ${user._id}`);
        
        // Verify password exists
        if (!user.password) {
            console.log(`Login failed: User found but password field is missing in database`);
            return NextResponse.json({ 
                success: false, 
                message: 'Invalid email or password' 
            }, { status: 401 });
        }

        // Verify password with bcrypt
        console.log("Verifying password...");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            console.log(`Login failed: Password incorrect for user ${email}`);
            return NextResponse.json({ 
                success: false, 
                message: 'Invalid email or password' 
            }, { status: 401 });
        }

        // Successful login - create user data without password
        console.log(`Login successful for user: ${email}`);
        const userData = {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
        };

        // Return success response with user data
        return NextResponse.json({ 
            success: true, 
            message: 'Login successful',
            user: userData
        }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        
        return NextResponse.json({ 
            success: false, 
            message: 'Authentication failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}