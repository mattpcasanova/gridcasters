import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="relative mx-auto w-24 h-24 mb-6">
              {/* Rotating gradient circle outline */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 to-green-500 bg-clip-border animate-spin">
                <div className="absolute inset-1 rounded-full bg-white"></div>
              </div>
              
              {/* GridCasters logo in center */}
              <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="GridCasters"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading GridCasters
            </h2>
            <p className="text-gray-500">
              Preparing your fantasy football experience...
            </p>
            
            {/* Loading dots */}
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 