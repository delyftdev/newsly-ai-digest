
import React from 'react';

const AnimatedGitHubIcon = () => (
  <div className="w-8 h-8 bg-gray-800 dark:bg-white rounded-full flex items-center justify-center transition-transform hover:scale-110">
    <span className="text-white dark:text-gray-800 font-bold text-sm">GH</span>
  </div>
);

const AnimatedJiraIcon = () => (
  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center transform hover:rotate-6 transition-transform">
    <span className="text-white font-bold text-xs">J</span>
  </div>
);

const AnimatedSlackIcon = () => (
  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform">
    <span className="text-white font-bold text-xs">#</span>
  </div>
);

const AnimatedNotionIcon = () => (
  <div className="w-8 h-8 bg-black dark:bg-white rounded flex items-center justify-center transform hover:rotate-12 transition-transform">
    <span className="text-white dark:text-black font-bold text-xs">N</span>
  </div>
);

const AnimatedLinearIcon = () => (
  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform">
    <span className="text-white font-bold text-xs">L</span>
  </div>
);

const AnimatedFigmaIcon = () => (
  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform">
    <span className="text-white font-bold text-xs">F</span>
  </div>
);

const AnimatedDiscordIcon = () => (
  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center transform hover:bounce transition-transform">
    <span className="text-white font-bold text-xs">D</span>
  </div>
);

const AnimatedIntercomIcon = () => (
  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
    <span className="text-white font-bold text-xs">I</span>
  </div>
);

const IntegrationsSection = () => {
  const integrations = [
    { name: 'GitHub', logo: AnimatedGitHubIcon, delay: '0ms' },
    { name: 'Jira', logo: AnimatedJiraIcon, delay: '100ms' },
    { name: 'Slack', logo: AnimatedSlackIcon, delay: '200ms' },
    { name: 'Notion', logo: AnimatedNotionIcon, delay: '300ms' },
    { name: 'Linear', logo: AnimatedLinearIcon, delay: '400ms' },
    { name: 'Figma', logo: AnimatedFigmaIcon, delay: '500ms' },
    { name: 'Discord', logo: AnimatedDiscordIcon, delay: '600ms' },
    { name: 'Intercom', logo: AnimatedIntercomIcon, delay: '700ms' },
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
                <integration.logo />
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
