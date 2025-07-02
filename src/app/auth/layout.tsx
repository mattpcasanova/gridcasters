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
      {/* Left side - Auth form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <Image
                width={48}
                height={48}
                className="h-12 w-auto"
                src="/logo.svg"
                alt="RankBet"
              />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                RankBet
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Background image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/auth-hero.jpg"
          alt="Fantasy football players"
          width={1920}
          height={1080}
          priority
        />
      </div>
    </div>
  )
} 