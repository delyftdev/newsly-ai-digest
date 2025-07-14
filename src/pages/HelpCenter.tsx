
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Book, MessageCircle, FileText, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HelpCenter = () => {
  const categories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics and set up your account",
      articles: 12
    },
    {
      icon: Settings,
      title: "Account & Billing",
      description: "Manage your subscription and billing settings",
      articles: 8
    },
    {
      icon: FileText,
      title: "Creating Content",
      description: "Write and publish changelogs and announcements",
      articles: 15
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Invite team members and manage permissions",
      articles: 6
    },
    {
      icon: MessageCircle,
      title: "Integrations",
      description: "Connect Delyft with your favorite tools",
      articles: 10
    },
    {
      icon: Settings,
      title: "Advanced Features",
      description: "Analytics, automation, and enterprise features",
      articles: 9
    }
  ];

  const popularArticles = [
    "How to create your first changelog",
    "Setting up team permissions",
    "Integrating with Slack",
    "Understanding analytics and metrics",
    "Customizing your changelog design"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            How can we
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> help you?</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to your questions, learn how to use Delyft effectively, and get the most out of our platform.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for help articles, tutorials, and guides..."
              className="pl-12 py-6 text-lg border-border focus:border-primary"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.articles} articles</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Articles</h2>
          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <div key={index} className="bg-card rounded-lg p-4 border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-foreground hover:text-primary transition-colors">{article}</span>
                  <Button variant="ghost" size="sm">Read →</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Still need help?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Contact Support
            </Button>
            <Button variant="outline" size="lg">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpCenter;
