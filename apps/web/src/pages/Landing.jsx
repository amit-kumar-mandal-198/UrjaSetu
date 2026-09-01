import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3, Activity, ArrowRight, PlugZap, CheckCircle2, Clock } from 'lucide-react';
import DataSourceBadge from '../components/DataSourceBadge';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8F4] text-[#0B1F33]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#F7F8F4]/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center text-white font-bold">U</div>
            <span className="font-bold text-xl tracking-tight">UrjaSetu</span>
            <span className="text-sm font-medium text-gray-500 ml-4 hidden md:block">Retrofit. Plan. Prove.</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#how-it-works" className="hover:text-[#0B1F33] transition-colors">How it works</a>
            <a href="#existing-solar" className="hover:text-[#0B1F33] transition-colors">Existing solar</a>
            <a href="#savings-proof" className="hover:text-[#0B1F33] transition-colors">Savings proof</a>
            <a href="#safety" className="hover:text-[#0B1F33] transition-colors">Safety</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/demo')}
              className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              View demo
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 text-sm font-medium bg-[#0D9488] text-white rounded-lg hover:bg-[#0f766e] transition-colors shadow-sm"
            >
              Open dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Copy */}
          <div className="flex-1 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} /> GREEN ENERGY, MADE USEFUL
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.15] mb-6 tracking-tight text-gray-900">
              Your solar already saves.<br/>
              <span className="text-[#0D9488]">UrjaSetu helps it work smarter.</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl">
              Low-cost retrofit that monitors solar, load and grid, recommends the best time for flexible tasks, verifies completion and issues a Savings Receipt.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-6 py-3.5 bg-[#0B1F33] text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-md"
              >
                Connect my system <ArrowRight size={18} />
              </button>
              
              <button 
                onClick={() => navigate('/demo')}
                className="flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                See 4-minute demo <ArrowRight size={18} />
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-600"/> No inverter opening</div>
              <div className="flex items-center gap-2"><PlugZap size={18} className="text-emerald-600"/> Low-voltage prototype</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-600"/> Works with existing solar</div>
            </div>
          </div>

          {/* Right: Realistic Dashboard Preview */}
          <div className="flex-1 w-full max-w-[500px] animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-shadow duration-300">
              
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <Activity size={14} className="text-emerald-500" /> System Status
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                   Data fresh · 12 sec ago · <DataSourceBadge type="Measured" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <div className="text-sm font-medium text-amber-700 mb-1">Solar Generation</div>
                  <div className="text-3xl font-bold text-amber-600">3.8 <span className="text-lg font-medium">kW</span></div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="text-sm font-medium text-blue-700 mb-1">Home Load</div>
                  <div className="text-3xl font-bold text-blue-600">2.1 <span className="text-lg font-medium">kW</span></div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 col-span-2 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-emerald-700 mb-1">Grid Export (Surplus)</div>
                    <div className="text-3xl font-bold text-emerald-600">1.7 <span className="text-lg font-medium">kW</span></div>
                  </div>
                  <BarChart3 size={40} className="text-emerald-200" />
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
                       <Clock size={12} /> AI Recommendation
                     </div>
                     <h3 className="font-semibold text-purple-900">Best pump window</h3>
                     <p className="text-sm text-purple-700 font-medium">12:30–1:15 PM</p>
                   </div>
                   <div className="bg-white px-3 py-1.5 rounded-lg border border-purple-100 text-sm font-bold text-purple-600">
                     + ₹12.50
                   </div>
                 </div>
                 
                 <div className="flex gap-3">
                   <button className="flex-1 bg-purple-600 text-white font-medium py-2.5 rounded-lg hover:bg-purple-700 transition-colors">
                     Approve
                   </button>
                   <button className="flex-1 bg-white text-gray-600 font-medium py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                     Skip
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="how-it-works" className="py-20 bg-white border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              
              <div className="flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                  <PlugZap size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Retrofit</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect without replacing your existing solar inverter. A non-invasive installation that instantly upgrades your setup.
                </p>
              </div>

              <div className="flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Task</h3>
                <p className="text-gray-600 leading-relaxed">
                  The AI monitors real-time solar surplus and recommends a useful task window (like running the water pump) to maximize consumption.
                </p>
              </div>

              <div className="flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Proof</h3>
                <p className="text-gray-600 leading-relaxed">
                  Execution is monitored cryptographically. Once completed, verify your results and automatically create a transparent Savings Receipt.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-24 px-6 bg-[#F7F8F4]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12 text-gray-900">Three simple steps to optimization</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
               <div className="bg-white px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 shadow-sm">
                 Connect
               </div>
               <ArrowRight className="text-gray-300 hidden md:block" size={24} />
               <div className="bg-white px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 shadow-sm">
                 Approve
               </div>
               <ArrowRight className="text-gray-300 hidden md:block" size={24} />
               <div className="bg-white px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 shadow-sm">
                 Verify
               </div>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#0D9488] flex items-center justify-center text-white text-xs font-bold">U</div>
            <span className="font-semibold text-gray-900">UrjaSetu</span>
            <span className="text-sm text-gray-500 ml-2">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
             <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
             <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
             <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
