
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, FileText, Users, Zap, ArrowRight, Star, Globe, Target, MessageSquare, BookOpen, TrendingUp, Clock, BarChart3, Lightbulb, AlertCircle, Rocket, Brain, Bot, Workflow, Settings, Send } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Rocket className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Delyft</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Private Beta
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Deploy Your AI GTM Squad:</span>{' '}
                  <span className="block text-blue-600 xl:inline">4 Specialized Agents That Launch Features 10X Faster</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Content, publishing, personalization and feedback automation - working in sync while you sleep.
                  AI agents as specialized teammates, not just tools.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="w-full sm:max-w-md">
                    <WaitlistForm />
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500 sm:text-center lg:text-left">
                  Join early squad leaders from Series A-C SaaS companies. No spam, ever.
                </p>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="AI GTM squad collaboration"
          />
        </div>
      </div>

      {/* Problem Statement */}
      <div className="py-12 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Manual GTM Processes Slow Launches & Drain Strategic Capacity
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Product-led growth teams waste <span className="font-bold text-red-600">weeks on execution</span> instead of focusing on strategy and growth
          </p>
          <p className="text-sm text-gray-500 mt-2">Speed is now a competitive necessity for SaaS teams shipping features weekly</p>
        </div>
      </div>

      {/* AI Agent Showcase */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Meet Your AI GTM Squad: Specialized Agents Working as Teammates
            </h2>
            <p className="text-xl text-gray-600">
              Each agent handles entire workflows while you focus on strategy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Content Generator Agent</h3>
              <p className="text-gray-600 mb-4">From spec to polished changelog in 90 seconds</p>
              <div className="mt-4 bg-gray-100 rounded-lg p-4 text-left text-sm">
                <FileText className="h-6 w-6 text-blue-500 mb-2" />
                <div className="text-xs text-gray-500">Multi-format templating</div>
                <div className="text-xs">• Changelog • Blog • Newsletter</div>
                <div className="text-xs">• Brand voice control</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Omni-Publish Agent</h3>
              <p className="text-gray-600 mb-4">Customer-branded widgets that deploy with 1 click</p>
              <div className="mt-4 bg-gray-100 rounded-lg p-4 text-left text-sm">
                <Globe className="h-6 w-6 text-green-500 mb-2" />
                <div className="text-xs text-gray-500">Channel-specific publishing</div>
                <div className="text-xs">• Web • Email • Embeds</div>
                <div className="text-xs">• White-label branding</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Outreach Agent</h3>
              <p className="text-gray-600 mb-4">CRM-powered emails drafted before your coffee brews</p>
              <div className="mt-4 bg-gray-100 rounded-lg p-4 text-left text-sm">
                <Users className="h-6 w-6 text-purple-500 mb-2" />
                <div className="text-xs text-gray-500">Hyper-personalized comms</div>
                <div className="text-xs">• CRM integration</div>
                <div className="text-xs">• Behavior-triggered messaging</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Workflow className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Feedback-Roadmap Agent</h3>
              <p className="text-gray-600 mb-4">Automated Jira tickets with customer notifications built-in</p>
              <div className="mt-4 bg-gray-100 rounded-lg p-4 text-left text-sm">
                <BarChart3 className="h-6 w-6 text-orange-500 mb-2" />
                <div className="text-xs text-gray-500">Feedback-to-roadmap pipeline</div>
                <div className="text-xs">• Multi-source ingestion</div>
                <div className="text-xs">• Sentiment-prioritized sync</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent-Specific Pain Points → Solutions */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Each Agent Solves Core GTM Pain Points
            </h2>
            <p className="text-xl text-gray-600 mt-4">Modular "pay for what you automate" approach</p>
          </div>

          <div className="space-y-12">
            {/* Content Generator Agent */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <Bot className="h-12 w-12 text-blue-500 mx-auto lg:mx-0 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Content Generator Agent</h3>
                  <p className="text-gray-600 mb-4">
                    <span className="text-red-600 font-semibold">Pain:</span> Manual repurposing, brand inconsistency
                  </p>
                  <p className="text-gray-600">
                    <span className="text-green-600 font-semibold">Solution:</span> Instant, on-brand content generation
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-blue-500" />
                          Multi-Format Templating
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Generates changelog, blog posts, and newsletter content from single product spec</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Settings className="h-5 w-5 mr-2 text-purple-500" />
                          Brand Voice Control
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Compliance guardrails ensure consistent brand voice across all generated content</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Omni-Publish Agent */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <Send className="h-12 w-12 text-green-500 mx-auto lg:mx-0 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Omni-Publish Agent</h3>
                  <p className="text-gray-600 mb-4">
                    <span className="text-red-600 font-semibold">Pain:</span> Fragmented publishing, manual customization
                  </p>
                  <p className="text-gray-600">
                    <span className="text-green-600 font-semibold">Solution:</span> 1-click publishing with customer branding
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-green-500" />
                          Channel-Specific Auto-Publish
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Automatically formats and publishes to web, email, and embed channels</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Star className="h-5 w-5 mr-2 text-cyan-500" />
                          White-Label Embeds
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Custom CSS injection for perfect brand integration in customer-facing widgets</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Outreach Agent */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <MessageSquare className="h-12 w-12 text-purple-500 mx-auto lg:mx-0 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Outreach Agent</h3>
                  <p className="text-gray-600 mb-4">
                    <span className="text-red-600 font-semibold">Pain:</span> Generic mass emails, manual personalization
                  </p>
                  <p className="text-gray-600">
                    <span className="text-green-600 font-semibold">Solution:</span> Hyper-personalized comms at scale
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Users className="h-5 w-5 mr-2 text-purple-500" />
                          CRM-Integrated Draft Generator
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Pulls customer data to generate personalized outreach drafts automatically</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
                          Behavior-Triggered Messaging
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Usage-based messaging that responds to customer behavior patterns</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback-Roadmap Agent */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <Workflow className="h-12 w-12 text-orange-500 mx-auto lg:mx-0 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Feedback-Roadmap Agent</h3>
                  <p className="text-gray-600 mb-4">
                    <span className="text-red-600 font-semibold">Pain:</span> Slow feedback aggregation, poor visibility
                  </p>
                  <p className="text-gray-600">
                    <span className="text-green-600 font-semibold">Solution:</span> Automated feedback-to-roadmap pipeline
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-orange-500" />
                          Multi-Source Ingestion
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Aggregates feedback from Gong, Grain, Zendesk and other sources automatically</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                          Sentiment-Prioritized Jira Sync
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Auto-creates prioritized Jira tickets with customer notifications when items ship</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results & Benefits */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-8">
            Launch Features 10X Faster with 50% Less Team Effort
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-200 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">3 Weeks → 2 Days</div>
              <p className="text-blue-200">Launch Operations Timeline</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-200 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">50%</div>
              <p className="text-blue-200">Less Manual Team Effort</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 text-blue-200 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">10X</div>
              <p className="text-blue-200">Faster Feature Launches</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Join Early Squad Leaders from Leading SaaS Companies
          </h2>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Series A</div>
            <div className="text-2xl font-bold text-gray-400">Series B</div>
            <div className="text-2xl font-bold text-gray-400">Series C</div>
            <div className="text-2xl font-bold text-gray-400">Growth Stage</div>
          </div>
          <p className="mt-4 text-gray-600">
            Trusted by product-led growth teams shipping features weekly
          </p>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to build your AI GTM squad?</span>
            <span className="block text-blue-200">Deploy specialized agents that work while you sleep.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Rocket className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-bold text-gray-900">Delyft</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 Delyft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
