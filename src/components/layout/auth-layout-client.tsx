"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loading } from '@/components/ui/loading';

// Dynamically import components with SSR disabled to prevent hydration issues
const FeatureHighlights = dynamic(() => Promise.resolve(function FeatureHighlightsComponent() {
  return (
    <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-600 via-blue-800 to-slate-900 p-8">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      <div className="relative z-10 max-w-md text-center text-white mx-auto">
        {/* Logo in centered box */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 rounded-2xl p-6 border border-blue-600/50 backdrop-blur-sm shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 mx-auto max-w-xs">
            <Link href="/" className="inline-block group transition-transform hover:scale-105">
              <Image
                src="/logo.png"
                alt="GridCasters"
                width={48}
                height={48}
                className="w-12 h-12 mx-auto"
              />
              <span className="text-2xl font-bold mt-2 block">
                <span className="text-blue-400">Grid</span>
                <span className="text-green-400">Casters</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 rounded-2xl p-6 border border-blue-600/50 backdrop-blur-sm shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Start Ranking Today</h3>
            <p className="text-gray-300">Create your first fantasy football rankings and see how you stack up</p>
          </div>

          <div className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 rounded-2xl p-6 border border-blue-600/50 backdrop-blur-sm shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Join the Community</h3>
            <p className="text-gray-300">Connect with thousands of fantasy football enthusiasts</p>
          </div>

          <div className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 rounded-2xl p-6 border border-blue-600/50 backdrop-blur-sm shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Prove Your Skills</h3>
            <p className="text-gray-300">Climb the leaderboards and become a verified expert</p>
          </div>
        </div>
      </div>
    </div>
  );
}), { 
  ssr: false,
  loading: () => <div className="hidden lg:block flex-1 bg-gradient-to-br from-blue-600 via-blue-800 to-slate-900" />
});

const MobileLogo = dynamic(() => Promise.resolve(function MobileLogoComponent() {
  return (
    <div className="lg:hidden text-center mb-8">
      <div className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 rounded-2xl p-6 border border-blue-600/50 backdrop-blur-sm shadow-xl mx-auto max-w-xs">
        <Link href="/" className="inline-block">
          <Image
            src="/logo.png"
            alt="GridCasters"
            width={80}
            height={80}
            className="mx-auto"
            priority
          />
          <span className="text-2xl font-bold mt-2 block">
            <span className="text-blue-400">Grid</span>
            <span className="text-green-400">Casters</span>
          </span>
        </Link>
      </div>
    </div>
  );
}), { 
  ssr: false,
  loading: () => <div className="lg:hidden h-24 mb-8" />
});

export function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <FeatureHighlights />
      <div className="flex-1 bg-white dark:bg-slate-900 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <MobileLogo />
          <Suspense fallback={<Loading className="w-full h-32" />}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  )
} 