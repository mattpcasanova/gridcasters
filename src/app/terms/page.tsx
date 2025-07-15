import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, Users, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="GridCasters Logo" width={48} height={48} className="w-12 h-12" />
            <span className="text-2xl font-bold">
              <span className="text-blue-400">Grid</span>
              <span className="text-green-400">Casters</span>
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-xl text-slate-300">
              The rules and guidelines for using GridCasters
            </p>
            <p className="text-slate-400 mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content Cards */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Scale className="w-5 h-5 mr-2 text-blue-400" />
                  Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <p className="mb-4">
                  These Terms of Service ("Terms") govern your use of GridCasters, a fantasy football ranking platform 
                  operated by GridCasters ("we," "us," or "our"). By accessing or using our service, you agree to be 
                  bound by these Terms.
                </p>
                <p>
                  If you disagree with any part of these terms, then you may not access the service. These Terms apply 
                  to all visitors, users, and others who access or use the service.
                </p>
              </CardContent>
            </Card>

            {/* Description of Service */}
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Description of Service
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <p>
                    GridCasters is a fantasy football platform that allows users to:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Create and manage fantasy football player rankings</li>
                    <li>Track prediction accuracy and performance metrics</li>
                    <li>Compete on leaderboards with other users</li>
                    <li>Follow other users and join groups</li>
                    <li>Share rankings and engage with the community</li>
                    <li>Access statistical analysis and insights</li>
                  </ul>
                  <p className="text-sm text-slate-400">
                    We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  User Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Account Creation</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>You must be at least 13 years old to create an account</li>
                      <li>Provide accurate and complete information during registration</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Notify us immediately of any unauthorized use</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Account Responsibilities</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>You are responsible for all activities under your account</li>
                      <li>Keep your password secure and confidential</li>
                      <li>Do not share your account with others</li>
                      <li>Update your information as needed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Account Termination</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>You may delete your account at any time</li>
                      <li>We may suspend or terminate accounts for violations</li>
                      <li>Account termination may result in data loss</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-yellow-400" />
                  Acceptable Use Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <p>You agree not to use the service to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Post false, misleading, or inappropriate content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use automated tools to scrape or collect data</li>
                    <li>Interfere with the service's operation</li>
                    <li>Impersonate others or provide false information</li>
                  </ul>
                  <p className="text-sm text-slate-400">
                    Violations may result in account suspension or termination.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Content */}
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">User-Generated Content</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Your Content</h4>
                    <p className="text-sm">
                      You retain ownership of content you create, including rankings, comments, and profile information. 
                      By posting content, you grant us a license to use, display, and distribute it within our service.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Content Standards</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Content must be accurate and not misleading</li>
                      <li>Respect intellectual property rights</li>
                      <li>Do not post offensive or inappropriate material</li>
                      <li>Follow community guidelines and standards</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Content Moderation</h4>
                    <p className="text-sm">
                      We reserve the right to remove content that violates these terms or community standards. 
                      We may also suspend or terminate accounts for repeated violations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Our Rights</h4>
                    <p className="text-sm">
                      The service and its original content, features, and functionality are owned by GridCasters 
                      and are protected by international copyright, trademark, patent, trade secret, and other 
                      intellectual property laws.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Your Rights</h4>
                    <p className="text-sm">
                      You retain ownership of your user-generated content. You grant us a non-exclusive, 
                      worldwide, royalty-free license to use, reproduce, modify, and distribute your content 
                      within our service.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Third-Party Content</h4>
                    <p className="text-sm">
                      Our service may contain content from third parties, including player data and statistics. 
                      We respect intellectual property rights and expect users to do the same.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Privacy and Data Protection</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <p>
                    Your privacy is important to us. Our collection and use of personal information is governed 
                    by our Privacy Policy, which is incorporated into these Terms by reference.
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>We collect and process data as described in our Privacy Policy</li>
                    <li>You consent to our data practices by using the service</li>
                    <li>We implement appropriate security measures to protect your data</li>
                    <li>You have rights regarding your personal information</li>
                  </ul>
                  <p className="text-sm text-slate-400">
                    Please review our Privacy Policy for detailed information about our data practices.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                  Disclaimers and Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Service Availability</h4>
                    <p className="text-sm">
                      We strive to provide reliable service but cannot guarantee uninterrupted availability. 
                      The service is provided "as is" without warranties of any kind.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Accuracy of Information</h4>
                    <p className="text-sm">
                      While we aim for accuracy, we cannot guarantee that all information is current or correct. 
                      Users should verify important information independently.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Limitation of Liability</h4>
                    <p className="text-sm">
                      To the maximum extent permitted by law, GridCasters shall not be liable for any indirect, 
                      incidental, special, consequential, or punitive damages.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Termination</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <p>
                    These Terms remain in effect until terminated by either party. You may terminate your 
                    agreement by deleting your account and discontinuing use of the service.
                  </p>
                  <p>
                    We may terminate or suspend your access immediately, without prior notice, for any reason, 
                    including breach of these Terms.
                  </p>
                  <p className="text-sm text-slate-400">
                    Upon termination, your right to use the service will cease immediately, and we may delete 
                    your account and associated data.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                  where GridCasters is incorporated, without regard to its conflict of law provisions.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of significant 
                  changes by posting the new Terms on this page and updating the "Last updated" date.
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Your continued use of the service after changes constitutes acceptance of the new Terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="mt-4 space-y-2">
                  <p><strong>Email:</strong> legal@gridcasters.com</p>
                  <p><strong>Address:</strong> GridCasters Legal Team</p>
                  <p className="text-sm text-slate-400">
                    We will respond to your inquiry within 30 days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 