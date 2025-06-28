
import React from 'react';

const IntegrationsSection = () => {
  const integrations = [
    { name: 'GitHub', logo: '🐙' },
    { name: 'Jira', logo: '🔷' },
    { name: 'Confluence', logo: '🌐' },
    { name: 'Gmail', logo: '📧' },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Connects with your existing workflow
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Seamlessly integrate with the tools your team already uses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {integrations.map((integration, index) => (
            <div 
              key={integration.name}
              className="flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">{integration.logo}</div>
              <h3 className="font-semibold text-foreground">{integration.name}</h3>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-card border border-border rounded-full">
            <span className="text-2xl">⚡</span>
            <span className="font-medium text-foreground">Plus 5,000+ apps through Zapier</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
