
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Target, Lightbulb } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Customer-First",
      description: "Everything we build starts with understanding what customers truly need from product communications."
    },
    {
      icon: Target,
      title: "Simplicity",
      description: "We believe the best tools are the ones that get out of your way and let you focus on what matters."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We're constantly pushing the boundaries of what's possible with AI and automation."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            We're building the future of
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> customer communication</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Founded in 2024, Delyft was born from the frustration of seeing great products fail to communicate their value to customers effectively.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-lg mb-6">
              After years of working at fast-growing startups, we noticed a pattern: amazing products were struggling to keep their customers informed about updates, new features, and improvements. Teams were spending countless hours crafting emails, writing changelog entries, and managing feedback—but the results were often disappointing.
            </p>
            <p className="text-lg mb-6">
              We realized that customer communication shouldn't be an afterthought. It should be as thoughtful and strategic as the products themselves. That's why we built Delyft—to give teams the tools they need to communicate with their customers in a way that's both efficient and engaging.
            </p>
            <p className="text-lg">
              Today, we're helping hundreds of companies transform how they communicate with their customers, turning routine updates into opportunities for deeper engagement and loyalty.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
