import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { config } from './config';
import { paymentRoutes } from './routes/paymentRoutes';

const app = new Hono();

app.use('*', cors({
  origin: '*', // For development. Should be restricted in production.
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x402-payment-signature'],
}));

app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'UrjaSetu Payment Gateway' });
});

app.route('/api/v1/payment', paymentRoutes);

console.log(`Starting x402 Payment Gateway on port ${config.port}`);

serve({
  fetch: app.fetch,
  port: config.port
});
