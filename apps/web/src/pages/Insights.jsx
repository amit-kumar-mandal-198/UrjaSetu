import React, { useState } from 'react';
import { 
  Sun, 
  Home, 
  Zap, 
  Leaf, 
  Lightbulb, 
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import TopNavigation from '../components/TopNavigation';
import MetricCard from '../components/MetricCard';

const WEEKLY_DATA = [
  { name: 'Mon', solar: 12.1, import: 4.2, export: 1.5 },
  { name: 'Tue', solar: 14.2, import: 2.1, export: 2.8 },
  { name: 'Wed', solar: 8.5, import: 6.5, export: 0.2 },
  { name: 'Thu', solar: 11.2, import: 3.8, export: 1.2 },
  { name: 'Fri', solar: 13.8, import: 2.0, export: 2.5 },
  { name: 'Sat', solar: 15.1, import: 1.5, export: 3.2 },
  { name: 'Sun', solar: 11.5, import: 2.5, export: 1.8 }
];

const PIE_DATA = [
  { name: 'Building', value: 72, color: '#3b82f6' },
  { name: 'Flexible tasks', value: 18, color: '#a855f7' },
  { name: 'Grid export', value: 10, color: '#10b981' }
];

const Insights = () => {
  const [period, setPeriod] = useState('7d');

  return (
    <div className="animate-fade-in flex flex-col gap-8 pb-12 h-full">
      <TopNavigation title="Energy & carbon insights" />

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6 -mt-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Energy & carbon insights</h1>
          <p className="text-gray-600 text-lg">Samjhein solar kahan use hua, grid kab use hua, aur UrjaSetu ne kis task mein help ki.</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
           <button 
             onClick={() => setPeriod('1d')}
             className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${period === '1d' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Today
           </button>
           <button 
             onClick={() => setPeriod('7d')}
             className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${period === '7d' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Last 7 days
           </button>
           <button 
             onClick={() => setPeriod('30d')}
             className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${period === '30d' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Last 30 days
           </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Solar produced" value="86.4" unit="kWh" icon={Sun} dataSourceType="Measured" />
        <MetricCard title="Self-consumed" value="62.1" unit="kWh" icon={Home} iconBgClass="bg-blue-100" iconColorClass="text-blue-600" dataSourceType="Measured" />
        <MetricCard title="Grid imported" value="18.7" unit="kWh" icon={Zap} iconBgClass="bg-red-100" iconColorClass="text-red-600" dataSourceType="Measured" />
        <MetricCard title="CO₂ avoided" value="49.8" unit="kg" icon={Leaf} iconBgClass="bg-emerald-100" iconColorClass="text-emerald-600" dataSourceType="Indicative" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (Main Charts) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
           
           {/* Main Weekly Chart */}
           <div className="card flex-1 min-h-[400px] flex flex-col">
              <h3 className="text-lg font-semibold mb-6 text-gray-900">Energy Source Breakdown (Last 7 Days)</h3>
              <div className="flex-1 w-full" style={{ minHeight: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                    <YAxis tickLine={false} axisLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f3f4f6' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />
                    <Bar dataKey="solar" name="Solar used (kWh)" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" maxBarSize={45} />
                    <Bar dataKey="import" name="Grid import (kWh)" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" maxBarSize={45} />
                    <Bar dataKey="export" name="Grid export (kWh)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Smart Pattern Callout */}
           <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
              <div className="flex items-start gap-4 z-10 relative">
                 <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0 border border-purple-200">
                    <Lightbulb size={24} />
                 </div>
                 <div>
                    <h4 className="font-bold text-purple-900 text-lg mb-1">Smart Pattern Identified</h4>
                    <p className="text-purple-800 font-medium">12 PM–2 PM mein average solar surplus sabse zyada hai. Flexible tasks ko is window mein schedule karna useful ho sakta hai.</p>
                 </div>
              </div>
              <button className="btn btn-primary shrink-0 z-10 w-full md:w-auto bg-purple-600 hover:bg-purple-700 border-transparent text-white">
                Create a smart task
              </button>
           </div>
        </div>

        {/* Right Column (Distribution & Impacts) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
           
           {/* Solar Usage Breakdown */}
           <div className="card flex flex-col">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Solar Distribution</h3>
              <div className="flex items-center justify-center h-[220px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={PIE_DATA}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={90}
                       paddingAngle={3}
                       dataKey="value"
                       stroke="none"
                     >
                       {PIE_DATA.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <Tooltip 
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                       formatter={(value) => [`${value}%`, 'Share']}
                     />
                   </PieChart>
                 </ResponsiveContainer>
              </div>
              
              <div className="flex flex-col gap-3 mt-4">
                 {PIE_DATA.map(item => (
                   <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                         <span className="text-sm font-medium text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{item.value}%</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Task-impact Section */}
           <div className="card flex-1">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">AI Task Impact</h3>
              
              <div className="flex flex-col gap-3">
                 
                 <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">Water Pump</div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
                        <CheckCircle2 size={12} /> Verified
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="font-bold text-emerald-600">+₹18</div>
                       <div className="text-[10px] text-gray-500 font-medium">Incremental benefit</div>
                    </div>
                 </div>

                 <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between opacity-75">
                    <div>
                      <div className="font-bold text-gray-900">Laundry</div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 mt-1">
                        <XCircle size={12} /> Skipped
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="font-bold text-gray-500">₹0</div>
                       <div className="text-[10px] text-gray-500 font-medium">Incremental benefit</div>
                    </div>
                 </div>

                 <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">EV charging demo</div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 mt-1">
                        <HelpCircle size={12} /> Simulated
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="font-bold text-emerald-600">+₹24</div>
                       <div className="text-[10px] text-gray-500 font-medium">Incremental benefit</div>
                    </div>
                 </div>

              </div>
           </div>

        </div>
      </div>

      {/* Disclaimers & Provenance */}
      <div className="mt-4 flex flex-col items-center gap-6">
         
         <div className="flex items-start gap-2 bg-gray-100 px-4 py-3 rounded-lg border border-gray-200 text-sm max-w-2xl mx-auto text-gray-600 font-medium">
            <Info size={18} className="shrink-0 mt-0.5 text-gray-500" />
            <p>CO₂ estimate CEA grid-emission factor par based hai—ye indicative hai, certified carbon credit nahi.</p>
         </div>

         <div className="flex flex-wrap justify-center items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>Measured</span>
            <span className="text-gray-300">·</span>
            <span>Estimated</span>
            <span className="text-gray-300">·</span>
            <span>Forecast</span>
            <span className="text-gray-300">·</span>
            <span>Simulated</span>
            <span className="text-gray-300">·</span>
            <span>Indicative</span>
         </div>
         
      </div>

    </div>
  );
};

export default Insights;
