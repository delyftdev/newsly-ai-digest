
import React from 'react';

const CompanyLogosSection = () => {
  const companies = [
    { name: 'Slack', logo: '💬' },
    { name: 'Notion', logo: '📝' },
    { name: 'Linear', logo: '📊' },
    { name: 'GitHub', logo: '🐙' },
    { name: 'Figma', logo: '🎨' },
    { name: 'Discord', logo: '🎮' },
    { name: 'Intercom', logo: '💬' },
    { name: 'Zendesk', logo: '🎫' },
    { name: 'Stripe', logo: '💳' },
    { name: 'Shopify', logo: '🛍️' },
    { name: 'Airtable', logo: '📋' },
    { name: 'Calendly', logo: '📅' },
  ];

  // Duplicate the array for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="py-8 px-4 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Trusted by teams at companies like
        </p>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {duplicatedCompanies.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex-shrink-0 mx-8 flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="text-2xl">{company.logo}</span>
                <span className="text-sm font-medium whitespace-nowrap">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default CompanyLogosSection;
