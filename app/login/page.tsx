// /app/login/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, useSession } from "next-auth/react"; // Import signIn and useSession
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter and useSearchParams

/**
 * LoginPage Component
 * Renders the user login form for EchoPulse with client-side validation
 * and NextAuth.js integration.
 */
export default function LoginPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // State for client-side validation errors
    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
    // State for NextAuth.js related errors (e.g., "Invalid credentials")
    const [authError, setAuthError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const { status } = useSession();

    // Get callbackUrl from query parameters or default to dashboard
    const callbackUrl = searchParams?.get('callbackUrl') || '/pages/dashboard';

    // Effect to handle redirection if user is already authenticated
    useEffect(() => {
        if (status === 'authenticated') {
            router.push(callbackUrl);
        }
    }, [status, router, callbackUrl]);


    /**
     * Validates the form inputs.
     * @returns boolean - True if form is valid, false otherwise.
     */
    const validateForm = (): boolean => {
        const errors: { email?: string; password?: string } = {};
        let isValid = true;

        // Email validation
        if (!email) {
            errors.email = 'Email is required.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email address is invalid.';
            isValid = false;
        }

        // Password validation
        if (!password) {
            errors.password = 'Password is required.';
            isValid = false;
        }
        // Add more password rules if needed (e.g., minimum length)
        // else if (password.length < 8) {
        //   errors.password = 'Password must be at least 8 characters.';
        //   isValid = false;
        // }

        setFormErrors(errors);
        return isValid;
    };

    /**
     * Handles the form submission event.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAuthError(''); // Clear previous NextAuth errors
        setFormErrors({}); // Clear previous form validation errors

        // Perform client-side validation first
        if (!validateForm()) {
            return; // Stop submission if form is invalid
        }

        setLoading(true);

        try {
            // Attempt to sign in using NextAuth.js Credentials provider
            const result = await signIn('credentials', {
                redirect: false, // We handle redirection manually based on the result
                email: email,
                password: password,
                // callbackUrl: callbackUrl, // NextAuth will use this if redirect is true
            });

            if (result?.error) {
                // Handle errors returned by NextAuth.js (e.g., from the authorize function)
                // Common error codes: "CredentialsSignin", "Callback"
                if (result.error === "CredentialsSignin") {
                    setAuthError('Invalid email or password. Please try again.');
                } else {
                    setAuthError(result.error || 'An unexpected error occurred during login.');
                }
                console.error("NextAuth Signin Error:", result.error);
            } else if (result?.ok) {
                // Successful sign-in, NextAuth session is being established.
                // The useEffect hook will handle redirection once status is 'authenticated'.
                // Or, you can redirect explicitly here if preferred:
                router.push(callbackUrl);
            } else {
                // Handle other unexpected cases where result might be ok: false but no error
                setAuthError("Login failed. Please try again.");
            }
        } catch (error) {
            // Catch any unexpected errors during the signIn process itself
            console.error("Login Page Submit Error:", error);
            setAuthError("An unexpected error occurred. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    // If session is loading or already authenticated, show a message or redirect (handled by useEffect)
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
                <p className="text-gray-700 text-lg">Loading session...</p>
            </div>
        );
    }
    // If already authenticated, useEffect will redirect. Can show null or a message here.
    if (status === 'authenticated') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
                <p className="text-gray-700 text-lg">Already logged in. Redirecting...</p>
            </div>
        );
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome Back to EchoPulse
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Log in to access your dashboard.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Display NextAuth.js related errors */}
                    {authError && (
                        <p className="px-3 py-2 text-sm font-medium text-center text-red-700 bg-red-100 rounded-md border border-red-200">
                            {authError}
                        </p>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            disabled={loading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 sm:text-sm disabled:bg-gray-50 transition duration-150 ease-in-out text-black ${
                                formErrors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                            placeholder="you@example.com"
                        />
                        {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
                    </div>

                    <div>
                        <div className="flex justify-between items-baseline">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <Link href="/pages/forgot-password"
                                  className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            disabled={loading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 sm:text-sm disabled:bg-gray-50 transition duration-150 ease-in-out text-black ${
                                formErrors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                            placeholder="Enter your password"
                        />
                        {formErrors.password && <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || status === 'loading' as unknown}
                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out ${
                                (loading || status === 'loading' as unknown)
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            } disabled:opacity-75`}
                        >
                            {(loading || status === 'loading' as unknown) ? 'Logging In...' : 'Log In'}
                        </button>
                    </div>
                </form>

                {/* OAuth Sign-In Buttons (Example for GitHub) */}
                {/* You would add similar buttons for other OAuth providers */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div>
                    <button
                        onClick={() => signIn('github', { callbackUrl: callbackUrl })} // Specify callbackUrl
                        disabled={loading || status === 'loading' as unknown}
                        className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {/* Replace with actual GitHub icon SVG or an icon component */}
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.202 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                        </svg>
                        Sign in with GitHub
                    </button>
                    <button
                        onClick={() => signIn('google', { callbackUrl: callbackUrl })} // Specify callbackUrl
                        disabled={loading || status === 'loading' as unknown}
                        className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.5-37.1-4.7-55H272v104h147.5c-6.4 34.6-25.6 63.8-54.8 83.3v68h88.4c51.7-47.7 80.4-118 80.4-200.3z"/>
                            <path fill="#34A853" d="M272 544.3c73.6 0 135.3-24.4 180.4-66.2l-88.4-68c-24.6 16.6-56 26.4-92 26.4-70.8 0-130.7-47.9-152.2-112.1h-89.7v70.7C80.4 483.9 169.8 544.3 272 544.3z"/>
                            <path fill="#FBBC04" d="M119.8 324.4c-10.6-31.2-10.6-64.8 0-96L30.1 157.7C-10 229.2-10 315.1 30.1 386.6l89.7-62.2z"/>
                            <path fill="#EA4335" d="M272 107.7c38.8 0 73.7 13.4 101.3 39.6l75.9-75.9C407.3 24.4 345.6 0 272 0 169.8 0 80.4 60.4 30.1 157.7l89.7 70.7c21.5-64.2 81.4-112.1 152.2-112.1z"/>
                        </svg>
                        Sign in with Google
                    </button>
                    {/* Add buttons for other providers (Google, Twitter, etc.) here */}
                </div>


                <p className="mt-6 text-sm text-center text-gray-600">
                    Don&apos;t have an account yet?{' '}
                    <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                        Sign up now
                    </Link>
                </p>
            </div>
        </div>
    );
}