// /app/api/analytics/[platform]/route.ts

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path to your NextAuth options
import { NextResponse } from 'next/server';
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

// Helper function to get an icon component by name (illustrative)
// In a real scenario, you might not pass icon components directly in API responses.
// Instead, pass an icon identifier (string) and map it to the component on the client-side.
// For simplicity in the mock, we are not doing that here, but the client-side already handles it.

async function getMockData(): Promise<MockAnalyticsFile> {
    // Construct the path to your data file in the `lib` folder
    // Note: process.cwd() gives the root of your Next.js project
    const dataFilePath = path.join(process.cwd(), 'lib', 'mockAnalyticsData.json');

    try {
        const jsonData = await fs.readFile(dataFilePath, 'utf-8');
        return JSON.parse(jsonData) as MockAnalyticsFile;
    } catch (error) {
        console.error("Error reading or parsing mockAnalyticsData.json:", error);
        // Return an empty structure or throw error if the file is critical
        return {
            youtube: { stats: {}, timeSeriesData: [], trafficSources: [], recentActivity: [], topContent: [] },
            twitter: { stats: {}, timeSeriesData: [], trafficSources: [], recentActivity: [], topContent: [] },
        };
    }
}


export async function GET(
    request: Request,
    { params }: { params: { platform: string } }
) {
    // 1. Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Get the platform from the dynamic route parameter
    const platform = params.platform;

    if (!platform) {
        return NextResponse.json({ message: "Platform parameter is missing" }, { status: 400 });
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

        // 5. Format the data to match what the frontend dashboard page expects
        // The frontend DashboardPage's fetchPlatformData function expects a structure like:
        // { youtubeStats: { ... }, youtubeTimeSeriesData: [ ... ], ... }
        // So, we'll wrap the platformData accordingly.

        const responseData = {
            [`${platform.toLowerCase()}Stats`]: platformData.stats || {},
            [`${platform.toLowerCase()}TimeSeriesData`]: platformData.timeSeriesData || [],
            [`${platform.toLowerCase()}TrafficSources`]: platformData.trafficSources || [],
            [`${platform.toLowerCase()}RecentActivity`]: platformData.recentActivity || [],
            [`${platform.toLowerCase()}TopVideos`]: platformData.topContent || [], // Assuming 'TopVideos' for youtube
            [`${platform.toLowerCase()}TopContent`]: platformData.topContent || [], // Generic for others
        };

        // Simulate a network delay (optional, for testing loading states)
        // await new Promise(resolve => setTimeout(resolve, 1000));

        return NextResponse.json(responseData, { status: 200 });

    } catch (error: any) {
        console.error(`API Error fetching data for ${platform}:`, error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
