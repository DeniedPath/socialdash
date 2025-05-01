'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function BasicDashboard() {
    const [stats, setStats] = useState({
        posts: 0,
        users: 0,
        reports: 0,
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const [usersRes, postsRes, reportsRes] = await Promise.all([
                    axios.get('/api/stats/users'),
                    axios.get('/api/stats/posts'),
                    axios.get('/api/stats/reports')
                ])
                setStats({
                    users: usersRes.data.count,
                    posts: postsRes.data.count,
                    reports: reportsRes.data.count
                })
            } catch (error) {
                console.error('Failed to fetch stats:', error)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card title="Total Users" value={stats.users} color="bg-blue-500" />
            <Card title="Total Posts" value={stats.posts} color="bg-green-500" />
            <Card title="Total Reports" value={stats.reports} color="bg-red-500" />
        </div>
    )
}

function Card({ title, value, color }: { title: string, value: number, color: string }) {
    return (
        <div className={`rounded-2xl shadow-md p-6 text-white ${color}`}>
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-4xl font-bold">{value}</p>
        </div>
    )
}
