import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// API Handlers
import healthHandler from './api/health.js';
import generateHandler from './api/generate.js';
import generateBundleStepHandler from './api/generate-bundle-step.js';
import suggestObjectivesHandler from './api/suggest/objectives.js';
import adminActionHandler from './api/admin/[action].js';
import authActionHandler from './api/auth/[action].js';
import pricingConfigHandler from './api/pricing/config.js';
import templateHandler from './api/template.js';
import documentsHandler from './api/documents.js';
import paymentCreateHandler from './api/payment/create.js';
import paymentNotificationHandler from './api/payment/notification.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to wrap Vercel handler
  const wrap = (handler: any) => async (req: any, res: any) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };

  // API Routes
  app.all('/api/health', wrap(healthHandler));
  app.all('/api/generate', wrap(generateHandler));
  app.all('/api/generate-bundle-step', wrap(generateBundleStepHandler));
  app.all('/api/suggest/objectives', wrap(suggestObjectivesHandler));
  
  // Dynamic routes
  app.all('/api/admin/:action', (req, res) => {
    req.query.action = req.params.action;
    return wrap(adminActionHandler)(req, res);
  });
  app.all('/api/auth/:action', (req, res) => {
    req.query.action = req.params.action;
    return wrap(authActionHandler)(req, res);
  });
  
  app.all('/api/pricing/config', wrap(pricingConfigHandler));
  app.all('/api/template', wrap(templateHandler));
  app.all('/api/documents', wrap(documentsHandler));
  app.all('/api/payment/create', wrap(paymentCreateHandler));
  app.all('/api/payment/notification', wrap(paymentNotificationHandler));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
