import { prisma } from './prisma';

export const mockAnalyticsData = {
    youtube: {
        stats: {
            subscriberCount: 36,
            viewCount: 3200,
            videoCount: 13,
            subscriberChange: "0 last 30 days",
            subscriberChangeType: "neutral"
        },
        timeSeriesData: [
            { name: "Jan '24", views: 15000, likes: 750, subscribers: 200 },
            { name: "Feb '24", views: 18000, likes: 820, subscribers: 250 },
            { name: "Mar '24", views: 16500, likes: 790, subscribers: 220 },
            { name: "Apr '24", views: 21000, likes: 950, subscribers: 310 },
            { name: "May '24", views: 19500, likes: 900, subscribers: 280 }
        ],
        trafficSources: [
            { name: "YouTube Search", value: 55, color: "#FF0000" },
            { name: "Suggested Videos", value: 25, color: "#FF5733" },
            { name: "Browse Features", value: 10, color: "#FFC300" },
            { name: "External", value: 5, color: "#DAF7A6" },
            { name: "Playlists", value: 5, color: "#900C3F" }
        ],
        recentActivity: [
            { id: "yt1", type: "New Subscriber", content: "ChannelLover123 subscribed.", time: "1h ago", iconName: "Users" },
            { id: "yt2", type: "Video Liked", content: "'My Latest Vlog' got a new like.", time: "3h ago", iconName: "Target" }
        ],
        topContent: [
            { id: "vid1", title: "My Most Epic Vlog Ever!", views: "55.2K", engagementRate: "22%" },
            { id: "vid2", title: "Tutorial: Advanced Editing", views: "30.1K", engagementRate: "18%" }
        ]
    },
    twitter: {
        stats: {
            followerCount: 10500,
            likeCount: 5200,
            subscriberChange: "+50 last 7 days",
            subscriberChangeType: "positive"
        },
        timeSeriesData: [
            { name: "Mon", impressions: 2000, engagements: 150 },
            { name: "Tue", impressions: 2200, engagements: 180 },
            { name: "Wed", impressions: 1900, engagements: 140 }
        ],
        recentActivity: [
            { id: "tw1", type: "New Follower", content: "TechGuru followed you.", time: "30m ago", iconName: "Users" }
        ],
        topContent: [
            { id: "tweet1", title: "Quick update on #NextJS features...", views: "10K", engagementRate: "5%" }
        ]
    }
};

export async function createMockDataForUser(userId: string) {
    try {
        // Get or create platforms
        const youtube = await prisma.platform.upsert({
            where: { name: 'YouTube' },
            create: {
                name: 'YouTube',
                apiKey: 'mock_youtube_api_key',
                apiSecret: 'mock_youtube_api_secret',
            },
            update: {}
        });

        const twitter = await prisma.platform.upsert({
            where: { name: 'Twitter' },
            create: {
                name: 'Twitter',
                apiKey: 'mock_twitter_api_key',
                apiSecret: 'mock_twitter_api_secret',
            },
            update: {}
        });

        // Create analytics for each platform
        await Promise.all([
            prisma.analytics.create({
                data: {
                    userId,
                    platformId: youtube.id,
                    subscriberCount: mockAnalyticsData.youtube.stats.subscriberCount,
                    viewCount: mockAnalyticsData.youtube.stats.viewCount,
                    videoCount: mockAnalyticsData.youtube.stats.videoCount,
                    subscriberChange: mockAnalyticsData.youtube.stats.subscriberChange,
                    subscriberChangeType: mockAnalyticsData.youtube.stats.subscriberChangeType,
                    timeSeriesData: mockAnalyticsData.youtube.timeSeriesData,
                    trafficSources: mockAnalyticsData.youtube.trafficSources,
                    recentActivity: mockAnalyticsData.youtube.recentActivity,
                    topContent: mockAnalyticsData.youtube.topContent,
                    engagement: 0.75
                }
            }),
            prisma.analytics.create({
                data: {
                    userId,
                    platformId: twitter.id,
                    subscriberCount: mockAnalyticsData.twitter.stats.followerCount,
                    likeCount: mockAnalyticsData.twitter.stats.likeCount,
                    subscriberChange: mockAnalyticsData.twitter.stats.subscriberChange,
                    subscriberChangeType: mockAnalyticsData.twitter.stats.subscriberChangeType,
                    timeSeriesData: mockAnalyticsData.twitter.timeSeriesData,
                    recentActivity: mockAnalyticsData.twitter.recentActivity,
                    topContent: mockAnalyticsData.twitter.topContent,
                    engagement: 0.65,
                    viewCount: 0,
                    videoCount: 0
                }
            })
        ]);

        // Create social accounts
        await Promise.all([youtube, twitter].map(platform => 
            prisma.socialAccount.create({
                data: {
                    userId,
                    platformId: platform.id,
                    accountHandle: `user_${platform.name.toLowerCase()}`,
                    accessToken: `mock_access_token_${platform.name.toLowerCase()}`,
                    refreshToken: `mock_refresh_token_${platform.name.toLowerCase()}`,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            })
        ));
    } catch (error) {
        console.error('Error creating mock data:', error);
    }
}
