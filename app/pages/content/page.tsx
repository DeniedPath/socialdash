// /app/content/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

// Import icons from lucide-react
import {
    LayoutDashboard, BarChart3, FileText, Users, MessageSquare, Edit, Send, FileArchive,
    Settings, LogOut, Briefcase,
    ChevronDown, AlertCircle, CalendarDays, Eye, Trash2, Edit2, Twitter,
    Linkedin,
    Youtube, Instagram, Facebook, ThumbsUp
} from 'lucide-react';

// Define a type for Content items
type ContentItem = {
    id: string;
    headline: string; // Or title, caption
    platform: string; // e.g., "YouTube", "Twitter / X", "Instagram"
    platformIcon: React.ElementType; // Icon for the platform
    date: string; // Publication or last modified date
    status: 'Published' | 'Draft' | 'Scheduled' | 'Archived';
    imageUrl?: string; // Optional image preview for the post
    link?: string; // Link to the actual post
    // Add other relevant fields like views, likes, comments if displaying brief stats here
    views?: string;
    likes?: string;
};

// Sample data for content items - replace with fetched data
const sampleContentData: ContentItem[] = [
    { id: 'post001', headline: 'Exciting News! Our new feature is live on EchoPulse.', platform: 'Twitter / X', platformIcon: Twitter, date: '2024-05-10', status: 'Published', views: '1.2K', likes: '150', link: '#' },
    { id: 'post002', headline: 'Deep Dive: Q1 Analytics Trends', platform: 'LinkedIn', platformIcon: Linkedin, date: '2024-05-08', status: 'Published', views: '800', likes: '95', link: '#' },
    { id: 'post003', headline: 'Upcoming Webinar: Mastering Social Engagement', platform: 'YouTube', platformIcon: Youtube, date: '2024-05-15', status: 'Scheduled', imageUrl: 'https://placehold.co/100x60/a2d2ff/ffffff?text=Webinar' },
    { id: 'post004', headline: 'Brainstorming new content ideas for #EchoPulseTips', platform: 'Internal Draft', platformIcon: MessageSquare, date: '2024-05-12', status: 'Draft' },
    { id: 'post005', headline: 'BTS Concert Highlights', platform: 'Instagram', platformIcon: Instagram, date: '2024-05-05', status: 'Published', imageUrl: 'https://placehold.co/100x100/ffafcc/ffffff?text=BTS', views: '2.5K', likes: '320', link: '#' },
    { id: 'post006', headline: 'Archived Campaign: Summer Sale 2023', platform: 'Facebook', platformIcon: Facebook, date: '2023-08-15', status: 'Archived' },
];


export default function ContentPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const [activeTab, setActiveTab] = useState<'published' | 'drafts' | 'scheduled' | 'archived'>('published');
    const [dateRange] = useState<string>('last_30_days'); // Placeholder
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [platformFilter, setPlatformFilter] = useState<string>('all');

    const [contentItems, setContentItems] = useState<ContentItem[]>([]);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
    const [dataError, setDataError] = useState<string | null>(null);

    // Effect for authentication
    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push(`/login?callbackUrl=${pathname}`);
        }
    }, [session, status, router, pathname]);

    // Memoized fetchContentData function
    const fetchContentData = useCallback(async () => {
        if (!session) return;

        setIsDataLoading(true);
        setDataError(null);
        console.log(`Fetching content for tab: ${activeTab}, range: ${dateRange}, search: ${searchTerm}, platform: ${platformFilter}`);

        try {
            // **ACTUAL API CALL TO YOUR BACKEND TO FETCH CONTENT LIST**
            // Endpoint like: /api/content?status=${activeTab}&range=${dateRange}&search=${searchTerm}&platform=${platformFilter}
            // This API would fetch the list of posts from your database or directly from connected platforms.
            // const response = await fetch(`/api/content?status=${activeTab}&range=${dateRange}&search=${searchTerm}&platform=${platformFilter}`);
            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.message || `Failed to fetch content`);
            // }
            // const data = await response.json();
            // setContentItems(data.posts);

            // Simulate API delay and set sample data based on activeTab
            await new Promise(resolve => setTimeout(resolve, 1000));
            const filteredSampleData = sampleContentData.filter(item => {
                const matchesPlatform = platformFilter === 'all' || item.platform.toLowerCase().includes(platformFilter.toLowerCase());
                const matchesSearch = !searchTerm || item.headline.toLowerCase().includes(searchTerm.toLowerCase());
                // Date range filtering would be more complex
                return matchesPlatform && matchesSearch;
            });

            if (activeTab === 'published') {
                setContentItems(filteredSampleData.filter(item => item.status === 'Published'));
            } else if (activeTab === 'drafts') {
                setContentItems(filteredSampleData.filter(item => item.status === 'Draft'));
            } else if (activeTab === 'scheduled') {
                setContentItems(filteredSampleData.filter(item => item.status === 'Scheduled'));
            } else if (activeTab === 'archived') {
                setContentItems(filteredSampleData.filter(item => item.status === 'Archived'));
            }


        } catch (error: Error | unknown) {
            console.error(`Error fetching content data:`, error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : "Could not load content.";
            setDataError(errorMessage);
            setContentItems([]);
        } finally {
            setIsDataLoading(false);
        }
    }, [activeTab, dateRange, searchTerm, platformFilter, session]);

    useEffect(() => {
        if (session) {
            fetchContentData();
        }
    }, [fetchContentData, session]);

    const handleAction = (action: 'view' | 'edit' | 'delete', postId: string) => {
        alert(`${action} action for post ID: ${postId} - Implement logic.`);
        // For 'delete', you'd typically show a confirmation modal then call an API.
    };


    if (status === 'loading' || (status === 'authenticated' && !session)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="p-10 bg-white rounded-xl shadow-2xl text-center">
                    <Briefcase className="h-16 w-16 text-blue-500 mx-auto mb-6 animate-pulse" />
                    <p className="text-2xl font-semibold text-slate-700">Loading Content Hub...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <p className="text-xl text-slate-600">Redirecting to login...</p>
            </div>
        );
    }

    const navigationItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/pages/dashboard' },
        { name: 'Analytics', icon: BarChart3, href: '/pages/analytics' },
        { name: 'Reports', icon: FileText, href: '/pages/reports' },
        { name: 'Content Hub', icon: Briefcase, href: '/pages/content' },
        { name: 'Audience Insights', icon: Users, href: '/pages/audience' },
    ];

    const platformOptions = [
        { id: 'all', name: 'All Platforms' },
        { id: 'youtube', name: 'YouTube' },
        { id: 'twitter', name: 'Twitter / X' },
        { id: 'instagram', name: 'Instagram' },
        { id: 'linkedin', name: 'LinkedIn' },
        { id: 'facebook', name: 'Facebook' },
    ];

    const tabs = [
        { name: 'Published', id: 'published' as const, icon: Send },
        { name: 'Drafts', id: 'drafts' as const, icon: Edit },
        { name: 'Scheduled', id: 'scheduled' as const, icon: CalendarDays },
        { name: 'Archived', id: 'archived' as const, icon: FileArchive },
    ];


    return (
        <div className="flex h-screen bg-slate-100 font-sans antialiased">
            {/* Sidebar (Same as Dashboard) */}
            <aside className="w-72 flex-shrink-0 bg-slate-900 text-slate-300 flex flex-col shadow-2xl">
                {/* ... Sidebar content from previous pages ... */}
                <div className="h-20 flex items-center justify-center border-b border-slate-700/50">
                    <Link href="/pages/dashboard" className="flex items-center space-x-2">
                        <LayoutDashboard className="h-8 w-8 text-blue-500" />
                        <span className="text-3xl font-bold text-white tracking-tight">EchoPulse</span>
                    </Link>
                </div>
                <nav className="flex-grow py-6 px-5 space-y-2.5">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group ${
                                    isActive ? 'bg-blue-600 text-white shadow-md scale-105' : 'hover:bg-slate-700/80 hover:text-white focus:bg-slate-700 focus:text-white'
                                }`}
                            >
                                <item.icon className={`h-5 w-5 mr-3.5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="px-5 py-6 mt-auto border-t border-slate-700/50 space-y-2.5">
                    <Link href="/pages/settings" className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group ${pathname.startsWith('/settings') ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/80 hover:text-white focus:bg-slate-700 focus:text-white'}`}>
                        <Settings className={`h-5 w-5 mr-3.5 transition-colors ${pathname.startsWith('/settings') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                        <span className="font-medium">Settings</span>
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600/20 hover:text-red-400 focus:bg-red-600/20 focus:text-red-400 transition-all duration-200 ease-in-out group">
                        <LogOut className="h-5 w-5 mr-3.5 text-slate-400 group-hover:text-red-400 transition-colors" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white shadow-md border-b border-slate-200 flex items-center justify-between px-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">Content Hub</h1>
                        <p className="text-sm text-slate-500">Manage and review your social media posts.</p>
                    </div>
                    <div className="flex items-center space-x-4">

                        {/* Date Range Picker Placeholder - You can use a library like react-datepicker */}
                        <button className="flex items-center bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors">
                            <CalendarDays className="h-4 w-4 mr-2 text-slate-500" />
                            <span>Last 30 Days</span>
                            <ChevronDown className="h-4 w-4 ml-2 text-slate-500" />
                        </button>
                        {/* Profile Link - same as other pages */}
                    </div>
                </header>

                {/* Page Content - Scrollable */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-8">
                    {/* Filters and Tabs */}
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex border border-slate-300 rounded-lg shadow-sm bg-white">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2.5 text-sm font-medium flex items-center transition-colors duration-150 ease-in-out
                                        ${activeTab === tab.id ? 'bg-blue-500 text-white shadow-inner' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}
                                        first:rounded-l-lg last:rounded-r-lg sm:first:border-r sm:last:border-l sm:border-slate-300`}
                                >
                                    <tab.icon className={`h-4 w-4 mr-2 ${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`} />
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-auto"
                            />
                            <div className="relative w-full sm:w-auto">
                                <select
                                    value={platformFilter}
                                    onChange={(e) => setPlatformFilter(e.target.value)}
                                    className="appearance-none bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2.5 hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    {platformOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                                </select>
                                <ChevronDown className="h-4 w-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {dataError && (
                        <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg flex items-center">
                            <AlertCircle className="h-5 w-5 mr-3" /> {dataError}
                            <button onClick={fetchContentData} className="ml-auto text-sm font-medium hover:underline">Retry</button>
                        </div>
                    )}

                    {/* Content List/Table */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {isDataLoading ? (
                            <div className="p-6 space-y-4">
                                {[...Array(5)].map((_, i) => ( // Show more skeleton items
                                    <div key={i} className="h-16 bg-slate-200 rounded animate-pulse"></div>
                                ))}
                            </div>
                        ) : contentItems.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-2/5">Headline / Content</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Platform</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stats</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                    {contentItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {item.imageUrl && (
                                                        <Image 
                                                            src={item.imageUrl} 
                                                            alt="Content preview" 
                                                            width={64}
                                                            height={40}
                                                            className="h-10 w-16 object-cover rounded mr-3 flex-shrink-0" 
                                                            onError={(e) => {
                                                                // TypeScript expects the error event, so we need to cast it
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                            }} 
                                                        />
                                                    )}
                                                    <div className="text-sm font-medium text-slate-900 truncate" title={item.headline}>{item.headline}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-slate-600">
                                                    <item.platformIcon className="h-5 w-5 mr-1.5 text-slate-400" />
                                                    {item.platform}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        item.status === 'Published' ? 'bg-green-100 text-green-800' :
                                                            item.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                                                                item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                                                    item.status === 'Archived' ? 'bg-slate-200 text-slate-700' : ''
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                                                {item.views && <div><Eye className="h-3 w-3 inline mr-1"/>{item.views}</div>}
                                                {item.likes && <div><ThumbsUp className="h-3 w-3 inline mr-1"/>{item.likes}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" title="View Post"><Eye className="h-5 w-5 inline"/></a>}
                                                <button onClick={() => handleAction('edit', item.id)} className="text-indigo-600 hover:text-indigo-800" title="Edit Post"><Edit2 className="h-5 w-5 inline"/></button>
                                                {item.status !== 'Published' && <button onClick={() => handleAction('delete', item.id)} className="text-red-600 hover:text-red-800" title="Delete Post"><Trash2 className="h-5 w-5 inline"/></button>}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-10 text-center text-slate-500">
                                <Briefcase className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                                <p>No content found for &quot;{activeTab}&quot; that matches your filters.</p>
                                <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
