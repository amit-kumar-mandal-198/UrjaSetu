import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Droplets, 
  Sun, 
  Zap, 
  AlertTriangle, 
  Clock, 
  Info,
  ClipboardCheck,
  Server
} from 'lucide-react';

const TaskReview = () => {
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);

  const handleApprove = () => {
    // Generate a mock plan ID and navigate
    navigate('/tasks/water-pump/live', { state: { planId: 'PLAN-9X2V', taskId: 'water-pump' } });
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
        <div className="text-sm font-semibold text-gray-500 tracking-wide">
          Smart Tasks / Water Pump
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Review task plan</h1>
              <div className="px-3 py-1 bg-purple-50 text-purple-700 font-bold rounded-full border border-purple-200 uppercase tracking-wider text-xs">
                Ready for approval
              </div>
            </div>
            <p className="text-gray-500 text-lg">UrjaSetu ne solar forecast, tariff aur deadline ko compare karke yeh plan banaya hai.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Task Info & Timeline) */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* Task Info */}
          <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Droplets size={32} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-gray-900">Water Pump</h3>
                   <div className="text-sm font-medium text-purple-600">Flexible Load</div>
                </div>
             </div>
             
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full sm:w-auto">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Required runtime</div>
                  <div className="font-bold text-gray-900">45 minutes</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Complete before</div>
                  <div className="font-bold text-gray-900">4:00 PM</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Flexible start</div>
                  <div className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle size={14}/> Yes</div>
                </div>
             </div>
          </div>

          {/* Timeline Visual */}
          <div className="card">
             <h3 className="text-lg font-semibold mb-6">Optimization Timeline (10 AM - 5 PM)</h3>
             
             <div className="relative pt-8 pb-12 overflow-x-auto">
                <div className="min-w-[600px] relative">
                   {/* Base axis */}
                   <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -mt-0.5 rounded-full"></div>
                   
                   {/* Tariffs & Solar (Abstract representation) */}
                   <div className="absolute top-0 left-[0%] right-[60%] h-full bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-l-lg border-t border-amber-200 border-dashed"></div>
                   <div className="absolute top-0 left-[60%] right-[0%] h-full bg-blue-50/50 border-t border-blue-200 border-dashed rounded-r-lg"></div>

                   {/* Time Markers */}
                   <div className="flex justify-between relative z-10">
                      {[10, 11, 12, 13, 14, 15, 16, 17].map((hour) => {
                         const displayHour = hour > 12 ? hour - 12 : hour;
                         const ampm = hour >= 12 ? 'PM' : 'AM';
                         return (
                           <div key={hour} className="flex flex-col items-center">
                              <div className="w-1 h-3 bg-gray-300 rounded mb-2"></div>
                              <div className="text-xs font-semibold text-gray-500">{displayHour} {ampm}</div>
                           </div>
                         );
                      })}
                   </div>

                   {/* Data annotations */}
                   <div className="absolute top-2 left-[20%] text-xs font-semibold text-amber-600">Peak Solar Region</div>
                   <div className="absolute top-2 left-[70%] text-xs font-semibold text-blue-600">High Tariff Begins (4PM)</div>

                   {/* Slot 1: Best */}
                   <div className="absolute top-1/2 left-[35.7%] w-[10.7%] h-3 bg-purple-500 rounded-full -mt-1.5 shadow-md shadow-purple-200 z-20" title="12:30 PM - 1:15 PM"></div>
                   <div className="absolute top-[60%] left-[34%] bg-purple-100 border border-purple-200 text-purple-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap z-30">
                     Best slot (12:30-1:15)
                   </div>

                   {/* Slot 2: Alternative */}
                   <div className="absolute top-1/2 left-[50%] w-[10.7%] h-3 bg-gray-400 rounded-full -mt-1.5 z-20" title="1:30 PM - 2:15 PM"></div>
                   <div className="absolute top-[60%] left-[50%] bg-gray-100 border border-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap z-30">
                     Alt. slot (1:30-2:15)
                   </div>
                </div>
             </div>
          </div>

          {/* 3 Explanation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             
             {/* Why this slot */}
             <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <div className="flex items-center gap-2 text-amber-700 mb-4 font-semibold">
                  <Sun size={20} /> Why this slot?
                </div>
                <div className="text-sm text-amber-800 mb-2">Maximum predicted solar surplus overlaps with lowest household demand.</div>
                <div className="mt-auto">
                   <div className="text-xs font-medium text-amber-700/70 mb-1">Solar forecast</div>
                   <div className="text-2xl font-bold text-amber-600">4.2 kW <span className="text-sm font-semibold bg-amber-200 px-2 py-0.5 rounded ml-2">Forecast</span></div>
                </div>
             </div>

             {/* Expected Result */}
             <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <div className="flex items-center gap-2 text-emerald-700 mb-4 font-semibold">
                  <Zap size={20} /> Expected result
                </div>
                <div className="flex flex-col gap-3">
                   <div className="pb-3 border-b border-emerald-200/60">
                     <div className="text-xs font-medium text-emerald-800/70 mb-1">Existing-solar benefit</div>
                     <div className="text-lg font-bold text-emerald-700">₹31</div>
                   </div>
                   <div>
                     <div className="text-xs font-medium text-emerald-800/70 mb-1">UrjaSetu incremental benefit</div>
                     <div className="text-2xl font-bold text-emerald-600">+ ₹18</div>
                   </div>
                </div>
             </div>

             {/* Assumptions */}
             <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 text-gray-700 mb-4 font-semibold">
                  <Info size={20} /> Assumptions
                </div>
                <div className="flex flex-col gap-2">
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500">Tariff</span>
                     <span className="font-bold text-gray-700">₹8.0/kWh</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500">Export credit</span>
                     <span className="font-bold text-gray-700">₹3.0/kWh</span>
                   </div>
                   <div className="flex justify-between items-center text-sm pt-2 mt-1 border-t border-gray-200">
                     <span className="text-gray-500">Data source</span>
                     <span className="font-semibold text-gray-600 bg-gray-200 px-2 py-0.5 rounded text-xs">Simulated</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column (Approval Panel) */}
        <div className="xl:col-span-1">
          <div className="card h-full flex flex-col bg-white border-gray-200">
             
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                 <ClipboardCheck size={24} />
               </div>
               <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Your task plan</h3>
             </div>
             
             <div className="flex flex-col gap-4 mb-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Clock size={16} /> Start
                  </div>
                  <span className="font-bold text-gray-900">12:30 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Clock size={16} /> Finish
                  </div>
                  <span className="font-bold text-gray-900">1:15 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Clock size={16} /> Complete before
                  </div>
                  <span className="font-bold text-gray-900">4:00 PM</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Command expires</span>
                  <span className="font-semibold text-gray-700">12:20 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Server size={16} /> Mode
                  </div>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-200">Advice only</span>
                </div>
             </div>

             <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-gray-100">
                <label className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-100/50 transition-colors">
                  <input 
                    type="checkbox" 
                    className="mt-0.5 w-4 h-4 text-indigo-600 accent-indigo-600 rounded border-gray-300"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                  />
                  <span className="text-sm font-semibold text-blue-900">
                    I understand the prototype does not switch mains power.
                  </span>
                </label>

                <button 
                  onClick={handleApprove}
                  disabled={!confirmed}
                  className={`btn w-full py-4 text-lg font-bold tracking-wide transition-all shadow-md ${confirmed ? 'btn-primary' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border-gray-200'}`}
                >
                  Approve this plan
                </button>
                
                <button className="btn w-full bg-white border border-gray-200 text-indigo-700 hover:bg-gray-50 font-semibold shadow-sm py-3">
                  Choose another time
                </button>
                <button className="w-full text-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors mt-2">
                  Skip task
                </button>
             </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100 mt-4 shadow-sm">
             <AlertTriangle size={24} className="text-red-600 shrink-0" />
             <span className="text-sm font-medium text-red-900">
               If data becomes stale or unsafe, UrjaSetu will <strong>HOLD</strong> and notify you.
             </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TaskReview;
