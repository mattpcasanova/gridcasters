import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle,
  Users,
  Shield,
  Eye,
  Lock,
  Globe,
  Clock,
  Mail,
  Settings,
  Gavel,
  UserCheck,
  Ban,
  Copyright,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TermsPage() {
  const sections = [
    { id: "agreement", title: "Agreement to Terms", icon: Scale },
    { id: "service-description", title: "Service Description", icon: CheckCircle },
    { id: "user-accounts", title: "User Accounts", icon: Users },
    { id: "acceptable-use", title: "Acceptable Use", icon: Shield },
    { id: "user-content", title: "User Content", icon: FileText },
    { id: "intellectual-property", title: "Intellectual Property", icon: Copyright },
    { id: "privacy-data", title: "Privacy & Data", icon: Lock },
    { id: "disclaimers", title: "Disclaimers", icon: AlertTriangle },
    { id: "termination", title: "Termination", icon: Ban },
    { id: "governing-law", title: "Governing Law", icon: Gavel },
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
              <FileText className="w-10 h-10 text-white" />
            </div>
            <Badge className="mb-4 bg-green-600/20 text-green-300 border-green-600/30">Legal Agreement</Badge>
            <h1 className="text-5xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              The rules and guidelines for using the GridCasters fantasy football platform
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
              {/* Agreement to Terms */}
              <Card
                id="agreement"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Scale className="w-6 h-6 mr-3 text-blue-400" />
                    Agreement to Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <p>
                    These Terms of Service ("Terms") govern your use of GridCasters, a fantasy football ranking platform
                    operated by GridCasters ("we," "us," or "our"). By accessing or using our service, you agree to be
                    bound by these Terms.
                  </p>
                  <p>
                    If you disagree with any part of these terms, then you may not access the service. These Terms apply
                    to all visitors, users, and others who access or use the service.
                  </p>
                  <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">By Using GridCasters, You Agree To:</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Follow all terms and conditions outlined below</li>
                          <li>• Comply with applicable laws and regulations</li>
                          <li>• Respect other users and our community guidelines</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Description */}
              <Card
                id="service-description"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                    Description of Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <p>
                    GridCasters is a comprehensive fantasy football platform designed to help users create, track, and
                    improve their player rankings through data-driven insights and community competition.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-blue-400" />
                          Core Features
                        </h5>
                        <ul className="text-xs text-slate-400 space-y-1">
                          <li>• Create and manage player rankings</li>
                          <li>• Track prediction accuracy scores</li>
                          <li>• Access statistical analysis tools</li>
                          <li>• View performance metrics</li>
                        </ul>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-green-400" />
                          Social Features
                        </h5>
                        <ul className="text-xs text-slate-400 space-y-1">
                          <li>• Follow other users</li>
                          <li>• Join groups and communities</li>
                          <li>• Share rankings publicly</li>
                          <li>• Engage in discussions</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-2 flex items-center">
                          <Scale className="w-4 h-4 mr-2 text-purple-400" />
                          Competitive Elements
                        </h5>
                        <ul className="text-xs text-slate-400 space-y-1">
                          <li>• Global and local leaderboards</li>
                          <li>• Accuracy competitions</li>
                          <li>• Ranking challenges</li>
                          <li>• Achievement system</li>
                        </ul>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-2 flex items-center">
                          <Settings className="w-4 h-4 mr-2 text-yellow-400" />
                          Platform Tools
                        </h5>
                        <ul className="text-xs text-slate-400 space-y-1">
                          <li>• Data visualization</li>
                          <li>• Export capabilities</li>
                          <li>• Custom preferences</li>
                          <li>• Mobile optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Service Modifications</h4>
                        <p className="text-sm text-slate-300">
                          We reserve the right to modify, suspend, or discontinue any aspect of the service at any time,
                          with or without notice, to improve user experience or for operational reasons.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Accounts */}
              <Card
                id="user-accounts"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Users className="w-6 h-6 mr-3 text-purple-400" />
                    User Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <UserCheck className="w-4 h-4 mr-2 text-blue-400" />
                        Account Creation
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Must be at least 13 years old</li>
                        <li>Provide accurate information</li>
                        <li>Verify email address</li>
                        <li>Choose unique username</li>
                        <li>Create secure password</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-green-400" />
                        Account Security
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Keep credentials secure</li>
                        <li>Don't share account access</li>
                        <li>Report unauthorized use</li>
                        <li>Update information regularly</li>
                        <li>Use strong passwords</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <Settings className="w-4 h-4 mr-2 text-yellow-400" />
                        Account Management
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Responsible for all activity</li>
                        <li>Can delete account anytime</li>
                        <li>Data export available</li>
                        <li>Privacy controls accessible</li>
                        <li>Support available</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Ban className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Account Termination</h4>
                        <p className="text-sm text-slate-300">
                          We may suspend or terminate accounts for violations of these Terms. Account termination may
                          result in permanent data loss. Users can delete their accounts at any time through account
                          settings.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Acceptable Use Policy */}
              <Card
                id="acceptable-use"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Shield className="w-6 h-6 mr-3 text-yellow-400" />
                    Acceptable Use Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <p>
                    To maintain a safe and positive environment for all users, you agree not to use GridCasters for any
                    prohibited activities:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-2 flex items-center">
                          <Ban className="w-4 h-4 mr-2 text-red-400" />
                          Prohibited Content
                        </h5>
                        <ul className="text-xs text-slate-400 space-y-1">
                          <li>• Harassment or abuse of other users</li>
                          <li>• False or misleading information</li>
                          <li>• Inappropriate or offensive material</li>
                          <li>• Spam or promotional content</li>
                          <li>• Impersonation of others</li>
                        </ul>
                      </div>
                      <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-2 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                          Prohibited Activities
                        </h5>
                        <ul className="text-xs text-slate-400 space-y-1">
                          <li>• Violating laws or regulations</li>
                          <li>• Infringing intellectual property</li>
                          <li>• Attempting unauthorized access</li>
                          <li>• Using automated scraping tools</li>
                          <li>• Interfering with service operation</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                          Encouraged Behavior
                        </h5>
                        <ul className="text-xs text-slate-400 space-y-1">
                          <li>• Respectful community interaction</li>
                          <li>• Accurate ranking submissions</li>
                          <li>• Constructive feedback and discussion</li>
                          <li>• Following community guidelines</li>
                          <li>• Reporting violations when found</li>
                        </ul>
                      </div>
                      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3">
                        <h5 className="font-semibold text-white text-sm mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-blue-400" />
                          Community Standards
                        </h5>
                        <ul className="text-xs text-slate-400 space-y-1">
                          <li>• Maintain sportsmanlike conduct</li>
                          <li>• Share knowledge and insights</li>
                          <li>• Support fellow fantasy players</li>
                          <li>• Contribute to positive discussions</li>
                          <li>• Celebrate achievements together</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Enforcement</h4>
                        <p className="text-sm text-slate-300">
                          Violations of this policy may result in content removal, account warnings, temporary
                          suspension, or permanent account termination, depending on the severity and frequency of
                          violations.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Content */}
              <Card
                id="user-content"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <FileText className="w-6 h-6 mr-3 text-cyan-400" />
                    User-Generated Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Copyright className="w-4 h-4 mr-2 text-blue-400" />
                          Your Content Rights
                        </h4>
                        <ul className="text-sm space-y-2">
                          <li>• You retain ownership of your content</li>
                          <li>• Rankings, comments, and profile data remain yours</li>
                          <li>• You can export your data at any time</li>
                          <li>• Deletion removes content from our platform</li>
                        </ul>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Scale className="w-4 h-4 mr-2 text-green-400" />
                          License to GridCasters
                        </h4>
                        <p className="text-sm">
                          By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use,
                          display, and distribute it within our service for platform functionality.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-purple-400" />
                          Content Standards
                        </h4>
                        <ul className="text-sm space-y-2">
                          <li>• Content must be accurate and honest</li>
                          <li>• Respect intellectual property rights</li>
                          <li>• Follow community guidelines</li>
                          <li>• No offensive or inappropriate material</li>
                        </ul>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Eye className="w-4 h-4 mr-2 text-yellow-400" />
                          Content Moderation
                        </h4>
                        <p className="text-sm">
                          We reserve the right to review, modify, or remove content that violates these terms or
                          community standards. Repeated violations may result in account action.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Intellectual Property */}
              <Card
                id="intellectual-property"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Copyright className="w-6 h-6 mr-3 text-pink-400" />
                    Intellectual Property
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-blue-400" />
                        Our Rights
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Platform design and functionality</li>
                        <li>• GridCasters brand and logo</li>
                        <li>• Proprietary algorithms</li>
                        <li>• User interface elements</li>
                        <li>• Original content and features</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <Users className="w-4 h-4 mr-2 text-green-400" />
                        Your Rights
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Your original rankings</li>
                        <li>• Comments and discussions</li>
                        <li>• Profile information</li>
                        <li>• Personal data and preferences</li>
                        <li>• Uploaded content</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-purple-400" />
                        Third-Party Content
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• NFL player statistics</li>
                        <li>• Team information and logos</li>
                        <li>• External data sources</li>
                        <li>• Licensed content</li>
                        <li>• Fair use materials</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Intellectual Property Protection</h4>
                    <p className="text-sm text-slate-300">
                      We respect intellectual property rights and expect users to do the same. If you believe your
                      intellectual property has been infringed, please contact us with details of the alleged
                      infringement.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy and Data */}
              <Card
                id="privacy-data"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Lock className="w-6 h-6 mr-3 text-green-400" />
                    Privacy and Data Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <p>
                    Your privacy is important to us. Our collection and use of personal information is governed by our
                    Privacy Policy, which is incorporated into these Terms by reference.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">We collect data as described in our Privacy Policy</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">You consent to our data practices by using the service</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">We implement appropriate security measures</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">You have rights regarding your personal information</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Data retention policies are clearly defined</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">GDPR and CCPA compliance maintained</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <ExternalLink className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Privacy Policy Reference</h4>
                        <p className="text-sm text-slate-300 mb-2">
                          Please review our Privacy Policy for detailed information about our data practices, your
                          rights, and how we protect your information.
                        </p>
                        <Link href="/privacy" className="text-blue-400 hover:text-blue-300 text-sm">
                          View Privacy Policy →
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimers */}
              <Card
                id="disclaimers"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                    Disclaimers and Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-red-400" />
                          Service Availability
                        </h4>
                        <p className="text-sm">
                          We strive to provide reliable service but cannot guarantee uninterrupted availability. The
                          service is provided "as is" without warranties of any kind.
                        </p>
                      </div>

                      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2 flex items-center">
                          <Eye className="w-4 h-4 mr-2 text-yellow-400" />
                          Information Accuracy
                        </h4>
                        <p className="text-sm">
                          While we aim for accuracy, we cannot guarantee that all information is current or correct.
                          Users should verify important information independently.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2 flex items-center">
                          <Scale className="w-4 h-4 mr-2 text-orange-400" />
                          Limitation of Liability
                        </h4>
                        <p className="text-sm">
                          To the maximum extent permitted by law, GridCasters shall not be liable for any indirect,
                          incidental, special, consequential, or punitive damages.
                        </p>
                      </div>

                      <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-purple-400" />
                          Fantasy Football Disclaimer
                        </h4>
                        <p className="text-sm">
                          Rankings and predictions are for entertainment purposes. We are not responsible for fantasy
                          football outcomes or decisions based on our platform.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 border border-slate-600/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Important Legal Notice</h4>
                    <p className="text-sm text-slate-300">
                      These disclaimers and limitations are essential parts of our Terms of Service. By using
                      GridCasters, you acknowledge and accept these limitations on our liability and the risks
                      associated with using our platform.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Termination */}
              <Card
                id="termination"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Ban className="w-6 h-6 mr-3 text-red-400" />
                    Termination
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-blue-400" />
                          User-Initiated Termination
                        </h4>
                        <ul className="text-sm space-y-2">
                          <li>• Delete your account at any time</li>
                          <li>• Export your data before deletion</li>
                          <li>• Discontinue use of the service</li>
                          <li>• Contact support for assistance</li>
                        </ul>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Settings className="w-4 h-4 mr-2 text-green-400" />
                          Account Deletion Process
                        </h4>
                        <ul className="text-sm space-y-2">
                          <li>• Access account settings</li>
                          <li>• Confirm deletion request</li>
                          <li>• Data removal within 30 days</li>
                          <li>• Some data may be retained for legal compliance</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <Ban className="w-4 h-4 mr-2 text-red-400" />
                          Platform-Initiated Termination
                        </h4>
                        <ul className="text-sm space-y-2">
                          <li>• Immediate suspension for severe violations</li>
                          <li>• Account termination for repeated violations</li>
                          <li>• No prior notice may be given</li>
                          <li>• Appeals process available</li>
                        </ul>
                      </div>

                      <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2 text-orange-400" />
                          Effects of Termination
                        </h4>
                        <ul className="text-sm space-y-2">
                          <li>• Immediate loss of access</li>
                          <li>• Potential data loss</li>
                          <li>• Forfeiture of account benefits</li>
                          <li>• Continued application of certain terms</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 border border-slate-600/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Survival of Terms</h4>
                    <p className="text-sm text-slate-300">
                      Certain provisions of these Terms will survive termination, including intellectual property
                      rights, disclaimers, limitations of liability, and governing law provisions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Governing Law */}
              <Card
                id="governing-law"
                className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Gavel className="w-6 h-6 mr-3 text-purple-400" />
                    Governing Law and Disputes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300 leading-relaxed space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <Scale className="w-4 h-4 mr-2 text-blue-400" />
                        Applicable Law
                      </h4>
                      <p className="text-sm">
                        These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
                        where GridCasters is incorporated, without regard to conflict of law provisions.
                      </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <Gavel className="w-4 h-4 mr-2 text-green-400" />
                        Dispute Resolution
                      </h4>
                      <p className="text-sm">
                        Any disputes arising from these Terms or your use of GridCasters will be resolved through
                        binding arbitration or in the courts of our jurisdiction.
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Dispute Prevention</h4>
                    <p className="text-sm text-slate-300">
                      We encourage users to contact us directly to resolve any issues before pursuing formal legal
                      action. Many disputes can be resolved through direct communication with our support team.
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
                  <p>If you have any questions about these Terms of Service, please contact us:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h5 className="font-semibold text-white mb-2 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-blue-400" />
                          Legal Team
                        </h5>
                        <p className="text-sm">legal@gridcasters.com</p>
                        <p className="text-xs text-slate-400 mt-1">For terms and legal questions</p>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h5 className="font-semibold text-white mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-green-400" />
                          General Support
                        </h5>
                        <p className="text-sm">support@gridcasters.com</p>
                        <p className="text-xs text-slate-400 mt-1">For general questions and support</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900/30 to-green-900/30 border border-blue-600/30 rounded-lg p-4">
                      <h5 className="font-semibold text-white mb-2">Response Time</h5>
                      <p className="text-sm text-slate-300 mb-3">
                        We will respond to your inquiry within 30 business days. For urgent legal matters, please
                        indicate the urgency in your subject line.
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Professional Legal Support</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Updates Notice */}
              <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-600/50 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h4 className="font-semibold text-white mb-2">Terms Updates</h4>
                    <p className="text-sm text-slate-300 mb-4">
                      We reserve the right to modify these Terms at any time. We will notify users of significant
                      changes by posting the new Terms on this page and updating the "Last updated" date. Your continued
                      use of the service after changes constitutes acceptance of the new Terms.
                    </p>
                    <Badge className="bg-green-600/20 text-green-300 border-green-600/30">
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