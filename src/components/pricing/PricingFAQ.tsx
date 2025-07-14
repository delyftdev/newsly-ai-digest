
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PricingFAQ = () => {
  const faqs = [
    {
      question: "Can I start with the free plan?",
      answer: "Absolutely! Our free plan includes 2 changelogs per month and all basic features. No credit card required to get started."
    },
    {
      question: "What happens when I hit my changelog limit?",
      answer: "You'll receive a notification when approaching your limit. You can upgrade anytime to unlock unlimited changelogs and additional features."
    },
    {
      question: "How does the Smart Inbox save time?",
      answer: "Our AI automatically categorizes and prioritizes customer feedback, eliminating manual sorting. Most teams save 4+ hours per week per user."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
    },
    {
      question: "What's included in the 14-day trial?",
      answer: "You get full access to all features in your chosen plan for 14 days. No credit card required, and you can cancel anytime."
    },
    {
      question: "Do you offer discounts for annual billing?",
      answer: "Yes! Annual plans save you 20% compared to monthly billing. You can switch between monthly and annual billing anytime."
    },
    {
      question: "What kind of support do you provide?",
      answer: "Free users get community support. Paid plans include priority email support, and Growth+ plans get priority chat support. Enterprise customers get dedicated success managers."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We're SOC 2 compliant with enterprise-grade security. All data is encrypted in transit and at rest, and we never share your information."
    }
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Frequently asked questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about our pricing and plans
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help.
          </p>
          <a 
            href="mailto:support@delyft.com" 
            className="text-primary hover:text-primary/80 font-medium"
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </section>
  );
};

export default PricingFAQ;
