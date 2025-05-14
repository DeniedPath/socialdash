// /app/reports/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation';

// Import icons from lucide-react
import {
    LayoutDashboard, BarChart3, FileText, Users, MessageSquare,
    Settings, HelpCircle, Bell, UserCircle, LogOut, Briefcase,
    ChevronDown, AlertCircle, RefreshCw, CalendarDays, Download, FileSpreadsheet, Brain // Added more icons
} from 'lucide-react';

// Define a type for Report items
type ReportItem = {
    id: string;
    name: string;
    type: string; // e.g., "Performance Summary", "Audience Growth", "Content Engagement"
    platform?: string; // e.g., "YouTube", "Twitter", "Overall"
    dateGenerated: string; // Formatted date string
    fileUrl?: string; // Placeholder for actual download link
    fileType?: 'PDF' | 'CSV' | 'XLSX'; // To indicate download type
};

// Sample data for reports - replace with fetched data
const sampleReportsData: ReportItem[] = [
    { id: 'rep001', name: 'Q1 Performance Overview', type: 'Performance Summary', platform: 'Overall', dateGenerated: '2024-04-01', fileUrl: '#', fileType: 'PDF' },
    { id: 'rep002', name: 'YouTube Channel Growth - March', type: 'Audience Growth', platform: 'YouTube', dateGenerated: '2024-03-31', fileUrl: '#', fileType: 'CSV' },
    { id: 'rep003', name: 'Twitter Engagement Analysis', type: 'Content Engagement', platform: 'Twitter / X', dateGenerated: '2024-03-28', fileUrl: '#', fileType: 'PDF' },
    { id: 'rep004', name: 'Instagram Weekly Digest', type: 'Performance Summary', platform: 'Instagram', dateGenerated: '2024-03-25', fileUrl: '#', fileType: 'XLSX' },
    { id: 'rep005', name: 'AI-Powered Trend Forecast', type: 'Trend Analysis', platform: 'Overall', dateGenerated: '2024-03-20', fileUrl: '#', fileType: 'PDF' },
];


export default function ReportsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const [dateRange, setDateRange] = useState<string>('last_30_days'); // Placeholder
    const [reports, setReports] = useState<ReportItem[]>([]);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
    const [dataError, setDataError] = useState<string | null>(null);

    // Effect for authentication
    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push(`/login?callbackUrl=${pathname}`);
        }
    }, [session, status, router, pathname]);

    // Memoized fetchReportsData function
    const fetchReportsData = useCallback(async () => {
        if (!session) return;

        setIsDataLoading(true);
        setDataError(null);
        console.log(`Fetching reports for date range: ${dateRange}`);

        try {
            // **ACTUAL API CALL TO YOUR BACKEND TO FETCH REPORTS LIST**
            // Endpoint like: /api/reports?range=${dateRange}
            // This API would fetch the list of generated reports metadata from your database.
            // const response = await fetch(`/api/reports?range=${dateRange}`);
            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.message || `Failed to fetch reports`);
            // }
            // const data = await response.json();
            // setReports(data.reports);

            // Simulate API delay and set sample data
            await new Promise(resolve => setTimeout(resolve, 1000));
            setReports(sampleReportsData);

        } catch (error: any) {
            console.error(`Error fetching reports data:`, error);
            setDataError(error.message || "Could not load reports.");
            setReports([]);
        } finally {
            setIsDataLoading(false);
        }
    }, [dateRange, session]);

    useEffect(() => {
        if (session) {
            fetchReportsData();
        }
    }, [fetchReportsData, session]);

    const handleDownloadReport = (report: ReportItem) => {
        // In a real application, this would either:
        // 1. Navigate to report.fileUrl if it's a direct link to a stored file.
        // 2. Call an API endpoint that generates and streams the file, or returns a secure temporary link.
        //    e.g., fetch(`/api/reports/download/${report.id}`).then(res => res.blob()).then(blob => { ... createObjectURL ... });
        if (report.fileUrl && report.fileUrl !== '#') {
            window.open(report.fileUrl, '_blank');
        } else {
            alert(`Download for "${report.name}" (${report.fileType}) - (COMING SOON)`);
        }
    };


    if (status === 'loading' || (status === 'authenticated' && !session)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="p-10 bg-white rounded-xl shadow-2xl text-center">
                    <FileText className="h-16 w-16 text-blue-500 mx-auto mb-6 animate-pulse" />
                    <p className="text-2xl font-semibold text-slate-700">Loading Reports...</p>
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
                {/* Header (Similar to Dashboard/Analytics) */}
                <header className="h-20 bg-white shadow-md border-b border-slate-200 flex items-center justify-between px-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">Reports</h1>
                        <p className="text-sm text-slate-500 flex items-center">
                            <Brain className="h-4 w-4 mr-1.5 text-purple-500" />
                            Generated Reports (AI Powered Insights)
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
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
                    {dataError && (
                        <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg flex items-center">
                            <AlertCircle className="h-5 w-5 mr-3" /> {dataError}
                            <button onClick={fetchReportsData} className="ml-auto text-sm font-medium hover:underline">Retry</button>
                        </div>
                    )}

                    {/* Reports Table/List */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-700">Available Reports</h3>
                        </div>
                        {isDataLoading ? (
                            <div className="p-6 space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-12 bg-slate-200 rounded animate-pulse"></div>
                                ))}
                            </div>
                        ) : reports.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Report Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type / Platform</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date Generated</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Format</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Download</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                    {reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-900">{report.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-600">{report.type}</div>
                                                {report.platform && <div className="text-xs text-slate-400">{report.platform}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{report.dateGenerated}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        report.fileType === 'PDF' ? 'bg-red-100 text-red-800' :
                                                            report.fileType === 'CSV' ? 'bg-green-100 text-green-800' :
                                                                report.fileType === 'XLSX' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                                                    }`}>
                                                        {report.fileType || 'File'}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDownloadReport(report)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                >
                                                    <Download className="h-4 w-4 mr-1.5" />
                                                    Download
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6 text-center text-slate-500">
                                <FileSpreadsheet className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                                <p>No reports found for the selected criteria.</p>
                                <p className="text-xs mt-1">Try adjusting the date range or generating new reports.</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 text-center">
                        <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg flex items-center mx-auto">
                            <Brain className="h-5 w-5 mr-2" />
                            Generate New AI-Powered Report (Coming Soon)
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
