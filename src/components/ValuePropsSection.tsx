import { useEffect, useRef, useState } from "react";
import { Inbox, Edit, MessageCircle, BarChart3 } from "lucide-react";
import FeedbackSvg from "./FeedbackSvg";
import InsightsSvg from "./InsightsSvg";
import ChangelogSvg from "./ChangelogSvg";
import SmartInboxSvg from "./SmartInboxSvg";

const ValuePropsSection = () => {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const valueProps = [
    {
      icon: Inbox,
      title: "Smart Inbox",
      benefit: "Find what you need instantly. Stop losing great ideas.",
      description: "Auto-organize every release note, announcement, or idea in one searchable inbox. No more hunting through docs, emails, and chats.",
      useSvg: true,
      highlightWords: ["instantly"],
      position: "left"
    },
    {
      icon: Edit,
      title: "Changelog", 
      benefit: "Send updates customers actually read. No more robotic emails.",
      description: "Tweak drafts to match your brand's voice and customer's tone — then publish as changelogs or widgets.",
      useSvg: true,
      highlightWords: ["actually read"],
      position: "right"
    },
    {
      icon: MessageCircle,
      title: "Feedback",
      benefit: "Close the loop faster. Show customers you're listening.",
      description: "Let customers and teammates submit, vote, and see how ideas are progressing.",
      useSvg: true,
      highlightWords: ["Close the loop"],
      position: "left"
    },
    {
      icon: BarChart3,
      title: "Insights",
      benefit: "See what's working. Stop wasting time on what's not.",
      description: "Check open rates, clicks, and reactions for every update you send.",
      useSvg: true,
      highlightWords: ["working"],
      position: "right"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionIndex = parseInt(entry.target.getAttribute('data-section') || '0');
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, sectionIndex]));
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const highlightText = (text: string, highlightWords: string[]) => {
    if (!highlightWords || highlightWords.length === 0) return text;
    
    let highlightedText = text;
    highlightWords.forEach((word) => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        `<span class="highlight-glow">$1</span>`
      );
    });
    
    return highlightedText;
  };

  return (
    <>
      <style>{`
        .highlight-glow {
          background: linear-gradient(135deg, #10b981, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          font-weight: 700;
        }
        
        .highlight-glow::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #10b981, #22d3ee);
          filter: blur(8px);
          opacity: 0.3;
          z-index: -1;
        }
        
        .section-animate {
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .section-visible {
          opacity: 1;
          transform: translateY(0px);
        }
        
        .section-hidden {
          opacity: 0;
          transform: translateY(40px);
        }
        
        .svg-container {
          transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: center;
        }
        
        .svg-visible {
          opacity: 1;
          transform: scale(1);
        }
        
        .svg-hidden {
          opacity: 0;
          transform: scale(0.95);
        }
        
        .text-slide-left {
          animation: slideInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .text-slide-right {
          animation: slideInRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .glow-pulse {
          animation: glowPulse 2s ease-in-out infinite;
        }
        
        @keyframes glowPulse {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.6));
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(16, 185, 129, 0.8));
          }
        }
      `}</style>

      <section className="py-8 px-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Everything you need for{" "}
            <span className="highlight-glow">customer-focused releases</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Transform how you communicate with customers and build products they love
          </p>
        </div>

        {/* Feature Sections */}
        {valueProps.map((prop, index) => (
          <div
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)}
            data-section={index}
            className={`min-h-screen flex items-center py-20 section-animate ${
              visibleSections.has(index) ? 'section-visible' : 'section-hidden'
            }`}
          >
            <div className="max-w-7xl mx-auto w-full">
              <div className={`grid lg:grid-cols-2 gap-16 items-center ${
                prop.position === 'right' ? 'lg:grid-flow-col-dense' : ''
              }`}>
                
                {/* Text Content */}
                <div className={`space-y-8 ${
                  prop.position === 'right' ? 'lg:col-start-2' : ''
                } ${
                  visibleSections.has(index) 
                    ? prop.position === 'right' 
                      ? 'text-slide-right' 
                      : 'text-slide-left'
                    : 'opacity-0'
                }`}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center glow-pulse ${
                      visibleSections.has(index) ? 'animate-bounce' : ''
                    }`}>
                      <prop.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                      {prop.title}
                    </h3>
                  </div>
                  
                  <div 
                    className="text-2xl md:text-3xl font-semibold leading-relaxed mb-6"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(prop.benefit, prop.highlightWords)
                    }}
                  />
                  
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                    {prop.description}
                  </p>
                </div>

                {/* SVG/Visual Content */}
                <div className={`${
                  prop.position === 'right' ? 'lg:col-start-1 lg:row-start-1' : ''
                } svg-container ${
                  visibleSections.has(index) ? 'svg-visible' : 'svg-hidden'
                }`}>
                  <div className="relative">
                    {prop.useSvg ? (
                      <div className="w-full max-w-4xl mx-auto">
                        {prop.title === "Smart Inbox" ? (
                          <SmartInboxSvg />
                        ) : prop.title === "Feedback" ? (
                          <FeedbackSvg />
                        ) : prop.title === "Changelog" ? (
                          <ChangelogSvg />
                        ) : (
                          <InsightsSvg />
                        )}
                      </div>
                    ) : (
                      <div className="bg-accent/30 rounded-3xl p-12 text-center text-muted-foreground min-h-[400px] flex items-center justify-center border border-primary/20">
                        <div className="text-4xl md:text-6xl font-light">
                          {prop.placeholder}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default ValuePropsSection;
