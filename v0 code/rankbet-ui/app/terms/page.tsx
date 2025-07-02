import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Shield, AlertTriangle, Scale, Gavel } from "lucide-react"

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
            <p className="text-slate-600 dark:text-slate-400">Last updated: January 1, 2024</p>
          </div>

          <div className="space-y-6">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <CardTitle>Agreement to Terms</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Welcome to RankBet! These Terms of Service ("Terms") govern your use of our fantasy football ranking
                  platform and services. By accessing or using RankBet, you agree to be bound by these Terms.
                </p>
                <p>
                  If you do not agree to these Terms, please do not use our services. We may update these Terms from
                  time to time, and your continued use constitutes acceptance of any changes.
                </p>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description of Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  RankBet is a fantasy football platform that allows users to create player rankings, track accuracy
                  scores, compete on leaderboards, and engage with a community of fantasy football enthusiasts. Our
                  services include ranking tools, performance analytics, social features, and educational content.
                </p>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <CardTitle>User Accounts and Responsibilities</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Account Creation</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>You must provide accurate and complete information when creating an account</li>
                    <li>You are responsible for maintaining the security of your account credentials</li>
                    <li>You must be at least 13 years old to use our services</li>
                    <li>One person may not maintain multiple accounts</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Account Usage</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>You are responsible for all activity that occurs under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                    <li>You may not share your account with others or allow others to access your account</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <CardTitle>Acceptable Use Policy</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  You agree to use RankBet in a manner consistent with all applicable laws and regulations. The
                  following activities are prohibited:
                </p>

                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Harassment, bullying, or threatening other users</li>
                  <li>• Posting offensive, discriminatory, or inappropriate content</li>
                  <li>• Attempting to manipulate rankings or accuracy scores</li>
                  <li>• Using automated tools or bots to interact with our services</li>
                  <li>• Sharing false or misleading information</li>
                  <li>• Violating intellectual property rights</li>
                  <li>• Attempting to gain unauthorized access to our systems</li>
                  <li>• Interfering with the normal operation of our services</li>
                </ul>
              </CardContent>
            </Card>

            {/* Content and Rankings */}
            <Card>
              <CardHeader>
                <CardTitle>User Content and Rankings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Your Content</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    You retain ownership of the rankings, comments, and other content you create on RankBet. However, by
                    posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and
                    distribute your content in connection with our services.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Content Standards</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    All content must comply with our community guidelines. We reserve the right to remove content that
                    violates these Terms or is otherwise objectionable. You are solely responsible for the content you
                    post.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  RankBet and its original content, features, and functionality are owned by RankBet and are protected
                  by international copyright, trademark, patent, trade secret, and other intellectual property laws. You
                  may not copy, modify, distribute, sell, or lease any part of our services without our written
                  permission.
                </p>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our
                  services, to understand our practices regarding the collection and use of your information.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <CardTitle>Disclaimers and Limitations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Service Availability</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    We strive to provide reliable services, but we cannot guarantee uninterrupted access. Our services
                    are provided "as is" without warranties of any kind.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Fantasy Sports Disclaimer</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    RankBet is for entertainment purposes only. We do not provide gambling services or facilitate
                    real-money wagering. Rankings and predictions are for informational purposes and should not be
                    considered professional advice.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Limitation of Liability</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    To the maximum extent permitted by law, RankBet shall not be liable for any indirect, incidental,
                    special, consequential, or punitive damages arising from your use of our services.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  We may terminate or suspend your account and access to our services at our sole discretion, without
                  prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or
                  third parties, or for any other reason. You may also terminate your account at any time through your
                  account settings.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Scale className="w-5 h-5" />
                  <CardTitle>Governing Law and Disputes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  These Terms shall be governed by and construed in accordance with the laws of the State of Delaware,
                  without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of
                  our services shall be resolved through binding arbitration.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Gavel className="w-5 h-5" />
                  <CardTitle>Contact Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <p>Email: legal@rankbet.com</p>
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
