import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Code, Shield, Zap, Box, FileText, User, Menu, Home, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

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

  // Close sidebar when location changes
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Code, label: "Code Review", href: "/code-review" },
    { icon: Shield, label: "Security Audit", href: "/security-audit" },
    { icon: Zap, label: "Performance", href: "/performance" },
    { icon: Box, label: "Refactoring", href: "/refactoring" },
    { icon: FileText, label: "Documentation", href: "/documentation" },
    { icon: Settings, label: "AI Service", href: "/ai-service" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">CodeAI Review</span>
          </Link>
        </div>
        
        {/* Mobile menu */}
        {isMobile && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] sm:w-[350px] pr-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <Code className="h-6 w-6 text-primary mr-2" />
                  <span className="text-lg font-semibold">CodeAI Review</span>
                </div>
                
                <nav className="flex-1 mb-4 space-y-1">
                  {menuItems.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                            isActive
                              ? "text-primary-foreground bg-primary"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          <item.icon className={cn(
                            "mr-3 h-5 w-5",
                            isActive 
                              ? "text-primary-foreground" 
                              : "text-muted-foreground"
                          )} />
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
                
                <div className="border-t pt-4">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Guest User</p>
                      <button className="text-xs font-medium text-muted-foreground hover:text-foreground">
                        Sign in
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        {/* Desktop menu */}
        <nav className="hidden lg:flex lg:flex-1 lg:items-center">
          <div className="flex space-x-1">
            {menuItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "mr-2 h-4 w-4",
                    isActive 
                      ? "text-primary-foreground" 
                      : "text-muted-foreground"
                  )} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* User profile */}
        <div className="ml-auto flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}