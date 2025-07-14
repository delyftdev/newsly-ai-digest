
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import Integrations from "./pages/Integrations";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import InboxPage from "./pages/InboxPage";
import Feedback from "./pages/Feedback";
import Changelogs from "./pages/Changelogs";
import ChangelogEditor from "./pages/ChangelogEditor";
import Releases from "./pages/Releases";
import ReleaseEditor from "./pages/ReleaseEditor";
import Roadmap from "./pages/Roadmap";
import PublicChangelog from "./pages/PublicChangelog";
import PublicChangelogView from "./pages/PublicChangelogView";
import PublicChangelogEntry from "./pages/PublicChangelogEntry";
import PublicGlossary from "./pages/PublicGlossary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/changelogs" element={<Changelogs />} />
              <Route path="/changelogs/new" element={<ChangelogEditor />} />
              <Route path="/changelogs/:id/edit" element={<ChangelogEditor />} />
              <Route path="/releases" element={<Releases />} />
              <Route path="/releases/new" element={<ReleaseEditor />} />
              <Route path="/releases/:id/edit" element={<ReleaseEditor />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/public/:companySlug/changelog" element={<PublicChangelog />} />
              <Route path="/public/:companySlug/changelog/:slug" element={<PublicChangelogEntry />} />
              <Route path="/changelog/:companySlug" element={<PublicChangelogView />} />
              <Route path="/changelog/:companySlug/:slug" element={<PublicChangelogEntry />} />
              <Route path="/public/:companySlug/glossary" element={<PublicGlossary />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
