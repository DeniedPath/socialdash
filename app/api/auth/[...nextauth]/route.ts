// /app/api/auth/[...nextauth]/route.ts
// This file handles all NextAuth.js authentication requests.

import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Extend the built-in User type
interface CustomUser extends User {
    id: string;
    username: string;
}

// --- IMPORTANT: Database Connection ---
// You need to establish your MongoDB connection here or import a helper that does.
// For example, if you have a dbConnect utility:
// import dbConnect from '@/lib/dbConnect'; // Adjust path as needed

// Import your Mongoose User model
// import User from '@/app/models/User'; // Adjust path to your User model

// Define a custom User type for NextAuth that aligns with your IUser
// interface NextAuthCustomUser extends NextAuthUser {
//     id: string; // This will be user._id.toString()
//     username?: string; // From your IUser model
//     // Add any other custom properties you want in the token/session
// }

// Make authOptions a local constant, not an export from this route file.
const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<CustomUser | null> {
                if (!credentials?.email || !credentials?.password) {
                    console.error("Authorize: Missing email or password");
                    throw new Error('Please enter both email and password.');
                }

                try {
                    console.log("Authorize: Attempting to find user by email:", credentials.email);
                    
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email.toLowerCase()
                        }
                    });

                    if (!user?.password) {
                        console.warn("Authorize: User not found or has no password:", credentials.email);
                        return null;
                    }

                    console.log("Authorize: User found, comparing password for:", credentials.email);
                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);

                    if (isValidPassword) {
                        console.log("Authorize: Password valid for user:", credentials.email);
                        return {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            name: user.username, // Using username as name for NextAuth
                        } as CustomUser;
                    } else {
                        console.warn("Authorize: Invalid password for user:", credentials.email);
                        return null;
                    }
                } catch (error) {
                    console.error("Authorize Error:", error);
                    return null;
                }
            }
        })
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = (user as CustomUser).username ?? user.name ?? user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
            }
            return session;
        },
    },

    pages: {
        signIn: '/login',
    },

    debug: process.env.NODE_ENV === 'development',
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
