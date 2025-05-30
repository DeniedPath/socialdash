import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const mockAnalyticsData = {
    youtube: {
        stats: {
            subscriberCount: 36,
            viewCount: 3200,
            videoCount: 13,
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
            { name: "External", value: 5, color: "#DAF7A6" }
        ]
    }
};

async function main() {
    // Clean up existing data
    await prisma.socialAccount.deleteMany();
    await prisma.post.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.report.deleteMany();
    await prisma.analytics.deleteMany();
    await prisma.platform.deleteMany();
    await prisma.user.deleteMany();

    // Create demo user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
        data: {
            email: 'demo@example.com',
            username: 'demouser',
            password: hashedPassword,
            role: 'user',
        },
    });

    // Create platforms
    const platforms = await Promise.all([
        prisma.platform.create({
            data: {
                name: 'YouTube',
                apiKey: 'mock_youtube_api_key',
                apiSecret: 'mock_youtube_api_secret',
            },
        }),
        prisma.platform.create({
            data: {
                name: 'Twitter',
                apiKey: 'mock_twitter_api_key',
                apiSecret: 'mock_twitter_api_secret',
            },
        }),
    ]);

    // Create analytics
    await prisma.analytics.create({
        data: {
            userId: user.id,
            subscriberCount: mockAnalyticsData.youtube.stats.subscriberCount,
            viewCount: mockAnalyticsData.youtube.stats.viewCount,
            videoCount: mockAnalyticsData.youtube.stats.videoCount,
            timeSeriesData: mockAnalyticsData.youtube.timeSeriesData,
            trafficSources: mockAnalyticsData.youtube.trafficSources,
            pageViews: 1000,
            engagement: 0.75,
            followers: 500,
        },
    });

    // Create some posts
    await Promise.all([
        prisma.post.create({
            data: {
                userId: user.id,
                platformId: platforms[0].id,
                content: 'Check out my latest video!',
                status: 'published',
                postedAt: new Date(),
                engagementStats: {
                    likes: 100,
                    shares: 25,
                    comments: 15,
                    impressions: 1000,
                },
            },
        }),
        prisma.post.create({
            data: {
                userId: user.id,
                platformId: platforms[1].id,
                content: 'Exciting announcement coming soon!',
                status: 'scheduled',
                scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        }),
    ]);

    // Create notifications
    await Promise.all([
        prisma.notification.create({
            data: {
                userId: user.id,
                type: 'engagement',
                message: 'Your post is performing well!',
                seen: false,
            },
        }),
        prisma.notification.create({
            data: {
                userId: user.id,
                type: 'schedule',
                message: 'Post scheduled for tomorrow',
                seen: true,
            },
        }),
    ]);

    // Create a report
    await prisma.report.create({
        data: {
            userId: user.id,
            title: 'Monthly Performance Report',
            reportType: 'analytics',
            generatedData: {
                totalViews: 5000,
                topPosts: [
                    { id: 1, engagement: 500 },
                    { id: 2, engagement: 300 },
                ],
            },
        },
    });

    // Create social accounts
    await Promise.all(platforms.map(platform => 
        prisma.socialAccount.create({
            data: {
                userId: user.id,
                platformId: platform.id,
                accountHandle: `demo_user_${platform.name.toLowerCase()}`,
                accessToken: `mock_access_token_${platform.name.toLowerCase()}`,
                refreshToken: `mock_refresh_token_${platform.name.toLowerCase()}`,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        })
    ));

    console.log('Seed data created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
