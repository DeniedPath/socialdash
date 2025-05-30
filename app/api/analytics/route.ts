import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { AggregatedAnalytics } from '@/lib/types/analytics';
import type { Prisma } from '@prisma/client';

type AnalyticsDataPoint = {
    date: string;
    subscribers: number;
    views: number;
    likes: number;
};

type TrafficSourcePoint = {
    name: string;
    value: number;
    color: string;
};

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get analytics for the user across all platforms
        const userAnalytics = await prisma.analytics.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 7
        });

        // Initialize aggregated stats with the structure expected by the frontend
        const aggregatedStats: AggregatedAnalytics = {
            stats: {
                subscriberCount: 0,
                viewCount: 0,
                videoCount: 0
            },
            timeSeriesData: Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return {
                    name: date.toISOString().split('T')[0],
                    subscribers: 0,
                    views: 0,
                    likes: 0
                };
            }).reverse(),
            platformDistribution: []
        };

        if (userAnalytics.length > 0) {
            // Get the most recent analytics entry for the overall stats
            const latestAnalytics = userAnalytics[0];
            aggregatedStats.stats = {
                subscriberCount: latestAnalytics.subscriberCount || 0,
                viewCount: latestAnalytics.viewCount || 0,
                videoCount: latestAnalytics.videoCount || 0
            };

            // Map time series data from stored JSON with proper type checks
            try {
                const timeSeriesData = JSON.parse(JSON.stringify(latestAnalytics.timeSeriesData)) as AnalyticsDataPoint[];
                if (Array.isArray(timeSeriesData) && timeSeriesData.length > 0) {
                    aggregatedStats.timeSeriesData = timeSeriesData.map(data => ({
                        name: data.date || 'Unknown',
                        subscribers: data.subscribers || 0,
                        views: data.views || 0,
                        likes: data.likes || 0
                    }));
                }
            } catch (e) {
                console.warn('Error parsing timeSeriesData:', e);
            }

            // Map traffic sources from stored JSON with proper type checks
            try {
                const trafficSources = JSON.parse(JSON.stringify(latestAnalytics.trafficSources)) as TrafficSourcePoint[];
                if (Array.isArray(trafficSources) && trafficSources.length > 0) {
                    aggregatedStats.platformDistribution = trafficSources.map(source => ({
                        name: source.name || 'Unknown',
                        value: source.value || 0,
                        color: source.color || '#808080'
                    }));
                }
            } catch (e) {
                console.warn('Error parsing trafficSources:', e);
            }
        }

        return NextResponse.json(aggregatedStats);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { message: "Error fetching analytics" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { subscribers, views, videos, timeSeriesData, trafficSources } = body;

        // Validate and transform input data
        const formattedTimeSeriesData = Array.isArray(timeSeriesData) 
            ? timeSeriesData.map(item => ({
                date: String(item.date || ''),
                subscribers: Number(item.subscribers || 0),
                views: Number(item.views || 0),
                likes: Number(item.likes || 0)
            })) as Prisma.InputJsonValue[]
            : [];

        const formattedTrafficSources = Array.isArray(trafficSources)
            ? trafficSources.map(item => ({
                name: String(item.name || ''),
                value: Number(item.value || 0),
                color: String(item.color || '#808080')
            })) as Prisma.InputJsonValue[]
            : [];

        // Create or update analytics for the user        // Get or create a default platform
        const defaultPlatform = await prisma.platform.upsert({
            where: { name: 'Default' },
            update: {},
            create: {
                name: 'Default',
                apiKey: 'default_key',
                apiSecret: 'default_secret'
            }
        });

        const analytics = await prisma.analytics.create({
            data: {
                userId: session.user.id,
                platformId: defaultPlatform.id,
                subscriberCount: subscribers || 0,
                viewCount: views || 0,
                videoCount: videos || 0,
                timeSeriesData: formattedTimeSeriesData,
                trafficSources: formattedTrafficSources,
                engagement: 0.0
            }
        });

        return NextResponse.json(analytics);
    } catch (error) {
        console.error('Error updating analytics:', error);
        return NextResponse.json(
            { error: 'Failed to update analytics' },
            { status: 500 }
        );
    }
}