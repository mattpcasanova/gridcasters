import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PrivacyPage() {
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-xl text-slate-300">
              How we collect, use, and protect your information
            </p>
            <p className="text-slate-400 mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content Cards */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-400" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <p className="mb-4">
                  At GridCasters, we respect your privacy and are committed to protecting your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                  use our fantasy football ranking platform.
                </p>
                <p>
                  By using GridCasters, you agree to the collection and use of information in accordance with this policy. 
                  If you do not agree with our policies and practices, please do not use our service.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="w-5 h-5 mr-2 text-green-400" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Personal Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Email address and username for account creation</li>
                      <li>Display name and profile information</li>
                      <li>Profile picture and bio (optional)</li>
                      <li>Account preferences and settings</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Usage Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Fantasy football rankings and predictions</li>
                      <li>Accuracy scores and performance metrics</li>
                      <li>Social interactions (follows, groups, comments)</li>
                      <li>Platform usage patterns and preferences</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Technical Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Operating system and device identifiers</li>
                      <li>Usage analytics and performance data</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Provide and maintain our fantasy football ranking platform</li>
                    <li>Calculate and display accuracy scores and performance metrics</li>
                    <li>Enable social features like following users and joining groups</li>
                    <li>Generate leaderboards and competitive rankings</li>
                    <li>Send important service updates and notifications</li>
                    <li>Improve our platform and develop new features</li>
                    <li>Ensure platform security and prevent fraud</li>
                    <li>Comply with legal obligations and enforce our terms</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-yellow-400" />
                  Information Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Public Profiles:</strong> Your username, display name, and public rankings may be visible to other users</li>
                    <li><strong>Service Providers:</strong> We may share data with trusted third-party services that help us operate our platform</li>
                    <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, user information may be transferred</li>
                    <li><strong>Consent:</strong> We may share information with your explicit consent</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-red-400" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <p>We implement appropriate security measures to protect your personal information:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Secure authentication and access controls</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information on a need-to-know basis</li>
                    <li>Monitoring for suspicious activity and potential threats</li>
                  </ul>
                  <p className="text-sm text-slate-400">
                    While we strive to protect your information, no method of transmission over the internet is 100% secure. 
                    We cannot guarantee absolute security but are committed to maintaining the highest standards of data protection.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                    <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                    <li><strong>Objection:</strong> Object to certain processing of your information</li>
                    <li><strong>Withdrawal:</strong> Withdraw consent for data processing where applicable</li>
                  </ul>
                  <p className="text-sm text-slate-400">
                    To exercise these rights, please contact us at privacy@gridcasters.com
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cookies and Tracking */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Cookies and Tracking Technologies</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <div className="space-y-4">
                  <p>We use cookies and similar tracking technologies to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze platform usage and performance</li>
                    <li>Provide personalized content and features</li>
                    <li>Ensure platform security and prevent fraud</li>
                  </ul>
                  <p className="text-sm text-slate-400">
                    You can control cookie settings through your browser preferences. 
                    Disabling certain cookies may affect platform functionality.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <p>
                  GridCasters is not intended for children under 13 years of age. We do not knowingly collect 
                  personal information from children under 13. If you are a parent or guardian and believe 
                  your child has provided us with personal information, please contact us immediately.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Privacy Policy */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by 
                  posting the new Privacy Policy on this page and updating the "Last updated" date. 
                  We encourage you to review this Privacy Policy periodically for any changes.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 leading-relaxed">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="mt-4 space-y-2">
                  <p><strong>Email:</strong> privacy@gridcasters.com</p>
                  <p><strong>Address:</strong> GridCasters Privacy Team</p>
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