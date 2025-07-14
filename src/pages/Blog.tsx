
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const blogPosts = [
    {
      title: "The Hidden Cost of Poor Customer Communication",
      excerpt: "How ineffective release communications can cost your company millions in churn and missed opportunities.",
      author: "Alex Chen",
      date: "Dec 15, 2024",
      category: "Strategy",
      readTime: "5 min read",
      featured: true
    },
    {
      title: "AI-Powered Content Creation: The Future of Release Notes",
      excerpt: "Discover how artificial intelligence is transforming the way teams create and distribute product updates.",
      author: "Sarah Kim",
      date: "Dec 12, 2024",
      category: "Technology",
      readTime: "7 min read",
      featured: false
    },
    {
      title: "Building a Customer-Centric Changelog Strategy",
      excerpt: "Learn how to craft changelog entries that your customers will actually read and appreciate.",
      author: "Mike Rodriguez",
      date: "Dec 10, 2024",
      category: "Best Practices",
      readTime: "6 min read",
      featured: false
    },
    {
      title: "From Feedback to Feature: Closing the Product Loop",
      excerpt: "A comprehensive guide to collecting, prioritizing, and acting on customer feedback effectively.",
      author: "Emily Watson",
      date: "Dec 8, 2024",
      category: "Product Management",
      readTime: "8 min read",
      featured: false
    },
    {
      title: "The Psychology of Product Announcements",
      excerpt: "Understanding the cognitive biases that influence how customers perceive and react to product updates.",
      author: "Alex Chen",
      date: "Dec 5, 2024",
      category: "Psychology",
      readTime: "4 min read",
      featured: false
    }
  ];

  const categories = ["All", "Strategy", "Technology", "Best Practices", "Product Management", "Psychology"];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Insights on
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> customer communication</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Strategies, best practices, and insights from our team and the broader product community.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <Button 
                key={index} 
                variant={index === 0 ? "default" : "outline"} 
                size="sm"
                className={index === 0 ? "bg-primary text-primary-foreground" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {blogPosts.filter(post => post.featured).map((post, index) => (
            <div key={index} className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-16 border border-primary/20">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Featured</span>
                  <span className="text-primary font-medium">{post.category}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{post.title}</h2>
                <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <article key={index} className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
                <div className="mb-4">
                  <span className="text-primary text-sm font-medium">{post.category}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="ghost" size="sm" className="p-0 h-auto font-medium text-primary hover:text-primary/80">
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
