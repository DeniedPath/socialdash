import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import type { PlatformAnalytics } from '@/lib/types/analytics';
import { mockAnalyticsData } from '@/lib/mockData';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Return mock data by default for now
        const response: PlatformAnalytics = {
            stats: {
                subscriberCount: mockAnalyticsData.youtube.stats.subscriberCount,
                viewCount: mockAnalyticsData.youtube.stats.viewCount,
                videoCount: mockAnalyticsData.youtube.stats.videoCount
            },
            timeSeriesData: mockAnalyticsData.youtube.timeSeriesData,
            trafficSources: mockAnalyticsData.youtube.trafficSources
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching YouTube analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch YouTube analytics' },
            { status: 500 }
        );
    }
}
