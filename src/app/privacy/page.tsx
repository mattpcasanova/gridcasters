import Link from "next/link"

export default function PrivacyPolicy() {
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

          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-400">
              This page is under construction. Check back soon for our complete privacy policy.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about our privacy practices, please contact us at{" "}
              <a
                href="mailto:privacy@gridcasters.com"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                privacy@gridcasters.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 