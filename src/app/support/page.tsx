import Link from "next/link"
import Image from "next/image"
import { 
  Mail, 
  MessageCircle, 
  HelpCircle, 
  FileText, 
  Shield, 
  Users, 
  Phone,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  ExternalLink,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Support() {
  const supportCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: HelpCircle,
      description: "New to GridCasters? Learn the basics and create your first ranking.",
      color: "text-green-400",
      bgColor: "bg-green-600/20",
      borderColor: "border-green-600/30",
      link: "/help/accuracy-scoring",
      linkText: "View Guide"
    },
    {
      id: "account-profile",
      title: "Account & Profile",
      icon: Users,
      description: "Manage your account settings, privacy, and profile information.",
      color: "text-blue-400",
      bgColor: "bg-blue-600/20",
      borderColor: "border-blue-600/30",
      link: "/settings",
      linkText: "Account Settings"
    },
    {
      id: "community",
      title: "Community",
      icon: MessageCircle,
      description: "Connect with other users, join groups, and participate in discussions.",
      color: "text-purple-400",
      bgColor: "bg-purple-600/20",
      borderColor: "border-purple-600/30",
      link: "/find-friends",
      linkText: "Find Friends"
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: Settings,
      description: "Troubleshoot issues, report bugs, and get technical assistance.",
      color: "text-yellow-400",
      bgColor: "bg-yellow-600/20",
      borderColor: "border-yellow-600/30",
      link: "mailto:support@gridcasters.com",
      linkText: "Contact Support"
    }
  ]

  const faqs = [
    {
      question: "How does accuracy scoring work?",
      answer: "Accuracy scoring measures how well your rankings predict actual player performance. We compare your rankings against real NFL statistics and award points based on how close your predictions are to actual results. The higher your accuracy score, the better your predictions were.",
      icon: CheckCircle,
      color: "text-green-400"
    },
    {
      question: "Can I change my username?",
      answer: "Currently, usernames cannot be changed after account creation. This helps maintain consistency in the community and prevents confusion. Choose your username carefully when creating your account.",
      icon: AlertTriangle,
      color: "text-yellow-400"
    },
    {
      question: "How do I join or create a group?",
      answer: "You can join existing groups by visiting the 'Find Groups' page and browsing available groups. To create your own group, use the 'Create Group' option in your dashboard. Groups allow you to compete with friends and track rankings within your own community.",
      icon: Users,
      color: "text-blue-400"
    },
    {
      question: "What are badges and how do I earn them?",
      answer: "Badges are achievements that recognize your performance and activity on GridCasters. You can earn badges for accuracy milestones, consistency, participation, and more. Check your profile to see your current badges and progress toward new ones.",
      icon: Shield,
      color: "text-purple-400"
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes, we take your privacy and data security seriously. Your personal information is encrypted and stored securely. You can control your privacy settings in your account, and we never share your personal data with third parties without your explicit consent.",
      icon: Shield,
      color: "text-green-400"
    }
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
            <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
              Privacy
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
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <Badge className="mb-4 bg-blue-600/20 text-blue-300 border-blue-600/30">We're Here to Help</Badge>
            <h1 className="text-5xl font-bold text-white mb-4">Support Center</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Need help with GridCasters? We're here to assist you with any questions or issues you might have.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mb-16">
            <Card className="bg-gradient-to-br from-blue-950/90 to-slate-900/90 border-blue-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-white">Get in Touch</CardTitle>
                <CardDescription className="text-lg text-slate-300">
                  Have a question or need assistance? Send us an email and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-8">
                  <p className="text-3xl font-bold text-blue-400 mb-2">
                    support@gridcasters.com
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>We typically respond within 24 hours</span>
                  </div>
                </div>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg">
                  <a href="mailto:support@gridcasters.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Help Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Quick Help</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Find answers to common questions and get help with specific features
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Card key={category.id} className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-600/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 ${category.bgColor} ${category.borderColor} border rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-5 h-5 ${category.color}`} />
                        </div>
                        <CardTitle className="text-lg text-white">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                        {category.description}
                      </p>
                      <Button variant="outline" asChild className="w-full border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-400 bg-blue-600/10">
                        <Link href={category.link}>
                          {category.linkText}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Quick answers to the most common questions about GridCasters
              </p>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, index) => {
                const IconComponent = faq.icon
                return (
                  <Card key={index} className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-600/50 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg text-white flex items-center">
                        <IconComponent className={`w-5 h-5 mr-3 ${faq.color}`} />
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Additional Resources</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Explore our documentation and legal information for more detailed guidance
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild className="border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-400 bg-blue-600/10">
                <Link href="/terms">
                  <FileText className="w-4 h-4 mr-2" />
                  Terms of Service
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-400 bg-blue-600/10">
                <Link href="/privacy">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-400 bg-blue-600/10">
                <Link href="/help/accuracy-scoring">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help Center
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 