import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database, Cookie, Mail } from "lucide-react"

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-slate-600 dark:text-slate-400">Last updated: January 1, 2024</p>
          </div>

          <div className="space-y-6">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <CardTitle>Our Commitment to Privacy</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  At RankBet, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                  disclose, and safeguard your information when you use our fantasy football ranking platform.
                </p>
                <p>
                  We are committed to protecting your personal information and being transparent about our data
                  practices. This policy applies to all users of RankBet services.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <CardTitle>Information We Collect</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Personal Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Name, email address, and username when you create an account</li>
                    <li>Profile information you choose to provide (bio, avatar, etc.)</li>
                    <li>Communication preferences and settings</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Usage Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Your fantasy football rankings and predictions</li>
                    <li>Accuracy scores and performance metrics</li>
                    <li>Interactions with other users (follows, comments, etc.)</li>
                    <li>Platform usage patterns and preferences</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Technical Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>IP address, browser type, and device information</li>
                    <li>Log data including access times and pages viewed</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <CardTitle>How We Use Your Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Provide and maintain our ranking platform services</li>
                  <li>• Calculate accuracy scores and generate leaderboards</li>
                  <li>• Enable social features like following and community interaction</li>
                  <li>• Send you notifications and updates based on your preferences</li>
                  <li>• Improve our services through analytics and user feedback</li>
                  <li>• Ensure platform security and prevent fraud</li>
                  <li>• Comply with legal obligations and enforce our terms</li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <CardTitle>Information Sharing and Disclosure</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  We do not sell, trade, or rent your personal information to third parties. We may share your
                  information only in the following circumstances:
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold">Public Information</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Your rankings, accuracy scores, and profile information may be visible to other users based on your
                    privacy settings. You can control this visibility in your account settings.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Service Providers</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    We may share information with trusted third-party service providers who help us operate our
                    platform, such as hosting, analytics, and email services.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Legal Requirements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    We may disclose information when required by law or to protect our rights, users, or the public from
                    harm.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Cookie className="w-5 h-5" />
                  <CardTitle>Cookies and Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  We use cookies and similar technologies to enhance your experience, remember your preferences, and
                  analyze platform usage. You can control cookie settings through your browser, though some features may
                  not work properly if cookies are disabled.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold">Types of Cookies We Use:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Essential cookies for platform functionality</li>
                    <li>Preference cookies to remember your settings</li>
                    <li>Analytics cookies to understand usage patterns</li>
                    <li>Performance cookies to optimize our services</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  We implement appropriate technical and organizational security measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction. However, no method of
                  transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Access and review your personal information</li>
                  <li>• Update or correct your information</li>
                  <li>• Delete your account and associated data</li>
                  <li>• Control privacy settings and data sharing preferences</li>
                  <li>• Opt out of marketing communications</li>
                  <li>• Request data portability where applicable</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <CardTitle>Contact Us</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  If you have questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <p>Email: privacy@rankbet.com</p>
                  <p>Address: 123 Fantasy Lane, Sports City, SC 12345</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
