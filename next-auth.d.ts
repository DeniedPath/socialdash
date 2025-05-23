// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's unique identifier. */
            id: string;
            /** The user's username. */
            username: string;
        } & DefaultSession["user"]; // Keep the default properties like name, email, image
    }

    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     * Also the shape of the user object returned by the `authorize` callback of the Credentials provider.
     */
    interface User extends DefaultUser {
        /** The user's username. */
        username?: string; // Make it optional if it might not always be present initially
        // id is already part of DefaultUser as string
    }
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends DefaultJWT {
        /** OpenID ID Token */
        idToken?: string;
        /** The user's unique identifier. */
        id: string;
        /** The user's username. */
        username: string;
        // provider?: string; // if you are adding provider to the token
    }
}
