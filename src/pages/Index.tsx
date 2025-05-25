
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Brain, Search, Share, Zap, Shield } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { useAuthStore } from "@/stores/authStore";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const { user } = useAuthStore();

  if (user) {
    return <Dashboard />;
  }

  const features = [
    {
      icon: Mail,
      title: "Dynamic Email Generation",
      description: "Get a unique email address to forward all your newsletters to one organized inbox."
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI categorizes and summarizes content automatically, extracting key insights."
    },
    {
      icon: Search,
      title: "Smart Organization",
      description: "Search, filter, and browse your newsletter content with intelligent categorization."
    },
    {
      icon: Share,
      title: "Shareable Glossaries",
      description: "Create public pages to share your curated newsletter insights with others."
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Emails are processed instantly with immediate AI analysis and categorization."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and secure with enterprise-grade protection."
    }
  ];

  const handleAuthOpen = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">NewsletterAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => handleAuthOpen('login')}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => handleAuthOpen('signup')}
              className="bg-primary hover:bg-primary-600 text-white"
            >
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <Badge className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">
            🚀 AI-Powered Newsletter Organization
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Newsletter Chaos Into
            <span className="text-primary block mt-2">Organized Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Aggregate all your newsletters in one place, let AI analyze and categorize content automatically, 
            and create shareable glossaries of product updates and insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handleAuthOpen('signup')}
              className="bg-primary hover:bg-primary-600 text-white px-8 py-3 text-lg"
            >
              Start Organizing Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Master Newsletter Content
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to transform how you consume and organize newsletter content.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-white/50 rounded-3xl mx-4 my-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Get started in minutes with our simple 3-step process.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Sign Up & Get Your Email</h3>
            <p className="text-gray-600">
              Create your account and receive a unique forwarding email address for all your newsletters.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Forward Your Newsletters</h3>
            <p className="text-gray-600">
              Update your newsletter subscriptions to use your new forwarding email address.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Does the Rest</h3>
            <p className="text-gray-600">
              Watch as AI automatically categorizes, summarizes, and organizes all your content.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Organize Your Newsletter Inbox?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of professionals who've transformed their newsletter consumption.
          </p>
          <Button 
            size="lg" 
            onClick={() => handleAuthOpen('signup')}
            className="bg-primary hover:bg-primary-600 text-white px-8 py-3 text-lg"
          >
            Start Your Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900 font-semibold">NewsletterAI</span>
          </div>
          <p className="text-center text-gray-600 mt-4">
            © 2024 NewsletterAI. All rights reserved.
          </p>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        mode={authMode}
      />
    </div>
  );
};

export default Index;
