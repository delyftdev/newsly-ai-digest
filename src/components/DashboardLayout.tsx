import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  MessageSquare, 
  MessageCircle, 
  FileText, 
  Map,
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  Inbox,
  BookOpen
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import DelyftLogo from "@/components/DelyftLogo";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const { company } = useCompanyStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Inbox', href: '/inbox', icon: Inbox },
    { name: 'Changelogs', href: '/changelogs', icon: BookOpen },
    { name: 'Feedback', href: '/feedback', icon: MessageCircle },
    { 
      name: 'Roadmap', 
      href: '/roadmap', 
      icon: Map,
      comingSoon: true
    },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center">
                <DelyftLogo width={120} height={34} className="h-8 mr-3" />
              </div>
            )}
            {sidebarCollapsed && (
              <DelyftLogo width={32} height={32} className="h-8 w-8" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 p-0"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <div key={item.name} className="relative">
              <Link
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                  location.pathname === item.href 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="flex items-center">
                    {item.name}
                    {item.comingSoon && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                        Coming Soon
                      </span>
                    )}
                  </span>
                )}
              </Link>
            </div>
          ))}
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-border">
          {!sidebarCollapsed && (
            <div className="mb-3">
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start text-muted-foreground hover:text-foreground",
              sidebarCollapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
            {!sidebarCollapsed && 'Sign Out'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {location.pathname === '/dashboard' && 'Dashboard'}
              {location.pathname === '/inbox' && 'Inbox'}
              {location.pathname === '/changelogs' && 'Changelogs'}
              {location.pathname === '/feedback' && 'Feedback'}
              {location.pathname === '/roadmap' && 'Roadmap'}
              {location.pathname === '/settings' && 'Settings'}
            </h2>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
