"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RefreshCcw, Home, Search } from 'lucide-react';
import Header from './components/header';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* 404 Header */}
          <h1 className="text-8xl font-bold text-blue-600">404</h1>
          
          {/* Social Media Post Frame */}
          <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-gray-200 rounded-full h-10 w-10"></div>
              <div className="ml-3">
                <div className="font-semibold">Page Not Found</div>
                <div className="text-xs text-gray-500">@missing_content • Just now</div>
              </div>
            </div>
            
            <p className="text-gray-800 text-lg mb-4">
              Looks like this content was deleted for violating our community guidelines... 
              Just kidding! This page doesn't exist.
            </p>
            
            <p className="text-gray-600 mb-4">
              You tried to access a page that's been ghosted harder than your last Tinder match.
            </p>
            
            {/* Fake social engagement metrics */}
            <div className="flex text-gray-500 text-sm justify-between border-t pt-3">
              <span>0 likes</span>
              <span>0 comments</span>
              <span>0 shares</span>
            </div>
          </div>
          
          {/* Navigation Options */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button 
              onClick={() => router.back()} 
              className="flex items-center px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition"
            >
              <RefreshCcw size={18} className="mr-2" />
              Go Back
            </button>
            
            <Link 
              href="/"
              className="flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition"
            >
              <Home size={18} className="mr-2" />
              Home Page
            </Link>
            
            <Link 
              href="/"
              className="flex items-center px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition"
            >
              <Search size={18} className="mr-2" />
              Search Site
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer with social media hashtags */}
      <div className="p-4 text-center text-gray-500 text-sm">
        <p>#PageNotFound #404Error #NoFilter #SocialDash</p>
      </div>
    </div>
  );
}
