import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { PlatformAnalytics } from '@/lib/types/analytics';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get Twitter platform
        const twitterPlatform = await prisma.platform.findFirst({
            where: {
                name: {
                    in: ['twitter', 'Twitter', 'TWITTER']
                }
            }
        });

        if (!twitterPlatform) {
            return NextResponse.json({ message: "Twitter platform not configured" }, { status: 404 });
        }

        // Get analytics for the user's Twitter account
        const analytics = await prisma.analytics.findFirst({
            where: {
                userId: session.user.id,
                platformId: twitterPlatform.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Return analytics data or mock data
        const mockData: PlatformAnalytics = {
            stats: {
                subscriberCount: analytics?.subscriberCount ?? 8750,
                viewCount: analytics?.viewCount ?? 245000,
                videoCount: analytics?.videoCount ?? 180
            },
            timeSeriesData: analytics?.timeSeriesData as { name: string; subscribers: number; views: number; likes: number }[] || 
                Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    return {
                        name: date.toISOString().split('T')[0],
                        subscribers: 8750 - Math.floor(Math.random() * 50) * i,
                        views: 35000 - Math.floor(Math.random() * 2000) * i,
                        likes: 1200 - Math.floor(Math.random() * 100) * i
                    };
                }).reverse(),
            trafficSources: analytics?.trafficSources as { name: string; value: number; color: string }[] || [
                { name: "Timeline", value: 40, color: "#1DA1F2" },
                { name: "Profile", value: 25, color: "#14171A" },
                { name: "Search", value: 20, color: "#657786" },
                { name: "Lists", value: 15, color: "#AAB8C2" }
            ]
        };

        return NextResponse.json(mockData);
    } catch (error) {
        console.error('Error fetching Twitter analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Twitter analytics' },
            { status: 500 }
        );
    }
}
