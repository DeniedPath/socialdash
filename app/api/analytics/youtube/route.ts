import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';
import type { PlatformAnalytics } from '@/lib/types/analytics';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get YouTube platform first
        const youtubePlatform = await prisma.platform.findUnique({
            where: {
                name: "youtube"
            }
        });

        if (!youtubePlatform) {
            return NextResponse.json({ error: 'YouTube platform not configured' }, { status: 404 });
        }

        // Get YouTube account for the user
        const youtubeAccount = await prisma.socialAccount.findFirst({
            where: {
                userId: session.user.id,
                platformId: youtubePlatform.id
            }
        });

        if (!youtubeAccount) {
            return NextResponse.json({ error: 'YouTube account not connected' }, { status: 404 });
        }

        // Get analytics for the user
        const analytics = await prisma.analytics.findFirst({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // If we have real analytics data, use it
        if (analytics?.timeSeriesData?.length && analytics?.trafficSources?.length) {
            const response: PlatformAnalytics = {
                stats: {
                    subscriberCount: analytics.subscriberCount || 0,
                    viewCount: analytics.viewCount || 0,
                    videoCount: analytics.videoCount || 0
                },
                timeSeriesData: analytics.timeSeriesData as { name: string; subscribers: number; views: number; likes: number }[],
                trafficSources: analytics.trafficSources as { name: string; value: number; color: string }[]
            };
            return NextResponse.json(response);
        }

        // Return demo data if no real data is available
        const demoData: PlatformAnalytics = {
            stats: {
                subscriberCount: 25600,
                viewCount: 158900,
                videoCount: 45
            },
            timeSeriesData: generateTimeSeriesData(),
            trafficSources: generateTrafficSourcesData()
        };
        
        return NextResponse.json(demoData);
    } catch (error) {
        console.error('Error fetching YouTube analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch YouTube analytics' },
            { status: 500 }
        );
    }
}

function generateTimeSeriesData() {
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        // Start with base values and decrease them going back in time
        const baseSubscribers = 25600;
        const baseViews = 158900;
        const baseLikes = 7900;
        
        return {
            name: date.toISOString().split('T')[0],
            subscribers: baseSubscribers - Math.floor(Math.random() * 100) * (6 - i),
            views: baseViews - Math.floor(Math.random() * 1000) * (6 - i),
            likes: baseLikes - Math.floor(Math.random() * 50) * (6 - i)
        };
    });
}

function generateTrafficSourcesData() {
    return [
        { name: 'Search', value: 45, color: '#FF0000' },
        { name: 'Suggested Videos', value: 30, color: '#00FF00' },
        { name: 'External', value: 15, color: '#4A90E2' },
        { name: 'Direct', value: 10, color: '#F5A623' }
    ];
}
