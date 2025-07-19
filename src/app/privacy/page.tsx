import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Globe,
  Clock,
  Mail,
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PrivacyPage() {
  const sections = [
    { id: "introduction", title: "Introduction", icon: Eye },
    { id: "information-collect", title: "Information We Collect", icon: Database },
    { id: "how-we-use", title: "How We Use Information", icon: Users },
    { id: "information-sharing", title: "Information Sharing", icon: Globe },
    { id: "data-security", title: "Data Security", icon: Lock },
    { id: "your-rights", title: "Your Rights", icon: Settings },
    { id: "data-retention", title: "Data Retention", icon: Clock },
    { id: "cookies", title: "Cookies & Tracking", icon: FileText },
    { id: "contact", title: "Contact Us", icon: Mail },
  ]

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Grid Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="GridCasters Logo" width={48} height={48} className="w-12 h-12" />
            <span className="text-2xl font-bold">
              <span className="text-blue-400">Grid</span>
              <span className="text-green-400">Casters</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/support" className="text-slate-300 hover:text-white transition-colors">
              Support
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <Badge className="mb-4 bg-blue-600/20 text-blue-300 border-blue-600/30">Your Privacy Matters</Badge>
            <h1 className="text-5xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              How we collect, use, and protect your information on the GridCasters fantasy football platform
            </p>
            <p className="text-slate-400 mt-4">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg sticky top-8">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Table of Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {sections.map((section) => {
                      const IconComponent = section.icon
                      return (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-800/50 p-2 rounded-lg transition-colors text-sm"
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{section.title}</span>
                        </a>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Introduction */}
              <Card
                id="introduction"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Eye className="w-6 h-6 mr-3 text-blue-400" />
                    Introduction
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <p>
                    At GridCasters, we respect your privacy and are committed to protecting your personal information.
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
                    use our fantasy football ranking platform.
                  </p>
                  <p>
                    By using GridCasters, you agree to the collection and use of information in accordance with this
                    policy. If you do not agree with our policies and practices, please do not use our service.
                  </p>
                  <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Our Commitment</h4>
                        <p className="text-sm text-slate-300">
                          We are committed to transparency, data minimization, and giving you control over your personal
                          information.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Information We Collect */}
              <Card
                id="information-collect"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Database className="w-6 h-6 mr-3 text-green-400" />
                    Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-blue-400" />
                          Account Information
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Email address and username</li>
                          <li>Display name and profile information</li>
                          <li>Profile picture and bio (optional)</li>
                          <li>Account preferences and settings</li>
                          <li>Birth date (for age verification)</li>
                        </ul>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-green-400" />
                          Fantasy Football Data
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Player rankings and predictions</li>
                          <li>Accuracy scores and performance metrics</li>
                          <li>Ranking history and trends</li>
                          <li>Competition results and leaderboard positions</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-purple-400" />
                          Social & Usage Data
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Social interactions (follows, groups)</li>
                          <li>Comments and community participation</li>
                          <li>Platform usage patterns</li>
                          <li>Feature preferences and settings</li>
                        </ul>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Settings className="w-4 h-4 mr-2 text-yellow-400" />
                          Technical Information
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>IP address and device information</li>
                          <li>Browser type and version</li>
                          <li>Operating system details</li>
                          <li>Usage analytics and performance data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How We Use Your Information */}
              <Card
                id="how-we-use"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Users className="w-6 h-6 mr-3 text-purple-400" />
                    How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <p>We use the information we collect to provide and improve our fantasy football ranking platform:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Provide and maintain our ranking platform</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Calculate accuracy scores and performance metrics</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Enable social features and community interaction</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Generate leaderboards and competitive rankings</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Send important service updates and notifications</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Improve our platform and develop new features</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Ensure platform security and prevent fraud</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Comply with legal obligations</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Information Sharing */}
              <Card
                id="information-sharing"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Globe className="w-6 h-6 mr-3 text-yellow-400" />
                    Information Sharing and Disclosure
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">We Don't Sell Your Data</h4>
                        <p className="text-sm text-slate-300">
                          We do not sell, trade, or rent your personal information to third parties for marketing
                          purposes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p>We may share your information only in the following limited circumstances:</p>

                  <div className="space-y-3">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-white mb-2">🏆 Public Profiles & Rankings</h5>
                      <p className="text-sm">
                        Your username, display name, and public rankings may be visible to other users as part of the
                        competitive platform experience.
                      </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-white mb-2">🔧 Service Providers</h5>
                      <p className="text-sm">
                        We may share data with trusted third-party services (like Supabase for authentication) that help
                        us operate our platform securely.
                      </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-white mb-2">⚖️ Legal Requirements</h5>
                      <p className="text-sm">
                        We may disclose information if required by law, court order, or to protect our rights, safety,
                        and the safety of others.
                      </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-white mb-2">✅ Your Consent</h5>
                      <p className="text-sm">
                        We may share information with your explicit consent for specific purposes you approve.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Security */}
              <Card
                id="data-security"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Lock className="w-6 h-6 mr-3 text-red-400" />
                    Data Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <p>We implement comprehensive security measures to protect your personal information:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Lock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-white text-sm">Encryption</h5>
                          <p className="text-xs text-slate-400">Data encrypted in transit and at rest</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-white text-sm">Authentication</h5>
                          <p className="text-xs text-slate-400">Secure access controls and authentication</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Eye className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-white text-sm">Monitoring</h5>
                          <p className="text-xs text-slate-400">24/7 monitoring for suspicious activity</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Settings className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-white text-sm">Regular Updates</h5>
                          <p className="text-xs text-slate-400">Security audits and system updates</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Users className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-white text-sm">Access Control</h5>
                          <p className="text-xs text-slate-400">Limited access on need-to-know basis</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Database className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-white text-sm">Secure Infrastructure</h5>
                          <p className="text-xs text-slate-400">Enterprise-grade hosting and security</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Security Disclaimer</h4>
                        <p className="text-sm text-slate-300">
                          While we implement industry-standard security measures, no method of transmission over the
                          internet is 100% secure. We cannot guarantee absolute security but are committed to
                          maintaining the highest standards of data protection.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Your Rights */}
              <Card
                id="your-rights"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Settings className="w-6 h-6 mr-3 text-cyan-400" />
                    Your Privacy Rights
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <p>You have the following rights regarding your personal information:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-1">👁️ Access</h5>
                        <p className="text-xs text-slate-400">Request a copy of your personal information</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-1">✏️ Correction</h5>
                        <p className="text-xs text-slate-400">Update or correct inaccurate information</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-1">🗑️ Deletion</h5>
                        <p className="text-xs text-slate-400">Request deletion of your account and data</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-1">📦 Portability</h5>
                        <p className="text-xs text-slate-400">Export your data in machine-readable format</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-1">🚫 Objection</h5>
                        <p className="text-xs text-slate-400">Object to certain processing of your information</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-1">↩️ Withdrawal</h5>
                        <p className="text-xs text-slate-400">Withdraw consent for data processing</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-white mb-2">How to Exercise Your Rights</h4>
                    <p className="text-sm text-slate-300 mb-3">
                      To exercise any of these rights, please contact us at <strong>privacy@gridcasters.com</strong>
                    </p>
                    <p className="text-xs text-slate-400">
                      We will respond to your request within 30 days and may require identity verification for security
                      purposes.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Data Retention */}
              <Card
                id="data-retention"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Clock className="w-6 h-6 mr-3 text-orange-400" />
                    Data Retention
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <p>
                    We retain your personal information only as long as necessary for the purposes outlined in this
                    policy:
                  </p>

                  <div className="space-y-3">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-white mb-2">📊 Active Account Data</h5>
                      <p className="text-sm">
                        Retained while your account is active and for a reasonable period after account closure to
                        comply with legal obligations.
                      </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-white mb-2">🏆 Historical Rankings</h5>
                      <p className="text-sm">
                        Anonymized ranking data may be retained for statistical analysis and platform improvement, with
                        personal identifiers removed.
                      </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h5 className="font-semibold text-white mb-2">📋 Legal & Security Logs</h5>
                      <p className="text-sm">
                        Security logs and legal compliance data retained according to applicable laws and regulations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cookies and Tracking */}
              <Card
                id="cookies"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <FileText className="w-6 h-6 mr-3 text-pink-400" />
                    Cookies and Tracking Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <p>We use cookies and similar tracking technologies to enhance your experience:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-1">🍪 Essential Cookies</h5>
                        <p className="text-xs text-slate-400">Required for basic platform functionality and security</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-1">⚙️ Preference Cookies</h5>
                        <p className="text-xs text-slate-400">Remember your settings and preferences</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-1">📈 Analytics Cookies</h5>
                        <p className="text-xs text-slate-400">Help us understand platform usage and performance</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-1">🎯 Functional Cookies</h5>
                        <p className="text-xs text-slate-400">Enable enhanced features and personalization</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 border border-slate-600/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Cookie Control</h4>
                    <p className="text-sm text-slate-300">
                      You can control cookie settings through your browser preferences. Note that disabling certain
                      cookies may affect platform functionality.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card
                id="contact"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Mail className="w-6 h-6 mr-3 text-green-400" />
                    Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h5 className="font-semibold text-white mb-2 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-blue-400" />
                          Email
                        </h5>
                        <p className="text-sm">privacy@gridcasters.com</p>
                        <p className="text-xs text-slate-400 mt-1">We respond within 30 days</p>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h5 className="font-semibold text-white mb-2 flex items-center">
                          <ExternalLink className="w-4 h-4 mr-2 text-green-400" />
                          Support Center
                        </h5>
                        <Link href="/support" className="text-sm text-blue-400 hover:text-blue-300">
                          Visit our Support Center →
                        </Link>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900/30 to-green-900/30 border border-blue-600/30 rounded-lg p-4">
                      <h5 className="font-semibold text-white mb-2">Privacy Team</h5>
                      <p className="text-sm text-slate-300 mb-3">
                        Our dedicated privacy team is committed to protecting your data and answering your questions.
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>GDPR & CCPA Compliant</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Updates Notice */}
              <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-600/50 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h4 className="font-semibold text-white mb-2">Policy Updates</h4>
                    <p className="text-sm text-slate-300 mb-4">
                      We may update this Privacy Policy from time to time. We will notify you of any material changes by
                      posting the new policy on this page and updating the "Last updated" date.
                    </p>
                    <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">
                      Check back periodically for updates
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 