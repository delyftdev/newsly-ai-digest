
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ReleaseEditor from "./pages/ReleaseEditor";
import PublicGlossary from "./pages/PublicGlossary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { user, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/glossary/:userId" element={<PublicGlossary />} />
            
            {/* Auth routes */}
            <Route 
              path="/auth" 
              element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
            />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={user ? <DashboardPage /> : <Navigate to="/auth" replace />} 
            />
            <Route 
              path="/releases/new" 
              element={user ? <ReleaseEditor /> : <Navigate to="/auth" replace />} 
            />
            <Route 
              path="/releases/:id/edit" 
              element={user ? <ReleaseEditor /> : <Navigate to="/auth" replace />} 
            />
            
            {/* Landing page */}
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" replace /> : <Index />} 
            />
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
