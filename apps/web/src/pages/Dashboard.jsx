import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sun, Home, Zap, IndianRupee, Cpu, CheckCircle, Bell, ArrowRight, Lock, Wallet, X, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const Dashboard = () => {
  const [data, setData] = useState({
    telemetry: null,
    tasks: [],
    total_savings_today: 0,
    suggestion: null
  });
  
  const [loading, setLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [paymentCost, setPaymentCost] = useState(0);
  const [visibleLines, setVisibleLines] = useState({ solar: true, consumption: true });

  const toggleLine = (dataKey) => {
    setVisibleLines(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  const [liveData, setLiveData] = useState(() => {
     const initialChart = [];
     const now = Date.now();
     for (let i = 20; i >= 0; i--) {
         const t = new Date(now - i * 2000);
         initialChart.push({
             time: t.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
             solar: parseFloat((2.4 + (Math.random() * 0.2 - 0.1)).toFixed(2)),
             consumption: parseFloat((1.6 + (Math.random() * 0.2 - 0.1)).toFixed(2))
         });
     }
     return {
       telemetry: {
         solar_power: 2.41,
         home_consumption: 1.67,
         grid_import: 0
       },
       chart: initialChart
     };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/dashboard`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data.telemetry) {
        setLiveData(prev => ({
            ...prev,
            telemetry: {
               ...prev.telemetry,
               ...data.telemetry,
               solar_power: parseFloat(data.telemetry.solar_power || prev.telemetry.solar_power),
               home_consumption: parseFloat(data.telemetry.home_consumption || prev.telemetry.home_consumption),
               grid_import: parseFloat(data.telemetry.grid_import || prev.telemetry.grid_import)
            }
        }));
    }
  }, [data.telemetry]);

  useEffect(() => {
     const interval = setInterval(() => {
         setLiveData(prev => {
             const solarJitter = (Math.random() * 0.1 - 0.05);
             const homeJitter = (Math.random() * 0.08 - 0.04);
             
             let newSolar = prev.telemetry.solar_power + solarJitter;
             let newHome = prev.telemetry.home_consumption + homeJitter;
             
             if (newSolar < 0) newSolar = 0;
             if (newHome < 0) newHome = 0;
             
             const gridImport = newHome > newSolar ? (newHome - newSolar) : 0;
             
             const newTelemetry = {
                 ...prev.telemetry,
                 solar_power: newSolar,
                 home_consumption: newHome,
                 grid_import: gridImport
             };

             const t = new Date();
             const newChartPoint = {
                 time: t.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
                 solar: parseFloat(newSolar.toFixed(2)),
                 consumption: parseFloat(newHome.toFixed(2))
             };

             return {
                 telemetry: newTelemetry,
                 chart: [...prev.chart.slice(1), newChartPoint]
             };
         });
     }, 2000);
     return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const handleApprove = async (taskId) => {
    setIsExecuting(true);
    setPaymentError(null);
    try {
      await axios.post(`${API_URL}/api/v1/tasks/${taskId}/approve`, { action: 'APPROVE' });
      setIsExecuting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setIsExecuting(false);
      if (error.response && error.response.status === 402) {
        setPaymentCost(error.response.data.detail.cost);
        setActiveTask(taskId);
        setShowPaymentModal(true);
      } else {
        alert("An error occurred during approval.");
      }
    }
  };

  const handleSimulatedPayment = async () => {
    setIsExecuting(true);
    try {
      const txId = 'ALG-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      await axios.post(`${API_URL}/api/v1/payments/unlock`, {
        taskId: activeTask,
        transactionId: txId,
        amount: paymentCost,
        sender: 'SIMULATED_WALLET'
      });
      setIsExecuting(false);
      setShowPaymentModal(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setIsExecuting(false);
      setPaymentError(error.response?.data?.detail || "Payment failed");
    }
  };

  if (loading) {
    return (
      <div className="fade-in" style={{ padding: '0 0' }}>
         <div className="header d-1">
           <div style={{ width: '100%' }}>
             <div className="skeleton skeleton-title"></div>
             <div className="skeleton skeleton-text" style={{ width: '250px' }}></div>
           </div>
         </div>
         <div className="bento-grid">
           <div className="bento-card skeleton" style={{ gridColumn: 'span 2', minHeight: '340px' }}></div>
           <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="bento-card skeleton" style={{ flex: 1 }}></div>
              <div className="bento-card skeleton" style={{ flex: 1 }}></div>
           </div>
           <div className="bento-card skeleton" style={{ gridColumn: 'span 1' }}></div>
           <div className="bento-card skeleton" style={{ gridColumn: 'span 4', minHeight: '360px' }}></div>
         </div>
      </div>
    );
  }

  const { suggestion, total_savings_today } = data;
  const { telemetry, chart: chartData } = liveData;
  
  // Calculate mock independence score based on solar vs grid
  const solarVal = telemetry.solar_power || 0;
  const homeVal = telemetry.home_consumption || 1; // avoid div by 0
  const independence = Math.min(100, Math.round((solarVal / homeVal) * 100));
  const surplus = Math.max(0, solarVal - homeVal);
  
  // Circumference for SVG circle
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (independence / 100) * circumference;

  return (
    <div className="fade-in">
      <div className="header animate-in d-1">
        <div>
           <h1 style={{fontSize: '1.75rem', marginBottom: '0.25rem', fontWeight: 700}}>Overview</h1>
           <p style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>Live energy orchestration and insights</p>
        </div>
        <div className="header-actions" style={{ gap: '2rem' }}>
          <span className="badge">Active Demo</span>
          <Bell size={20} color="var(--text-muted)" style={{cursor: 'pointer'}} />
          <div className="user-avatar">
            JS
          </div>
        </div>
      </div>

      <div className="bento-grid" style={{ alignItems: 'stretch' }}>
        
        {/* Hero Score Card */}
        <div className="bento-card card-score animate-in d-2">
           <h3 style={{marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>Energy Independence <span className="badge" style={{fontSize: '0.6rem'}}>MEASURED</span></h3>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', width: '100%', alignItems: 'center', flexWrap: 'wrap' }}>
             <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 1.5rem auto' }}>
                <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Background track */}
                  <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--border-color)" strokeWidth="12" />
                  {/* Progress */}
                  <circle 
                    cx="80" cy="80" r={radius} 
                    fill="none" 
                    stroke="var(--accent-green)" 
                    strokeWidth="12" 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                  />
                </svg>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                   <span style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1 }}>{independence}%</span>
                   <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Self-Sufficient</span>
                </div>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '160px', flex: 1 }}>
                <div style={{ background: 'var(--bg-card-hover)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Grid Import</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{telemetry.grid_import.toFixed(2)} kW</div>
                </div>
                <div style={{ background: 'var(--bg-card-hover)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Grid Export (Surplus)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-green)' }}>{surplus.toFixed(2)} kW</div>
                </div>
             </div>
           </div>
           
           <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', textAlign: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
             {independence === 100 
                ? `You are fully disconnected from the grid, generating a live surplus of ${surplus.toFixed(2)}kW.`
                : `Your home is currently supplementing ${telemetry.grid_import.toFixed(2)}kW from the grid to meet demand.`
             }
           </p>
           
           <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', width: '100%', padding: '1rem', background: 'var(--bg-card-hover)', borderRadius: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>7-Day Avg</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>82%</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Peak Load</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>3.4kW</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Saved</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-green)' }}>₹420</div>
              </div>
           </div>
        </div>

        {/* Live Stats Column */}
        <div className="bento-card animate-in d-2" style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
            <div className="bento-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="stat-header" style={{ marginBottom: '0.5rem' }}>
                <div className="stat-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Solar Yield <span className="badge" style={{fontSize: '0.6rem'}}>MEASURED</span></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                <div className="stat-icon green" style={{ width: 48, height: 48 }}><Sun size={24} /></div>
                <div className="stat-value">{telemetry.solar_power.toFixed(2)}<span className="stat-unit">kW</span></div>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Peak Today: <span style={{color:'var(--text-main)', fontWeight:500}}>3.40 kW</span></div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Efficiency: <span style={{color:'var(--accent-green)', fontWeight:500}}>98%</span></div>
              </div>
            </div>
            <div className="bento-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="stat-header" style={{ marginBottom: '0.5rem' }}>
                <div className="stat-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Consumption <span className="badge" style={{fontSize: '0.6rem'}}>ESTIMATED</span></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                <div className="stat-icon blue" style={{ width: 48, height: 48 }}><Home size={24} /></div>
                <div className="stat-value">{telemetry.home_consumption.toFixed(2)}<span className="stat-unit">kW</span></div>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Base Load: <span style={{color:'var(--text-main)', fontWeight:500}}>0.40 kW</span></div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Loads: <span style={{color:'var(--accent-blue)', fontWeight:500}}>3</span></div>
              </div>
            </div>
        </div>

        {/* AI Insight Card */}
        <div className="bento-card card-ai animate-in d-2" style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column' }}>
          <div className="ai-header-title">
            <Cpu size={16} /> Autonomous Intelligence
          </div>
          
          {suggestion ? (
            <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
              <div className="ai-suggestion-title">
                {suggestion.title}
              </div>
              <div className="ai-suggestion-desc">
                {suggestion.description}
              </div>
              
              <div className="ai-logic-box">
                 <span style={{color: 'var(--accent-blue)', fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Logic Trigger</span>
                 <span style={{color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500}}>{suggestion.reason}</span>
              </div>
              
              <div style={{marginTop: 'auto'}}>
                 <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }} onClick={() => handleApprove(suggestion.task_id)} disabled={isExecuting}>
                   {isExecuting ? <div className="spinner"></div> : <><Lock size={16} /> Unlock Verified Optimization</>}
                 </button>
              </div>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem 0'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0, 245, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle size={24} color="var(--accent-green)" />
                </div>
                <div>
                   <div style={{fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)'}}>Systems Optimal</div>
                   <div style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>No immediate action required</div>
                </div>
              </div>
              
              <div style={{ background: 'var(--bg-card-hover)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>Active Strategies</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)' }}></div> Solar Self-Consumption Maximization
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-blue)' }}></div> Predictive Peak Shaving
                </div>
              </div>
              
              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Next Scan: <span style={{color: 'var(--text-main)', fontWeight: 500}}>Live</span></div>
                 <div style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>View AI Logs <ArrowRight size={14}/></div>
              </div>
            </div>
          )}
        </div>

        {/* Chart Card */}
        <div className="bento-card card-chart animate-in d-3" style={{ gridColumn: 'span 4' }}>
          <div className="chart-header">
            <div className="chart-title">Energy Flow Pulse</div>
            <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.9rem', fontWeight: 500}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: visibleLines.solar ? 1 : 0.4, transition: 'opacity 0.2s'}} onClick={() => toggleLine('solar')}>
                 <div style={{width: 12, height: 12, borderRadius: '4px', background: 'var(--accent-green)'}}></div> Solar Generation
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: visibleLines.consumption ? 1 : 0.4, transition: 'opacity 0.2s'}} onClick={() => toggleLine('consumption')}>
                 <div style={{width: 12, height: 12, borderRadius: '4px', background: 'var(--accent-blue)'}}></div> Home Demand
               </div>
            </div>
          </div>
          <div style={{height: '320px', width: '100%', marginTop: '2rem'}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 13, fontWeight: 500}} dy={15} />
                <YAxis domain={[0, 'auto']} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 13, fontWeight: 500}} dx={-10} />
                <Tooltip 
                  cursor={{ stroke: 'var(--text-muted)', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: 'var(--glass-shadow)' }}
                  itemStyle={{ fontWeight: 600 }}
                  labelStyle={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}
                  formatter={(value) => [`${value} kW`]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <ReferenceLine y={2.0} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Flexible Load Threshold (2.00 kW)', fill: '#f59e0b', fontSize: 12 }} />
                <Area hide={!visibleLines.solar} type="monotone" dataKey="solar" stroke="var(--accent-green)" fillOpacity={1} fill="url(#colorSolar)" strokeWidth={3} dot={{r: 4, fill: 'var(--bg-card)', stroke: 'var(--accent-green)', strokeWidth: 2}} activeDot={{r: 6, fill: 'var(--accent-green)'}} />
                <Area hide={!visibleLines.consumption} type="monotone" dataKey="consumption" stroke="var(--accent-blue)" fillOpacity={1} fill="url(#colorHome)" strokeWidth={3} dot={{r: 4, fill: 'var(--bg-card)', stroke: 'var(--accent-blue)', strokeWidth: 2}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
      
      {showToast && (
        <div className="toast">
          <CheckCircle size={20} /> Task execution authorized successfully
        </div>
      )}

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content bento-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wallet size={20} color="var(--accent-green)" /> Payment Required (x402)</h2>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowPaymentModal(false)} />
            </div>
            
            <div style={{ background: 'var(--bg-card-hover)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Network</span>
                <span style={{ fontWeight: 500 }}>Algorand Testnet</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Action</span>
                <span style={{ fontWeight: 500 }}>Authorize Execution</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Total Cost</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{paymentCost} ALGO</span>
              </div>
            </div>
            
            {paymentError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} /> {paymentError}
              </div>
            )}
            
            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={handleSimulatedPayment} disabled={isExecuting}>
              {isExecuting ? <div className="spinner"></div> : `Pay & Unlock System`}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>Demo purposes only. No real funds will be transferred.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
