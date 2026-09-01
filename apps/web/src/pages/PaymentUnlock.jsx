import React, { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Loader2, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import algosdk from 'algosdk';
import { Buffer } from 'buffer';

import TopNavigation from '../components/TopNavigation';

const PaymentUnlock = () => {
  const { activeAddress, providers, signTransactions } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const taskId = location.state?.taskId || 1; 
  
  const [paymentState, setPaymentState] = useState('IDLE'); 
  const [errorMsg, setErrorMsg] = useState('');
  const [txId, setTxId] = useState('');

  const paymentDetails = {
    amount: 0.01,
    asset: 'ALGO',
    network: 'Algorand Testnet',
    receiver: 'GOPLAUSIBLE_FACILITATOR',
    protocol: 'x402'
  };

  const handleConnectWallet = () => {
    if (providers && providers.length > 0) {
      providers[0].connect();
    } else {
      setErrorMsg('No wallet provider found. Please install Pera or Defly.');
    }
  };

  const handlePayAndUnlock = async () => {
    if (!activeAddress) {
        setErrorMsg('Please connect your wallet first.');
        return;
    }
    
    try {
        setPaymentState('SIGNING');
        setErrorMsg('');
        
        const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', 443);
        const suggestedParams = await algodClient.getTransactionParams().do();
        
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: activeAddress,
            to: process.env.VITE_RECEIVER_ADDRESS || 'GD64YIY3TWGDMCNCE554LSND24EIXED36B5F5P6J5K6W4O2Z54H334T3WQ',
            amount: paymentDetails.amount * 1000000, 
            suggestedParams,
            note: new Uint8Array(Buffer.from('UrjaSetu x402 Optimization Unlock'))
        });

        const txnBytes = txn.toByte();
        const b64Payload = Buffer.from(txnBytes).toString('base64');

        const encodedTxn = algosdk.encodeUnsignedTransaction(txn);
        const signedTxns = await signTransactions([encodedTxn]);
        
        const b64Signature = Buffer.from(signedTxns[0]).toString('base64');
        
        setPaymentState('VERIFYING');
        
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002'; 
        
        const response = await axios.post(`${API_URL}/api/v1/payment/optimize`, { taskId }, {
           headers: { 
               'x402-signature': b64Signature,
               'x402-payload': b64Payload
           }
        });

        setPaymentState('SETTLING');

        await new Promise(r => setTimeout(r, 1000));
        
        setPaymentState('SETTLED');
        setTxId(response.data.transactionId || 'tx_success');

    } catch (err) {
        console.error(err);
        setPaymentState('FAILED');
        setErrorMsg(err.message || 'Payment failed to verify.');
    }
  };

  const handleReturn = () => {
      navigate('/');
  };

  return (
    <div className="animate-fade-in flex flex-col items-center">
      <div className="w-full">
         <TopNavigation title="Payment Unlock" />
      </div>

      <div className="card w-full max-w-lg mt-8 p-12 text-center">
        
        {paymentState === 'SETTLED' ? (
           <div>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--bg-emerald)' }}>
                <ShieldCheck size={40} style={{ color: 'var(--color-emerald)' }} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Payment Verified</h2>
              
              <div className="text-left bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
                 <div className="flex items-center gap-2 mb-2 font-medium" style={{ color: 'var(--color-emerald)' }}><CheckCircle size={16}/> x402 verified</div>
                 <div className="flex items-center gap-2 mb-2 font-medium" style={{ color: 'var(--color-emerald)' }}><CheckCircle size={16}/> GoPlausible settled</div>
                 <div className="flex items-center gap-2 mb-6 font-medium" style={{ color: 'var(--color-emerald)' }}><CheckCircle size={16}/> Algorand Testnet confirmed</div>
                 
                 <div className="text-sm text-muted flex flex-col gap-2">
                    <div><strong className="text-gray-700">Transaction ID:</strong> {txId}</div>
                    <div><strong className="text-gray-700">Network:</strong> Algorand Testnet</div>
                    <div><strong className="text-gray-700">Asset:</strong> ALGO</div>
                    <div><strong className="text-gray-700">Amount:</strong> 0.01</div>
                 </div>
              </div>
              
              <button className="btn btn-primary w-full p-4" onClick={handleReturn}>
                Proceed to Execution <ArrowRight size={18} />
              </button>
           </div>
        ) : (
           <div>
              <h2 className="text-2xl font-bold mb-2">Verified Energy Optimization</h2>
              <p className="text-muted mb-10">Unlock verified optimization for this task.</p>
              
              <div className="text-left bg-gray-50 p-6 rounded-xl mb-10 border border-gray-200 flex flex-col gap-4">
                 <div className="flex justify-between">
                    <span className="text-muted">Amount</span>
                    <strong className="text-gray-900">{paymentDetails.amount} {paymentDetails.asset}</strong>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-muted">Network</span>
                    <strong className="text-gray-900">{paymentDetails.network}</strong>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-muted">Protocol</span>
                    <strong className="text-gray-900">{paymentDetails.protocol}</strong>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-muted">Facilitator</span>
                    <strong className="text-gray-900">GoPlausible</strong>
                 </div>
              </div>
              
              {errorMsg && (
                 <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start gap-3 text-sm text-left border border-red-200">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" /> {errorMsg}
                 </div>
              )}

              {paymentState === 'IDLE' || paymentState === 'FAILED' ? (
                 !activeAddress ? (
                     <button className="btn btn-primary w-full p-4" onClick={handleConnectWallet}>
                        Connect Wallet
                     </button>
                 ) : (
                     <button className="btn btn-primary w-full p-4" onClick={handlePayAndUnlock}>
                        Sign & Unlock Optimization
                     </button>
                 )
              ) : (
                 <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg font-medium text-gray-700 border border-gray-200">
                    <Loader2 className="animate-spin" size={20} /> 
                    {paymentState === 'SIGNING' && 'Waiting for signature...'}
                    {paymentState === 'VERIFYING' && 'Verifying x402 payment...'}
                    {paymentState === 'SETTLING' && 'Settling on Algorand Testnet...'}
                 </div>
              )}
           </div>
        )}

      </div>
    </div>
  );
};

export default PaymentUnlock;
