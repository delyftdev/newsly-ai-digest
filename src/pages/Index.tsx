import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, FileText, Users, Zap, ArrowRight, Star, Globe, Target, MessageSquare, BookOpen, TrendingUp, Clock, BarChart3, Lightbulb, AlertCircle, Rocket, Brain, Bot, Workflow, Settings, Send, Menu, X } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";
import DelyftLogo from "@/components/DelyftLogo";
import { useState } from "react";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="glass-nav fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <DelyftLogo size={32} className="text-white" />
                <span className="ml-3 text-xl font-bold text-white">Delyft</span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#agents" className="text-foreground/80 hover:text-primary transition-colors duration-200 text-sm font-medium">Agents</a>
                <a href="#features" className="text-foreground/80 hover:text-primary transition-colors duration-200 text-sm font-medium">Features</a>
                <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors duration-200 text-sm font-medium">Pricing</a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                Private Beta
              </Badge>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-foreground/80 hover:text-primary transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden glass-card mt-2 p-4 space-y-2">
              <a href="#agents" className="block text-foreground/80 hover:text-primary transition-colors py-2">Agents</a>
              <a href="#features" className="block text-foreground/80 hover:text-primary transition-colors py-2">Features</a>
              <a href="#pricing" className="block text-foreground/80 hover:text-primary transition-colors py-2">Pricing</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-6">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-4 py-2">
                🚀 AI GTM Squad - Now in Private Beta
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-balance">
              Deploy Your AI{' '}
              <span className="gradient-text">GTM Squad</span>
              <br />
              <span className="text-4xl md:text-6xl text-muted-foreground">Launch Features 10X Faster</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
              4 Specialized AI agents that handle content, publishing, personalization and feedback automation - 
              working in sync while you focus on strategy.
            </p>
            
            <div className="flex flex-col items-center space-y-6">
              <WaitlistForm />
              <p className="text-sm text-muted-foreground">
                Join squad leaders from Series A-C SaaS companies • No spam, ever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="glass-card p-8 md:p-12 border-red-500/20">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Manual GTM Processes Slow Launches & Drain Strategic Capacity
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Product-led growth teams waste <span className="text-red-400 font-semibold">weeks on execution</span> instead of focusing on strategy and growth. 
              <br />
              <span className="text-sm mt-4 block">Speed is now a competitive necessity for SaaS teams shipping features weekly</span>
            </p>
          </div>
        </div>
      </section>

      {/* AI Agent Showcase */}
      <section id="agents" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Your AI GTM Squad
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Specialized agents working as teammates, handling entire workflows while you focus on strategy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Content Generator Agent */}
            <div className="glass-card p-6 group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:from-blue-500/30 group-hover:to-blue-600/20 transition-all duration-300">
                <Bot className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Content Generator</h3>
              <p className="text-muted-foreground mb-6 text-center">From spec to polished changelog in 90 seconds</p>
              
              <div className="glass-card p-4 border-blue-500/20">
                <FileText className="h-6 w-6 text-blue-400 mb-3" />
                <div className="text-sm space-y-2">
                  <div className="text-muted-foreground">Multi-format templating</div>
                  <div className="text-xs text-blue-400">• Changelog • Blog • Newsletter</div>
                  <div className="text-xs text-blue-400">• Brand voice control</div>
                </div>
              </div>
            </div>
            
            {/* Omni-Publish Agent */}
            <div className="glass-card p-6 group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:from-green-500/30 group-hover:to-green-600/20 transition-all duration-300">
                <Send className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Omni-Publish</h3>
              <p className="text-muted-foreground mb-6 text-center">Customer-branded widgets that deploy with 1 click</p>
              
              <div className="glass-card p-4 border-green-500/20">
                <Globe className="h-6 w-6 text-green-400 mb-3" />
                <div className="text-sm space-y-2">
                  <div className="text-muted-foreground">Channel-specific publishing</div>
                  <div className="text-xs text-green-400">• Web • Email • Embeds</div>
                  <div className="text-xs text-green-400">• White-label branding</div>
                </div>
              </div>
            </div>
            
            {/* Outreach Agent */}
            <div className="glass-card p-6 group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-purple-600/20 transition-all duration-300">
                <MessageSquare className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Outreach Agent</h3>
              <p className="text-muted-foreground mb-6 text-center">CRM-powered emails drafted before your coffee brews</p>
              
              <div className="glass-card p-4 border-purple-500/20">
                <Users className="h-6 w-6 text-purple-400 mb-3" />
                <div className="text-sm space-y-2">
                  <div className="text-muted-foreground">Hyper-personalized comms</div>
                  <div className="text-xs text-purple-400">• CRM integration</div>
                  <div className="text-xs text-purple-400">• Behavior-triggered messaging</div>
                </div>
              </div>
            </div>
            
            {/* Feedback-Roadmap Agent */}
            <div className="glass-card p-6 group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:from-orange-500/30 group-hover:to-orange-600/20 transition-all duration-300">
                <Workflow className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Feedback-Roadmap</h3>
              <p className="text-muted-foreground mb-6 text-center">Automated Jira tickets with customer notifications built-in</p>
              
              <div className="glass-card p-4 border-orange-500/20">
                <BarChart3 className="h-6 w-6 text-orange-400 mb-3" />
                <div className="text-sm space-y-2">
                  <div className="text-muted-foreground">Feedback-to-roadmap pipeline</div>
                  <div className="text-xs text-orange-400">• Multi-source ingestion</div>
                  <div className="text-xs text-orange-400">• Sentiment-prioritized sync</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results & Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-12 border-primary/20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Launch Features 10X Faster with 50% Less Team Effort
              </h2>
              <p className="text-xl text-muted-foreground">
                Transform your GTM operations from weeks to days
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="glass-card p-6 border-cyan-500/20">
                  <Clock className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-cyan-400 mb-2">3 Weeks → 2 Days</div>
                  <p className="text-muted-foreground">Launch Operations Timeline</p>
                </div>
              </div>
              <div className="text-center">
                <div className="glass-card p-6 border-green-500/20">
                  <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-green-400 mb-2">50%</div>
                  <p className="text-muted-foreground">Less Manual Team Effort</p>
                </div>
              </div>
              <div className="text-center">
                <div className="glass-card p-6 border-primary/20">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-4xl font-bold text-primary mb-2">10X</div>
                  <p className="text-muted-foreground">Faster Feature Launches</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            Join Early Squad Leaders from Leading SaaS Companies
          </h2>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-2xl font-bold text-muted-foreground">Series A</div>
            <div className="text-2xl font-bold text-muted-foreground">Series B</div>
            <div className="text-2xl font-bold text-muted-foreground">Series C</div>
            <div className="text-2xl font-bold text-muted-foreground">Growth Stage</div>
          </div>
          <p className="mt-6 text-muted-foreground">
            Trusted by product-led growth teams shipping features weekly
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 text-center border-primary/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to build your{' '}
              <span className="gradient-text">AI GTM squad?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Deploy specialized agents that work while you sleep. Transform your product launches from manual processes to automated excellence.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-nav border-t border-white/[0.08] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <DelyftLogo size={24} className="text-white" />
              <span className="ml-3 text-lg font-bold text-white">Delyft</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 Delyft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
