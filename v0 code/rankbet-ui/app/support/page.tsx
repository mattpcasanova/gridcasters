"use client"

import type React from "react"

import { useState } from "react"
import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { GradientButton } from "@/components/ui/gradient-button"
import { HelpCircle, Mail, MessageSquare, Clock, AlertCircle, Search, ChevronDown, ChevronRight } from "lucide-react"

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create my first ranking?",
        answer:
          "Navigate to the Rankings page, select a position (QB, RB, WR, TE), and drag players to arrange them in your preferred order. Your ranking will be automatically saved.",
      },
      {
        question: "How is my accuracy score calculated?",
        answer:
          "Your accuracy score is based on how closely your rankings match actual player performance. We use a proprietary algorithm that considers various performance metrics and weights them appropriately.",
      },
      {
        question: "Can I edit my rankings after submitting them?",
        answer:
          "You can edit your rankings until the games start for that week. Once games begin, rankings are locked to ensure fair competition.",
      },
    ],
  },
  {
    category: "Rankings & Scoring",
    questions: [
      {
        question: "What scoring system do you use?",
        answer:
          "We use standard PPR (Point Per Reception) scoring for our accuracy calculations. This includes 1 point per reception, 6 points for touchdowns, and standard yardage bonuses.",
      },
      {
        question: "How often are rankings updated?",
        answer:
          "You can update your rankings as often as you like throughout the week. We recommend updating them based on injury reports, weather conditions, and other relevant factors.",
      },
      {
        question: "What happens if a player doesn't play?",
        answer:
          "If a player is inactive or doesn't play, they are removed from accuracy calculations for that week to ensure fair scoring.",
      },
    ],
  },
  {
    category: "Account & Privacy",
    questions: [
      {
        question: "How do I make my profile private?",
        answer:
          "Go to Settings > Privacy and toggle on 'Private Profile'. This will require users to request to follow you before seeing your detailed rankings and stats.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can delete your account from Settings > Account > Danger Zone. This action is permanent and cannot be undone.",
      },
      {
        question: "How do I change my username?",
        answer:
          "You can change your username once every 30 days from your Profile Settings. Keep in mind that your old username may become available to other users.",
      },
    ],
  },
  {
    category: "Community & Social",
    questions: [
      {
        question: "How do I follow other users?",
        answer:
          "Visit any user's profile and click the 'Follow' button. You'll see their public rankings and can compare your performance against theirs.",
      },
      {
        question: "What are badges and how do I earn them?",
        answer:
          "Badges are achievements you can earn based on your ranking accuracy and platform engagement. Check your Profile > Achievements tab to see available badges and your progress.",
      },
      {
        question: "Can I create private groups?",
        answer:
          "Yes! You can create private groups to compete with friends. Go to Groups > Create Group and set it to private with an invite code.",
      },
    ],
  },
]

export default function Support() {
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", contactForm)
    // Reset form
    setContactForm({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Support Center</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Get help with RankBet and find answers to common questions
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Mail className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Get help via email within 24 hours</p>
                <Button variant="outline" size="sm">
                  support@rankbet.com
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Chat with our team in real-time</p>
                <Button variant="outline" size="sm">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Average response within 4 hours</p>
                <Badge variant="secondary">Mon-Fri 9AM-6PM EST</Badge>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="faq" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
            </TabsList>

            <TabsContent value="faq">
              <div className="space-y-6">
                {/* Search */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search frequently asked questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Categories */}
                <div className="space-y-4">
                  {filteredFaqs.map((category, categoryIndex) => (
                    <Card key={categoryIndex}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <HelpCircle className="w-5 h-5" />
                          <span>{category.category}</span>
                          <Badge variant="secondary">{category.questions.length}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {category.questions.map((faq, faqIndex) => {
                          const faqId = `${categoryIndex}-${faqIndex}`
                          const isOpen = selectedFaq === faqId

                          return (
                            <div key={faqIndex} className="border rounded-lg">
                              <button
                                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                onClick={() => setSelectedFaq(isOpen ? null : faqId)}
                              >
                                <span className="font-medium">{faq.question}</span>
                                {isOpen ? (
                                  <ChevronDown className="w-4 h-4 text-slate-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-500" />
                                )}
                              </button>
                              {isOpen && (
                                <div className="px-4 pb-3 text-sm text-slate-600 dark:text-slate-400 border-t bg-slate-50 dark:bg-slate-800/50">
                                  <p className="pt-3">{faq.answer}</p>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredFaqs.length === 0 && searchQuery && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                      <h3 className="font-semibold mb-2">No results found</h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Try adjusting your search terms or contact us directly for help.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Our Support Team</CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Send us a message and we'll get back to you soon.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={contactForm.category}
                        onValueChange={(value) => setContactForm((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="account">Account Problem</SelectItem>
                          <SelectItem value="rankings">Rankings Question</SelectItem>
                          <SelectItem value="billing">Billing Inquiry</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="Please describe your issue or question in detail..."
                        required
                      />
                    </div>

                    <GradientButton type="submit" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </GradientButton>
                  </form>
                </CardContent>
              </Card>

              {/* Additional Support Options */}
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Community Forum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Connect with other RankBet users and get help from the community.
                    </p>
                    <Button variant="outline" className="w-full bg-transparent">
                      Visit Forum
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Video Tutorials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Watch step-by-step guides on how to use RankBet features.
                    </p>
                    <Button variant="outline" className="w-full bg-transparent">
                      Watch Tutorials
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
