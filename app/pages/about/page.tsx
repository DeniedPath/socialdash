import Link from 'next/link';
import { ArrowLeft, Info, CheckCircle, Shield, Settings2 } from 'lucide-react'; // Added more icons

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            <div className="max-w-3xl mx-auto"> {/* Adjusted max-width for content readability */}
                {/* Back to Dashboard Link */}
                <div className="mb-6 sm:mb-8">
                    <Link
                        href="/" // Assuming your dashboard is at /dashboard
                        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1.5 text-slate-500 group-hover:text-blue-500 transition-colors" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* About Page Card */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-6 sm:p-8 md:p-10">
                        {/* Page Header */}
                        <div className="flex items-center mb-8">
                            <Info className="h-10 w-10 text-blue-500 mr-4" />
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                                    About EchoPulse
                                </h1>
                                <p className="text-base text-slate-500 mt-1">
                                    Your All-In-One Social Media Analytics Platform.
                                </p>
                            </div>
                        </div>

                        {/* Introduction Section */}
                        <section className="mb-8">
                            <p className="text-lg text-slate-700 leading-relaxed">
                                EchoPulse empowers creators, marketers, and social media managers to gain
                                comprehensive insights and stay ahead of their performance game. We provide
                                a unified dashboard to track critical metrics across major platforms like
                                Twitter/X, Instagram, TikTok, YouTube, and more.
                            </p>
                            <p className="text-lg text-slate-700 leading-relaxed mt-4">
                                With secure social media account integration via OAuth and real-time data
                                visualization, you’ll unlock actionable intelligence about your followers,
                                content engagement, and overall reach—all streamlined into one intuitive experience.
                            </p>
                        </section>

                        {/* What You Get Section */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-700 mb-5 flex items-center">
                                <CheckCircle className="h-6 w-6 mr-3 text-green-500" />
                                Key Features & Benefits
                            </h2>
                            <ul className="space-y-3 text-slate-600">
                                {[
                                    "Track post engagement metrics (likes, views, comments, shares) in real-time.",
                                    "Analyze follower growth, demographics, and audience behavior trends.",
                                    "Monitor content performance across multiple platforms from a single view.",
                                    "Securely connect your accounts using industry-standard OAuth protocols.",
                                    "Visualize data with interactive charts and generate insightful reports.",
                                    "Content management hub to review post history and plan future content (future feature).",
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="h-5 w-5 mr-2 mt-1 text-green-500 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* How It Works Section */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-slate-700 mb-5 flex items-center">
                                <Settings2 className="h-6 w-6 mr-3 text-purple-500" />
                                How EchoPulse Works
                            </h2>
                            <p className="text-lg text-slate-700 leading-relaxed">
                                Upon signing in and connecting your social media accounts, EchoPulse utilizes
                                industry-standard OAuth authentication. This grants us secure, read-only access
                                to your public data and analytics provided by the platforms.
                            </p>
                            <p className="text-lg text-slate-700 leading-relaxed mt-4">
                                This data is then processed and visualized through secure APIs. EchoPulse does not
                                store your raw metrics history unless you explicitly choose to save specific reports
                                or utilize content scheduling features. Your account credentials are never stored by us.
                            </p>
                        </section>

                        {/* Privacy Commitment Section */}
                        <section>
                            <h2 className="text-2xl font-semibold text-slate-700 mb-5 flex items-center">
                                <Shield className="h-6 w-6 mr-3 text-orange-500" />
                                Our Commitment to Your Privacy
                            </h2>
                            <p className="text-lg text-slate-700 leading-relaxed">
                                Your privacy and data security are paramount at EchoPulse. We are committed to
                                transparent data handling practices.
                            </p>
                            <ul className="space-y-3 text-slate-600 mt-4">
                                {[
                                    "We only request the minimum necessary permissions to provide our analytics services.",
                                    "Your social media credentials are never stored on our servers.",
                                    "Personal data and analytics are not shared with any third parties.",
                                    "You have full control over connected accounts and can disconnect them at any time.",
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <Shield className="h-5 w-5 mr-2 mt-1 text-orange-500 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <footer className="text-center mt-10 pb-6 text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} EchoPulse. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}