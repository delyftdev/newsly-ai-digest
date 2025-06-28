
import { Inbox, Edit, MessageCircle, BarChart3 } from "lucide-react";

const ValuePropsSection = () => {
  const valueProps = [
    {
      icon: Inbox,
      title: "Smart Inbox for All Customer Updates",
      benefit: "Find what you need instantly. Stop losing great ideas.",
      description: "Auto-organize every release note, announcement, or idea in one searchable inbox. No more hunting through docs, emails, and chats.",
      placeholder: "📥 Smart organization demo"
    },
    {
      icon: Edit,
      title: "AI Editor for On-Brand Content", 
      benefit: "Send updates customers actually read. No more robotic emails.",
      description: "Tweak drafts to match your brand's voice and customer's tone — then publish as changelogs or widgets.",
      placeholder: "✨ AI content editor demo"
    },
    {
      icon: MessageCircle,
      title: "Feedback Hub with Public Voting",
      benefit: "Close the loop faster. Show customers you're listening.",
      description: "Let customers and teammates submit, vote, and see how ideas are progressing.",
      placeholder: "🗳️ Feedback voting demo"
    },
    {
      icon: BarChart3,
      title: "Content Insights Dashboard",
      benefit: "See what's working. Stop wasting time on what's not.",
      description: "Check open rates, clicks, and reactions for every update you send.",
      placeholder: "📊 Analytics dashboard demo"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need for customer-focused releases
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform how you communicate with customers and build products they love
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {valueProps.map((prop, index) => (
            <div 
              key={index} 
              className="group bg-card border border-border rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-primary/30"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <prop.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{prop.title}</h3>
                  <p className="text-primary font-medium mb-3">{prop.benefit}</p>
                </div>
              </div>
              
              <div className="bg-accent/50 rounded-lg p-6 mb-4 text-center text-muted-foreground">
                {prop.placeholder}
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropsSection;
