import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, Zap, Shield, IndianRupee, Cpu } from 'lucide-react';
import { MOCK_DASHBOARD_DATA } from '../mockData';
import TopNavigation from '../components/TopNavigation';
import LoadingSkeleton from '../components/LoadingSkeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const Audit = () => {
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/dashboard`, { timeout: 3000 });
        setAuditEvents(response.data.audit_events || []);
        setLoading(false);
      } catch (error) {
        console.warn("Backend not reachable", error);
        setAuditEvents(MOCK_DASHBOARD_DATA.audit_events);
        setLoading(false);
      }
    };
    
    fetchAudit();
    const interval = setInterval(fetchAudit, 5000); 
    return () => clearInterval(interval);
  }, []);

  const getIconForEvent = (eventType) => {
    switch(eventType) {
      case 'Task Created': return <Clock size={20} />;
      case 'Optimization Calculated': return <Cpu size={20} />;
      case 'Payment Required': return <IndianRupee size={20} />;
      case 'Payment Verified': return <Shield size={20} />;
      case 'Command Issued': return <Zap size={20} />;
      case 'Device Executed': return <CheckCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getColorConfig = (eventType) => {
    if (eventType.includes('Payment')) return { color: 'var(--color-amber)', bg: 'var(--bg-amber)' };
    if (eventType.includes('Executed') || eventType.includes('Verified')) return { color: 'var(--color-emerald)', bg: 'var(--bg-emerald)' };
    if (eventType.includes('Issued') || eventType.includes('Optimization')) return { color: 'var(--color-blue)', bg: 'var(--bg-blue)' };
    return { color: 'var(--text-muted)', bg: 'var(--bg-card-hover)' };
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <TopNavigation title="Execution Audit" />
        <div className="bento-grid">
          <div className="col-span-2">
             <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <TopNavigation title="Execution Audit" />

      <div className="card max-w-3xl">
        <div className="flex flex-col gap-8 p-4">
          {auditEvents.length === 0 ? (
            <div className="text-center py-8 text-muted">No audit events recorded yet.</div>
          ) : (
            auditEvents.map((event, idx) => {
              const { color, bg } = getColorConfig(event.event_type);
              
              return (
                <div key={event.id} className="flex gap-6 relative">
                  {idx !== auditEvents.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-[-2rem] w-0.5 bg-gray-200" style={{ backgroundColor: 'var(--border-color)' }}></div>
                  )}
                  
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white"
                    style={{ backgroundColor: bg, color: color, borderColor: 'var(--bg-card)' }}
                  >
                    {getIconForEvent(event.event_type)}
                  </div>
                  
                  <div className="pb-4 pt-1">
                     <div className="flex items-baseline gap-4 mb-2">
                        <div className="font-semibold text-lg">{event.event_type}</div>
                        <div className="text-sm text-muted">{new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</div>
                     </div>
                     <div className="text-muted mb-3 leading-relaxed">
                       {event.details}
                     </div>
                     <div>
                        <span className="badge badge-gray border border-gray-200">Task ID: {event.task_id}</span>
                     </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;
