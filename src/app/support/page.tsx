import Link from "next/link"
import { Mail, MessageCircle, FileQuestion } from "lucide-react"

export default function Support() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/"
            className="inline-block mb-8 text-blue-600 hover:text-blue-500 transition-colors"
          >
            ← Back to home
          </Link>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Support Center</h1>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Mail className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Email Support</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Get help via email within 24 hours
              </p>
              <Link 
                href="mailto:support@rankbet.com"
                className="text-blue-600 hover:text-blue-500 transition-colors"
              >
                support@rankbet.com
              </Link>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <MessageCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Live Chat</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Chat with our support team (Coming Soon)
              </p>
              <span className="text-slate-500 dark:text-slate-500">
                Available 9am-5pm EST
              </span>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <FileQuestion className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">FAQs</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Browse our help articles (Coming Soon)
              </p>
              <span className="text-slate-500 dark:text-slate-500">
                Updated regularly
              </span>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>Common Questions</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Our help center is under construction. In the meantime, please email us for any support needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 