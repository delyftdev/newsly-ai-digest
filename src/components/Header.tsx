
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Sun, Moon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DelyftLogo from "@/components/DelyftLogo";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { theme, setTheme } = useTheme();

  const productItems = [
    { name: "Smart Inbox", description: "Organize all customer updates", href: "/product/smart-inbox" },
    { name: "Changelog", description: "Create on-brand content", href: "/product/changelog" },
    { name: "Feedback", description: "Collect and prioritize feedback", href: "/product/feedback" },
    { name: "Insights", description: "Track engagement and performance", href: "/product/insights" },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="border-b border-border backdrop-blur-xl bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <DelyftLogo width={120} height={34} className="h-8" />
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1">
                    <span>Product</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 bg-background/95 backdrop-blur-lg">
                  {productItems.map((item) => (
                    <DropdownMenuItem key={item.name} className="flex flex-col items-start p-3" asChild>
                      <Link to={item.href} className="w-full">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link to="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
              <Button variant="ghost">What's New</Button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/auth">
              <Button variant="ghost">Log In</Button>
            </Link>
            
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
