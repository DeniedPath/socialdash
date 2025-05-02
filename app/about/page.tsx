export default function page() {
    return (
        <main className="min-h-screen bg-white px-6 py-20 text-gray-800">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold mb-8">About This Dashboard</h1>
                <p className="text-lg mb-6">
                    Our platform helps creators, marketers, and social media managers stay on top of their performance across platforms like Twitter, Instagram, and TikTok.
                    With secure logins and real-time data visualization, you’ll gain actionable insights into your followers, content, and reach—all from one place.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4">What You Get</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Track post engagement metrics (likes, views, comments, shares)</li>
                    <li>Analyze follower growth and audience trends</li>
                    <li>Manage and schedule content across platforms</li>
                    <li>See platform-specific insights with one unified dashboard</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-10 mb-4">How It Works</h2>
                <p className="text-lg mb-6">
                    After signing in with your social media account, we use industry-standard OAuth authentication to request read-only access to your public data.
                    That data is visualized using secure APIs, and nothing is stored unless you choose to save your metrics history or schedule posts.
                </p>

                <p className="text-lg mt-6">
                    Your privacy is important to us. No data is shared with third parties, and your credentials are never stored.
                </p>
            </div>
        </main>
    )
}
