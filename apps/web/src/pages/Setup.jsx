import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Server, 
  Wifi, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  Sun,
  LayoutDashboard,
  PlugZap,
  ShieldCheck,
  RefreshCw,
  Loader2
} from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import DataSourceBadge from '../components/DataSourceBadge';

const Setup = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('urjasetu_sensor');
  const [testState, setTestState] = useState('idle'); // idle, loading, success, error

  const handleTestReading = () => {
    setTestState('loading');
    setTimeout(() => {
      setTestState('success');
    }, 2500); // simulate 2.5s network delay
  };

  const handleFinishSetup = () => {
    navigate('/dashboard');
  };

  return (
    <div className="animate-fade-in flex flex-col h-full">
      <TopNavigation title="Connect your energy system" />
      
      <p className="text-muted mb-8 -mt-6">Existing solar ko change kiye bina pehle compatibility check karein.</p>

      {/* 4-Step Progress Indicator */}
      <div className="flex items-center justify-between max-w-3xl mb-12">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">1</div>
          <span className="text-sm font-semibold text-gray-900">Property</span>
        </div>
        <div className="flex-1 h-1 bg-teal-600 mx-4 rounded"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">2</div>
          <span className="text-sm font-semibold text-gray-900">Data source</span>
        </div>
        <div className="flex-1 h-1 bg-gray-200 mx-4 rounded relative overflow-hidden">
          {testState === 'success' && <div className="absolute inset-0 bg-teal-600 animate-slide-right"></div>}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500" 
            style={{ backgroundColor: testState === 'success' ? 'var(--color-teal)' : '#E2E8F0', color: testState === 'success' ? 'white' : 'var(--text-muted)' }}>
            3
          </div>
          <span className="text-sm font-semibold transition-colors duration-500" style={{ color: testState === 'success' ? 'var(--text-main)' : 'var(--text-muted)' }}>Test reading</span>
        </div>
        <div className="flex-1 h-1 bg-gray-200 mx-4 rounded relative overflow-hidden">
           {testState === 'success' && <div className="absolute inset-0 bg-teal-600 animate-slide-right" style={{ animationDelay: '0.5s' }}></div>}
        </div>
        <div className="flex flex-col items-center gap-2">
           <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500" 
            style={{ backgroundColor: testState === 'success' ? 'var(--color-teal)' : '#E2E8F0', color: testState === 'success' ? 'white' : 'var(--text-muted)' }}>
            4
          </div>
          <span className="text-sm font-semibold transition-colors duration-500" style={{ color: testState === 'success' ? 'var(--text-main)' : 'var(--text-muted)' }}>Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        
        {/* Left Column: Data Source Selection & Topology */}
        <div className="flex flex-col gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Select Connection Type</h3>
            
            <div className="flex flex-col gap-3">
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${source === 'inverter_api' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="source" value="inverter_api" checked={source === 'inverter_api'} onChange={(e) => setSource(e.target.value)} className="w-5 h-5 text-teal-600 accent-teal-600" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Solar Inverter API</div>
                  <div className="text-sm text-muted">Connect directly to cloud API (e.g. Growatt, Solis)</div>
                </div>
                <Server className="text-gray-400" />
              </label>

              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${source === 'smart_meter' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="source" value="smart_meter" checked={source === 'smart_meter'} onChange={(e) => setSource(e.target.value)} className="w-5 h-5 text-teal-600 accent-teal-600" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Smart Meter / Modbus</div>
                  <div className="text-sm text-muted">Read directly from RS485/Modbus RTU</div>
                </div>
                <Activity className="text-gray-400" />
              </label>

              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${source === 'urjasetu_sensor' ? 'border-teal-500 bg-teal-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="source" value="urjasetu_sensor" checked={source === 'urjasetu_sensor'} onChange={(e) => setSource(e.target.value)} className="w-5 h-5 text-teal-600 accent-teal-600" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">UrjaSetu Sensor (Recommended)</div>
                  <div className="text-sm text-muted">Non-invasive CT clamp sensor over Wi-Fi</div>
                </div>
                <Wifi className="text-teal-500" />
              </label>

              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${source === 'demo_data' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="source" value="demo_data" checked={source === 'demo_data'} onChange={(e) => setSource(e.target.value)} className="w-5 h-5 text-teal-600 accent-teal-600" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Demo Data</div>
                  <div className="text-sm text-muted">Simulate data for evaluation purposes</div>
                </div>
                <Cpu className="text-gray-400" />
              </label>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Connection Topology</h3>
            
            <div className="flex flex-col items-center gap-2 p-6 bg-gray-50 border border-gray-200 rounded-xl mb-6">
              <div className="flex items-center justify-between w-full">
                 <div className="flex flex-col items-center gap-2 text-gray-600">
                    <Sun size={28} />
                    <span className="text-xs font-semibold text-center">Existing Solar<br/>Panels</span>
                 </div>
                 <ArrowRight className="text-gray-400" />
                 <div className="flex flex-col items-center gap-2 text-gray-600">
                    <Server size={28} />
                    <span className="text-xs font-semibold text-center">Existing<br/>Inverter</span>
                 </div>
                 <ArrowRight className="text-teal-500" strokeWidth={3} />
                 <div className="flex flex-col items-center gap-2 text-teal-600">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                       <Wifi size={20} />
                    </div>
                    <span className="text-xs font-bold text-center">UrjaSetu<br/>Sensor</span>
                 </div>
                 <ArrowRight className="text-teal-500" strokeWidth={3} />
                 <div className="flex flex-col items-center gap-2 text-gray-600">
                    <LayoutDashboard size={28} />
                    <span className="text-xs font-semibold text-center">Dashboard</span>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-emerald-900">No inverter opening</span>
               </div>
               <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <PlugZap size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-emerald-900">Non-invasive low-voltage</span>
               </div>
               <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <ShieldAlert size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-emerald-900">No mains switching</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Test Reading & Actions */}
        <div className="flex flex-col gap-8">
          
          <div className="card h-full flex flex-col relative overflow-hidden">
            <h3 className="text-lg font-semibold mb-6">Test Reading</h3>
            
            {testState === 'idle' && (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                 <Wifi size={48} className="text-gray-300 mb-4" />
                 <h4 className="text-lg font-semibold text-gray-700 mb-2">No connection established</h4>
                 <p className="text-sm text-muted mb-6">Run a test reading to verify the sensor is transmitting telemetry data over the local network.</p>
                 <button onClick={handleTestReading} className="btn btn-primary shadow-sm">
                   Run test reading
                 </button>
              </div>
            )}

            {testState === 'loading' && (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-center p-8 bg-teal-50 border border-teal-100 rounded-xl">
                 <Loader2 size={48} className="text-teal-600 animate-spin mb-4" />
                 <h4 className="text-lg font-semibold text-teal-800 mb-2">Connecting to sensor...</h4>
                 <p className="text-sm text-teal-600/80">Listening for MQTT payload on local network</p>
              </div>
            )}

            {testState === 'success' && (
              <div className="flex-1 flex flex-col animate-fade-in">
                 <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 size={14} /> Signal Stable
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted font-medium">
                      Updated 8 sec ago · <DataSourceBadge type="Measured" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="text-sm font-medium text-muted mb-1">Solar Generation</div>
                      <div className="text-3xl font-bold text-gray-900">3.6 <span className="text-lg text-muted">kW</span></div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="text-sm font-medium text-muted mb-1">Home Load</div>
                      <div className="text-3xl font-bold text-gray-900">2.0 <span className="text-lg text-muted">kW</span></div>
                    </div>
                    <div className="col-span-2 bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-emerald-800 mb-1">Grid Export (Surplus)</div>
                        <div className="text-3xl font-bold text-emerald-600">1.6 <span className="text-lg font-medium text-emerald-500">kW</span></div>
                      </div>
                      <Activity size={32} className="text-emerald-200" />
                    </div>
                 </div>

                 <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-auto">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-sm text-muted font-medium">Compatibility result</span>
                       <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={16}/> Compatible for monitoring</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-muted font-medium">Control mode</span>
                       <span className="text-sm font-bold text-amber-600 flex items-center gap-1.5"><ShieldAlert size={16}/> Advice only until installer verification</span>
                    </div>
                 </div>

                 <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100">
                    <button onClick={() => setTestState('loading')} className="btn btn-outline flex-1 border-gray-300">
                       <RefreshCw size={18} /> Retest
                    </button>
                 </div>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Footer Actions & Safety Notice */}
      <div className="mt-auto bg-white border-t border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-3 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100">
            <ShieldAlert size={20} className="shrink-0" />
            <span className="text-sm font-semibold">Prototype: low-voltage bench only. No mains switching.</span>
         </div>
         
         <div className="flex gap-4 w-full md:w-auto">
            <button className="btn btn-outline flex-1 md:flex-none">Save & continue later</button>
            <button 
              className="btn btn-primary flex-1 md:flex-none"
              onClick={handleFinishSetup}
              disabled={testState !== 'success'}
            >
              Finish setup
            </button>
         </div>
      </div>
      
    </div>
  );
};

export default Setup;
