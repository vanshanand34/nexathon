import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import MemoryStore from "memorystore";
import { addTestRoutes } from "./test-route";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup session with memory store
const MemoryStoreSession = MemoryStore(session);
app.use(session({
  secret: 'code-review-app-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
  },
  store: new MemoryStoreSession({
    checkPeriod: 86400000 // prune expired entries every 24h
  })
}));

// Enhanced CORS handling for Replit environment
app.use((req, res, next) => {
  // Log important request information for debugging
  console.log("Incoming request:", {
    path: req.path,
    origin: req.headers.origin,
    host: req.headers.host,
    referer: req.headers.referer
  });
  
  // Set Vary header to properly cache based on Origin
  res.header('Vary', 'Origin');
  
  // Always allow all origins to ensure Replit's domains work
  // This is critical for Replit as their domain structure can vary
  res.header('Access-Control-Allow-Origin', '*');
  
  // Set comprehensive headers for CORS
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // No content for OPTIONS
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Log useful information for debugging
  console.log("Starting server with:");
  console.log("- REPL_ID:", process.env.REPL_ID);
  console.log("- REPL_SLUG:", process.env.REPL_SLUG);
  console.log("- REPL_OWNER:", process.env.REPL_OWNER);
  
  // Add diagnostic test routes
  addTestRoutes(app);
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  
  // Log additional info about environment
  log(`Server environment variables:
  REPL_ID: ${process.env.REPL_ID || 'Not set'}
  REPL_SLUG: ${process.env.REPL_SLUG || 'Not set'}
  REPL_OWNER: ${process.env.REPL_OWNER || 'Not set'}
  NODE_ENV: ${process.env.NODE_ENV || 'Not set'}
  PORT: ${port}
  `);

  // Add a health check endpoint
  app.get('/health', (req, res) => {
    console.log('Health check accessed');
    res.json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: {
        replId: process.env.REPL_ID,
        replSlug: process.env.REPL_SLUG,
        replOwner: process.env.REPL_OWNER
      }
    });
  });
  
  server.listen({
    port,
    host: "127.0.0.1",
  }, () => {
    console.log(`Server running`);
  }); // <-- closing both the function and call
  
})();
