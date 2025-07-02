import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function GroupLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-9 w-32" />
        </div>

        {/* Group Header Skeleton */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-16 w-full" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center space-y-2">
                      <Skeleton className="w-15 h-15 rounded-full mx-auto" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                    <div className="text-center space-y-2">
                      <Skeleton className="h-8 w-12 mx-auto" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                    <div className="text-center space-y-2">
                      <Skeleton className="h-8 w-12 mx-auto" />
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members Section Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>
            <Skeleton className="h-10 w-64 mt-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="w-11 h-11 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
