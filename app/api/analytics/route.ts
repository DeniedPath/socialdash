// /app/api/analytics/route.ts (or your chosen new static path)

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Adjust path to your NextAuth options
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs/promises'; // Using promises version of fs for async/await

// Define the expected structure of your mock data file
// This should align with what your frontend dashboard page expects
interface PlatformAnalyticsData {
    stats?: { // Corresponds to what setStatsData expects
        subscriberCount?: string;
        viewCount?: string;
        videoCount?: string;
        likeCount?: string; // Example for other platforms
        followerCount?: string; // Example for other platforms
        subscriberChange?: string;
        subscriberChangeType?: 'positive' | 'negative';
    };
    timeSeriesData?: Array<{ name: string; [key: string]: number | string }>; // For LineChart
    trafficSources?: Array<{ name: string; value: number; color: string }>; // For PieChart
    recentActivity?: Array<{ id: string | number; type: string; content: string; time: string; iconName: string }>; // Store icon name, resolve to component on client
    topContent?: Array<{ id: string | number; title: string; views: string; engagementRate: string }>;
}

interface MockAnalyticsFile {
    youtube?: PlatformAnalyticsData;
    twitter?: PlatformAnalyticsData;
    instagram?: PlatformAnalyticsData;
    // Add other platforms as needed
}

async function getMockData(): Promise<MockAnalyticsFile> {
    const dataFilePath = path.join(process.cwd(), 'lib', 'mockAnalyticsData.json');

    try {
        const jsonData = await fs.readFile(dataFilePath, 'utf-8');
        return JSON.parse(jsonData) as MockAnalyticsFile;
    } catch (error) {
        console.error("Error reading or parsing mockAnalyticsData.json:", error);
        return {
            youtube: { stats: {}, timeSeriesData: [], trafficSources: [], recentActivity: [], topContent: [] },
            twitter: { stats: {}, timeSeriesData: [], trafficSources: [], recentActivity: [], topContent: [] },
            instagram: { stats: {}, timeSeriesData: [], trafficSources: [], recentActivity: [], topContent: [] },
        };
    }
}

export async function GET(request: NextRequest) { // Removed { params }
    // 1. Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Get the platform from the query parameters
    const platform = request.nextUrl.searchParams.get('platform');

    if (!platform) {
        return NextResponse.json({ message: "Platform query parameter is missing" }, { status: 400 });
    }

    console.log(`API: Received request for platform: ${platform}`);

    try {
        // 3. Load your mock data
        const mockData = await getMockData();

        let platformData: PlatformAnalyticsData | undefined;

        // 4. Select data based on the platform
        switch (platform.toLowerCase()) {
            case 'youtube':
                platformData = mockData.youtube;
                break;
            case 'twitter':
                platformData = mockData.twitter;
                break;
            case 'instagram':
                platformData = mockData.instagram;
                break;
            // Add cases for other platforms you support
            default:
                return NextResponse.json({ message: `Analytics data for platform '${platform}' not found.` }, { status: 404 });
        }

        if (!platformData) {
            return NextResponse.json({ message: `No data configured for platform '${platform}'.` }, { status: 404 });
        }

        // 5. Format the data
        const responseData = {
            [`${platform.toLowerCase()}Stats`]: platformData.stats || {},
            [`${platform.toLowerCase()}TimeSeriesData`]: platformData.timeSeriesData || [],
            [`${platform.toLowerCase()}TrafficSources`]: platformData.trafficSources || [],
            [`${platform.toLowerCase()}RecentActivity`]: platformData.recentActivity || [],
            [`${platform.toLowerCase()}TopVideos`]: platformData.topContent || [],
            [`${platform.toLowerCase()}TopContent`]: platformData.topContent || [],
        };

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ message: "Internal Server Error", error: errorMessage }, { status: 500 });
    }
    // The last 'return new Response('OK');' was unreachable and likely a leftover, so I've removed it.
    // If you need a default return outside the try-catch for some reason, ensure it's placed correctly.
}