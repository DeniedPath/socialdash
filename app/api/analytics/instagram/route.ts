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

    try {        // Get Instagram platform and connected account from database
        const instagramPlatform = await prisma.platform.findUnique({
            where: { name: "instagram" }
        });
        
        if (!instagramPlatform) {
            return NextResponse.json({ message: "Instagram platform not configured" }, { status: 404 });
        }

        const instagramAccount = await prisma.socialAccount.findFirst({
            where: {
                userId: session.user.id,
                platformId: instagramPlatform.id
            }
        });

        if (!instagramAccount) {
            return NextResponse.json({ message: "Instagram account not connected" }, { status: 404 });
        }        // For now, return mock data
        // In production, use the access token to fetch real data from Instagram Graph API
        const mockData: PlatformAnalytics = {
            stats: {
                subscriberCount: 5420,
                viewCount: 128500,
                videoCount: 245
            },
            timeSeriesData: Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return {
                    name: date.toISOString().split('T')[0],
                    subscribers: 5420 - Math.floor(Math.random() * 100) * i,
                    views: 18500 - Math.floor(Math.random() * 1000) * i,
                    likes: 850 - Math.floor(Math.random() * 50) * i
                };
            }).reverse(),
            trafficSources: [
                { name: "Profile Visits", value: 45, color: "#E1306C" },
                { name: "Hashtags", value: 30, color: "#F56040" },
                { name: "Explore Page", value: 15, color: "#833AB4" },
                { name: "Stories", value: 10, color: "#FCAF45" }
            ]
        };

        return NextResponse.json(mockData);
    } catch (error) {
        console.error('Error fetching Instagram analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Instagram analytics' },
            { status: 500 }
        );
    }
}
