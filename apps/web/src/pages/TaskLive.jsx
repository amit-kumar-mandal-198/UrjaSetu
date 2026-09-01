import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Activity, 
  Zap,
  ArrowRight,
  Sun,
  Home,
  Droplets
} from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import DataSourceBadge from '../components/DataSourceBadge';

const TaskLive = () => {
  const navigate = useNavigate();
  const [dataAge, setDataAge] = useState(6);
  const [isHold, setIsHold] = useState(false);

  // Timer for data age
  useEffect(() => {
    const timer = setInterval(() => {
      setDataAge(prev => {
        const nextAge = prev + 1;
        if (nextAge > 60) setIsHold(true);
        return nextAge;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleMarkComplete = () => {
    navigate('/receipts/SR-240824-017');
  };

  const forceHold = () => {
    setIsHold(true);
  };

  const resetState = () => {
    setDataAge(6);
    setIsHold(false);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8 pb-12 h-full">
      <TopNavigation title="Water Pump task is in progress" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6 -mt-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-lg border border-emerald-200 uppercase tracking-wider text-sm w-fit">
            <CheckCircle2 size={16} /> Approved status
          </div>
          <p className="text-gray-600 font-medium mt-2">Plan approved at 12:18 PM</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 font-medium">Target completion</p>
          <p className="text-2xl font-bold text-gray-900">1:15 PM</p>
        </div>
      </div>

      {isHold && (
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl flex items-start gap-4 shadow-sm animate-fade-in">
          <ShieldAlert size={32} className="text-red-600 shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-red-800 mb-2">TASK HOLD</h3>
            <p className="text-red-700 font-medium">Verification paused. Telemetry data became stale or an unsafe condition was detected. Task progression tracking is stopped.</p>
          </div>
        </div>
      )}

      {/* Progress Tracker */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
         <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -mt-0.5 rounded-full z-0"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2 z-10 bg-white px-2">
               <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center"><CheckCircle2 size={16}/></div>
               <span className="text-xs font-bold text-emerald-700">Plan approved</span>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2 z-10 bg-white px-2">
               <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center"><CheckCircle2 size={16}/></div>
               <span className="text-xs font-bold text-emerald-700">Start window reached</span>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2 z-10 bg-white px-2">
               <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                 <Activity size={16}/>
               </div>
               <span className="text-xs font-bold text-blue-700">Task running</span>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-center gap-2 z-10 bg-white px-2">
               <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">4</div>
               <span className="text-xs font-semibold text-gray-400">Verify completion</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Status & Energy Flow) */}
        <div className="xl:col-span-2 flex flex-col gap-8">
           
           {/* Live Status Card */}
           <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Live Status</h3>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <Clock size={14} className={dataAge > 60 ? 'text-red-500' : 'text-gray-400'} /> Updated {dataAge} sec ago · <DataSourceBadge type="Measured" />
                </div>
              </div>

              <div className="mb-8">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-bold text-gray-900">68%</span>
                    <span className="text-sm font-semibold text-gray-500">31 of 45 minutes complete</span>
                 </div>
                 <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${isHold ? 'bg-red-400' : 'bg-blue-500'} rounded-full transition-all duration-1000`} style={{ width: '68%' }}></div>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-xs font-medium text-gray-500 mb-1">Projected finish</div>
                    <div className="text-lg font-bold text-gray-900">1:14 PM</div>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-xs font-medium text-gray-500 mb-1">Task energy</div>
                    <div className="text-lg font-bold text-gray-900">0.74 <span className="text-sm font-medium">kWh</span></div>
                 </div>
                 <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <div className="text-xs font-medium text-amber-700 mb-1">Solar share</div>
                    <div className="text-lg font-bold text-amber-600">92%</div>
                 </div>
                 <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                    <div className="text-xs font-medium text-emerald-700 mb-1">Grid share</div>
                    <div className="text-lg font-bold text-emerald-600">8%</div>
                 </div>
              </div>
           </div>

           {/* Energy Flow Card (Specialized) */}
           <div className="card">
              <h3 className="text-lg font-semibold mb-6">Task Load Profile</h3>
              
              <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
                 
                 {/* Solar */}
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2 border-2 border-amber-200">
                      <Sun size={28} />
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Solar</div>
                    <div className="text-xl font-bold text-amber-600">4.1 <span className="text-sm">kW</span></div>
                 </div>
                 
                 <ArrowRight className="text-gray-300 hidden md:block" size={32} />
                 
                 {/* Building + Pump */}
                 <div className="flex flex-col items-center">
                    <div className="flex gap-2 mb-2">
                       <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-blue-200">
                         <Home size={28} />
                       </div>
                       <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 border-2 border-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                         <Droplets size={28} />
                       </div>
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Building + Pump</div>
                    <div className="text-xl font-bold text-gray-900">2.0 <span className="text-gray-400">+</span> <span className="text-purple-600">1.1</span> <span className="text-sm">kW</span></div>
                 </div>

                 <ArrowRight className="text-gray-300 hidden md:block" size={32} />

                 {/* Grid Export */}
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2 border-2 border-emerald-200">
                      <Zap size={28} />
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Grid Export</div>
                    <div className="text-xl font-bold text-emerald-600">1.0 <span className="text-sm">kW</span></div>
                 </div>

              </div>
           </div>

        </div>

        {/* Right Column (Timeline & Actions) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
           
           <div className="card flex-1 border-blue-200 shadow-md">
              <h3 className="text-lg font-semibold mb-6 text-gray-900">Event Timeline</h3>
              
              <div className="relative border-l-2 border-gray-100 ml-3 flex flex-col gap-6 mb-8">
                 <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                    <div className="text-xs font-bold text-gray-500 mb-0.5">12:18 PM</div>
                    <div className="text-sm font-semibold text-gray-900">Plan approved by Satyam</div>
                 </div>
                 <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                    <div className="text-xs font-bold text-gray-500 mb-0.5">12:30 PM</div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">Start instruction issued</div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 text-xs font-medium text-gray-600">
                      <div>Command ID: <span className="font-bold text-gray-800">CMD-48A7</span></div>
                      <div>Command expiry: 12:32 PM</div>
                    </div>
                 </div>
                 <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                    <div className="text-xs font-bold text-gray-500 mb-0.5">12:31 PM</div>
                    <div className="text-sm font-semibold text-gray-900">Pump activity detected</div>
                 </div>
                 <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white shadow-[0_0_0_2px_rgba(59,130,246,0.2)]"></div>
                    <div className="text-xs font-bold text-blue-600 mb-0.5">12:52 PM</div>
                    <div className="text-sm font-bold text-blue-700">Running normally</div>
                 </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-8">
                 <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Verification checks</h4>
                 <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600"><CheckCircle2 size={16} className="text-emerald-500"/> Signal fresh</div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600"><CheckCircle2 size={16} className="text-emerald-500"/> Runtime tracking</div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600"><CheckCircle2 size={16} className="text-emerald-500"/> Load signature detected</div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600"><CheckCircle2 size={16} className="text-emerald-500"/> Deadline feasible</div>
                 </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 mb-6">
                 <ShieldAlert size={20} className="text-amber-600 shrink-0" />
                 <p className="text-xs font-semibold text-amber-800">Advice-only prototype. System will not switch anything automatically. User remains in control.</p>
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                 <button 
                   onClick={handleMarkComplete}
                   disabled={isHold}
                   className={`btn w-full py-3 font-bold transition-all ${isHold ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'btn-primary'}`}
                 >
                   Mark task complete
                 </button>
                 <div className="flex gap-3">
                   <button className="btn btn-outline flex-1 border-gray-300 py-2.5">Pause monitoring</button>
                   <button className="btn btn-outline flex-1 border-gray-300 py-2.5">View safety log</button>
                 </div>
              </div>
           </div>

        </div>
      </div>

      {/* Dev Tools for presentation */}
      <div className="fixed bottom-4 left-4 bg-white p-3 rounded-lg border border-gray-200 shadow-lg flex items-center gap-3 text-xs z-50">
        <span className="font-bold text-gray-500 uppercase">Dev Test:</span>
        <button onClick={forceHold} className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 font-semibold">Force HOLD</button>
        <button onClick={resetState} className="bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 font-semibold">Reset State</button>
      </div>

    </div>
  );
};

export default TaskLive;
