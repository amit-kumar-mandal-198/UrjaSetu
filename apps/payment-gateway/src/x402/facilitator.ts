import axios from 'axios';
import { config } from '../config';

interface VerifySettleParams {
    signature: string;
    payload?: string;
    receiver: string;
    amount: number;
    asset: number;
}

interface SettlementData {
    status: string;
    paymentId?: string;
    transactionId: string;
    sender?: string;
}

export const verifyAndSettle = async (params: VerifySettleParams): Promise<SettlementData> => {
    // In a real environment, this calls the GoPlausible Facilitator
    // We wrap it in a try-catch to provide clear error reporting.
    try {
        const response = await axios.post(`${config.x402.facilitatorUrl}/v1/verify`, {
            signature: params.signature,
            payload: params.payload,
            receiver: params.receiver,
            amount: params.amount,
            asset: params.asset,
            network: config.x402.network
        });

        if (response.data && response.data.status === 'SETTLED') {
             return {
                 status: 'SETTLED',
                 transactionId: response.data.transactionId,
                 paymentId: response.data.paymentId,
                 sender: response.data.sender
             };
        } else {
             throw new Error('Facilitator did not return SETTLED status.');
        }
    } catch (error: any) {
        // Log the actual error for server-side audit
        console.error('GoPlausible Settlement Error:', error?.response?.data || error.message);
        
        // Return a structured error to the middleware
        throw new Error('Facilitator validation failed: ' + (error.response?.data?.message || error.message));
    }
}
