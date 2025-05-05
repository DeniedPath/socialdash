// Necessary directive for Client Components if using hooks or event handlers
"use client";

import React from 'react';
import Link from 'next/link';
// Import icons (install lucide-react: npm install lucide-react)
import {
    LayoutDashboard,
    BarChart3,
    FileText,
    Users,
    MessageSquare, // Placeholder for generic 'Content' or specific platform
    Settings,
    HelpCircle,
    Bell, // Placeholder for notifications/ideas
    UserCircle, // Placeholder for user profile
    ArrowUpRight,
    PieChart,
    Activity,
    List,
} from 'lucide-react';

// Define a type for Stat Cards if needed later for props
type StatCardProps = {
    title: string;
    value: string;
    icon: React.ElementType;
};

/**
 * StatCard Component - Reusable component for displaying key metrics.
 */
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow duration-200 flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-full">
            <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
    </div>
);

/**
 * DashboardPage Component
 * The main dashboard layout for EchoPulse.
 */
export default function DashboardPage() {
    // Placeholder data - replace with actual data fetching
    const stats = [
        { title: 'Total Views', value: '12,000', icon: ArrowUpRight },
        { title: 'Total Likes', value: '1,000', icon: ArrowUpRight }, // Consider a 'ThumbsUp' icon if more appropriate
        { title: 'Total Comments', value: '687', icon: ArrowUpRight }, // Consider a 'MessageCircle' icon
    ];

    // Placeholder for active navigation item - manage this with state/router
    const activeNav = 'Dashboard';

    // Sidebar navigation items
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Analytics', icon: BarChart3, href: '/not-found' },
        { name: 'Reports', icon: FileText, href: '/not-found' },
        { name: 'Content', icon: MessageSquare, href: '/not-found' }, // Or a more specific icon
        { name: 'Audience', icon: Users, href: '/not-found' },
        // Add dynamically connected accounts here, e.g., Twitter
        // { name: 'Twitter', icon: TwitterIcon, href: '/accounts/twitter' },
    ];

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-64 flex-shrink-0 bg-white shadow-md flex flex-col">
                {/* Logo/Brand */}
                <div className="h-16 flex items-center justify-center border-b border-gray-200">
                    <span className="text-2xl font-bold text-blue-600">EchoPulse</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-grow mt-4 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-150 ease-in-out ${
                                activeNav === item.name
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                        >
                            <item.icon className="h-5 w-5 mr-3" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Settings Link at the bottom */}
                <div className="px-4 pb-4 mt-auto">
                    <Link
                        href="/settings"
                        className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-150 ease-in-out ${
                            activeNav === 'Settings'
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                    >
                        <Settings className="h-5 w-5 mr-3" />
                        Settings
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
                    {/* Can add search bar or page title here */}
                    <h1 className="text-xl font-semibold text-gray-800">Dashboard Overview</h1>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                            <HelpCircle className="h-5 w-5" />
                        </button>
                        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                            <Bell className="h-5 w-5" /> {/* Lightbulb or Bell for notifications */}
                        </button>
                        <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                            <UserCircle className="h-7 w-7" /> {/* User Profile */}
                        </button>
                    </div>
                </header>

                {/* Page Content - Scrollable */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-100 to-gray-200 p-6 lg:p-8">
                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat) => (
                            <StatCard key={stat.title} {...stat} />
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Visitors Over Time Chart Placeholder */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow duration-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Visitors Over Time</h3>
                            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                {/* Replace with actual chart component */}
                                <BarChart3 className="h-12 w-12 opacity-50" />
                                <span className="ml-2">Area/Line Chart Placeholder</span>
                            </div>
                        </div>

                        {/* Traffic Sources Chart Placeholder */}
                        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow duration-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Traffic Sources</h3>
                            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                {/* Replace with actual chart component */}
                                <PieChart className="h-12 w-12 opacity-50" />
                                <span className="ml-2">Pie Chart Placeholder</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity/Pages Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent Activity Placeholder */}
                        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow duration-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                {/* Replace with actual activity list/feed */}
                                <Activity className="h-12 w-12 opacity-50" />
                                <span className="ml-2">Activity Feed Placeholder</span>
                            </div>
                        </div>

                        {/* Top Pages Placeholder */}
                        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow duration-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Pages/Posts</h3>
                            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                {/* Replace with actual list/table */}
                                <List className="h-12 w-12 opacity-50" />
                                <span className="ml-2">Top Content Placeholder</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
