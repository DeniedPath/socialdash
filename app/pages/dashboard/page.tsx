// /app/dashboard/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation';

import {
    LayoutDashboard, BarChart3, FileText, Users, MessageSquare,
    Settings, HelpCircle, Bell, UserCircle, ArrowUpRight,
    PieChart as PieChartIcon, Activity as ActivityIcon, List as ListIcon, LogOut, Briefcase, TrendingUp, Target,
    ChevronDown, AlertCircle, RefreshCw, Youtube as YoutubeIcon, Twitter as TwitterIcon, Instagram as InstagramIcon // Added specific platform icons
} from 'lucide-react';

import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

// Define types for our data
type StatCardData = {
    title: string;
    value: string;
    icon: React.ElementType;
    change?: string;
    changeType?: 'positive' | 'negative';
};

type ChartDataPoint = { name: string; [key: string]: number | string }; // For line/bar charts
type PieChartDataPoint = { name: string; value: number; color: string };
type ActivityItem = { id: string | number; type: string; content: string; time: string; icon: React.ElementType };
type TopContentItem = { id: string | number; title: string; views: string; engagementRate: string };

// Main StatCard Component (no changes from before)
const StatCard: React.FC<StatCardData> = ({ title, value, icon: Icon, change, changeType }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-slate-100 rounded-lg">
                <Icon className="h-6 w-6 text-blue-600" />
            </div>
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

// Chart Placeholder Component (no changes from before)
const ChartPlaceholder = ({ message, icon: IconComp = BarChart3 }: { message: string, icon?: React.ElementType }) => (
    <div className="h-full bg-slate-50 rounded-lg flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 p-4 min-h-[200px]">
        <IconComp className="h-12 w-12 opacity-50 mb-3" />
        <span className="text-base text-center">{message}</span>
    </div>
);

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const [selectedPlatform, setSelectedPlatform] = useState<string>('youtube'); // Default to youtube if user is signed in with Google
    const [statsData, setStatsData] = useState<StatCardData[]>([]);
    const [lineChartData, setLineChartData] = useState<ChartDataPoint[]>([]);
    const [pieChartData, setPieChartData] = useState<PieChartDataPoint[]>([]);
    const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
    const [topContent, setTopContent] = useState<TopContentItem[]>([]);
    const [isChartsLoading, setIsChartsLoading] = useState<boolean>(true);
    const [chartError, setChartError] = useState<string | null>(null);

    // Placeholder for available platforms - this should come from user's connected accounts
    // and potentially the session to know which ones are active.
    const [availablePlatforms, setAvailablePlatforms] = useState([
        // { id: 'overall', name: 'Overall Performance', icon: LayoutDashboard }, // Overall might be a summary
        { id: 'youtube', name: 'YouTube', icon: YoutubeIcon },
        { id: 'twitter', name: 'Twitter / X', icon: TwitterIcon },
        { id: 'instagram', name: 'Instagram', icon: InstagramIcon },
    ]);

    // Effect for authentication
    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push(`/login?callbackUrl=${pathname}`);
        } else {
            // TODO: Dynamically populate `availablePlatforms` based on `session.user.connectedAccounts`
            // For now, if primary login was Google, default to YouTube if not already set.
            // @ts-ignore
            if (session.user?.provider === 'google' && selectedPlatform === 'overall' /* initial default */) {
                setSelectedPlatform('youtube');
            }
        }
    }, [session, status, router, pathname, selectedPlatform]);


    // Memoized fetchChartData function
    const fetchPlatformData = useCallback(async () => {
        if (!session || !selectedPlatform || selectedPlatform === 'overall') {
            // Handle 'overall' case separately if it's a summary of all platforms
            // or clear data if no specific platform is selected for fetching.
            if (selectedPlatform === 'overall') {
                setStatsData([
                    { title: 'Total Views (Overall)', value: 'N/A', icon: TrendingUp },
                    { title: 'Total Likes (Overall)', value: 'N/A', icon: Target },
                    { title: 'Total Subscribers (Overall)', value: 'N/A', icon: Users },
                ]);
                setLineChartData([]);
                setPieChartData([]);
                // Potentially fetch a summary from a different endpoint or aggregate client-side if feasible
            }
            setIsChartsLoading(false);
            return;
        }

        setIsChartsLoading(true);
        setChartError(null);
        console.log(`Fetching data for platform: ${selectedPlatform}`);

        try {
            // **ACTUAL API CALL TO YOUR BACKEND**
            // The backend (/api/analytics/[platform]) will use the user's session
            // to get the OAuth token for the selectedPlatform and fetch data from the actual social media API.
            const response = await fetch(`/api/analytics/${selectedPlatform}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch ${selectedPlatform} analytics data`);
            }
            const data = await response.json();

            // --- Update state with fetched data ---
            // The structure of 'data' must match what your frontend expects.
            // Example for YouTube:
            if (selectedPlatform === 'youtube' && data.youtubeStats) {
                setStatsData([
                    { title: 'YouTube Subscribers', value: data.youtubeStats.subscriberCount || '0', icon: Users, change: data.youtubeStats.subscriberChange || undefined, changeType: data.youtubeStats.subscriberChangeType || undefined },
                    { title: 'Total Views (YouTube)', value: data.youtubeStats.viewCount || '0', icon: TrendingUp },
                    { title: 'Total Videos (YouTube)', value: data.youtubeStats.videoCount || '0', icon: Briefcase },
                ]);
                setLineChartData(data.youtubeTimeSeriesData || []); // e.g., [{ name: 'Date', views: 100, likes: 10}, ...]
                setPieChartData(data.youtubeTrafficSources || []); // e.g., [{ name: 'Search', value: 50, color: '#FF0000' }, ...]
                setActivityFeed(data.youtubeRecentActivity || []);
                setTopContent(data.youtubeTopVideos || []);
            } else {
                // Handle other platforms or if data structure is different
                // Fallback to clearing or showing 'no data' for unhandled platforms
                setStatsData([]);
                setLineChartData([]);
                setPieChartData([]);
                setActivityFeed([]);
                setTopContent([]);
                console.warn(`No specific data handling for platform: ${selectedPlatform} or data was empty.`);
            }

        } catch (error: any) {
            console.error(`Error fetching ${selectedPlatform} data:`, error);
            setChartError(error.message || `Could not load ${selectedPlatform} analytics data.`);
            // Clear data on error
            setStatsData([]);
            setLineChartData([]);
            setPieChartData([]);
            setActivityFeed([]);
            setTopContent([]);
        } finally {
            setIsChartsLoading(false);
        }
    }, [selectedPlatform, session]); // Dependencies for useCallback

    // Effect to call fetchPlatformData
    useEffect(() => {
        if (session && selectedPlatform) {
            fetchPlatformData();
        }
    }, [fetchPlatformData, session, selectedPlatform]); // fetchPlatformData is now stable due to useCallback


    // Loading State
    if (status === 'loading' || (status === 'authenticated' && !session)) { // Handle edge case where status is authenticated but session is briefly null
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="p-10 bg-white rounded-xl shadow-2xl text-center">
                    <LayoutDashboard className="h-16 w-16 text-blue-500 mx-auto mb-6 animate-pulse" />
                    <p className="text-2xl font-semibold text-slate-700">Loading EchoPulse...</p>
                </div>
            </div>
        );
    }

    if (!session) { // Should be caught by useEffect redirect, but as a safeguard
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <p className="text-xl text-slate-600">Redirecting to login...</p>
            </div>
        );
    }

    //const navigationItems = [ /* ... same as before ... */ ];
    // Ensure navigationItems is defined if you are using it in the return statement
    // For brevity, I'll assume it's the same as your previous version.
     const navigationItems = [
         { name: 'Dashboard', icon: LayoutDashboard, href: '/pages/dashboard' },
         { name: 'Analytics', icon: BarChart3, href: '/pages/analytics' },
         { name: 'Reports', icon: FileText, href: '/pages/reports' },
         { name: 'Content Hub', icon: Briefcase, href: '/pages/content' },
         { name: 'Audience Insights', icon: Users, href: '/pages/audience' },
     ];


    return (
        <div className="flex h-screen bg-slate-100 font-sans antialiased">
            <aside className="w-72 flex-shrink-0 bg-slate-900 text-slate-300 flex flex-col shadow-2xl">
                {/* Sidebar content (same as before) */}
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

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white shadow-md border-b border-slate-200 flex items-center justify-between px-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">
                            {availablePlatforms.find(p => p.id === selectedPlatform)?.name || 'Dashboard'} Overview
                        </h1>
                    </div>
                    <div className="flex items-center space-x-5">
                        <div className="relative">
                            <select
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                                className="appearance-none bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2.5 hover:bg-slate-100 transition-colors"
                                title="Select Platform"
                            >
                                {availablePlatforms.map(platform => (
                                    <option key={platform.id} value={platform.id}>{platform.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="h-4 w-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {/* ... other header icons ... */}
                        <button title="Help" className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            <HelpCircle className="h-5 w-5" />
                        </button>
                        <button title="Notifications" className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                        <div className="h-8 border-l border-slate-200"></div>
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

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-8">
                    {/* Updated Stats Cards Row */}
                    {isChartsLoading && statsData.length === 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
                            {[...Array(3)].map((_, i) => <div key={i} className="bg-white p-5 rounded-xl shadow-lg h-32 animate-pulse"><div className="h-full bg-slate-200 rounded"></div></div>)}
                        </div>
                    ) : statsData.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
                            {statsData.map((stat) => (
                                <StatCard key={stat.title} {...stat} />
                            ))}
                        </div>
                    ) : !isChartsLoading && ( // Show if not loading and no stats
                        <div className="mb-10 p-4 bg-amber-50 text-amber-700 border border-amber-300 rounded-lg text-center">
                            No summary statistics available for {availablePlatforms.find(p=>p.id === selectedPlatform)?.name || 'this platform'}.
                        </div>
                    )}


                    {chartError && (
                        <div className="mb-8 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg flex items-center">
                            <AlertCircle className="h-5 w-5 mr-3" />
                            {chartError}
                            <button
                                onClick={fetchPlatformData} // Re-trigger fetch
                                className="ml-auto text-sm font-medium hover:underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Charts Row - structure remains similar, data source changes */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
                        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[400px]">
                            <h3 className="text-xl font-semibold text-slate-800 mb-1">Engagement Over Time</h3>
                            <p className="text-sm text-slate-500 mb-5">Key metrics trend for {availablePlatforms.find(p=>p.id === selectedPlatform)?.name || 'selected platform'}.</p>
                            {isChartsLoading ? <ChartPlaceholder message="Loading chart data..." icon={RefreshCw} /> : lineChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={320}>
                                    <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                                        <Tooltip wrapperClassName="rounded-md shadow-lg" contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }} />
                                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                                        {/* Dynamically add lines based on available keys in data, excluding 'name' */}
                                        {lineChartData.length > 0 && Object.keys(lineChartData[0]).filter(key => key !== 'name').map((key, index) => (
                                            <Line key={key} type="monotone" dataKey={key} stroke={['#3b82f6', '#84cc16', '#f97316', '#a855f7'][index % 4]} strokeWidth={2} activeDot={{ r: 6 }} name={key.charAt(0).toUpperCase() + key.slice(1)} />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : <ChartPlaceholder message="No time-series data available." />}
                        </div>

                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[400px]">
                            <h3 className="text-xl font-semibold text-slate-800 mb-1">Audience Breakdown</h3>
                            <p className="text-sm text-slate-500 mb-5">Visitor demographics or sources.</p>
                            {isChartsLoading ? <ChartPlaceholder message="Loading chart data..." icon={RefreshCw} /> : pieChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={320}>
                                    <PieChart>
                                        <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false}
                                             label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                                 const RADIAN = Math.PI / 180;
                                                 const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // Adjust label position
                                                 const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                 const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                                 return (
                                                     <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="medium">
                                                         {`${(percent * 100).toFixed(0)}%`}
                                                     </text>
                                                 );
                                             }}
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} className="focus:outline-none hover:opacity-80 transition-opacity" />
                                            ))}
                                        </Pie>
                                        <Tooltip wrapperClassName="rounded-md shadow-lg" contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }} />
                                        <Legend iconSize={10} wrapperStyle={{fontSize: "12px", paddingTop: "10px"}}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <ChartPlaceholder message="No breakdown data available." icon={PieChartIcon} />}
                        </div>
                    </div>
                    {/* ... Activity/Pages Row (structure remains similar, data source changes) ... */}
                </main>
            </div>
        </div>
    );
}
