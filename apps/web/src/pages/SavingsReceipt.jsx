import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  Download, 
  Share2, 
  FileText, 
  Info, 
  TrendingDown, 
  Leaf, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import DataSourceBadge from '../components/DataSourceBadge';

const SavingsReceipt = () => {
  const { id } = useParams();
  const receiptId = id || 'SR-240824-017';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8 pb-12 h-full max-w-5xl mx-auto">
      
      {/* Action Header (No Print) */}
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-4 no-print">
        <div className="text-sm font-semibold text-gray-500 tracking-wide">
          Receipts / {receiptId}
        </div>
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
             <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Savings Receipt</h1>
             <div className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200 flex items-center gap-1 text-xs uppercase tracking-wider">
               <CheckCircle2 size={14} /> Task verified
             </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-outline bg-white border-gray-200 shadow-sm" onClick={handlePrint}>
              <Download size={18} /> Download PDF
            </button>
            <button className="btn btn-outline bg-white border-gray-200 shadow-sm text-indigo-600">
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Printable Area Starts Here */}
      <div className="flex flex-col gap-6 border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-white" id="printable-receipt">
        
        {/* Receipt Header / Meta */}
        <div className="card bg-gray-50 border-gray-200 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div>
              <div className="flex items-center gap-2 text-teal-700 font-bold mb-1">
                <FileText size={20} /> UrjaSetu Official Receipt
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{receiptId}</h2>
              <div className="mt-4 text-sm text-gray-600 font-medium flex flex-col gap-1">
                <div>Property: <span className="text-gray-900">Shanti Hostel, Roorkee</span></div>
                <div>Completed: <span className="text-gray-900">1:14 PM (Today)</span></div>
              </div>
           </div>
           
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm min-w-[240px]">
              <div className="text-sm font-bold text-gray-700 uppercase mb-3">Task Details</div>
              <div className="flex justify-between items-center mb-2">
                 <span className="text-sm text-gray-500">Task</span>
                 <span className="font-bold text-gray-900">Water Pump</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                 <span className="text-sm text-gray-500">Runtime</span>
                 <span className="font-bold text-gray-900">45 minutes</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                 <span className="text-sm text-gray-500">Task energy</span>
                 <span className="font-bold text-gray-900">0.98 kWh</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm text-gray-500">Solar share</span>
                 <span className="font-bold text-amber-600">92%</span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-100 font-semibold text-sm">
           <CheckCircle2 size={18} /> Task completed before 4:00 PM deadline
        </div>

        {/* Core Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
           
           {/* Without Plan */}
           <div className="card border-gray-200 bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>
              <h3 className="text-lg font-bold text-gray-700 mb-6 flex justify-between items-center">
                Without UrjaSetu plan
                <span className="text-[10px] uppercase bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold tracking-wider">Estimated baseline</span>
              </h3>
              
              <div className="flex flex-col gap-4">
                 <div>
                   <div className="text-sm font-medium text-gray-500 mb-1">Solar used</div>
                   <div className="text-xl font-bold text-gray-900">0.42 <span className="text-sm text-gray-500">kWh</span></div>
                 </div>
                 <div className="pt-4 border-t border-gray-100">
                   <div className="text-sm font-medium text-gray-500 mb-1">Baseline net cost</div>
                   <div className="text-3xl font-bold text-red-500">₹12</div>
                 </div>
              </div>
           </div>

           {/* With Plan */}
           <div className="card border-teal-200 bg-teal-50/30 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
              <h3 className="text-lg font-bold text-teal-900 mb-6 flex justify-between items-center">
                With UrjaSetu plan
                <span className="text-[10px] uppercase bg-teal-100 text-teal-700 px-2 py-1 rounded font-bold tracking-wider border border-teal-200">Measured + Estimated</span>
              </h3>
              
              <div className="flex flex-col gap-4">
                 <div>
                   <div className="text-sm font-medium text-teal-700/70 mb-1">Solar used</div>
                   <div className="text-xl font-bold text-teal-900">0.90 <span className="text-sm text-teal-700/70">kWh</span></div>
                 </div>
                 <div className="pt-4 border-t border-teal-200/50">
                   <div className="text-sm font-medium text-teal-700/70 mb-1 flex items-center gap-2">Optimized net cost <TrendingDown size={16} className="text-emerald-500"/></div>
                   <div className="text-3xl font-bold text-emerald-600">₹0</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Benefit Breakdown */}
        <div className="card bg-purple-50 border-purple-200 mt-2">
           <h3 className="text-xl font-bold text-purple-900 mb-6">Benefit Breakdown</h3>
           
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-6">
              <div className="flex-1 w-full">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-gray-600 font-medium">Existing solar benefit</span>
                   <span className="font-bold text-gray-900">₹31</span>
                 </div>
                 <div className="flex justify-between items-center mb-4 pb-4 border-b border-purple-200/50">
                   <span className="text-purple-700 font-bold">UrjaSetu incremental benefit</span>
                   <span className="font-black text-emerald-600 text-lg">+ ₹18</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-purple-900 font-bold text-lg">Total task benefit</span>
                   <span className="font-black text-purple-700 text-2xl">₹49</span>
                 </div>
              </div>

              <div className="flex-1 bg-white/60 p-4 rounded-xl border border-purple-100 text-purple-800 text-sm font-medium leading-relaxed italic relative">
                 <div className="absolute top-2 left-2 text-purple-300 opacity-50 text-4xl font-serif">"</div>
                 <div className="relative z-10 px-4 py-2">
                   ₹31 aapke solar ka fayda tha. UrjaSetu ne timing optimize karke ₹18 extra bachane mein madad ki.
                 </div>
              </div>
           </div>
           
           <div className="flex items-start gap-2 text-xs font-semibold text-purple-700 bg-white/40 p-3 rounded-lg border border-purple-100">
             <Info size={16} className="shrink-0" />
             No benefit hidden — Agar incremental benefit ₹0 hota, receipt wahi dikhata.
           </div>
        </div>

        {/* Calculation Disclosure & Provenance */}
        <div className="card mt-2">
           <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
             <ShieldCheck size={20} className="text-teal-600" /> Calculation Disclosure & Provenance
           </h3>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                 <div className="text-xs text-gray-500 mb-1">Tariff</div>
                 <div className="font-bold text-gray-900 mb-2">₹8.0/kWh</div>
                 <DataSourceBadge type="Simulated" />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                 <div className="text-xs text-gray-500 mb-1">Export credit</div>
                 <div className="font-bold text-gray-900 mb-2">₹3.0/kWh</div>
                 <DataSourceBadge type="Simulated" />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                 <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Leaf size={12} className="text-emerald-500"/> CO₂ avoided</div>
                 <div className="font-bold text-gray-900 mb-2">0.66 kg</div>
                 <DataSourceBadge type="Indicative" />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                 <div className="text-xs text-gray-500 mb-1">Baseline method</div>
                 <div className="font-bold text-gray-900 text-sm mb-2 leading-tight">Similar-day profile</div>
                 <DataSourceBadge type="Estimated" />
              </div>
           </div>

           <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-100 gap-4">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={12}/> Energy measured</span>
                <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={12}/> Runtime measured</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-wider">
                RETROFIT <ArrowRight size={12} /> TASK <ArrowRight size={12} /> <span className="text-teal-600">PROOF</span>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default SavingsReceipt;
