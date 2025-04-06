import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  analyzeCode, 
  securityAudit, 
  performanceAnalysis, 
  refactoringAnalysis, 
  documentationAnalysis 
} from "./ai-service";
import {
  getCurrentAIProvider,
  setCurrentAIProvider,
  checkProviderApiKey,
  getProviderModels
} from "./ai-service-routes";
import { insertCodeReviewSchema, insertCodeReviewResultSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import 'express-session';

// Extend the Session interface to include our custom properties
declare module 'express-session' {
  interface Session {
    userId?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Add CORS headers to all responses
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
  });

  // Health check route that bypasses Vite middleware
  app.get("/health", (req, res) => {
    console.log("Health check accessed");
    return res.status(200).json({ 
      status: "ok", 
      message: "Server is running", 
      timestamp: new Date().toISOString(),
      environment: {
        replId: process.env.REPL_ID,
        replSlug: process.env.REPL_SLUG,
        replOwner: process.env.REPL_OWNER
      }
    });
  });
  
  // API routes
  app.post("/api/analyze", async (req: Request, res: Response) => {
    try {
      console.log("Received analyze request:", req.body);
      const { code, language, options } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ message: "Code and language are required" });
      }
      
      // Set default options if not provided
      const analysisOptions = {
        securityAnalysis: options?.securityAnalysis ?? true,
        performanceOptimization: options?.performanceOptimization ?? true,
        codingStandards: options?.codingStandards ?? true,
        documentationQuality: options?.documentationQuality ?? false,
        improvementSuggestions: options?.improvementSuggestions ?? true,
        analysisDepth: options?.analysisDepth ?? 3
      };
      
      // Analyze code using AI service
      const result = await analyzeCode(code, language, analysisOptions);
      
      // Store the code review in database if user is authenticated
      if (req.session && req.session.userId) {
        try {
          const codeReview = await storage.createCodeReview({
            userId: req.session.userId,
            code,
            language,
            createdAt: new Date().toISOString(),
            ...analysisOptions
          });
          
          const resultData = {
            codeReviewId: codeReview.id,
            overallQuality: result.overallQuality,
            issues: result.issues,
            suggestions: result.issues.filter(issue => issue.type === 'suggestion'),
            codeEfficiency: result.codeEfficiency,
            bestPractices: result.bestPractices,
            createdAt: new Date().toISOString()
          };
          
          await storage.createCodeReviewResult(resultData);
        } catch (error) {
          console.error("Error storing code review:", error);
          // Continue with response even if storage fails
        }
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error during code analysis:", error);
      return res.status(500).json({ 
        message: "Failed to analyze code", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Security audit route
  app.post("/api/security-audit", async (req: Request, res: Response) => {
    try {
      console.log("Received security audit request");
      const { code, language, analysisDepth = 3 } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ message: "Code and language are required" });
      }
      
      const result = await securityAudit(code, language, { analysisDepth });
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error during security audit:", error);
      return res.status(500).json({ 
        message: "Failed to perform security audit", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Performance analysis route
  app.post("/api/performance", async (req: Request, res: Response) => {
    try {
      console.log("Received performance analysis request");
      const { code, language, analysisDepth = 3 } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ message: "Code and language are required" });
      }
      
      const result = await performanceAnalysis(code, language, { analysisDepth });
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error during performance analysis:", error);
      return res.status(500).json({ 
        message: "Failed to analyze performance", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Refactoring suggestions route
  app.post("/api/refactoring", async (req: Request, res: Response) => {
    try {
      console.log("Received refactoring request");
      const { code, language, analysisDepth = 3 } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ message: "Code and language are required" });
      }
      
      const result = await refactoringAnalysis(code, language, { analysisDepth });
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error during refactoring analysis:", error);
      return res.status(500).json({ 
        message: "Failed to generate refactoring suggestions", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Documentation suggestions route
  app.post("/api/documentation", async (req: Request, res: Response) => {
    try {
      console.log("Received documentation request");
      const { code, language, analysisDepth = 3 } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ message: "Code and language are required" });
      }
      
      const result = await documentationAnalysis(code, language, { analysisDepth });
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error during documentation analysis:", error);
      return res.status(500).json({ 
        message: "Failed to generate documentation suggestions", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // User registration
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user
      const user = await storage.createUser({ username, password });
      
      // Set user session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      return res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      return res.status(500).json({ 
        message: "Failed to register user", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // User login
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Set user session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      return res.status(200).json({ id: user.id, username: user.username });
    } catch (error) {
      return res.status(500).json({ 
        message: "Login failed", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // User logout
  app.post("/api/logout", (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      res.status(200).json({ message: "Logged out successfully" });
    }
  });
  
  // Get user profile
  app.get("/api/profile", async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(200).json({ id: user.id, username: user.username });
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to get profile", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // Get user's code reviews
  app.get("/api/reviews", async (req: Request, res: Response) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const reviews = await storage.getCodeReviewsByUserId(req.session.userId);
      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to get reviews", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // AI Service provider routes
  
  // Get current AI provider
  app.get("/api/ai-service/provider", getCurrentAIProvider);
  
  // Set AI provider
  app.post("/api/ai-service/provider", setCurrentAIProvider);
  
  // Check if provider has API key configured
  app.get("/api/ai-service/provider/:provider/status", checkProviderApiKey);
  
  // Get models for a provider
  app.get("/api/ai-service/provider/:provider/models", getProviderModels);
  
  const httpServer = createServer(app);
  return httpServer;
}
