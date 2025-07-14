
import React from 'react';
import GitHubLogo from '@/components/logos/GitHubLogo';
import SlackLogo from '@/components/logos/SlackLogo';
import NotionLogo from '@/components/logos/NotionLogo';
import IntercomLogo from '@/components/logos/IntercomLogo';
import JiraLogo from '@/components/logos/JiraLogo';
import LinearLogo from '@/components/logos/LinearLogo';
import FigmaLogo from '@/components/logos/FigmaLogo';
import DiscordLogo from '@/components/logos/DiscordLogo';

const IntegrationsSection = () => {
  const integrations = [
    { name: 'GitHub', logo: GitHubLogo, delay: '0ms' },
    { name: 'Jira', logo: JiraLogo, delay: '100ms' },
    { name: 'Slack', logo: SlackLogo, delay: '200ms' },
    { name: 'Notion', logo: NotionLogo, delay: '300ms' },
    { name: 'Linear', logo: LinearLogo, delay: '400ms' },
    { name: 'Figma', logo: FigmaLogo, delay: '500ms' },
    { name: 'Discord', logo: DiscordLogo, delay: '600ms' },
    { name: 'Intercom', logo: IntercomLogo, delay: '700ms' },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Connects with your existing workflow
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Seamlessly integrate with the tools your team already uses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {integrations.map((integration, index) => (
            <div 
              key={integration.name}
              className="flex flex-col items-center p-8 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
              style={{
                animationDelay: integration.delay,
                animationFillMode: 'both'
              }}
            >
              <div className="mb-6">
                <integration.logo size={32} className="text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{integration.name}</h3>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-3 px-8 py-4 bg-card border border-border rounded-full hover:bg-accent/50 transition-colors">
            <span className="text-3xl">⚡</span>
            <span className="text-lg font-medium text-foreground">Plus 5,000+ apps through Zapier</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
