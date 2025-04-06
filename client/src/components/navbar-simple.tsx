import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Code, Shield, Zap, Box, FileText, User, Menu, Home, Settings } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
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
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-blue-500" />
            <span className="hidden font-bold sm:inline-block">CodeAI Review</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </button>
        
        {/* Desktop menu */}
        <nav className="hidden lg:flex lg:items-center lg:space-x-1">
          {menuItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                  ${isActive 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}
                `}
              >
                <item.icon className={`
                  mr-2 h-4 w-4
                  ${isActive ? "text-white" : "text-gray-500"}
                `} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* User profile */}
        <div className="hidden sm:flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            {menuItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    block px-3 py-2 rounded-md text-base font-medium flex items-center
                    ${isActive 
                      ? "bg-blue-500 text-white" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}
                  `}
                >
                  <item.icon className={`
                    mr-3 h-5 w-5
                    ${isActive ? "text-white" : "text-gray-500"}
                  `} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}