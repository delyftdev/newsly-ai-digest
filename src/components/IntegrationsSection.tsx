
import React from 'react';

const GitHubLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-white">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const JiraLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M11.53 2c0 2.4 1.97 4.37 4.37 4.37h.84l-.84.84c-2.59 2.59-2.59 6.78 0 9.37 2.4 0 4.37-1.97 4.37-4.37V2h-8.74z" fill="#2684FF"/>
    <path d="M2 11.53c2.4 0 4.37 1.97 4.37 4.37v.84l.84-.84c2.59-2.59 6.78-2.59 9.37 0 0-2.4-1.97-4.37-4.37-4.37H2z" fill="#2684FF"/>
  </svg>
);

const ConfluenceLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M1.51 5.82c.65-.89 1.93-.89 2.58 0l8.99 12.24c.89 1.21 2.56 1.5 3.77.61.14-.1.27-.22.37-.36l1.83-2.49c.65-.89.65-2.09 0-2.98L9.06 1.61c-.89-1.21-2.56-1.5-3.77-.61-.14.1-.27.22-.37.36L2.88 3.85c-.89 1.21-.6 2.88.61 3.77.02.01.03.02.05.03z" fill="#2684FF"/>
    <path d="M22.49 18.18c-.65.89-1.93.89-2.58 0L11.92 5.94c-.89-1.21-2.56-1.5-3.77-.61-.14.1-.27.22-.37.36l-1.83 2.49c-.65.89-.65 2.09 0 2.98l8.99 12.24c.89 1.21 2.56 1.5 3.77.61.14-.1.27-.22.37-.36l2.04-2.78c.89-1.21.6-2.88-.61-3.77-.02-.01-.03-.02-.05-.03z" fill="#2684FF"/>
  </svg>
);

const GmailLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
  </svg>
);

const IntegrationsSection = () => {
  const integrations = [
    { name: 'GitHub', logo: GitHubLogo },
    { name: 'Jira', logo: JiraLogo },
    { name: 'Confluence', logo: ConfluenceLogo },
    { name: 'Gmail', logo: GmailLogo },
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
