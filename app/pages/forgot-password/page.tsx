// /app/forgot-password/page.tsx
// Necessary directive for Client Components (using hooks like useState)
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
// Optional: If you want to redirect after success, import useRouter
// import { useRouter } from 'next/navigation';

/**
 * ForgotPasswordPage Component
 * Renders the form for users to request a password reset link for EchoPulse.
 */
export default function ForgotPasswordPage() {
    // State hook for the email input field
    const [email, setEmail] = useState<string>('');

    // State hooks for handling form submission status, errors, and success messages
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
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
        setSuccessMessage(''); // Clear previous success messages
        setLoading(true); // Indicate loading state

        // --- Placeholder for your actual password reset request API call ---
        console.log('Requesting password reset for:', email);
        try {
            // Replace this section with your actual API call logic
            // Example:
            // const response = await fetch('/api/auth/request-password-reset', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email }),
            // });
            // if (!response.ok) {
            //   const errorData = await response.json();
            //   // Handle specific errors, e.g., email not found
            //   if (response.status === 404) {
            //      throw new Error('No account found with that email address.');
            //   }
            //   throw new Error(errorData.message || 'Failed to send reset link');
            // }

            // Simulate network delay for demonstration
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Password reset link request successful (simulated)');

            // Display a success message to the user
            setSuccessMessage(
                'If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).'
            );
            setEmail(''); // Optionally clear the email field

            // Optional: Redirect after a delay or keep the message displayed
            // setTimeout(() => router.push('/login'), 5000); // Redirect after 5 seconds

        } catch (err: unknown) {
            console.error('Password reset request failed (simulated):', err);
            // Set a user-friendly error message
            setError(err instanceof Error ? err.message : 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false); // Reset loading state regardless of outcome
        }
        // --- End Placeholder ---
    };

    return (
        // Main container: Centers the form vertically and horizontally
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
            {/* Form Card */}
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Forgot Your Password?
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        No worries! Enter your email below and we&#39;ll send you a link to reset it.
                    </p>
                </div>

                {/* Forgot Password Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Error Message Display */}
                    {error && (
                        <p className="px-3 py-2 text-sm font-medium text-center text-red-700 bg-red-100 rounded-md border border-red-200">
                            {error}
                        </p>
                    )}

                    {/* Success Message Display */}
                    {successMessage && (
                        <p className="px-3 py-2 text-sm font-medium text-center text-green-700 bg-green-100 rounded-md border border-green-200">
                            {successMessage}
                        </p>
                    )}

                    {/* Email Input - Only show if no success message */}
                    {!successMessage && (
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
                                placeholder="Enter your account email"
                            />
                        </div>
                    )}

                    {/* Submit Button - Only show if no success message */}
                    {!successMessage && (
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
                                {loading ? 'Sending Link...' : 'Send Reset Link'}
                            </button>
                        </div>
                    )}
                </form>

                {/* Link back to Login Page */}
                <p className="mt-6 text-sm text-center text-gray-600">
                    Remembered your password?{' '}
                    <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
