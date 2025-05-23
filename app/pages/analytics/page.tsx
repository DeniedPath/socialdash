// /app/analytics/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation';

// Import icons from lucide-react
import {
    LayoutDashboard, BarChart3, FileText, Users,
    Settings, TrendingUp, TrendingDown,
    PieChart as PieChartIcon, LogOut, Briefcase,
    ChevronDown, AlertCircle, RefreshCw, CalendarDays, Users2, Heart
} from 'lucide-react';

// Import Recharts components
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

// Define a type for Stat Cards
type AnalyticsStatCardProps = {
    title: string;
    value: string;
    icon: React.ElementType;
    period?: string; // e.g., "Last 30 days"
    trendValue?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
};

const AnalyticsStatCard: React.FC<AnalyticsStatCardProps> = ({ title, value, icon: Icon, period, trendValue, trendDirection }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <div className="p-2 bg-slate-100 rounded-lg">
                <Icon className="h-5 w-5 text-blue-600" />
            </div>
        </div>
        <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
        {trendValue && (
            <div className="flex items-center text-xs">
                {trendDirection === 'up' && <TrendingUp className="h-4 w-4 mr-1 text-green-500" />}
                {trendDirection === 'down' && <TrendingDown className="h-4 w-4 mr-1 text-red-500" />}
                <span className={`${trendDirection === 'up' ? 'text-green-500' : trendDirection === 'down' ? 'text-red-500' : 'text-slate-500'}`}>
                    {trendValue}
                </span>
                {period && <span className="ml-1 text-slate-400">vs prev. period</span>}
            </div>
        )}
        {!trendValue && period && <p className="text-xs text-slate-400">{period}</p>}
    </div>
);

// Chart Placeholder Component
const ChartPlaceholder = ({ message, icon: IconComp = BarChart3, height = "h-full" }: { message: string, icon?: React.ElementType, height?: string }) => (
    <div className={`${height} bg-slate-50 rounded-lg flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 p-4 min-h-[200px]`}>
        <IconComp className="h-12 w-12 opacity-50 mb-3" />
        <span className="text-base text-center">{message}</span>
    </div>
);

// Sample data for charts - replace with fetched data
const sampleFollowerEngagementData: FollowerEngagementDataPoint[] = [
    { date: '2024-04-01', followers: 1200, engagement: 250 },
    { date: '2024-04-08', followers: 1250, engagement: 280 },
    { date: '2024-04-15', followers: 1300, engagement: 260 },
    { date: '2024-04-22', followers: 1380, engagement: 310 },
    { date: '2024-04-29', followers: 1450, engagement: 300 },
];

const samplePlatformDistributionData: PlatformDistributionDataPoint[] = [
    { name: 'YouTube', value: 45, color: '#FF0000' },
    { name: 'Twitter/X', value: 30, color: '#1DA1F2' },
    { name: 'Instagram', value: 25, color: '#E1306C' },
];

const sampleOverallTrendData: OverallTrendDataPoint[] = [
    { month: 'Jan', value: 12000 },
    { month: 'Feb', value: 15000 },
    { month: 'Mar', value: 13500 },
    { month: 'Apr', value: 16000 },
    { month: 'May', value: 18500 },
    { month: 'Jun', value: 17000 },
];

// Define missing types
interface FollowerEngagementDataPoint {
    date: string;
    followers: number;
    engagement: number; // Corrected from engagementRate
}

interface PlatformDistributionDataPoint {
    name: string; // Corrected from platform
    value: number;
    color: string;
}

interface OverallTrendDataPoint {
    month: string; // Corrected from date
    value: number;
    metric?: string; // Made optional to match usage
}

export default function AnalyticsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const [selectedPlatform, setSelectedPlatform] = useState<string>('overall');
    const [dateRange] = useState<string>('last_30_days'); // Placeholder for date range selection

    // Define types for chart data
    type FollowerEngagementDataPoint = {
        date: string;
        followers: number;
        engagement: number;
    };
    
    type PlatformDistributionDataPoint = {
        name: string;
        value: number;
        color: string;
    };
    
    type OverallTrendDataPoint = {
        month: string;
        value: number;
    };
    
    // State for chart data
    const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStatCardProps[]>([]);
    const [followerEngagementData, setFollowerEngagementData] = useState<FollowerEngagementDataPoint[]>([]);
    const [platformDistributionData, setPlatformDistributionData] = useState<PlatformDistributionDataPoint[]>([]);
    const [overallTrendData, setOverallTrendData] = useState<OverallTrendDataPoint[]>([]);


    const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
    const [dataError, setDataError] = useState<string | null>(null);

    // Effect for authentication
    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push(`/login?callbackUrl=${pathname}`);
        }
    }, [session, status, router, pathname]);

    // Memoized fetchAnalyticsData function
    const fetchAnalyticsData = useCallback(async (): Promise<void> => {
        if (!session) return;

        setIsDataLoading(true);
        setDataError(null);
        console.log(`Fetching analytics for platform: ${selectedPlatform}, date range: ${dateRange}`);

        try {
            // **ACTUAL API CALL TO YOUR BACKEND**
            // Endpoint like: /api/analytics-detail?platform=${selectedPlatform}&range=${dateRange}
            // This API would fetch and process data from the specific platform or aggregate if 'overall'.
            // const response = await fetch(`/api/analytics-detail?platform=${selectedPlatform}&range=${dateRange}`);
            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.message || `Failed to fetch analytics`);
            // }
            // const data = await response.json();

            // Simulate API delay and set sample data
            await new Promise(resolve => setTimeout(resolve, 1200));

            // Update state based on fetched data (using sample data for now)
            setAnalyticsStats([
                { title: 'Total Followers', value: '15.8K', icon: Users2, trendValue: '+500', trendDirection: 'up' },
                { title: 'Avg. Engagement Rate', value: '4.7%', icon: Heart, trendValue: '-0.2%', trendDirection: 'down' },
                { title: 'Top Performing Post', value: 'Summer Campaign Launch', icon: TrendingUp, period: 'Last 7 days' },
            ]);
            setFollowerEngagementData(sampleFollowerEngagementData);
            setPlatformDistributionData(samplePlatformDistributionData);
            setOverallTrendData(sampleOverallTrendData);

        } catch (error: unknown) {
            console.error(`Error fetching analytics data:`, error);
            const errorMessage = error instanceof Error ? error.message : "Could not load analytics data.";
            setDataError(errorMessage);
            // Clear data on error
            setAnalyticsStats([]);
            setFollowerEngagementData([]);
            setPlatformDistributionData([]);
            setOverallTrendData([]);
        } finally {
            setIsDataLoading(false);
        }
    }, [selectedPlatform, dateRange, session]);

    useEffect(() => {
        if (session) {
            fetchAnalyticsData();
        }
    }, [fetchAnalyticsData, session]);


    if (status === 'loading' || (status === 'authenticated' && !session)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="p-10 bg-white rounded-xl shadow-2xl text-center">
                    <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-6 animate-pulse" />
                    <p className="text-2xl font-semibold text-slate-700">Loading Analytics...</p>
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
                {/* Header (Similar to Dashboard) */}
                <header className="h-20 bg-white shadow-md border-b border-slate-200 flex items-center justify-between px-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">Analytics Overview</h1>
                        <p className="text-sm text-slate-500">Detailed insights into your social media performance.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Platform Selector */}
                        <div className="relative">
                            <select
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                                className="appearance-none bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2.5 hover:bg-slate-100 transition-colors"
                                title="Select Platform for Analytics"
                            >
                                {availablePlatforms.map(platform => (
                                    <option key={platform.id} value={platform.id}>{platform.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="h-4 w-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {/* Date Range Picker Placeholder */}
                        <button className="flex items-center bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors">
                            <CalendarDays className="h-4 w-4 mr-2 text-slate-500" />
                            <span>Last 30 Days</span> {/* Placeholder */}
                            <ChevronDown className="h-4 w-4 ml-2 text-slate-500" />
                        </button>
                        <div className="h-8 border-l border-slate-200"></div>
                        <Link href="/pages/profile" title="Profile" className="flex items-center space-x-3 group"> {/* ... Profile Link ... */} </Link>
                    </div>
                </header>

                {/* Page Content - Scrollable */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-8">
                    {/* Top Stat Cards */}
                    {isDataLoading && analyticsStats.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[...Array(3)].map((_, i) => <div key={i} className="bg-white p-5 rounded-xl shadow-lg h-32 animate-pulse"><div className="h-full bg-slate-200 rounded"></div></div>)}
                        </div>
                    ) : analyticsStats.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {analyticsStats.map((stat) => (
                                <AnalyticsStatCard key={stat.title} {...stat} />
                            ))}
                        </div>
                    ) : !isDataLoading && (
                        <div className="mb-8 p-4 bg-amber-50 text-amber-700 border border-amber-300 rounded-lg text-center">
                            No summary statistics available for the selected criteria.
                        </div>
                    )}

                    {dataError && (
                        <div className="mb-8 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg flex items-center">
                            <AlertCircle className="h-5 w-5 mr-3" /> {dataError}
                            <button onClick={fetchAnalyticsData} className="ml-auto text-sm font-medium hover:underline">Retry</button>
                        </div>
                    )}

                    {/* Mid-section Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[350px]">
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">Followers & Engagement Trend</h3>
                            <p className="text-xs text-slate-500 mb-4">Weekly overview for {availablePlatforms.find(p=>p.id === selectedPlatform)?.name || 'selected source'}.</p>
                            {isDataLoading ? <ChartPlaceholder message="Loading data..." icon={RefreshCw} height="h-[250px]" /> : followerEngagementData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={followerEngagementData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                                        <YAxis yAxisId="left" stroke="#3b82f6" fontSize={10} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={10} />
                                        <Tooltip wrapperClassName="rounded-md shadow-lg" contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem', fontSize: '12px' }} />
                                        <Legend wrapperStyle={{fontSize: "10px"}}/>
                                        <Bar yAxisId="left" dataKey="followers" fill="#3b82f6" name="Followers" radius={[4, 4, 0, 0]} />
                                        <Bar yAxisId="right" dataKey="engagement" fill="#10b981" name="Engagement" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : <ChartPlaceholder message="No follower/engagement data." height="h-[250px]" />}
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[350px]">
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">Platform Distribution</h3>
                            <p className="text-xs text-slate-500 mb-4">Contribution of each platform (if &apos;Overall&apos; is selected).</p>
                            {isDataLoading ? <ChartPlaceholder message="Loading data..." icon={RefreshCw} height="h-[250px]" /> : platformDistributionData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={platformDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}
                                             label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {platformDistributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip wrapperClassName="rounded-md shadow-lg" contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem', fontSize: '12px' }} />
                                        {/* <Legend wrapperStyle={{fontSize: "10px"}}/> */}
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <ChartPlaceholder message="No platform distribution data." icon={PieChartIcon} height="h-[250px]" />}
                        </div>
                    </div>

                    {/* Bottom Large Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[400px]">
                        <h3 className="text-lg font-semibold text-slate-800 mb-1">Overall Performance Trend</h3>
                        <p className="text-xs text-slate-500 mb-4">Monthly key metric trend for {availablePlatforms.find(p=>p.id === selectedPlatform)?.name || 'selected source'}.</p>
                        {isDataLoading ? <ChartPlaceholder message="Loading data..." icon={RefreshCw} height="h-[300px]" /> : overallTrendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={overallTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                                    <YAxis stroke="#64748b" fontSize={10} />
                                    <Tooltip wrapperClassName="rounded-md shadow-lg" contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '0.5rem', fontSize: '12px' }} />
                                    <Legend wrapperStyle={{fontSize: "10px"}}/>
                                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 6 }} name="Key Metric" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : <ChartPlaceholder message="No overall trend data available." height="h-[300px]" />}
                    </div>
                </main>
            </div>
        </div>
    );
}
