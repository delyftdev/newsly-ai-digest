
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EmailLink {
  id: string;
  url: string;
  linkText: string;
}

export interface EmailImage {
  id: string;
  imageUrl: string;
  altText: string;
}

export interface Email {
  id: string;
  userId: string;
  sender: string;
  subject: string;
  content: string;
  htmlContent: string;
  receivedAt: string;
  category: string;
  aiSummary: string;
  links: EmailLink[];
  images: EmailImage[];
  keyInsights: string[];
}

interface EmailState {
  emails: Email[];
  categories: string[];
  addEmail: (email: Omit<Email, 'id'>) => void;
  addSampleEmail: () => void;
  getEmailsByCategory: (category: string) => Email[];
}

const defaultCategories = [
  'Product Updates',
  'Feature Releases', 
  'News & Announcements',
  'Marketing Content',
  'Technical Updates',
  'Company News'
];

const sampleEmails: Omit<Email, 'id' | 'userId'>[] = [
  {
    sender: 'Linear Team <updates@linear.app>',
    subject: 'Linear: New AI-powered issue suggestions and improved search',
    content: 'We are excited to announce new AI-powered features in Linear that will help you work more efficiently...',
    htmlContent: '<div>We are excited to announce new AI-powered features in Linear...</div>',
    receivedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    category: 'Product Updates',
    aiSummary: 'Linear announced AI-powered issue suggestions and improved search functionality to enhance productivity and workflow management.',
    links: [
      { id: '1', url: 'https://linear.app/changelog', linkText: 'View full changelog' },
      { id: '2', url: 'https://linear.app/docs/ai-features', linkText: 'Learn about AI features' }
    ],
    images: [
      { id: '1', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', altText: 'Linear AI features' }
    ],
    keyInsights: ['AI-powered issue suggestions', 'Enhanced search capabilities', 'Improved workflow automation']
  },
  {
    sender: 'Notion Team <updates@notion.so>',
    subject: 'Notion AI is now available in all workspaces',
    content: 'Notion AI is now rolling out to all users across all workspace plans. This powerful AI assistant can help you write, brainstorm, and organize your content more effectively...',
    htmlContent: '<div>Notion AI is now rolling out to all users...</div>',
    receivedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    category: 'Feature Releases',
    aiSummary: 'Notion AI is now available to all users across all workspace plans, offering writing assistance, brainstorming, and content organization capabilities.',
    links: [
      { id: '3', url: 'https://notion.so/product/ai', linkText: 'Try Notion AI' },
      { id: '4', url: 'https://notion.so/help/notion-ai', linkText: 'AI documentation' }
    ],
    images: [
      { id: '2', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', altText: 'Notion AI interface' }
    ],
    keyInsights: ['Available in all workspaces', 'Writing and brainstorming assistance', 'Content organization features']
  },
  {
    sender: 'Figma Team <news@figma.com>',
    subject: 'Dev Mode: Bridge the gap between design and development',
    content: 'Today we are launching Dev Mode, a new space in Figma designed specifically for developers. Dev Mode provides ready-to-use code, design tokens, and assets...',
    htmlContent: '<div>Today we are launching Dev Mode...</div>',
    receivedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    category: 'Product Updates',
    aiSummary: 'Figma launched Dev Mode, a developer-focused space providing ready-to-use code, design tokens, and assets to bridge design-development workflow.',
    links: [
      { id: '5', url: 'https://figma.com/dev-mode', linkText: 'Learn about Dev Mode' },
      { id: '6', url: 'https://figma.com/blog/dev-mode', linkText: 'Read the announcement' }
    ],
    images: [
      { id: '3', imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800', altText: 'Figma Dev Mode' }
    ],
    keyInsights: ['Developer-focused workspace', 'Ready-to-use code generation', 'Design token integration']
  },
  {
    sender: 'Stripe Newsletter <newsletter@stripe.com>',
    subject: 'Stripe Elements: Enhanced payment UI components',
    content: 'We have redesigned Stripe Elements with improved accessibility, mobile optimization, and customization options. The new components offer better user experience...',
    htmlContent: '<div>We have redesigned Stripe Elements...</div>',
    receivedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    category: 'Technical Updates',
    aiSummary: 'Stripe redesigned Elements with enhanced accessibility, mobile optimization, and customization options for better payment experiences.',
    links: [
      { id: '7', url: 'https://stripe.com/docs/elements', linkText: 'Elements documentation' },
      { id: '8', url: 'https://stripe.com/blog/elements-redesign', linkText: 'Migration guide' }
    ],
    images: [
      { id: '4', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', altText: 'Stripe payment interface' }
    ],
    keyInsights: ['Improved accessibility', 'Mobile-first design', 'Enhanced customization options']
  }
];

export const useEmailStore = create<EmailState>()(
  persist(
    (set, get) => ({
      emails: [],
      categories: defaultCategories,

      addEmail: (emailData) => {
        const email: Email = {
          ...emailData,
          id: Date.now().toString(),
        };

        set((state) => ({
          emails: [email, ...state.emails],
          categories: Array.from(new Set([...state.categories, email.category]))
        }));
      },

      addSampleEmail: () => {
        const randomEmail = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
        const email: Email = {
          ...randomEmail,
          id: Date.now().toString(),
          userId: '1', // Default user ID for demo
        };

        set((state) => ({
          emails: [email, ...state.emails],
        }));
      },

      getEmailsByCategory: (category) => {
        return get().emails.filter(email => email.category === category);
      },
    }),
    {
      name: 'email-storage',
    }
  )
);
