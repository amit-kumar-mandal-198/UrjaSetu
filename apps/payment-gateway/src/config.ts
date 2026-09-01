import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: parseInt(process.env.PAYMENT_GATEWAY_PORT || '4002', 10),
  fastapiUrl: `http://localhost:${process.env.API_PORT || '8000'}`,
  x402: {
    network: process.env.X402_NETWORK || 'algorand:testnet',
    scheme: process.env.X402_SCHEME || 'x402',
    receiverAddress: process.env.RECEIVER_ADDRESS || '',
    paymentAssetId: parseInt(process.env.PAYMENT_ASSET_ID || '0', 10),
    paymentAmount: parseFloat(process.env.PAYMENT_AMOUNT || '0.01'),
    facilitatorUrl: process.env.FACILITATOR_URL || 'https://api.goplausible.com',
  },
  algod: {
    server: process.env.ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
    port: parseInt(process.env.ALGOD_PORT || '443', 10),
    token: process.env.ALGOD_TOKEN || '',
  }
};
