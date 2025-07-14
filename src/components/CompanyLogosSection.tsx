
import React from 'react';
import SlackLogo from '@/components/logos/SlackLogo';
import NotionLogo from '@/components/logos/NotionLogo';
import LinearLogo from '@/components/logos/LinearLogo';
import GitHubLogo from '@/components/logos/GitHubLogo';
import FigmaLogo from '@/components/logos/FigmaLogo';
import DiscordLogo from '@/components/logos/DiscordLogo';
import IntercomLogo from '@/components/logos/IntercomLogo';
import ZendeskLogo from '@/components/logos/ZendeskLogo';

const CompanyLogosSection = () => {
  const companies = [
    { name: 'Slack', logo: SlackLogo },
    { name: 'Notion', logo: NotionLogo },
    { name: 'Linear', logo: LinearLogo },
    { name: 'GitHub', logo: GitHubLogo },
    { name: 'Figma', logo: FigmaLogo },
    { name: 'Discord', logo: DiscordLogo },
    { name: 'Intercom', logo: IntercomLogo },
    { name: 'Zendesk', logo: ZendeskLogo },
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
                <company.logo size={24} className="text-current" />
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
