'use client'

import Link from 'next/link'


export default function LandingPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col justify-center items-center text-center px-6 py-20">
            <div className="max-w-3xl">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                    Manage & Monitor Your Social Media Like a Pro
                </h1>
                <p className="text-xl text-gray-600 mb-10">
                    One dashboard to track your followers, engagement, content performance, and audience insights — across all your social platforms.
                </p>

                <div className="flex justify-center gap-4 mb-14">
                    <Link href="/auth/login">
            <span className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-md transition">
              Get Started Free
            </span>
                    </Link>
                    <Link href="/about">
            <span className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-8 rounded-full text-lg shadow-md transition">
              Learn More
            </span>
                    </Link>
                </div>

                <section className="grid sm:grid-cols-2 gap-8 text-left">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-2xl font-semibold text-blue-700 mb-2">🔍 Analytics Dashboard</h3>
                        <p className="text-gray-600">Track performance metrics for each connected account—followers, views, likes, shares, and post engagement, all in real time.</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-2xl font-semibold text-blue-700 mb-2">📅 Content Manager</h3>
                        <p className="text-gray-600">View and manage your scheduled content, post history, and cross-platform performance from a single place.</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-2xl font-semibold text-blue-700 mb-2">👥 Audience Insights</h3>
                        <p className="text-gray-600">Understand who your followers are, where they’re from, and how they interact with your posts. Tailor your content to grow smarter.</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-2xl font-semibold text-blue-700 mb-2">🔐 Secure Login</h3>
                        <p className="text-gray-600">Login with your social accounts securely using OAuth. We never store your credentials—only the data you choose to share.</p>
                    </div>
                </section>
            </div>
        </main>
    )
}
