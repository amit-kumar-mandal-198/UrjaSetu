import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Cpu, 
  Sun, 
  Zap, 
  Droplets,
  Activity, 
  ShieldAlert, 
  ArrowRight,
  Wifi,
  Radio,
  Server,
  Cloud,
  Loader2,
  Settings,
  Info
} from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import DataSourceBadge from '../components/DataSourceBadge';

const Devices = () => {
  const [dataAge, setDataAge] = useState(9);
  const [isHold, setIsHold] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);

  // Timer for data freshness
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

  const handleHealthCheck = () => {
    setIsCheckingHealth(true);
    setHealthStatus(null);
    setTimeout(() => {
      setIsCheckingHealth(false);
      setHealthStatus("All systems operational. Telemetry stable.");
      setDataAge(0);
      setIsHold(false);
      setTimeout(() => setHealthStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8 pb-12 h-full">
      <TopNavigation title="Devices & integration" />

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6 -mt-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Devices & integration</h1>
          <p className="text-gray-600 text-lg">Existing setup ko replace kiye bina readings connect aur verify karein.</p>
        </div>
      </div>

      {/* Top Status Bar */}
      <div className="card flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-gray-50/50">
         <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 font-bold rounded-lg border border-emerald-200 uppercase tracking-wider text-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Monitoring online
            </div>
            
            <div className="flex items-center gap-2 font-semibold text-gray-700">
               <Cpu size={20} className="text-blue-500" />
               3 sources connected
            </div>

            <div className="flex items-center gap-2 font-semibold text-gray-700">
               <Activity size={20} className={isHold ? 'text-red-500' : 'text-gray-400'} />
               Last sync: <span className={isHold ? 'text-red-600' : 'text-gray-900'}>{dataAge} sec ago</span>
            </div>
         </div>

         <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <button 
              onClick={handleHealthCheck}
              disabled={isCheckingHealth}
              className="btn btn-outline border-gray-300 flex-1 lg:flex-none bg-white min-w-[160px]"
            >
              {isCheckingHealth ? <Loader2 size={18} className="animate-spin text-teal-600" /> : <Settings size={18} />}
              {isCheckingHealth ? 'Checking...' : 'Run health check'}
            </button>
            <button className="btn btn-primary flex-1 lg:flex-none">Add data source</button>
         </div>
      </div>

      {healthStatus && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200 font-medium flex items-center gap-3 animate-fade-in shadow-sm">
           <CheckCircle2 size={20} /> {healthStatus}
        </div>
      )}

      {isHold && (
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl flex items-start gap-4 shadow-sm animate-fade-in">
          <ShieldAlert size={32} className="text-red-600 shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-red-800 mb-2">SYSTEM HOLD</h3>
            <p className="text-red-700 font-medium">Data freshness exceeded 60 seconds. Automation safely paused until connection is restored.</p>
          </div>
        </div>
      )}

      {/* Non-invasive Topology */}
      <div className="card">
         <h3 className="text-lg font-bold text-gray-900 mb-6">Non-Invasive System Topology</h3>
         
         <div className="bg-white border border-gray-100 rounded-xl p-8 mb-6 shadow-sm overflow-x-auto">
            <div className="flex items-center min-w-[800px] justify-between">
               
               <div className="flex flex-col items-center gap-3 w-28 text-center">
                 <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
                   <Sun size={28} />
                 </div>
                 <span className="text-xs font-bold text-gray-600 uppercase">Solar panels</span>
               </div>
               
               <ArrowRight className="text-gray-300" size={24} />

               <div className="flex flex-col items-center gap-3 w-28 text-center">
                 <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
                   <Zap size={28} />
                 </div>
                 <span className="text-xs font-bold text-gray-600 uppercase">Existing inverter</span>
               </div>

               <ArrowRight className="text-gray-300" size={24} />

               <div className="flex flex-col items-center gap-3 w-28 text-center">
                 <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
                   <Server size={28} />
                 </div>
                 <span className="text-xs font-bold text-gray-600 uppercase">Smart meter</span>
               </div>

               <ArrowRight className="text-emerald-300" size={24} strokeWidth={3} />

               <div className="flex flex-col items-center gap-3 w-32 text-center relative">
                 <div className="absolute -top-3 -right-3 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                   <CheckCircle2 size={14} />
                 </div>
                 <div className="w-16 h-16 rounded-xl bg-teal-50 border-2 border-teal-500 flex items-center justify-center text-teal-600 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                   <Radio size={28} />
                 </div>
                 <span className="text-xs font-bold text-teal-700 uppercase">UrjaSetu sensor</span>
               </div>

               <ArrowRight className="text-teal-300 border-dashed" size={24} />

               <div className="flex flex-col items-center gap-3 w-28 text-center">
                 <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500">
                   <Wifi size={28} />
                 </div>
                 <span className="text-xs font-bold text-gray-600 uppercase">Wi-Fi/Cloud</span>
               </div>

               <ArrowRight className="text-blue-300" size={24} />

               <div className="flex flex-col items-center gap-3 w-28 text-center">
                 <div className="w-16 h-16 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                   <Cloud size={28} />
                 </div>
                 <span className="text-xs font-bold text-gray-600 uppercase">Web App</span>
               </div>

            </div>
         </div>

         {/* Safety Badges */}
         <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-emerald-700">
            <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 flex items-center gap-2">
              <ShieldAlert size={16} /> No inverter opening
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 flex items-center gap-2">
              <CheckCircle2 size={16} /> Safe telemetry only
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 flex items-center gap-2">
              <ShieldAlert size={16} /> No meter tampering
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 flex items-center gap-2">
              <ShieldAlert size={16} /> No mains switching
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         
         {/* Device Cards */}
         <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="card border-teal-200 bg-white">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="bg-teal-50 text-teal-600 p-2.5 rounded-lg">
                        <Radio size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900">UrjaSetu Sensor UST-01</h4>
                        <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-0.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Online</div>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Signal</span><span className="font-bold text-gray-900">-54 dBm</span></div>
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Firmware</span><span className="font-bold text-gray-900">0.9.3</span></div>
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Data</span><DataSourceBadge type="Measured" /></div>
                  <div className="flex justify-between py-1"><span className="text-gray-500">Last seen</span><span className="font-bold text-gray-900">{dataAge} sec ago</span></div>
               </div>
            </div>

            <div className="card">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="bg-amber-50 text-amber-500 p-2.5 rounded-lg">
                        <Sun size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900">Solar source</h4>
                        <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">Connected through demo/API</div>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col gap-2 text-sm mt-8">
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Status</span><span className="font-bold text-emerald-600">Stable</span></div>
                  <div className="flex justify-between py-1"><span className="text-gray-500">Mode</span><DataSourceBadge type="Simulated" /></div>
                  <div className="text-xs text-gray-400 mt-2 italic">Simulated for prototype</div>
               </div>
            </div>

            <div className="card">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="bg-blue-50 text-blue-500 p-2.5 rounded-lg">
                        <Zap size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900">Grid meter</h4>
                        <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">Connected</div>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col gap-2 text-sm mt-8">
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Interface</span><span className="font-bold text-gray-900">Modbus/bench feed</span></div>
                  <div className="flex justify-between py-1"><span className="text-gray-500">Data</span><DataSourceBadge type="Measured" /></div>
               </div>
            </div>

            <div className="card bg-purple-50/50 border-purple-100">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="bg-purple-100 text-purple-600 p-2.5 rounded-lg">
                        <Droplets size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900">Water Pump monitor</h4>
                        <div className="text-xs font-semibold text-purple-600 flex items-center gap-1 mt-0.5">Detected</div>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col gap-2 text-sm mt-8">
                  <div className="flex justify-between py-1 border-b border-purple-100"><span className="text-purple-700">Control mode</span><span className="font-bold text-amber-600 flex items-center gap-1"><ShieldAlert size={14}/> Advice only</span></div>
                  <div className="flex justify-between py-1"><span className="text-purple-700">Switch status</span><span className="font-bold text-gray-600">No switch control</span></div>
               </div>
            </div>

         </div>

         {/* Sidebar Blocks */}
         <div className="xl:col-span-1 flex flex-col gap-6">
            
            <div className="card bg-amber-50 border-amber-200">
               <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-4">
                 <ShieldAlert size={20} className="text-amber-600"/> Safety Boundary
               </h3>
               <ul className="flex flex-col gap-3 text-sm text-amber-800 font-medium">
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="shrink-0 mt-0.5 text-amber-600" /> Low-voltage bench prototype</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="shrink-0 mt-0.5 text-amber-600" /> No inverter opening</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="shrink-0 mt-0.5 text-amber-600" /> No meter tampering</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="shrink-0 mt-0.5 text-amber-600" /> No mains switching</li>
                  <li className="flex items-start gap-2 pt-2 border-t border-amber-200/60 font-bold"><ShieldAlert size={16} className="shrink-0 mt-0.5" /> Control mode: Advice only</li>
               </ul>
            </div>

            <div className="card">
               <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                 <Activity size={20} className="text-blue-500"/> Data Quality
               </h3>
               <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-600 font-medium">Freshness</span>
                    <span className={`font-bold ${isHold ? 'text-red-600' : 'text-emerald-600'}`}>{dataAge} sec</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-600 font-medium">Missing samples</span>
                    <span className="font-bold text-gray-900">0.4%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-600 font-medium">Clock sync</span>
                    <span className="font-bold text-emerald-600">OK</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-600 font-medium">Last validation</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={14}/> Passed</span>
                  </div>
               </div>
               
               <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 text-center uppercase tracking-wider">
                 Rule: If freshness &gt;60 sec → HOLD
               </div>
            </div>

         </div>
      </div>

      <div className="flex items-start gap-2 bg-gray-100 px-4 py-3 rounded-lg border border-gray-200 text-sm max-w-2xl mx-auto text-gray-600 font-medium mt-4">
         <Info size={18} className="shrink-0 mt-0.5 text-gray-500" />
         <p>Compatibility is verified per installation; universal compatibility is not claimed.</p>
      </div>

    </div>
  );
};

export default Devices;
