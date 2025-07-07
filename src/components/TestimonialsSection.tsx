
import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Finally, a tool that actually understands how customer communication should work. Our release announcements now get 3x more engagement.",
      author: "Sarah Chen",
      role: "Head of Product",
      company: "TechFlow",
      avatar: "SC",
      rating: 5
    },
    {
      quote: "The AI categorization is incredible. What used to take hours of manual sorting now happens instantly. Game changer for our team.",
      author: "Marcus Rodriguez",
      role: "Customer Success Manager",
      company: "DataSync",
      avatar: "MR",
      rating: 5
    },
    {
      quote: "Love how it turns our technical release notes into customer-friendly updates. Our users actually read our changelogs now!",
      author: "Emily Watson",
      role: "Product Marketing Manager",
      company: "CloudBase",
      avatar: "EW",
      rating: 5
    }
  ];

  return (
    <section className="py-24 px-4 bg-muted/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            What customers are saying
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how teams are transforming their customer communication
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <blockquote className="text-lg text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
