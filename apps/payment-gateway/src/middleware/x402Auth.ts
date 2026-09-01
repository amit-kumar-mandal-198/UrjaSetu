import { Context, Next } from 'hono';
import { config } from '../config';
import { ExactAvmFacilitator } from '@x402-avm/avm';
import { x402RequirePayment } from '@x402-avm/core';

// This acts as the local representation of the GoPlausible Facilitator for verifying
const facilitator = new ExactAvmFacilitator({
    network: config.x402.network,
    algodToken: config.algod.token,
    algodServer: config.algod.server,
    algodPort: config.algod.port
});

export const requireX402Payment = async (c: Context, next: Next) => {
    // Standard x402 headers
    const signature = c.req.header('x402-signature');
    const payload = c.req.header('x402-payload');
    
    // Construct the requirement based on our resource configuration
    const requirement = {
        network: config.x402.network,
        scheme: config.x402.scheme,
        receiver: config.x402.receiverAddress,
        amount: config.x402.paymentAmount.toString(),
        asset: config.x402.paymentAssetId.toString(),
        facilitator: config.x402.facilitatorUrl,
    };

    if (!signature || !payload) {
        c.status(402);
        c.header('x-402-network', requirement.network);
        c.header('x-402-scheme', requirement.scheme);
        c.header('x-402-receiver', requirement.receiver);
        c.header('x-402-amount', requirement.amount);
        c.header('x-402-asset', requirement.asset);
        c.header('x-402-facilitator', requirement.facilitator);
        
        return c.json({
            error: 'Payment Required',
            message: 'This resource requires an x402 payment to unlock optimization services.',
            requirements: requirement
        });
    }

    try {
        // Validate the transaction with the facilitator (either local SDK or remote GoPlausible)
        // In this implementation, we utilize the AVM Facililator which can submit to the node
        // or we could forward to GoPlausible. We will use the SDK which mimics GoPlausible.
        const result = await facilitator.verifyAndSettle({
            signature,
            payload,
            requirement
        });

        if (result.status !== 'SETTLED') {
            return c.json({ error: 'Payment Settlement Failed', message: 'The payment could not be settled on-chain.' }, 400);
        }

        c.set('x402TransactionId', result.transactionId);
        c.set('x402Amount', config.x402.paymentAmount);
        c.set('x402Sender', result.sender);
        
        await next();
    } catch (error: any) {
        return c.json({
            error: 'Payment Verification Error',
            message: error.message
        }, 401);
    }
};
