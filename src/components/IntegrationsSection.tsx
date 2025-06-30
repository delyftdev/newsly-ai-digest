
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

const AnimatedConfluenceIcon = () => (
  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform">
    <span className="text-white font-bold text-xs">C</span>
  </div>
);

const AnimatedGmailIcon = () => (
  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center transform hover:bounce transition-transform">
    <span className="text-white font-bold text-xs">@</span>
  </div>
);

const IntegrationsSection = () => {
  const integrations = [
    { name: 'GitHub', logo: AnimatedGitHubIcon },
    { name: 'Jira', logo: AnimatedJiraIcon },
    { name: 'Confluence', logo: AnimatedConfluenceIcon },
    { name: 'Gmail', logo: AnimatedGmailIcon },
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
              className="flex flex-col items-center p-8 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
