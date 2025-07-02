import Link from 'next/link'
import Image from 'next/image'
import { requireGuest } from '@/lib/utils/server-auth'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireGuest();

  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth form */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[600px] xl:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="RankBet"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold">RankBet</span>
            </Link>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Background image */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-br from-primary/90 to-primary/70">
            <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
              <h1 className="text-4xl font-bold">Rank Smart. Bet Better.</h1>
              <p className="mt-4 text-lg">
                Join the community of fantasy football experts and prove your ranking skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 