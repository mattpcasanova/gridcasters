'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, AlertTriangle, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-900/20 dark:via-slate-900 dark:to-orange-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6">
                  <AlertTriangle className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Critical Error
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-slate-400">
                  A serious error occurred in the application.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-500 mb-6">
                    We're experiencing technical difficulties. Please try refreshing the page.
                  </p>
                  
                  {error.digest && (
                    <div className="bg-gray-100 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 font-mono">
                        Error ID: {error.digest}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={reset}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Page
                  </Button>
                  
                  <Link href="/" className="w-full">
                    <Button variant="outline" className="w-full">
                      <Home className="w-4 h-4 mr-2" />
                      Go Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                Critical Error • GridCasters
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Please contact support if this problem persists
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 