import { useState, useEffect } from "react";
import { Menu, Code, User, Shield, Zap, Box, FileText, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Code, label: "Code Review", href: "/code-review" },
    { icon: Shield, label: "Security Audit", href: "/security-audit" },
    { icon: Zap, label: "Performance Analysis", href: "/performance" },
    { icon: Box, label: "Code Refactoring", href: "/refactoring" },
    { icon: FileText, label: "Documentation Generator", href: "/documentation" },
  ];

  // Close sidebar when location changes
  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-border bg-background">
      <div className="flex items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 border-r bg-background">
            <div className="flex items-center h-16 border-b border-border px-4">
              <Code className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-semibold text-foreground">CodeAI Review</span>
            </div>
            <nav className="flex flex-col p-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md my-1",
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
            <div className="px-4 py-4 border-t border-border mt-auto">
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
          </SheetContent>
        </Sheet>
        <Link href="/" className="ml-2 flex items-center">
          <Code className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold text-foreground">CodeAI Review</span>
        </Link>
      </div>
      <div>
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
