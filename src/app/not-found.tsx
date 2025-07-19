import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft, Search, Users, Trophy } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Page Not Found
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Sorry, we couldn't find the page you're looking for.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-500 mb-6">
                The page might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              
              <Link href="/rankings" className="w-full">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Rankings
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button 
                variant="ghost" 
                className="w-full text-gray-500 hover:text-gray-700"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Error 404 • GridCasters
          </p>
        </div>
      </div>
    </div>
  )
} 