
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Careers = () => {
  const openRoles = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Join our team to build beautiful, performant user interfaces that delight our customers."
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Shape the future of customer communication through thoughtful design and user research."
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      description: "Help our customers achieve success and drive product adoption across enterprise accounts."
    },
    {
      title: "AI/ML Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build and improve our AI-powered content generation and analysis capabilities."
    }
  ];

  const benefits = [
    "Competitive salary and equity",
    "Comprehensive health, dental, and vision insurance",
    "Unlimited PTO and flexible working hours",
    "Remote-first culture with optional office access",
    "Learning and development budget",
    "Top-tier equipment and home office setup"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Join us in building the
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> future of customer communication</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're looking for passionate, talented individuals who want to make a meaningful impact on how companies communicate with their customers.
          </p>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Delyft?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Rapid Growth</h3>
              <p className="text-muted-foreground">Join a fast-growing company with massive market opportunity and room for career advancement.</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Impact</h3>
              <p className="text-muted-foreground">Your work will directly impact thousands of companies and millions of their customers.</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Team</h3>
              <p className="text-muted-foreground">Work with a world-class team of engineers, designers, and product experts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          <div className="space-y-6">
            {openRoles.map((role, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{role.title}</h3>
                    <p className="text-muted-foreground mb-4">{role.description}</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">Apply Now</Button>
                </div>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{role.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{role.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{role.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
