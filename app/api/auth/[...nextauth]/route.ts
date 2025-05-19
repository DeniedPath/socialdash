// /app/api/auth/[...nextauth]/route.ts
// This file handles all NextAuth.js authentication requests.

import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs'; // For password comparison

// --- IMPORTANT: Database Connection ---
// You need to establish your MongoDB connection here or import a helper that does.
// For example, if you have a dbConnect utility:
// import dbConnect from '@/lib/dbConnect'; // Adjust path as needed

// Import your Mongoose User model
import User from '@/app/models/User'; // Adjust path to your User model

// Define a custom User type for NextAuth that aligns with your IUser
// NextAuth's User type expects 'id', 'name', 'email', 'image' (optional)
// We'll map your IUser to this.
interface NextAuthCustomUser extends NextAuthUser {
    id: string; // This will be user._id.toString()
    username?: string; // From your IUser model
    // Add any other custom properties you want in the token/session
}

// Define custom session user type
interface CustomSessionUser {
    id: string;
    username: string;
    name?: string;
    email?: string;
    image?: string;
}

export const authOptions: NextAuthOptions = {
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
            async authorize(credentials): Promise<NextAuthCustomUser | null> {
                if (!credentials?.email || !credentials?.password) {
                    console.error("Authorize: Missing email or password");
                    throw new Error('Please enter both email and password.');
                }

                // --- Establish Database Connection (if not already connected globally) ---
                // await dbConnect(); // Uncomment if you use a connection helper

                try {
                    console.log("Authorize: Attempting to find user by email:", credentials.email);
                    // Find the user in MongoDB by email.
                    // Your UserSchema has `password` with `select: false`,
                    // so you need to explicitly select it for password comparison.
                    const userFromDb = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password');

                    if (!userFromDb) {
                        console.warn("Authorize: User not found with email:", credentials.email);
                        return null; // User not found
                    }

                    if (!userFromDb.password) {
                        console.warn("Authorize: User found but has no password set (e.g., OAuth user):", credentials.email);
                        // This can happen if a user signed up via OAuth and tries to log in with credentials.
                        // You might want to guide them to use OAuth or set a password.
                        return null;
                    }

                    console.log("Authorize: User found, comparing password for:", credentials.email);
                    // Compare the provided password with the hashed password from the database.
                    const isValidPassword = await bcrypt.compare(credentials.password, userFromDb.password);

                    if (isValidPassword) {
                        console.log("Authorize: Password valid for user:", credentials.email);
                        // If authentication is successful, return a user object for NextAuth.
                        // This object is then passed to the `jwt` callback.
                        return {
                            id: (userFromDb._id as unknown as string).toString(), // MongoDB _id needs to be converted to string
                            name: userFromDb.username, // Using username as 'name' for NextAuth session
                            email: userFromDb.email,
                            username: userFromDb.username, // You can add custom fields
                            // image: userFromDb.profileImage, // If you add a profile image field later
                        } as NextAuthCustomUser;
                    } else {
                        console.warn("Authorize: Invalid password for user:", credentials.email);
                        return null; // Incorrect password
                    }
                } catch (error) {
                    console.error("Authorize Error:", error);
                    // throw new Error("An error occurred during authentication."); // Or return null
                    return null;
                }
            }
        })
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user, account }) {
            // `user` is the object returned from the `authorize` callback (for credentials)
            // or from the OAuth provider profile (for OAuth sign-ins).
            if (user) {
                const customUser = user as NextAuthCustomUser;
                token.id = customUser.id;
                token.username = customUser.username; // Persist username to token
                // token.name will be set from user.name (which we mapped to username)
                // token.email will be set from user.email
                // token.picture will be set from user.image (if available)
            }
            // If signing in with OAuth, `account` will be present
            if (account) {
                token.accessToken = account.access_token; // Store OAuth access token
                token.provider = account.provider;      // Store OAuth provider
            }
            return token;
        },
        async session({ session, token }) {
            // `token` is the object returned from the `jwt` callback.
            // We add the custom properties from the token to the `session.user` object.
            if (token && session.user) {
                (session.user as CustomSessionUser).id = token.id as string;
                (session.user as CustomSessionUser).username = token.username as string;
                // session.user.name is already set by NextAuth from token.name
                // session.user.email is already set by NextAuth from token.email
                // session.user.image is already set by NextAuth from token.picture

                // If you stored provider in token, you can expose it to session if needed
                // (session.user as CustomSessionUser).provider = token.provider;
            }
            return session;
        },
    },

    pages: {
        signIn: '/login',
        // error: '/auth/error', // Optional: Custom error page
    },

    debug: process.env.NODE_ENV === 'development',
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
