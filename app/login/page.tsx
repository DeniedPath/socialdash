// /app/login/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
// Import useRouter for redirection
import { useRouter } from 'next/navigation';

/**
 * LoginPage Component
 * Renders the user login form for EchoPulse.
 */
export default function LoginPage() {
    // State hooks for input fields
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // State hooks for handling form submission status and errors
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Initialize router for redirection
    const router = useRouter();

    /**
     * Handles the form submission event.
     * @param e - The form event object.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('Attempting login with:', { email, password });
        try {
            // --- Replace this with your actual login API call ---
            // This endpoint should connect to your database, verify credentials,
            // and potentially set up a session or return a token.
            const response = await fetch('/api/auth/login', { // Or use axios: await axios.post('/api/auth/login', { email, password });
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
               // Try to parse error message from the backend response
               let errorMessage = 'Login failed. Please check your credentials.';
               try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
               } catch (parseError) {
                    // Ignore if response body is not JSON or empty
                    console.error("Could not parse error response:", parseError);
               }
               throw new Error(errorMessage);
            }

            // Assuming successful login returns some user data or session info (optional)
            // const data = await response.json();
            // console.log('Login successful:', data);

            console.log('Login successful');

            // --- Redirect to dashboard on successful login ---
            router.push('/pages/dashboard');

        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
        // --- End API call section ---
    };

    return (
        // Main container: Centers the form vertically and horizontally
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
            {/* Form Card */}
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome Back to EchoPulse
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Log in to access your dashboard.
                    </p>
                </div>

                {/* Login Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Error Message Display */}
                    {error && (
                        <p className="px-3 py-2 text-sm font-medium text-center text-red-700 bg-red-100 rounded-md border border-red-200">
                            {error}
                        </p>
                    )}

                    {/* Email Input */}
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm disabled:bg-gray-50"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex justify-between items-baseline">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <Link href="/forgot-password"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm disabled:bg-gray-50"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out ${
                                loading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            } disabled:opacity-75`}
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>
                    </div>
                </form>

                {/* Link to Signup Page */}
                <p className="mt-6 text-sm text-center text-gray-600">
                    Don't have an account yet?{' '}
                    <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                        Sign up now
                    </Link>
                </p>
            </div>
        </div>
    );
}
