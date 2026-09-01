import { Hono } from 'hono';
import { config } from '../config';
import { requireX402Payment } from '../middleware/x402Auth';
import axios from 'axios';

export const paymentRoutes = new Hono();

// This endpoint is protected by the x402 middleware.
// If the signature is absent or invalid, the middleware will intercept and return HTTP 402.
paymentRoutes.post('/optimize', requireX402Payment, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const txId = c.get('x402TransactionId');
  const paymentAmount = c.get('x402Amount');
  const sender = c.get('x402Sender');

  try {
     // Notify FastAPI that the payment has been settled and the task is authorized.
     await axios.post(`${config.fastapiUrl}/api/v1/payments/unlock`, {
         taskId: body.taskId,
         transactionId: txId,
         amount: paymentAmount,
         sender: sender
     });

     return c.json({
         paymentId: txId, // Using TxID as the reference
         taskId: body.taskId,
         status: 'SETTLED',
         transactionId: txId,
         optimization: {
             authorized: true,
             message: 'Optimization service successfully unlocked.'
         }
     });

  } catch (error: any) {
     return c.json({
        error: 'Backend Synchronization Error',
        message: 'Payment settled but failed to unlock service. ' + error.message
     }, 500);
  }
});
