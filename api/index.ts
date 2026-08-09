import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

// API Handlers
import healthHandler from './_health.js';
import generateHandler from './_generate.js';
import generateBundleStepHandler from './_generate-bundle-step.js';
import suggestObjectivesHandler from './_suggest/objectives.js';
import adminActionHandler from './_admin/[action].js';
import authActionHandler from './_auth/[action].js';
import referralActionHandler from './_referral/[action].js';
import pricingConfigHandler from './_pricing/config.js';
import templateHandler from './_template.js';
import documentsHandler from './_documents.js';
import paymentActionHandler from './_payment/[action].js';

const app = express();

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
app.all('/api/referral/:action', (req, res) => {
  req.query.action = req.params.action;
  return wrap(referralActionHandler)(req, res);
});

app.all('/api/pricing/config', wrap(pricingConfigHandler));
app.all('/api/template', wrap(templateHandler));
app.all('/api/documents', wrap(documentsHandler));
app.all('/api/payment/:action', (req, res) => {
  req.query.action = req.params.action;
  return wrap(paymentActionHandler)(req, res);
});

export default app;
