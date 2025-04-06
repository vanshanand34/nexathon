// Simple diagnostic endpoint and connection information
import express from 'express';
import type { Express, Request, Response } from 'express';
import os from 'os';

export function addTestRoutes(app: Express) {
  // Test endpoint to check if the server is responding correctly
  app.get('/test', (req: Request, res: Response) => {
    console.log('Test endpoint accessed with headers:', req.headers);
    
    // Network information for debugging
    const networkInterfaces = os.networkInterfaces();
    const addresses = Object.entries(networkInterfaces)
      .flatMap(([name, interfaces]) => 
        interfaces?.map(iface => ({ name, ...iface })) || []
      )
      .filter(iface => iface.family === 'IPv4' && !iface.internal)
      .map(iface => ({
        name: iface.name,
        address: iface.address
      }));

    // Return detailed information
    return res.status(200).json({
      status: 'ok',
      message: 'Test endpoint is working',
      timestamp: new Date().toISOString(),
      headers: req.headers,
      connection: {
        remoteAddress: req.socket.remoteAddress,
        remotePort: req.socket.remotePort,
        localAddress: req.socket.localAddress,
        localPort: req.socket.localPort
      },
      serverInfo: {
        hostname: os.hostname(),
        platform: process.platform,
        uptime: process.uptime(),
        networkInterfaces: addresses,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          PORT: process.env.PORT,
          REPL_ID: process.env.REPL_ID,
          REPL_SLUG: process.env.REPL_SLUG,
          REPL_OWNER: process.env.REPL_OWNER
        }
      }
    });
  });
}