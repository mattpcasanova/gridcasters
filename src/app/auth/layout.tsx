import Link from 'next/link'
import Image from 'next/image'
import { requireUnauth } from '@/lib/utils/server-auth'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireUnauth();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Features */}
      <div className="flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-8">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-16 w-40 h-40 bg-purple-500/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500/20 rounded-full blur-xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md text-center text-white">
          {/* Logo */}
          <div className="mb-12">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.svg"
                alt="RankBet"
                width={120}
                height={120}
                className="mx-auto drop-shadow-2xl"
              />
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-8">
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-2">Track Your Accuracy</h3>
              <p className="text-blue-100">Advanced analytics to measure your fantasy football prediction skills</p>
            </div>

            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-2">Compete Globally</h3>
              <p className="text-blue-100">Rise through the ranks on our global leaderboards</p>
            </div>

            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-2">Connect with Experts</h3>
              <p className="text-blue-100">Follow verified analysts and learn from the best</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 bg-white dark:bg-slate-900 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  )
} 