import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Code, Shield, Zap, Box, FileText, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const menuItems = [
    { icon: Code, label: "Code Review", href: "/code-review" },
    { icon: Shield, label: "Security Audit", href: "/security-audit" },
    { icon: Zap, label: "Performance Analysis", href: "/performance" },
    { icon: Box, label: "Code Refactoring", href: "/refactoring" },
    { icon: FileText, label: "Documentation Generator", href: "/documentation" },
  ];

  // Don't show sidebar on mobile - mobile header will handle it
  if (isMobile) {
    return null;
  }

  return (
    <div className={cn(
      "relative z-10 flex-shrink-0 transition-all duration-300", 
      collapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex flex-col h-full border-r border-border bg-background">
        <div className="flex items-center h-16 px-4 border-b border-border justify-between">
          {!collapsed && (
            <div className="flex items-center">
              <Code className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-semibold text-foreground">CodeAI Review</span>
            </div>
          )}
          {collapsed && (
            <Code className="h-6 w-6 text-primary mx-auto" />
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "text-primary-foreground bg-primary"
                    : "text-foreground hover:bg-muted"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn(
                  collapsed ? "mx-auto" : "mr-3", 
                  "h-5 w-5", 
                  isActive 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground"
                )} />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>
        
        {!collapsed && (
          <div className="flex-shrink-0 px-4 py-4 border-t border-border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-foreground">Guest User</p>
                <button className="text-xs font-medium text-muted-foreground hover:text-foreground">
                  Sign in
                </button>
              </div>
            </div>
          </div>
        )}
        
        {collapsed && (
          <div className="flex-shrink-0 p-4 border-t border-border flex justify-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
}
