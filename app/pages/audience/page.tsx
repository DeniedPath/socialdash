// /app/audience/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation';

// Import icons from lucide-react
import {
    LayoutDashboard, BarChart3, FileText, Users, Briefcase,
    Settings, LogOut, TrendingUp, TrendingDown,
    ChevronDown, AlertCircle, RefreshCw, CalendarDays, Users2, UserPlus, Percent, LineChart as LineChartIcon
} from 'lucide-react';

// Import Recharts components
import {
    ResponsiveContainer, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area
} from 'recharts';

// Define a type for Audience Stat Cards
type AudienceStatCardProps = {
    title: string;
    value: string;
    icon: React.ElementType;
    change?: string; // e.g., "+150 last 7 days" or "+2.5%"
    changeType?: 'positive' | 'negative' | 'neutral';
    period?: string;
};

const AudienceStatCard: React.FC<AudienceStatCardProps> = ({ title, value, icon: Icon, change, changeType, period }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <div className="p-2 bg-slate-100 rounded-lg">
                <Icon className="h-5 w-5 text-blue-600" />
            </div>
        </div>
        <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
        {change && (
            <div className="flex items-center text-xs">
                {changeType === 'positive' && <TrendingUp className="h-4 w-4 mr-1 text-green-500" />}
                {changeType === 'negative' && <TrendingDown className="h-4 w-4 mr-1 text-red-500" />}
                <span className={`${changeType === 'positive' ? 'text-green-500' : changeType === 'negative' ? 'text-red-500' : 'text-slate-500'}`}>
                    {change}
                </span>
                {period && <span className="ml-1 text-slate-400">{period}</span>}
            </div>
        )}
    </div>
);

// Chart Placeholder Component
const ChartPlaceholder = ({ message, icon: IconComp = BarChart3, height = "h-full" }: { message: string, icon?: React.ElementType, height?: string }) => (
    <div className={`${height} bg-slate-50 rounded-lg flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 p-4 min-h-[200px]`}>
        <IconComp className="h-12 w-12 opacity-50 mb-3" />
        <span className="text-base text-center">{message}</span>
    </div>
);

// Sample data - replace with fetched data
const sampleAudienceStats = [
    { title: 'Total Followers', value: '25.6K', icon: Users2, change: '+1.2K', changeType: 'positive' as const, period: 'last 30 days' },
    { title: 'New Followers', value: '850', icon: UserPlus, change: '+5.8%', changeType: 'positive' as const, period: 'last 7 days' },
    { title: 'Engagement Rate', value: '3.9%', icon: Percent, change: '-0.3%', changeType: 'negative' as const, period: 'last 30 days' },
];

const sampleFollowerGrowthData = [
    { date: 'Jan', followers: 18000 }, { date: 'Feb', followers: 19500 }, { date: 'Mar', followers: 22000 },
    { date: 'Apr', followers: 23500 }, { date: 'May', followers: 25600 },
];

const sampleDemographicsData = [ // Example for a pie chart
    { name: '18-24', value: 30, color: '#0088FE' }, { name: '25-34', value: 45, color: '#00C49F' },
    { name: '35-44', value: 15, color: '#FFBB28' }, { name: '45+', value: 10, color: '#FF8042' },
];

export default function AudiencePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const [selectedPlatform, setSelectedPlatform] = useState<string>('overall');
    const [dateRange] = useState<string>('last_30_days');

    // Define types for the data
    type FollowerGrowthDataPoint = {
        date: string;
        followers: number;
    };
    
    type DemographicsDataPoint = {
        name: string;
        value: number;
        color: string;
    };
    
    type AudienceActivityItem = {
        id: string;
        name: string;
        platform: string;
        date: string;
        avatar: string;
    };
    
    // State for audience data
    const [audienceStats, setAudienceStats] = useState<AudienceStatCardProps[]>([]);
    const [followerGrowthData, setFollowerGrowthData] = useState<FollowerGrowthDataPoint[]>([]);
    const [demographicsData, setDemographicsData] = useState<DemographicsDataPoint[]>([]);
    // Placeholder for a list of recent followers or top influencers
    const [audienceActivity, setAudienceActivity] = useState<AudienceActivityItem[]>([]);


    const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
    const [dataError, setDataError] = useState<string | null>(null);

    // Effect for authentication
    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push(`/login?callbackUrl=${pathname}`);
        }
    }, [session, status, router, pathname]);

    // Memoized fetchAudienceData function
    const fetchAudienceData = useCallback(async () => {
        if (!session) return;

        setIsDataLoading(true);
        setDataError(null);
        console.log(`Fetching audience data for platform: ${selectedPlatform}, date range: ${dateRange}`);

        try {
            // **ACTUAL API CALL TO YOUR BACKEND**
            // Endpoint like: /api/audience?platform=${selectedPlatform}&range=${dateRange}
            // This API would fetch audience-specific data (follower counts, demographics, etc.)
            // const response = await fetch(`/api/audience?platform=${selectedPlatform}&range=${dateRange}`);
            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.message || `Failed to fetch audience data`);
            // }
            // const data = await response.json();
            // setAudienceStats(data.summaryStats);
            // setFollowerGrowthData(data.growthTrend);
            // setDemographicsData(data.demographics);
            // setAudienceActivity(data.activityList); // e.g., new followers

            // Simulate API delay and set sample data
            await new Promise(resolve => setTimeout(resolve, 1100));
            setAudienceStats(sampleAudienceStats);
            setFollowerGrowthData(sampleFollowerGrowthData);
            setDemographicsData(sampleDemographicsData);
            setAudienceActivity([
                { id: 'follower1', name: 'Jane Doe (@janedoe)', platform: 'Instagram', date: '2024-05-13', avatar: 'https://placehold.co/40x40/a2d2ff/ffffff?text=JD' },
                { id: 'follower2', name: 'Tech Enthusiast (@techguru)', platform: 'Twitter / X', date: '2024-05-12', avatar: 'https://placehold.co/40x40/ffafcc/ffffff?text=TG' },
                { id: 'follower3', name: 'Creator Hub', platform: 'YouTube', date: '2024-05-11', avatar: 'https://placehold.co/40x40/bde0fe/ffffff?text=CH' },
            ]);


                } catch (error: Error | unknown) {
                    console.error(`Error fetching audience data:`, error);
                    const errorMessage = error instanceof Error ? error.message : "Could not load audience insights.";
                    setDataError(errorMessage);
            setAudienceStats([]);
            setFollowerGrowthData([]);
            setDemographicsData([]);
            setAudienceActivity([]);
        } finally {
            setIsDataLoading(false);
        }
    }, [selectedPlatform, dateRange, session]);

    useEffect(() => {
        if (session) {
            fetchAudienceData();
        }
    }, [fetchAudienceData, session]);


    if (status === 'loading' || (status === 'authenticated' && !session)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="p-10 bg-white rounded-xl shadow-2xl text-center">
                    <Users className="h-16 w-16 text-blue-500 mx-auto mb-6 animate-pulse" />
                    <p className="text-2xl font-semibold text-slate-700">Loading Audience Insights...</p>
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
    const availablePlatforms = [
        { id: 'overall', name: 'Overall' }, { id: 'youtube', name: 'YouTube' },
        { id: 'twitter', name: 'Twitter / X' }, { id: 'instagram', name: 'Instagram' },
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
                        <h1 className="text-2xl font-semibold text-slate-800">Audience Insights</h1>
                        <p className="text-sm text-slate-500">Understand your followers and their behavior.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <select
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                                className="appearance-none bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2.5 hover:bg-slate-100 transition-colors"
                                title="Select Platform for Audience Data"
                            >
                                {availablePlatforms.map(platform => (
                                    <option key={platform.id} value={platform.id}>{platform.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="h-4 w-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
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
                    {/* Top Stat Cards */}
                    {isDataLoading && audienceStats.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[...Array(3)].map((_, i) => <div key={i} className="bg-white p-5 rounded-xl shadow-lg h-36 animate-pulse"><div className="h-full bg-slate-200 rounded"></div></div>)}
                        </div>
                    ) : audienceStats.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {audienceStats.map((stat) => (
                                <AudienceStatCard key={stat.title} {...stat} />
                            ))}
                        </div>
                    ) : !isDataLoading && (
                        <div className="mb-8 p-4 bg-amber-50 text-amber-700 border border-amber-300 rounded-lg text-center">
                            No audience summary available for the selected criteria.
                        </div>
                    )}

                    {dataError && (
                        <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg flex items-center">
                            <AlertCircle className="h-5 w-5 mr-3" /> {dataError}
                            <button onClick={fetchAudienceData} className="ml-auto text-sm font-medium hover:underline">Retry</button>
                        </div>
                    )}

                    {/* Main Charts/Data Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Follower Growth Chart */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[380px]">
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">Follower Growth Trend</h3>
                            <p className="text-xs text-slate-500 mb-4">Track your audience growth over time for {availablePlatforms.find(p=>p.id === selectedPlatform)?.name || 'selected source'}.</p>
                            {isDataLoading ? <ChartPlaceholder message="Loading growth data..." icon={RefreshCw} height="h-[280px]" /> : followerGrowthData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <AreaChart data={followerGrowthData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                                        <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} />
                                        <Tooltip wrapperClassName="rounded-md shadow-lg" contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem', fontSize: '12px' }} />
                                        <Area type="monotone" dataKey="followers" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFollowers)" strokeWidth={2} name="Followers" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : <ChartPlaceholder message="No follower growth data available." icon={LineChartIcon} height="h-[280px]" />}
                        </div>

                        {/* Demographics Chart (e.g., Age or Location) */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[380px]">
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">Audience Demographics</h3>
                            <p className="text-xs text-slate-500 mb-4">Example: Age distribution.</p>
                            {isDataLoading ? <ChartPlaceholder message="Loading demographics..." icon={RefreshCw} height="h-[280px]" /> : demographicsData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie data={demographicsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} labelLine={false}
                                             label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {demographicsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} className="focus:outline-none hover:opacity-80 transition-opacity" />
                                            ))}
                                        </Pie>
                                        <Tooltip wrapperClassName="rounded-md shadow-lg" contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem', fontSize: '12px' }} />
                                        <Legend wrapperStyle={{fontSize: "10px"}}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <ChartPlaceholder message="No demographics data available." icon={LineChartIcon} height="h-[280px]" />}
                        </div>
                    </div>

                    {/* Recent Followers / Audience Activity List (Placeholder) */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">Recent Audience Activity</h3>
                        <p className="text-xs text-slate-500 mb-4">Latest new followers or key audience interactions.</p>
                        {isDataLoading ? <ChartPlaceholder message="Loading activity..." icon={RefreshCw} height="h-[200px]" /> : audienceActivity.length > 0 ? (
                            <ul className="space-y-3 max-h-72 overflow-y-auto pr-2">
                                {audienceActivity.map(activity => (
                                    <li key={activity.id} className="flex items-center p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors">
                                        <Image 
                                            src={activity.avatar} 
                                            alt={activity.name} 
                                            width={32} 
                                            height={32} 
                                            className="rounded-full mr-3 flex-shrink-0"
                                            onError={(e) => {
                                                // Handle image load error
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{activity.name}</p>
                                            <p className="text-xs text-slate-500">Joined on {activity.date} via {activity.platform}</p>
                                        </div>
                                        {/* <button className="ml-auto text-xs text-blue-500 hover:underline">View Profile</button> */}
                                    </li>
                                ))}
                            </ul>
                        ) : <ChartPlaceholder message="No recent audience activity." icon={Users} height="h-[200px]" />}
                    </div>
                </main>
            </div>
        </div>
    );
}
