import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <header className="fixed w-full bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.svg"
                  alt="RankBet"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  RankBet
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative pt-32 pb-16 sm:pt-48 sm:pb-24">
          <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Rank Smart.{' '}
              <span className="text-primary">Bet Better.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Join the community of fantasy football experts. Create rankings,
              track your accuracy, and compete with friends to prove your skills.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signup"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg text-lg font-semibold"
              >
                Start Ranking
              </Link>
              <Link
                href="/leaderboard"
                className="text-lg font-semibold leading-6 text-gray-900"
              >
                View Leaderboard <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 sm:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">
                Your Rankings, Your Record
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to dominate fantasy football
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="font-semibold leading-7 text-gray-900 text-lg">
                    Create Rankings
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p>Build and share your player rankings for any position. Weekly updates or season-long predictions.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="font-semibold leading-7 text-gray-900 text-lg">
                    Track Accuracy
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p>See how your predictions stack up against actual performance. Build your reputation over time.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="font-semibold leading-7 text-gray-900 text-lg">
                    Compete Socially
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p>Follow friends, create groups, and see who has the best ranking accuracy in your circle.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-sm leading-5 text-gray-600">
              &copy; {new Date().getFullYear()} RankBet. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
