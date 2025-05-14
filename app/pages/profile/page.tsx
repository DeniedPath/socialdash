// /app/profile/page.tsx (or your specific path)
"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserCircle, Mail, LogOut, ShieldCheck, Edit3, ArrowLeft, Save, XCircle, KeyRound } from 'lucide-react';

export default function ProfilePage() {
    const { data: session, status, update: updateSession } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    // State for profile editing (username)
    const [isEditMode, setIsEditMode] = useState(false);
    const [editableUsername, setEditableUsername] = useState("");
    const [profileUpdateError, setProfileUpdateError] = useState("");
    const [profileUpdateSuccess, setProfileUpdateSuccess] = useState("");
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // State for password change
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordChangeError, setPasswordChangeError] = useState("");
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // State for displaying the username, to ensure reactivity
    const [displayName, setDisplayName] = useState('User Profile');

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push(`/login?callbackUrl=${pathname}`);
        } else if (session?.user) {
            // Initialize editableUsername and displayName from the session.
            // Your NextAuth callbacks should ensure 'username' is part of session.user
            // @ts-ignore
            const currentUsername = session.user.username || session.user.name || "";
            setEditableUsername(currentUsername);
            setDisplayName(currentUsername || 'User Profile');
        }
    }, [session, status, router, pathname]); // Initial load and when session object itself changes

    // Effect to update displayName whenever session.user.name or session.user.username changes
    useEffect(() => {
        if (session?.user) {
            // @ts-ignore
            const newDisplayName = session.user.username || session.user.name || 'User Profile';
            setDisplayName(newDisplayName);
        }
    }, [session?.user?.name, session?.user?.username]); // Specifically watch these properties

    const handleEditProfileToggle = () => {
        if (isEditMode) {
            // If canceling edit mode, reset username to original session username
            // @ts-ignore
            setEditableUsername(session?.user.username || session?.user.name || "");
            setProfileUpdateError("");
            setProfileUpdateSuccess("");
        } else {
            // Entering edit mode
            // @ts-ignore
            setEditableUsername(session?.user.username || session?.user.name || "");
        }
        setIsEditMode(!isEditMode);
    };

    const handleProfileSave = async () => {
        if (!editableUsername.trim()) {
            setProfileUpdateError("Username cannot be empty.");
            return;
        }
        if (editableUsername.trim().length < 3) {
            setProfileUpdateError("Username must be at least 3 characters long.");
            return;
        }
        setIsSavingProfile(true);
        setProfileUpdateError("");
        setProfileUpdateSuccess("");

        try {
            // API call to update username in the database
            const response = await fetch('/api/user/update-username', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: editableUsername }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update username.');
            }

            // Completely refresh the session
            const refreshResponse = await fetch('/api/auth/session', { method: 'GET' });
            const refreshedSession = await refreshResponse.json();

            // Manually update the session using NextAuth's update method
            await updateSession(refreshedSession);

            // Update local state
            setDisplayName(editableUsername);
            setEditableUsername(editableUsername);

            setProfileUpdateSuccess("Username updated successfully!");
            setIsEditMode(false);

        } catch (error: any) {
            console.error("Username save error:", error);
            setProfileUpdateError(error.message || "Failed to update username. Please try again.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPasswordChangeError("");
        setPasswordChangeSuccess("");

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setPasswordChangeError("All password fields are required.");
            return;
        }
        if (newPassword.length < 6) { // Matches your User model minlength for password
            setPasswordChangeError("New password must be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordChangeError("New passwords do not match.");
            return;
        }
        if (newPassword === currentPassword) {
            setPasswordChangeError("New password cannot be the same as the current password.");
            return;
        }

        setIsChangingPassword(true);
        try {
            // **BACKEND API CALL NEEDED HERE**
            const response = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password.');
            }

            setPasswordChangeSuccess("Password changed successfully! You might need to log in again with your new password.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (error: any) {
            console.error("Password change error:", error);
            setPasswordChangeError(error.message || "Failed to change password. Please try again.");
        } finally {
            setIsChangingPassword(false);
        }
    };


    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="p-10 bg-white rounded-xl shadow-2xl text-center">
                    <UserCircle className="h-16 w-16 text-blue-500 mx-auto mb-6 animate-pulse" />
                    <p className="text-2xl font-semibold text-slate-700">Loading Profile...</p>
                    <p className="text-base text-slate-500 mt-2">Fetching your account details.</p>
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

    const { user } = session;
    // @ts-expect-error
    const providerName = session.account?.provider ?
        // @ts-ignore
        session.account.provider.charAt(0).toUpperCase() + session.account.provider.slice(1) :
        'your credentials';

    return (
        <div className="min-h-screen bg-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/pages/dashboard"
                        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1.5 text-slate-500 group-hover:text-blue-500 transition-colors" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-6 sm:p-8 md:p-10">
                        <div className="flex flex-col items-center sm:flex-row sm:items-start text-center sm:text-left">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt="Profile Picture"
                                    className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover shadow-lg border-4 border-white"
                                />
                            ) : (
                                <UserCircle className="h-28 w-28 sm:h-32 sm:w-32 text-slate-300 border-4 border-white rounded-full shadow-lg" />
                            )}
                            <div className="mt-5 sm:mt-0 sm:ml-6 flex-grow">
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        value={editableUsername}
                                        onChange={(e) => setEditableUsername(e.target.value)}
                                        className="text-3xl sm:text-4xl font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        aria-label="Edit username"
                                        placeholder="Enter new username"
                                    />
                                ) : (
                                    // Ensure this part (around line 235) uses the displayName state variable
                                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 px-3 py-2">
                                        {displayName}
                                    </h1>
                                )}
                                {/* User's email and other non-editable details might follow here */}
                                {/* Button to toggle edit mode */}
                                {!isEditMode && (
                                    <div className="mt-4"> {/* Added a div for spacing if needed */}
                                        <button
                                            onClick={handleEditProfileToggle}
                                            className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        >
                                            <Edit3 className="h-4 w-4 mr-2 text-slate-500" />
                                            Edit Username
                                        </button>
                                    </div>
                                )}
                                {/* Save/Cancel buttons for edit mode would typically be here,
                                    conditionally rendered when isEditMode is true.
                                    Your handleProfileSave logic is tied to a save button elsewhere.
                                */}
                                {user.email && (
                                    <p className="mt-1.5 text-base text-slate-500 flex items-center justify-center sm:justify-start">
                                        <Mail className="h-5 w-5 mr-2 text-slate-400" />
                                        {user.email}
                                    </p>
                                )}
                                {profileUpdateError && <p className="mt-2 text-xs text-red-600">{profileUpdateError}</p>}
                                {profileUpdateSuccess && <p className="mt-2 text-xs text-green-600">{profileUpdateSuccess}</p>}
                            </div>
                            {!isEditMode && (
                                <button
                                    onClick={handleEditProfileToggle}
                                    className="mt-4 sm:mt-0 sm:ml-auto flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                                    title="Edit Username"
                                >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit
                                </button>
                            )}
                        </div>
                        {isEditMode && (
                            <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
                                <button
                                    onClick={handleEditProfileToggle}
                                    disabled={isSavingProfile}
                                    className="flex items-center justify-center px-5 py-2.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
                                >
                                    <XCircle className="h-5 w-5 mr-2" /> Cancel
                                </button>
                                <button
                                    onClick={handleProfileSave}
                                    disabled={isSavingProfile}
                                    className="flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                                >
                                    <Save className="h-5 w-5 mr-2" />
                                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}

                        <hr className="my-8 border-slate-200" />

                        <div>
                            <h2 className="text-xl font-semibold text-slate-700 mb-1">Account Information</h2>
                            <p className="text-sm text-slate-500 mb-5">
                                This is the information associated with your EchoPulse account.
                                You are currently logged in using {providerName}.
                            </p>
                        </div>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-700 mb-1 flex items-center">
                                <ShieldCheck className="h-6 w-6 mr-3 text-orange-500" />
                                Security Settings
                            </h2>
                            <p className="text-sm text-slate-500 mb-5">Manage your account password.</p>

                            <form onSubmit={handlePasswordChange} className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-slate-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-slate-100"
                                        required
                                        minLength={6}
                                    />
                                    <p className="mt-1 text-xs text-slate-500">Must be at least 6 characters long.</p>
                                </div>
                                <div>
                                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmNewPassword"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-slate-100"
                                        required
                                    />
                                </div>
                                {passwordChangeError && <p className="text-sm text-red-600">{passwordChangeError}</p>}
                                {passwordChangeSuccess && <p className="text-sm text-green-600">{passwordChangeSuccess}</p>}
                                <button
                                    type="submit"
                                    disabled={isChangingPassword}
                                    className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-60"
                                >
                                    <KeyRound className="h-5 w-5 mr-2" />
                                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                                </button>
                            </form>
                        </section>

                        <hr className="my-8 border-slate-200" />

                        <div className="mt-6">
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-150 ease-in-out"
                            >
                                <LogOut className="h-5 w-5 mr-2" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="text-center mt-10 pb-6 text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} EchoPulse. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}