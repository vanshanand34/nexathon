import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import NotFound from "./pages/not-found-simple";
import Home from "./pages/home-simple";
import CodeReview from "./pages/code-review-simple";
import SecurityAudit from "./pages/security-audit-simple";
import Performance from "./pages/performance-simple";
import Refactoring from "./pages/refactoring-simple";
import Documentation from "./pages/documentation-simple";
import AIService from "./pages/ai-service-simple";
import Navbar from "./components/navbar-simple";
import { ToastProvider } from "./hooks/simple-toast";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/code-review" component={CodeReview} />
              <Route path="/security-audit" component={SecurityAudit} />
              <Route path="/performance" component={Performance} />
              <Route path="/refactoring" component={Refactoring} />
              <Route path="/documentation" component={Documentation} />
              <Route path="/ai-service" component={AIService} />
              {/* Make sure the NotFound component is used for any non-matching routes */}
              <Route path="/:path*" component={NotFound} />
            </Switch>
          </main>
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
