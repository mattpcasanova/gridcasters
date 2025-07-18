import Link from "next/link"
import { Mail, MessageCircle, HelpCircle, FileText, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Support() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Support Center
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Need help with GridCasters? We're here to assist you with any questions or issues you might have.
        </p>
      </div>

      {/* Contact Section */}
      <div className="mb-12">
        <Card className="border-2 border-blue-100 dark:border-blue-900">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Mail className="w-12 h-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Get in Touch</CardTitle>
            <CardDescription className="text-lg">
              Have a question or need assistance? Send us an email and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                support@gridcasters.com
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                We typically respond within 24 hours
              </p>
            </div>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <a href="mailto:support@gridcasters.com">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Help Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Quick Help
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Getting Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                New to GridCasters? Learn how to create your first ranking and get started with fantasy football predictions.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/help/accuracy-scoring">
                  <FileText className="w-4 h-4 mr-2" />
                  View Guide
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Account & Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Questions about your account, profile settings, or privacy? Find answers here.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/settings">
                  <Shield className="w-4 h-4 mr-2" />
                  Account Settings
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-lg">Community</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Connect with other users, join groups, and participate in the GridCasters community.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/find-friends">
                  <Users className="w-4 h-4 mr-2" />
                  Find Friends
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How does accuracy scoring work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Accuracy scoring measures how well your rankings predict actual player performance. 
                We compare your rankings against real NFL statistics and award points based on how 
                close your predictions are to actual results. The higher your accuracy score, the 
                better your predictions were.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I change my username?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Currently, usernames cannot be changed after account creation. This helps maintain 
                consistency in the community and prevents confusion. Choose your username carefully 
                when creating your account.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How do I join or create a group?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                You can join existing groups by visiting the "Find Groups" page and browsing 
                available groups. To create your own group, use the "Create Group" option in 
                your dashboard. Groups allow you to compete with friends and track rankings 
                within your own community.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What are badges and how do I earn them?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Badges are achievements that recognize your performance and activity on GridCasters. 
                You can earn badges for accuracy milestones, consistency, participation, and more. 
                Check your profile to see your current badges and progress toward new ones.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is my data secure and private?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Yes, we take your privacy and data security seriously. Your personal information 
                is encrypted and stored securely. You can control your privacy settings in your 
                account, and we never share your personal data with third parties without your 
                explicit consent.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Additional Resources
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/terms">
              <FileText className="w-4 h-4 mr-2" />
              Terms of Service
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/help/accuracy-scoring">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help Center
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 