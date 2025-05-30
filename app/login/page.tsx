// /app/login/page.tsx
"use client";

import React, { Suspense } from 'react';

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';

// Component to handle search params
function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl') || '/pages/dashboard';
    return <LoginForm callbackUrl={callbackUrl} />;
}

/**
 * LoginPage Component
 * Renders the OAuth login options for EchoPulse
 */
export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
            <p className="text-gray-700 text-lg">Loading...</p>
        </div>}>
            <LoginContent />
        </Suspense>
    );
}

// Main login form component
function LoginForm({ callbackUrl }: { callbackUrl: string }) {
    const router = useRouter();
    const { status } = useSession();

    // Effect to handle redirection if user is already authenticated
    React.useEffect(() => {
        if (status === 'authenticated') {
            router.push(callbackUrl);
        }
    }, [status, router, callbackUrl]);

    // If session is loading or already authenticated, show a message or redirect (handled by useEffect)
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
                <p className="text-gray-700 text-lg">Loading session...</p>
            </div>
        );
    }

    // If already authenticated, useEffect will redirect
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
                        Welcome to EchoPulse
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Choose your preferred sign-in method
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => signIn('github', { callbackUrl: callbackUrl })}
                        disabled={status === 'loading' as unknown}
                        className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.202 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                        </svg>
                        Sign in with GitHub
                    </button>

                    <button
                        onClick={() => signIn('google', { callbackUrl: callbackUrl })}
                        disabled={status === 'loading' as unknown}
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
                </div>

                
            </div>
        </div>
    );
}