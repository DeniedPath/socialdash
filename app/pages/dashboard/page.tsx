// /app/dashboard/page.tsx
"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname

// Import icons from lucide-react
import {
    LayoutDashboard, BarChart3, FileText, Users, MessageSquare,
    Settings, HelpCircle, Bell, UserCircle, ArrowUpRight,
    PieChart, Activity, List, LogOut, Briefcase, TrendingUp, Target // Added some more icons for variety
} from 'lucide-react';

// Define a type for Stat Cards
type StatCardProps = {
    title: string;
    value: string;
    icon: React.ElementType;
    change?: string; // Optional: for showing percentage change or trend
    changeType?: 'positive' | 'negative'; // Optional: for styling the change
};

/**
 * StatCard Component - Reusable component for displaying key metrics with a modern look.
 */
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, changeType }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-slate-100 rounded-lg"> {/* Subtle background for icon */}
                <Icon className="h-6 w-6 text-blue-600" />
            </div>
            {/* Optional: Placeholder for a small trend chart or action button */}
            {/* <button className="text-slate-400 hover:text-blue-600">
                <MoreHorizontal className="h-5 w-5" />
            </button> */}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 mb-0.5">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
            {change && (
                <p className={`text-xs mt-1 ${changeType === 'positive' ? 'text-green-500' : changeType === 'negative' ? 'text-red-500' : 'text-slate-500'}`}>
                    {change}
                </p>
            )}
        </div>
    </div>
);

/**
 * DashboardPage Component - Main dashboard layout for EchoPulse.
 */
export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname(); // Get current path for active nav state

    // Effect to handle authentication status
    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push(`/login?callbackUrl=${pathname}`); // Pass current path as callbackUrl
        }
    }, [session, status, router, pathname]);

    // Loading State
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="p-10 bg-white rounded-xl shadow-2xl text-center">
                    <LayoutDashboard className="h-16 w-16 text-blue-500 mx-auto mb-6 animate-pulse" />
                    <p className="text-2xl font-semibold text-slate-700">Loading EchoPulse...</p>
                    <p className="text-base text-slate-500 mt-2">Preparing your dashboard, please wait.</p>
                </div>
            </div>
        );
    }

    // Unauthenticated State (should be handled by redirect, but as a fallback)
    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <p className="text-xl text-slate-600">Redirecting to login...</p>
            </div>
        );
    }

    // Placeholder data - replace with actual data fetching
    const statsData = [
        { title: 'Total Views', value: '12,389', icon: TrendingUp, change: '+12.5%', changeType: 'positive' as 'positive' | 'negative' },
        { title: 'Total Likes', value: '1,402', icon: Target, change: '+8.2%', changeType: 'positive' as 'positive' | 'negative' },
        { title: 'Total Comments', value: '715', icon: MessageSquare, change: '-1.5%', changeType: 'negative' as 'positive' | 'negative' },
    ];

    const navigationItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Analytics', icon: BarChart3, href: '/analytics' },
        { name: 'Reports', icon: FileText, href: '/reports' },
        { name: 'Content Hub', icon: Briefcase, href: '/content' }, // Renamed for a more enterprise feel
        { name: 'Audience Insights', icon: Users, href: '/audience' },
    ];

    return (
        <div className="flex h-screen bg-slate-100 font-sans antialiased">
            {/* Sidebar Navigation */}
            <aside className="w-72 flex-shrink-0 bg-slate-900 text-slate-300 flex flex-col shadow-2xl">
                {/* Logo/Brand */}
                <div className="h-20 flex items-center justify-center border-b border-slate-700/50">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        {/* You can use an SVG logo here */}
                        <LayoutDashboard className="h-8 w-8 text-blue-500" />
                        <span className="text-3xl font-bold text-white tracking-tight">EchoPulse</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-grow py-6 px-5 space-y-2.5">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md scale-105'
                                        : 'hover:bg-slate-700/80 hover:text-white focus:bg-slate-700 focus:text-white'
                                }`}
                            >
                                <item.icon className={`h-5 w-5 mr-3.5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer: Settings & Sign Out */}
                <div className="px-5 py-6 mt-auto border-t border-slate-700/50 space-y-2.5">
                    <Link
                        href="/pages/settings"
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group ${
                            pathname.startsWith('/settings')
                                ? 'bg-slate-700 text-white'
                                : 'hover:bg-slate-700/80 hover:text-white focus:bg-slate-700 focus:text-white'
                        }`}
                    >
                        <Settings className={`h-5 w-5 mr-3.5 transition-colors ${pathname.startsWith('/settings') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                        <span className="font-medium">Settings</span>
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600/20 hover:text-red-400 focus:bg-red-600/20 focus:text-red-400 transition-all duration-200 ease-in-out group"
                    >
                        <LogOut className="h-5 w-5 mr-3.5 text-slate-400 group-hover:text-red-400 transition-colors" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar/Header */}
                <header className="h-20 bg-white shadow-md border-b border-slate-200 flex items-center justify-between px-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">Dashboard Overview</h1>
                        {/* Optional: Breadcrumbs or sub-navigation could go here */}
                    </div>
                    <div className="flex items-center space-x-5">
                        <button title="Help" className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            <HelpCircle className="h-5 w-5" />
                        </button>
                        <button title="Notifications" className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            <Bell className="h-5 w-5" />
                            {/* Optional: Notification badge */}
                            {/* <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /> */}
                        </button>
                        <div className="h-8 border-l border-slate-200"></div> {/* Divider */}
                        <Link href="/pages/profile" title="Profile" className="flex items-center space-x-3 group">
                            <div className="p-1 rounded-full hover:bg-slate-100 transition-colors">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="User" className="h-10 w-10 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-all" />
                                ) : (
                                    <UserCircle className="h-10 w-10 text-slate-400 group-hover:text-blue-500 transition-all" />
                                )}
                            </div>
                            {session.user?.name && (
                                <div className="text-sm">
                                    <p className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{session.user.name}</p>
                                    <p className="text-slate-500">{session.user.email}</p>
                                </div>
                            )}
                        </Link>
                    </div>
                </header>

                {/* Page Content - Scrollable */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-8">
                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
                        {statsData.map((stat) => (
                            <StatCard key={stat.title} {...stat} />
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
                        {/* Visitors Over Time Chart Placeholder (Larger) */}
                        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-xl font-semibold text-slate-800 mb-1">Visitors Over Time</h3>
                            <p className="text-sm text-slate-500 mb-5">Track your audience growth and engagement patterns.</p>
                            <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-dashed border-slate-300">
                                <BarChart3 className="h-16 w-16 opacity-60" />
                                <span className="ml-3 text-lg">Area/Line Chart Placeholder</span>
                            </div>
                        </div>

                        {/* Traffic Sources Chart Placeholder (Smaller) */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-xl font-semibold text-slate-800 mb-1">Traffic Sources</h3>
                            <p className="text-sm text-slate-500 mb-5">Understand where your visitors are coming from.</p>
                            <div className="h-80 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-dashed border-slate-300">
                                <PieChart className="h-16 w-16 opacity-60" />
                                <span className="ml-3 text-lg">Pie Chart Placeholder</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity/Pages Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-xl font-semibold text-slate-800 mb-1">Recent Activity</h3>
                            <p className="text-sm text-slate-500 mb-5">Latest interactions and events on your platforms.</p>
                            <div className="h-60 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-dashed border-slate-300">
                                <Activity className="h-16 w-16 opacity-60" />
                                <span className="ml-3 text-lg">Activity Feed Placeholder</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-xl font-semibold text-slate-800 mb-1">Top Performing Content</h3>
                            <p className="text-sm text-slate-500 mb-5">Discover your most engaging posts and pages.</p>
                            <div className="h-60 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-dashed border-slate-300">
                                <List className="h-16 w-16 opacity-60" />
                                <span className="ml-3 text-lg">Top Content Placeholder</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
