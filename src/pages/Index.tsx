
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, FileText, Users, Zap, ArrowRight, Star, Globe, Target, MessageSquare, BookOpen, TrendingUp, Clock, BarChart3, Lightbulb, AlertCircle, Rocket, Brain } from "lucide-react";
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
                  <span className="block xl:inline">GTM Teams: Ship Campaigns</span>{' '}
                  <span className="block text-blue-600 xl:inline">Faster Than Your Engineering Ships Features</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  AI Agents that turn product specs into personalized comms, enablement & analytics - in 1 workflow. 
                  The AI Copilot That Helps GTM Teams Become 10X Faster.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="w-full sm:max-w-md">
                    <WaitlistForm />
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500 sm:text-center lg:text-left">
                  Join early adopters from Series A-C SaaS companies. No spam, ever.
                </p>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="GTM team collaboration"
          />
        </div>
      </div>

      {/* Problem Statement */}
      <div className="py-12 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Do your feature launches trigger Slack storms AND crickets?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            GTM teams waste <span className="font-bold text-red-600">68% of launch cycles</span> on manual coordination → generic comms → reactive firefighting
          </p>
          <p className="text-sm text-gray-500 mt-2">*Source: Gartner "GTM Inefficiency in SaaS", 2024</p>
        </div>
      </div>

      {/* 4-Panel Visual Demo */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              From Product Spec to Customer Success in One Workflow
            </h2>
            <p className="text-xl text-gray-600">
              Watch AI agents orchestrate your entire GTM process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">PMM Pastes Spec</h3>
              <p className="text-gray-600">Product requirements document gets uploaded</p>
              <div className="mt-4 bg-gray-100 rounded-lg p-4 text-left text-sm">
                <FileText className="h-6 w-6 text-gray-400 mb-2" />
                <div className="text-xs text-gray-500">Product Spec v2.1</div>
                <div className="font-mono text-xs">"New analytics dashboard with..."</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Generates Brief</h3>
              <p className="text-gray-600">Auto-briefing + video script creation</p>
              <div className="mt-4 bg-gray-100 rounded-lg p-4 text-left text-sm">
                <Brain className="h-6 w-6 text-green-500 mb-2" />
                <div className="text-xs text-gray-500">Generated Assets</div>
                <div className="text-xs">• Launch brief • Video script • Email templates</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">CSM Sends Behavioral Email</h3>
              <p className="text-gray-600">Hyper-personalized customer outreach</p>
              <div className="mt-4 bg-gray-100 rounded-lg p-4 text-left text-sm">
                <MessageSquare className="h-6 w-6 text-purple-500 mb-2" />
                <div className="text-xs text-gray-500">Personalized for Enterprise users</div>
                <div className="text-xs">"Based on your usage of reports..."</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Dashboard</h3>
              <p className="text-gray-600">Adoption analytics & insights</p>
              <div className="mt-4 bg-gray-100 rounded-lg p-4 text-left text-sm">
                <BarChart3 className="h-6 w-6 text-orange-500 mb-2" />
                <div className="text-xs text-gray-500">Adoption Rate: 87%</div>
                <div className="text-xs">↑ 42% higher than avg launch</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pain Points → Solutions */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              End Cross-Functional Chaos, Accelerate Feature Adoption
            </h2>
          </div>

          <div className="space-y-12">
            {/* Internal Alignment */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <Target className="h-12 w-12 text-red-500 mx-auto lg:mx-0 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Internal Alignment</h3>
                  <p className="text-gray-600 mb-4">
                    <span className="text-red-600 font-semibold">Pain:</span> Version chaos, stakeholder delays
                  </p>
                  <p className="text-gray-600">
                    <span className="text-green-600 font-semibold">Solution:</span> Instant stakeholder alignment
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                          AI Brief Generator
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Auto-generates stakeholder briefs from product specs with key messaging and positioning</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                          Approval Workflow Hub
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Centralized approval process with automated reminders and version control</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Creation */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <FileText className="h-12 w-12 text-red-500 mx-auto lg:mx-0 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Content Creation</h3>
                  <p className="text-gray-600 mb-4">
                    <span className="text-red-600 font-semibold">Pain:</span> Repurposing hell, brand inconsistency
                  </p>
                  <p className="text-gray-600">
                    <span className="text-green-600 font-semibold">Solution:</span> 1-click omnichannel content
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Zap className="h-5 w-5 mr-2 text-blue-500" />
                          Brand-Gov'd Repurposing Engine
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Creates emails, docs, slides, and social posts while maintaining brand consistency</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Star className="h-5 w-5 mr-2 text-purple-500" />
                          Dynamic Video Script Builder
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Generates video scripts optimized for different customer segments and use cases</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Comms */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <MessageSquare className="h-12 w-12 text-red-500 mx-auto lg:mx-0 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Comms</h3>
                  <p className="text-gray-600 mb-4">
                    <span className="text-red-600 font-semibold">Pain:</span> Generic blasts, manual personalization
                  </p>
                  <p className="text-gray-600">
                    <span className="text-green-600 font-semibold">Solution:</span> Hyper-personalized scaling
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                          Behavior-Triggered Composer
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Automatically personalizes messaging based on customer usage patterns and segment</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Users className="h-5 w-5 mr-2 text-indigo-500" />
                          CSM AI Copilot
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">AI assistant that helps CSMs craft perfect outreach for each customer's context</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Enablement */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <BookOpen className="h-12 w-12 text-red-500 mx-auto lg:mx-0 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Enablement</h3>
                  <p className="text-gray-600 mb-4">
                    <span className="text-red-600 font-semibold">Pain:</span> Reactive support, knowledge gaps
                  </p>
                  <p className="text-gray-600">
                    <span className="text-green-600 font-semibold">Solution:</span> Zero-day enablement
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-cyan-500" />
                          Auto-Knowledge Packager
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Creates help docs, training materials, and FAQs automatically from product specs</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Mail className="h-5 w-5 mr-2 text-orange-500" />
                          Feedback-to-FAQ Converter
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">Transforms customer questions into knowledge base articles proactively</p>
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
            Cut Campaign Time from Weeks → Hours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-200 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">90%</div>
              <p className="text-blue-200">Faster Campaign Deployment</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-200 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">42%</div>
              <p className="text-blue-200">Higher Feature Adoption</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-blue-200 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">10X</div>
              <p className="text-blue-200">GTM Team Productivity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Join Early Adopters from Leading SaaS Companies
          </h2>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Series A</div>
            <div className="text-2xl font-bold text-gray-400">Series B</div>
            <div className="text-2xl font-bold text-gray-400">Series C</div>
            <div className="text-2xl font-bold text-gray-400">Growth Stage</div>
          </div>
          <p className="mt-4 text-gray-600">
            Trusted by GTM teams at companies with frequent feature releases
          </p>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to 10X your GTM velocity?</span>
            <span className="block text-blue-200">Join the private beta today.</span>
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
