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
      position: "left",
      id: "smart-inbox"
    },
    {
      icon: Edit,
      title: "Changelog", 
      benefit: "Send updates customers actually read. No more robotic emails.",
      description: "Tweak drafts to match your brand's voice and customer's tone — then publish as changelogs or widgets.",
      useSvg: true,
      highlightWords: ["actually read"],
      position: "right",
      id: "changelog"
    },
    {
      icon: MessageCircle,
      title: "Feedback",
      benefit: "Close the loop faster. Show customers you're listening.",
      description: "Let customers and teammates submit, vote, and see how ideas are progressing.",
      useSvg: true,
      highlightWords: ["Close the loop"],
      position: "left",
      id: "feedback"
    },
    {
      icon: BarChart3,
      title: "Insights",
      benefit: "See what's working. Stop wasting time on what's not.",
      description: "Check open rates, clicks, and reactions for every update you send.",
      useSvg: true,
      highlightWords: ["working"],
      position: "right",
      id: "insights"
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
        threshold: 0.2,
        rootMargin: '-20% 0px -20% 0px'
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
          font-weight: 600;
        }
        
        .section-animate {
          transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .section-visible {
          opacity: 1;
          transform: translateY(0px);
        }
        
        .section-hidden {
          opacity: 0;
          transform: translateY(60px);
        }
        
        .svg-container {
          transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: center;
        }
        
        .svg-visible {
          opacity: 1;
          transform: scale(1);
        }
        
        .svg-hidden {
          opacity: 0;
          transform: scale(0.92);
        }
        
        .text-slide-left {
          animation: slideInLeft 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .text-slide-right {
          animation: slideInRight 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto text-center mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Customer communication{" "}
            <span className="highlight-glow">shouldn't be this hard</span>
          </h2>
          <div className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed space-y-4">
            <p>Your team spends hours crafting customer updates, going back and forth between product and design just to get content right. The result?</p>
            <p className="font-medium">Delayed communications and confused customers.</p>
            <p>It's not anyone's fault. Streamlining customer communication has always been tough. Until now.</p>
          </div>
        </div>

        {valueProps.map((prop, index) => (
          <div
            key={index}
            id={prop.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            data-section={index}
            className={`py-32 flex items-center section-animate ${
              visibleSections.has(index) ? 'section-visible' : 'section-hidden'
            }`}
          >
            <div className="max-w-7xl mx-auto w-full">
              <div className={`grid lg:grid-cols-2 gap-20 items-center ${
                prop.position === 'right' ? 'lg:grid-flow-col-dense' : ''
              }`}>
                
                <div className={`space-y-6 ${
                  prop.position === 'right' ? 'lg:col-start-2' : ''
                } ${
                  visibleSections.has(index) 
                    ? prop.position === 'right' 
                      ? 'text-slide-right' 
                      : 'text-slide-left'
                    : 'opacity-0'
                }`}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <prop.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                      {prop.title}
                    </h3>
                  </div>
                  
                  <div 
                    className="text-xl md:text-2xl font-medium leading-relaxed mb-4 text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(prop.benefit, prop.highlightWords)
                    }}
                  />
                  
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                    {prop.description}
                  </p>
                </div>

                <div className={`${
                  prop.position === 'right' ? 'lg:col-start-1 lg:row-start-1' : ''
                } svg-container ${
                  visibleSections.has(index) ? 'svg-visible' : 'svg-hidden'
                }`}>
                  <div className="relative">
                    {prop.useSvg ? (
                      <div className="w-full max-w-7xl mx-auto">
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
                          Visual Placeholder
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
