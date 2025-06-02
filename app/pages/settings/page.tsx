// /app/settings/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react"; // Import signIn
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    UserCircle, ShieldCheck, Link2, Bell, Sun, Moon, Monitor, ArrowLeft, Edit3,
    Youtube, Twitter, Instagram, Linkedin, Facebook, MessageCircle, Settings // Platform icons
} from 'lucide-react';

// Type for individual social connection cards
type SocialConnectionCardProps = {
    platformId: string; // e.g., 'google', 'twitter', 'facebook'
    platformName: string;
    PlatformIcon: React.ElementType;
    isConnected: boolean;
    username?: string; // Display if connected
    onConnect: (providerId: string) => void;
    onDisconnect: (providerId: string) => void; // Placeholder for now
    accentColor: string;
    buttonBgColor: string;
    buttonHoverBgColor: string;
};

const SocialConnectionCard: React.FC<SocialConnectionCardProps> = ({
                                                                       platformId, platformName, PlatformIcon, isConnected, username, onConnect, onDisconnect, accentColor, buttonBgColor, buttonHoverBgColor
                                                                   }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
                <PlatformIcon className={`h-8 w-8 mr-4 ${accentColor}`} />
                <div>
                    <p className="font-semibold text-slate-700">{platformName}</p>
                    {isConnected && username && (
                        <p className="text-xs text-slate-500">Connected as: {username}</p>
                    )}
                    {!isConnected && (
                        <p className="text-xs text-slate-400">Not Connected</p>
                    )}
                </div>
            </div>
            {isConnected ? (
                <button
                    onClick={() => onDisconnect(platformId)}
                    className="px-4 py-2 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                >
                    Disconnect
                </button>
            ) : (
                <button
                    onClick={() => onConnect(platformId)}
                    className={`px-4 py-2 text-xs font-medium text-white ${buttonBgColor} ${buttonHoverBgColor} rounded-md transition-colors`}
                >
                    Connect
                </button>
            )}
        </div>
    );
};


export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname(); // Used for callbackUrl

    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');
    // Notification preferences state will be implemented in a future update

    // State to hold information about connected accounts
    // This would ideally be populated from the session or a dedicated API call
    const [connectedAccounts, setConnectedAccounts] = useState<Array<{ provider: string; username?: string }>>([]);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push(`/login?callbackUrl=${pathname}`);
        } else if (session) {
            // --- Populate connectedAccounts from session ---
            // This is an example. The actual structure depends on your NextAuth.js adapter and callbacks.
            // If you use an adapter, linked accounts are often stored in a separate collection
            // and might be exposed on the session object if your callbacks are set up to do so.
            // For now, we'll simulate it or you'll need to fetch this data.
            // Session accounts data will be used in a future implementation

            // Or, if your JWT/session callback adds provider info directly to user or a sub-object:
            // const accountsFromSession = session.user?.linkedAccounts || [];

            // Provider info from session user will be implemented in a future update

            // This needs to be more robust based on your actual data structure for linked accounts
            // setConnectedAccounts(accountsFromSession);
            console.log("Session Data for Accounts:", session); // Log to inspect session structure

            // Placeholder: Manually set some based on common provider IDs if they exist in session directly
            // This is a simplified check and not how multiple accounts of the same type would be handled.
            const currentLinked: Array<{ provider: string; username?: string }> = [];
            // eslint-disable-next-line
            if ((session.user as any)?.githubId) {
                currentLinked.push({ provider: 'github', username: session.user?.name ?? undefined });
            }
            // eslint-disable-next-line
            if ((session.user as any)?.googleId) {
                currentLinked.push({ provider: 'google', username: session.user?.name ?? undefined });
            }
            // eslint-disable-next-line
            if ((session.user as any)?.twitterId) {
                currentLinked.push({ provider: 'twitter', username: session.user?.name ?? undefined });
            }

            setConnectedAccounts(currentLinked); // This is still very basic
        }
    }, [session, status, router, pathname]);


    const handleConnect = (providerId: string) => {
  // Fake username for demo purposes
  const fakeUsername = `${providerId}_user`;

  // Update state to show "connected"
  setConnectedAccounts(prev => [
    ...prev,
    { provider: providerId, username: fakeUsername }
  ]);
};

    const handleDisconnect = (providerId: string) => {
  setConnectedAccounts(prev =>
    prev.filter(acc => acc.provider !== providerId)
  );
};
// eslint-disable-next-line
    const handleSettingsUpdate = (settings: Record<string, unknown>): void => {
        // Example usage of handleSettingsUpdate if needed
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="p-10 bg-white rounded-xl shadow-2xl text-center">
                    <Settings className="h-16 w-16 text-blue-500 mx-auto mb-6 animate-pulse" />
                    <p className="text-2xl font-semibold text-slate-700">Loading Settings...</p>
                </div>
            </div>
        );
    }

    if (!session || !session.user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <p className="text-xl text-slate-600">Redirecting to login...</p>
            </div>
        );
    }

    // Define your social platforms and their NextAuth provider IDs
    const platforms = [
        { providerId: 'google', name: 'YouTube', icon: Youtube, accent: 'text-red-600', btnBg: 'bg-red-500', btnHover: 'hover:bg-red-600' },
        { providerId: 'twitter', name: 'Twitter / X', icon: Twitter, accent: 'text-sky-500', btnBg: 'bg-sky-500', btnHover: 'hover:bg-sky-600' },
        { providerId: 'instagram', name: 'Instagram', icon: Instagram, accent: 'text-pink-500', btnBg: 'bg-pink-500', btnHover: 'hover:bg-pink-600' }, // Often uses Facebook provider
        { providerId: 'facebook', name: 'Facebook', icon: Facebook, accent: 'text-blue-700', btnBg: 'bg-blue-600', btnHover: 'hover:bg-blue-700' },
        { providerId: 'linkedin', name: 'LinkedIn', icon: Linkedin, accent: 'text-blue-600', btnBg: 'bg-blue-500', btnHover: 'hover:bg-blue-600' },
        // TikTok does not have a standard NextAuth.js provider. You might need a custom OAuth provider or use their SDK.
        // For now, we can use 'github' as a placeholder if you have it configured, or disable it.
        { providerId: 'tiktok', name: 'TikTok', icon: MessageCircle, accent: 'text-black', btnBg: 'bg-black', btnHover: 'hover:bg-gray-800' },
    ];

    return (
        <div className="min-h-screen bg-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/pages/dashboard" // Corrected dashboard link
                        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1.5 text-slate-500 group-hover:text-blue-500 transition-colors" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-6 sm:p-8 md:p-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-8">Settings</h1>

                        <section className="mb-10">
                            {/* ... Profile Management section ... */}
                            <h2 className="text-xl font-semibold text-slate-700 mb-1 flex items-center">
                                <UserCircle className="h-6 w-6 mr-3 text-blue-500" />
                                Profile Management
                            </h2>
                            <p className="text-sm text-slate-500 mb-4">View and update your personal information.</p>
                            <Link
                                href="/pages/profile" // Corrected profile link
                                className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                            >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Go to Profile Page
                            </Link>
                        </section>

                        <hr className="my-8 border-slate-200" />

                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-slate-700 mb-1 flex items-center">
                                <Link2 className="h-6 w-6 mr-3 text-green-500" />
                                Connected Accounts
                            </h2>
                            <p className="text-sm text-slate-500 mb-5">Manage your linked social media accounts to gather analytics.</p>
                            <div className="space-y-4">
                                {platforms.map(platform => {
                                    // Check if this platform is connected based on `connectedAccounts` state
                                    const accountInfo = connectedAccounts.find(acc => acc.provider.toLowerCase() === platform.providerId.toLowerCase());
                                    const isConnected = !!accountInfo;
                                    const username = accountInfo?.username;

                                    return (
                                        <SocialConnectionCard
                                            key={platform.providerId}
                                            platformId={platform.providerId}
                                            platformName={platform.name}
                                            PlatformIcon={platform.icon}
                                            isConnected={isConnected}
                                            username={username}
                                            onConnect={handleConnect}
                                            onDisconnect={handleDisconnect}
                                            accentColor={platform.accent}
                                            buttonBgColor={platform.btnBg}
                                            buttonHoverBgColor={platform.btnHover}
                                        />
                                    );
                                })}
                            </div>
                        </section>

                        <hr className="my-8 border-slate-200" />
                        {/* ... Account Security, Notifications, Appearance sections ... */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-slate-700 mb-1 flex items-center">
                                <ShieldCheck className="h-6 w-6 mr-3 text-orange-500" />
                                Account Security
                            </h2>
                            <p className="text-sm text-slate-500 mb-4">Manage your password and account security settings.</p>
                            <div className="space-y-3">
                                <button disabled className="w-full sm:w-auto flex items-center justify-start px-5 py-2.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed">
                                    Change Password (Coming Soon)
                                </button>
                                <button disabled className="w-full sm:w-auto flex items-center justify-start px-5 py-2.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed">
                                    Enable Two-Factor Authentication (Coming Soon)
                                </button>
                            </div>
                        </section>

                        <hr className="my-8 border-slate-200" />

                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-slate-700 mb-1 flex items-center">
                                <Bell className="h-6 w-6 mr-3 text-purple-500" />
                                Notification Preferences
                            </h2>
                            <p className="text-sm text-slate-500 mb-4">Choose how you receive updates from EchoPulse.</p>
                            <div className="space-y-3 text-sm text-slate-600">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
                                    <span>Email for new followers</span>
                                    <button className="text-blue-600 hover:text-blue-700">Toggle (Placeholder)</button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
                                    <span>Weekly post summary email</span>
                                    <button className="text-blue-600 hover:text-blue-700">Toggle (Placeholder)</button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
                                    <span>In-app mention notifications</span>
                                    <button className="text-blue-600 hover:text-blue-700">Toggle (Placeholder)</button>
                                </div>
                            </div>
                        </section>

                        <hr className="my-8 border-slate-200" />

                        <section>
                            <h2 className="text-xl font-semibold text-slate-700 mb-1 flex items-center">
                                {currentTheme === 'dark' ? <Moon className="h-6 w-6 mr-3 text-indigo-500" /> : <Sun className="h-6 w-6 mr-3 text-yellow-500" />}
                                Appearance
                            </h2>
                            <p className="text-sm text-slate-500 mb-4">Customize the look and feel of your dashboard.</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setCurrentTheme('light')}
                                    className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${currentTheme === 'light' ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                                >
                                    <Sun className="h-5 w-5 mr-2 inline-block" /> Light Mode
                                </button>
                                <button
                                    onClick={() => setCurrentTheme('dark')}
                                    className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${currentTheme === 'dark' ? 'bg-slate-700 text-white border-slate-700 shadow-md' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                                >
                                    <Moon className="h-5 w-5 mr-2 inline-block" /> Dark Mode
                                </button>
                                <button
                                    onClick={() => setCurrentTheme('system')}
                                    className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${currentTheme === 'system' ? 'bg-slate-500 text-white border-slate-500 shadow-md' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                                >
                                    <Monitor className="h-5 w-5 mr-2 inline-block" /> System Default
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-3">Note: Theme switching is a UI placeholder and does not yet change the actual application theme.</p>
                        </section>
                    </div>
                </div>

                <footer className="text-center mt-10 pb-6 text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} EchoPulse. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
