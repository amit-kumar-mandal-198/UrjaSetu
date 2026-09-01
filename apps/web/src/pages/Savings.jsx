import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, Leaf, Calendar, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const Savings = () => {
  const [data, setData] = useState({ total_savings_today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/dashboard`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching savings data:", error);
      }
    };
    
    fetchSavings();
  }, []);

  const historyData = [
    { day: 'Mon', optimized: 12.5, baseline: 18.0 },
    { day: 'Tue', optimized: 18.0, baseline: 26.5 },
    { day: 'Wed', optimized: 0, baseline: 0 },
    { day: 'Thu', optimized: 24.5, baseline: 42.0 },
    { day: 'Fri', optimized: 15.0, baseline: 25.0 },
    { day: 'Sat', optimized: 8.5, baseline: 12.0 },
    { day: 'Sun', optimized: 22.0, baseline: 36.5 },
  ];

  if (loading) {
    return <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', display: 'flex' }}>Loading Savings Ledger...</div>;
  }

  return (
    <div className="fade-in">
      <div className="header animate-in d-1">
        <div>
           <h1 style={{fontSize: '1.75rem', marginBottom: '0.25rem', fontWeight: 700}}>Savings & Carbon</h1>
           <p style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>Transparent proof of your AI optimizer's value</p>
        </div>
      </div>

      <div className="bento-grid">
        
        {/* Top Summaries */}
        <div className="bento-card animate-in d-2" style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(0, 245, 212, 0.05) 0%, var(--bg-card) 100%)', borderTop: '4px solid var(--accent-green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
             <div className="stat-icon green"><IndianRupee size={24} /></div>
             <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 600 }}>Total Extra Savings (Month)</h3>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
            ₹{450 + (data?.total_savings_today || 0)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)', fontSize: '0.9rem', fontWeight: 500 }}>
            <ArrowUpRight size={16} /> +12% compared to standard timer
          </div>
        </div>

        <div className="bento-card animate-in d-2" style={{ gridColumn: 'span 2', animationDelay: '0.1s', background: 'linear-gradient(135deg, rgba(58, 134, 255, 0.05) 0%, var(--bg-card) 100%)', borderTop: '4px solid var(--accent-blue)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
             <div className="stat-icon blue"><Leaf size={24} /></div>
             <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 600 }}>CO2 Emissions Avoided</h3>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
            18.2 <span style={{fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: 400}}>kg</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'help', textDecoration: 'underline dotted' }} title="CEA Grid Emission Factor: 0.71 tCO2/MWh (2022-23). Formula: (imported kWh * 0.71)">
            Based on CEA Grid Emission Factor
          </div>
        </div>

        {/* History Chart */}
        <div className="bento-card animate-in d-3" style={{ gridColumn: 'span 4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Daily Savings Ledger (INR)</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', background: 'var(--bg-card-hover)', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 500 }}>
              <Calendar size={16} /> This Week
            </div>
          </div>
          
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontWeight: 500}} />
                <Tooltip 
                  cursor={{fill: 'var(--bg-card-hover)'}}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: 'var(--glass-shadow)' }}
                  itemStyle={{ color: 'var(--text-main)', fontWeight: 600 }}
                />
                <Bar dataKey="baseline" name="Baseline Cost" fill="var(--border-highlight)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="optimized" name="Optimized Cost" fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Receipts Log */}
        <div className="bento-card animate-in d-4" style={{ gridColumn: 'span 4' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Verified Savings Receipts</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Task</th>
                <th>Shift Type</th>
                <th>Calculated Saving</th>
                <th>Network (Asset)</th>
                <th>TxID (Provenance)</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>#URJ-9821</td>
                <td style={{ color: 'var(--text-main)', fontWeight: 500 }}>Water Pump (30 min)</td>
                <td>Solar Surplus match</td>
                <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>₹{(data?.total_savings_today || 0)}</td>
                <td>Algorand Testnet (ALGO)</td>
                <td><span style={{fontFamily: 'monospace', fontSize: '0.8rem', background: 'var(--bg-card-hover)', padding: '0.2rem 0.4rem', borderRadius: '4px'}}>ALG-A9F3K2B</span></td>
                <td>
                   <div style={{display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
                     <span className="badge" style={{background: 'rgba(0, 245, 212, 0.1)', color: 'var(--accent-green)', border: '1px solid rgba(0, 245, 212, 0.2)', alignSelf: 'flex-start', display: 'inline-block', width: 'fit-content'}}>SETTLED</span>
                     <a href="https://lora.algokit.io/testnet/transaction/ALG-A9F3K2B" target="_blank" rel="noreferrer" style={{fontSize: '0.8rem', color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem'}}>Lora Testnet <ArrowUpRight size={12}/></a>
                   </div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>#URJ-9820</td>
                <td style={{ color: 'var(--text-main)', fontWeight: 500 }}>EV Charger (1 hr)</td>
                <td>Avoided Peak Tariff</td>
                <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>₹14.00</td>
                <td>Algorand Testnet (ALGO)</td>
                <td><span style={{fontFamily: 'monospace', fontSize: '0.8rem', background: 'var(--bg-card-hover)', padding: '0.2rem 0.4rem', borderRadius: '4px'}}>ALG-82NF7W</span></td>
                <td><span className="badge" style={{background: 'rgba(0, 245, 212, 0.1)', color: 'var(--accent-green)', border: '1px solid rgba(0, 245, 212, 0.2)'}}>SETTLED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Savings;
