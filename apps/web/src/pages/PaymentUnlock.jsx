import React, { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Loader2, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import algosdk from 'algosdk';
import { Buffer } from 'buffer';

const PaymentUnlock = () => {
  const { activeAddress, providers, signTransactions } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const taskId = location.state?.taskId || 1; // Default to 1 if directly accessed
  
  const [paymentState, setPaymentState] = useState('IDLE'); // IDLE, WALLET_CONNECTING, SIGNING, VERIFYING, SETTLING, SETTLED, FAILED
  const [errorMsg, setErrorMsg] = useState('');
  const [txId, setTxId] = useState('');

  // Example Payment Requirement from server
  const paymentDetails = {
    amount: 0.01,
    asset: 'ALGO',
    network: 'Algorand Testnet',
    receiver: 'GOPLAUSIBLE_FACILITATOR',
    protocol: 'x402'
  };

  const handleConnectWallet = () => {
    if (providers && providers.length > 0) {
      // For simplicity, connect the first available provider (e.g. Pera or Defly)
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
        
        // Construct an Algorand transaction
        const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', 443);
        const suggestedParams = await algodClient.getTransactionParams().do();
        
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: activeAddress,
            to: process.env.VITE_RECEIVER_ADDRESS || 'GD64YIY3TWGDMCNCE554LSND24EIXED36B5F5P6J5K6W4O2Z54H334T3WQ',
            amount: paymentDetails.amount * 1000000, // 0.01 ALGO to microAlgos
            suggestedParams,
            note: new Uint8Array(Buffer.from('UrjaSetu x402 Optimization Unlock'))
        });

        // Encode the transaction to base64 for x402 payload
        const txnBytes = txn.toByte();
        const b64Payload = Buffer.from(txnBytes).toString('base64');

        // Sign using the wallet
        const encodedTxn = algosdk.encodeUnsignedTransaction(txn);
        const signedTxns = await signTransactions([encodedTxn]);
        
        // Encode signature to base64 for x402 signature
        const b64Signature = Buffer.from(signedTxns[0]).toString('base64');
        
        setPaymentState('VERIFYING');
        
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002'; // Pointing to Payment Gateway
        
        // Calling the Payment Gateway to verify and settle
        const response = await axios.post(`${API_URL}/api/v1/payment/optimize`, { taskId }, {
           headers: { 
               'x402-signature': b64Signature,
               'x402-payload': b64Payload
           }
        });

        setPaymentState('SETTLING');

        // Allow some time for UI state transition
        await new Promise(r => setTimeout(r, 1000));
        
        // Success
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
    <div className="fade-in" style={{maxWidth: '600px', margin: '0 auto', paddingTop: '2rem'}}>
      <div className="bento-card" style={{padding: '3rem', textAlign: 'center'}}>
        
        {paymentState === 'SETTLED' ? (
           <div>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <ShieldCheck size={40} color="var(--accent-green)" />
              </div>
              <h2 style={{marginBottom: '1rem'}}>Payment Verified</h2>
              <div style={{textAlign: 'left', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem'}}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-green)'}}><CheckCircle size={16}/> x402 verified</div>
                 <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-green)'}}><CheckCircle size={16}/> GoPlausible settled</div>
                 <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-green)'}}><CheckCircle size={16}/> Algorand Testnet confirmed</div>
                 
                 <div style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                    <div><strong>Transaction ID:</strong> {txId}</div>
                    <div><strong>Network:</strong> Algorand Testnet</div>
                    <div><strong>Asset:</strong> ALGO</div>
                    <div><strong>Amount:</strong> 0.01</div>
                 </div>
              </div>
              
              <button className="btn btn-primary" style={{width: '100%', padding: '1rem'}} onClick={handleReturn}>
                Proceed to Execution <ArrowRight size={18} />
              </button>
           </div>
        ) : (
           <div>
              <h2 style={{marginBottom: '0.5rem'}}>Verified Energy Optimization</h2>
              <p style={{color: 'var(--text-muted)', marginBottom: '2.5rem'}}>Unlock verified optimization for this task.</p>
              
              <div style={{textAlign: 'left', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem'}}>
                 <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                    <span style={{color: 'var(--text-muted)'}}>Amount</span>
                    <strong>{paymentDetails.amount} {paymentDetails.asset}</strong>
                 </div>
                 <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                    <span style={{color: 'var(--text-muted)'}}>Network</span>
                    <strong>{paymentDetails.network}</strong>
                 </div>
                 <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                    <span style={{color: 'var(--text-muted)'}}>Protocol</span>
                    <strong>{paymentDetails.protocol}</strong>
                 </div>
                 <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{color: 'var(--text-muted)'}}>Facilitator</span>
                    <strong>GoPlausible</strong>
                 </div>
              </div>
              
              {errorMsg && (
                 <div style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', textAlign: 'left'}}>
                    <AlertCircle size={18} /> {errorMsg}
                 </div>
              )}

              {paymentState === 'IDLE' || paymentState === 'FAILED' ? (
                 !activeAddress ? (
                     <button className="btn btn-primary" style={{width: '100%', padding: '1rem'}} onClick={handleConnectWallet}>
                        Connect Wallet
                     </button>
                 ) : (
                     <button className="btn btn-primary" style={{width: '100%', padding: '1rem'}} onClick={handlePayAndUnlock}>
                        Sign & Unlock Optimization
                     </button>
                 )
              ) : (
                 <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', color: 'var(--text-main)', fontWeight: 500}}>
                    <Loader2 className="spin" size={20} /> 
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
