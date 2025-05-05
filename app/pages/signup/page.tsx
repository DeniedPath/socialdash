// /app/signup/page.tsx
// Necessary directive for Client Components (using hooks like useState)
"use client";

import React, { useState } from 'react';
import Link from 'next/link';


/**
 * SignupPage Component
 * Renders the user registration form for EchoPulse.
 */
export default function SignupPage() {
    // State hooks for input fields
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    // State hooks for handling form submission status and errors
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Optional: Initialize router for redirection
    // const router = useRouter();

    /**
     * Handles the form submission event.
     * @param e - The form event object.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default browser form submission
        setError(''); // Clear previous errors
        setLoading(true); // Indicate loading state

        // Basic client-side validation: Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false); // Reset loading state
            return; // Stop submission
        }

        // === Add Password Length Validation ===
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setLoading(false); // Reset loading state
            return; // Stop submission
        }
        // === End Password Length Validation ===


        try {
            // Make API call to the signup endpoint
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            // Handle non-successful responses
            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            console.log('Signup successful:', data);

            // Redirect to login page after successful signup
            // Use setTimeout to show the success message briefly
            setTimeout(() => {
                window.location.href = '/auth/login';
                // Or using router: router.push('/auth/login');
            }, 2000);

        } catch (err: any) {
            console.error('Signup failed:', err);
            // Set a user-friendly error message
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false); // Reset loading state regardless of outcome
        }
    };

    return (
        // Main container: Centers the form vertically and horizontally
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
            {/* Form Card */}
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Join EchoPulse
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Create your account to manage your social media like a pro.
                    </p>
                </div>

                {/* Signup Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Error Message Display */}
                    {error && (
                        <p className="px-3 py-2 text-sm font-medium text-center text-red-700 bg-red-100 rounded-md border border-red-200">
                            {error}
                        </p>
                    )}

                    {/* Username Input */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            disabled={loading} // Disable input when loading
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm disabled:bg-gray-50"
                            placeholder="Choose a unique username"
                        />
                    </div>

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
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password" // Important for password managers
                            required
                            disabled={loading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm disabled:bg-gray-50"
                            placeholder="Create a strong password"
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label
                            htmlFor="confirm-password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            required
                            disabled={loading}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm disabled:bg-gray-50"
                            placeholder="Re-enter your password"
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading} // Disable button when loading
                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out ${
                                loading
                                    ? 'bg-blue-400 cursor-not-allowed' // Style for loading state
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' // Style for active state
                            } disabled:opacity-75`} // General disabled style
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                {/* Link to Login Page */}
                <p className="mt-6 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}