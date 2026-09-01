import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  Settings, 
  Download,
  Smartphone,
  Globe,
  FileText
} from 'lucide-react';
import TopNavigation from '../components/TopNavigation';

const INITIAL_ALERTS = [
  {
    id: 1,
    type: 'Safety',
    isRead: false,
    title: 'Monitoring paused safely',
    message: 'Sensor data 60 sec se fresh nahi tha, isliye UrjaSetu ne koi naya action suggest nahi kiya.',
    timestamp: 'Just now',
    actions: [
      { label: 'Check device', route: '/devices', primary: true },
      { label: 'View safety log', route: '#', primary: false }
    ],
    icon: ShieldAlert,
    colorClass: 'text-red-600',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200'
  },
  {
    id: 2,
    type: 'Tasks',
    isRead: false,
    title: 'Water Pump completed',
    message: 'Task 1:14 PM par complete hua. Aapka Savings Receipt ready hai.',
    timestamp: '2 hours ago',
    actions: [
      { label: 'Open receipt', route: '/receipts/SR-240824-017', primary: true }
    ],
    icon: CheckCircle2,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200'
  },
  {
    id: 3,
    type: 'Energy',
    isRead: false,
    title: 'Better solar window found',
    message: 'Pump ko 12:30–1:15 PM chalane se estimated ₹18 incremental benefit ho sakta hai.',
    timestamp: '4 hours ago',
    actions: [
      { label: 'Review plan', route: '/tasks/water-pump/review', primary: true }
    ],
    icon: Zap,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200'
  },
  {
    id: 4,
    type: 'Energy',
    isRead: true,
    title: 'Grid export is high',
    message: 'Abhi 1.7 kW grid ko export ho raha hai. Flexible task schedule kar sakte hain.',
    timestamp: 'Yesterday',
    actions: [
      { label: 'Create task', route: '/dashboard', primary: true }
    ],
    icon: Zap,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200'
  }
];

const Alerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Tasks', 'Energy', 'Device', 'Safety'];

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const filteredAlerts = useMemo(() => {
    if (activeFilter === 'All') return alerts;
    return alerts.filter(a => a.type === activeFilter);
  }, [alerts, activeFilter]);

  const markAsRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const handleAction = (alertId, route) => {
    markAsRead(alertId);
    if (route !== '#') {
      navigate(route);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8 pb-12 h-full">
      <TopNavigation title="Alerts & activity" />

      {/* Header */}
      <div className="flex flex-col border-b border-gray-200 pb-6 -mt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts & activity</h1>
        <p className="text-gray-600 text-lg max-w-3xl">Important updates simple language mein—kya hua, kyun hua, aur ab kya karein.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="card border-l-4 border-l-blue-500 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Unread</div>
              <div className="text-3xl font-black text-gray-900">{unreadCount}</div>
            </div>
            <Bell size={32} className="text-blue-100 fill-blue-500" />
         </div>
         <div className="card border-l-4 border-l-red-500 flex items-center justify-between bg-red-50/30">
            <div>
              <div className="text-sm font-bold text-red-500 uppercase tracking-wider mb-1">Safety HOLD</div>
              <div className="text-3xl font-black text-red-700">1</div>
            </div>
            <ShieldAlert size={32} className="text-red-500" />
         </div>
         <div className="card border-l-4 border-l-emerald-500 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Tasks completed this week</div>
              <div className="text-3xl font-black text-gray-900">6</div>
            </div>
            <CheckCircle2 size={32} className="text-emerald-500" />
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         
         {/* Main Feed Column */}
         <div className="xl:col-span-2 flex flex-col gap-6">
            
            {/* Notification Preview (Highlighted) */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
               <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-white/20 rounded-full shrink-0">
                     <Bell size={24} className="text-white" />
                  </div>
                  <div>
                     <div className="text-sm font-bold text-purple-200 uppercase tracking-wider mb-2">Push Preview</div>
                     <p className="text-lg font-medium leading-relaxed">"Solar surplus abhi high hai. Water Pump ke liye 12:30–1:15 PM best window hai. Approve ya skip karein."</p>
                  </div>
               </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
               {filters.map(filter => (
                 <button
                   key={filter}
                   onClick={() => setActiveFilter(filter)}
                   className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${activeFilter === filter ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50' : 'text-gray-500 hover:bg-gray-50'}`}
                 >
                   {filter}
                 </button>
               ))}
            </div>

            {/* Activity Feed */}
            <div className="flex flex-col gap-4">
               {filteredAlerts.length === 0 ? (
                 <div className="text-center py-12 text-gray-500">No alerts found for this filter.</div>
               ) : (
                 filteredAlerts.map(alert => (
                   <div 
                     key={alert.id} 
                     onClick={() => !alert.isRead && markAsRead(alert.id)}
                     className={`card flex flex-col sm:flex-row gap-4 transition-all ${!alert.isRead ? 'border-l-4 shadow-sm bg-white' : 'opacity-70 bg-gray-50 border-transparent'} hover:shadow-md cursor-pointer`}
                     style={{ borderLeftColor: !alert.isRead ? 'var(--color-teal)' : 'transparent' }}
                   >
                      <div className={`p-3 rounded-full shrink-0 h-fit ${alert.bgClass} ${alert.colorClass}`}>
                         <alert.icon size={24} />
                      </div>
                      
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-1">
                            <h3 className={`text-lg font-bold ${!alert.isRead ? 'text-gray-900' : 'text-gray-700'}`}>{alert.title}</h3>
                            <span className="text-xs font-semibold text-gray-400 whitespace-nowrap ml-2">{alert.timestamp}</span>
                         </div>
                         <p className="text-gray-600 mb-4 font-medium">{alert.message}</p>
                         
                         <div className="flex flex-wrap gap-3">
                            {alert.actions.map((action, idx) => (
                               <button 
                                 key={idx}
                                 onClick={(e) => { e.stopPropagation(); handleAction(alert.id, action.route); }}
                                 className={`btn text-sm py-1.5 px-4 ${action.primary ? 'btn-primary' : 'btn-outline border-gray-300'}`}
                               >
                                 {action.label}
                               </button>
                            ))}
                         </div>
                      </div>
                      
                      {!alert.isRead && (
                         <div className="w-3 h-3 bg-teal-500 rounded-full shrink-0 mt-2 sm:mt-0"></div>
                      )}
                   </div>
                 ))
               )}
            </div>

         </div>

         {/* Sidebar Blocks */}
         <div className="xl:col-span-1 flex flex-col gap-6">
            
            {/* Notification Preferences */}
            <div className="card">
               <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
                 <Settings size={20} className="text-gray-400"/> Notification preferences
               </h3>
               
               <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Safety alerts</span>
                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded">Always on</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Task suggestions</span>
                    <div className="w-10 h-6 bg-teal-500 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Receipt ready</span>
                    <div className="w-10 h-6 bg-teal-500 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Weekly insight</span>
                    <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-4">
                     <div className="flex-1 bg-teal-50 text-teal-700 p-3 rounded-lg border border-teal-100 flex flex-col items-center justify-center gap-1">
                        <Globe size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider">Web App Active</span>
                     </div>
                     <div className="flex-1 bg-gray-50 text-gray-500 p-3 rounded-lg border border-gray-200 flex flex-col items-center justify-center gap-1">
                        <Smartphone size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider">Mobile Demo</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Audit Details */}
            <div className="card bg-gray-50 border-gray-200">
               <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                 <FileText size={20} className="text-gray-500"/> System Audit Trace
               </h3>
               
               <div className="font-mono text-xs text-gray-600 bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-2 mb-4 shadow-inner">
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-400">Event ID:</span>
                    <span className="font-bold text-gray-800">EVT-240824-42</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-400">Source:</span>
                    <span className="font-bold text-gray-800">Sensor UST-01</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-400">Decision:</span>
                    <span className="font-bold text-red-600">HOLD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reason:</span>
                    <span className="font-bold text-amber-600">DATA_STALE</span>
                  </div>
               </div>

               <button className="btn btn-outline w-full bg-white border-gray-300">
                 <Download size={16} /> Export audit log
               </button>
            </div>

         </div>

      </div>
    </div>
  );
};

export default Alerts;
