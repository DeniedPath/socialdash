import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose';
import User from '@/lib/models/User'

export async function GET() {
  try {
    await dbConnect()
    const count = await User.countDocuments()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting users:', error)
    return new NextResponse('Failed to fetch user count', { status: 500 })
  }
}
