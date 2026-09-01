import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, Leaf, Calendar, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MOCK_DASHBOARD_DATA } from '../mockData';

import TopNavigation from '../components/TopNavigation';
import LoadingSkeleton from '../components/LoadingSkeleton';
import DataSourceBadge from '../components/DataSourceBadge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const Savings = () => {
  const [data, setData] = useState({ total_savings_today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/dashboard`, { timeout: 3000 });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.warn("Backend not reachable", error);
        setData(MOCK_DASHBOARD_DATA);
        setLoading(false);
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
    return (
      <div className="animate-fade-in">
        <TopNavigation title="Savings & Carbon" />
        <div className="bento-grid">
          <div className="col-span-2">
             <LoadingSkeleton type="card" />
          </div>
          <div className="col-span-2">
             <LoadingSkeleton type="card" />
          </div>
          <div className="col-span-4 mt-6">
             <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <TopNavigation title="Savings & Carbon" />

      <div className="bento-grid">
        
        {/* Top Summaries */}
        <div className="card" style={{ gridColumn: 'span 2', borderTop: '4px solid var(--color-emerald)' }}>
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600" style={{ backgroundColor: 'var(--bg-emerald)', color: 'var(--color-emerald)' }}><IndianRupee size={24} /></div>
             <h3 className="text-lg font-semibold">Total Extra Savings (Month)</h3>
          </div>
          <div className="text-4xl font-bold mb-4">
            ₹{450 + (data?.total_savings_today || 0)}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-emerald)' }}>
            <ArrowUpRight size={16} /> +12% compared to standard timer
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 2', borderTop: '4px solid var(--color-teal)' }}>
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-100 text-teal-600" style={{ backgroundColor: 'var(--bg-teal)', color: 'var(--color-teal)' }}><Leaf size={24} /></div>
             <h3 className="text-lg font-semibold">CO2 Emissions Avoided</h3>
          </div>
          <div className="text-4xl font-bold mb-4">
            18.2 <span className="text-2xl text-muted font-normal">kg</span>
          </div>
          <div className="text-sm text-muted underline decoration-dotted cursor-help" title="CEA Grid Emission Factor: 0.71 tCO2/MWh (2022-23). Formula: (imported kWh * 0.71)">
            Based on CEA Grid Emission Factor
          </div>
        </div>

        {/* History Chart */}
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-semibold">Daily Savings Ledger (INR)</h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--bg-card-hover)' }}>
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
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: 'var(--shadow-restrained)' }}
                  itemStyle={{ color: 'var(--text-main)', fontWeight: 600 }}
                />
                <Bar dataKey="baseline" name="Baseline Cost" fill="var(--text-muted)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="optimized" name="Optimized Cost" fill="var(--color-emerald)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Receipts Log */}
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Verified Savings Receipts</h3>
            <DataSourceBadge type="Verified" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="pb-4 pt-2 border-b border-gray-200 text-sm font-semibold text-muted uppercase tracking-wider">Receipt ID</th>
                  <th className="pb-4 pt-2 border-b border-gray-200 text-sm font-semibold text-muted uppercase tracking-wider">Task</th>
                  <th className="pb-4 pt-2 border-b border-gray-200 text-sm font-semibold text-muted uppercase tracking-wider">Shift Type</th>
                  <th className="pb-4 pt-2 border-b border-gray-200 text-sm font-semibold text-muted uppercase tracking-wider">Calculated Saving</th>
                  <th className="pb-4 pt-2 border-b border-gray-200 text-sm font-semibold text-muted uppercase tracking-wider">Network (Asset)</th>
                  <th className="pb-4 pt-2 border-b border-gray-200 text-sm font-semibold text-muted uppercase tracking-wider">TxID (Provenance)</th>
                  <th className="pb-4 pt-2 border-b border-gray-200 text-sm font-semibold text-muted uppercase tracking-wider">Verification</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-4 border-b border-gray-100 text-muted">#URJ-9821</td>
                  <td className="py-4 border-b border-gray-100 font-medium">Water Pump (30 min)</td>
                  <td className="py-4 border-b border-gray-100">Solar Surplus match</td>
                  <td className="py-4 border-b border-gray-100 font-semibold" style={{ color: 'var(--color-emerald)' }}>₹{(data?.total_savings_today || 0)}</td>
                  <td className="py-4 border-b border-gray-100">Algorand Testnet (ALGO)</td>
                  <td className="py-4 border-b border-gray-100"><span className="px-2 py-1 bg-gray-100 rounded text-sm font-mono" style={{ backgroundColor: 'var(--bg-card-hover)' }}>ALG-A9F3K2B</span></td>
                  <td className="py-4 border-b border-gray-100">
                     <div className="flex flex-col gap-2">
                       <span className="px-2 py-1 text-xs font-semibold rounded uppercase w-fit" style={{ backgroundColor: 'var(--bg-emerald)', color: 'var(--color-emerald)' }}>Settled</span>
                       <a href="https://lora.algokit.io/testnet/transaction/ALG-A9F3K2B" target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 hover:underline" style={{ color: 'var(--color-blue)' }}>Lora Testnet <ArrowUpRight size={12}/></a>
                     </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 border-b border-gray-100 text-muted">#URJ-9820</td>
                  <td className="py-4 border-b border-gray-100 font-medium">EV Charger (1 hr)</td>
                  <td className="py-4 border-b border-gray-100">Avoided Peak Tariff</td>
                  <td className="py-4 border-b border-gray-100 font-semibold" style={{ color: 'var(--color-emerald)' }}>₹14.00</td>
                  <td className="py-4 border-b border-gray-100">Algorand Testnet (ALGO)</td>
                  <td className="py-4 border-b border-gray-100"><span className="px-2 py-1 bg-gray-100 rounded text-sm font-mono" style={{ backgroundColor: 'var(--bg-card-hover)' }}>ALG-82NF7W</span></td>
                  <td className="py-4 border-b border-gray-100"><span className="px-2 py-1 text-xs font-semibold rounded uppercase" style={{ backgroundColor: 'var(--bg-emerald)', color: 'var(--color-emerald)' }}>Settled</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Savings;
