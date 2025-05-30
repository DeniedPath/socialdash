export interface TimeSeriesDataPoint {
    name: string;
    subscribers: number;
    views: number;
    likes: number;
}

export interface TrafficSource {
    name: string;
    value: number;
    color: string;
}

export interface PlatformStats {
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
}

export interface PlatformAnalytics {
    stats: PlatformStats;
    timeSeriesData: TimeSeriesDataPoint[];
    trafficSources: TrafficSource[];
}

export interface AggregatedAnalytics {
    stats: PlatformStats;
    timeSeriesData: TimeSeriesDataPoint[];
    platformDistribution: TrafficSource[];
}
