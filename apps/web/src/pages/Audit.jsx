import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, Zap, Shield, IndianRupee, Cpu } from 'lucide-react';
import '../index.css';
import { MOCK_DASHBOARD_DATA } from '../mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const Audit = () => {
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/dashboard`, { timeout: 3000 });
        // We included audit_events in the dashboard endpoint
        setAuditEvents(response.data.audit_events || []);
        setLoading(false);
      } catch (error) {
        console.warn("Backend not reachable, falling back to mock data for demonstration.");
        setAuditEvents(MOCK_DASHBOARD_DATA.audit_events);
        setLoading(false);
      }
    };
    
    fetchAudit();
    const interval = setInterval(fetchAudit, 5000); // Polling for timeline updates
    return () => clearInterval(interval);
  }, []);

  const getIconForEvent = (eventType) => {
    switch(eventType) {
      case 'Task Created': return <Clock size={16} />;
      case 'Optimization Calculated': return <Cpu size={16} />;
      case 'Payment Required': return <IndianRupee size={16} />;
      case 'Payment Verified': return <Shield size={16} />;
      case 'Command Issued': return <Zap size={16} />;
      case 'Device Executed': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getColorForEvent = (eventType) => {
    if (eventType.includes('Payment')) return 'var(--accent-orange)';
    if (eventType.includes('Executed') || eventType.includes('Verified')) return 'var(--accent-green)';
    if (eventType.includes('Issued')) return 'var(--accent-blue)';
    return 'var(--text-muted)';
  };

  if (loading) {
    return (
      <div className="fade-in" style={{ padding: '0 0' }}>
         <div className="header d-1">
           <div style={{ width: '100%' }}>
             <div className="skeleton skeleton-title"></div>
             <div className="skeleton skeleton-text" style={{ width: '250px' }}></div>
           </div>
         </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="header animate-in d-1">
        <div>
           <h1 style={{fontSize: '1.75rem', marginBottom: '0.25rem', fontWeight: 700}}>Execution Audit</h1>
           <p style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>Cryptographic provenance and strict chronological execution log</p>
        </div>
      </div>

      <div className="bento-card animate-in d-2" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
          {auditEvents.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No audit events recorded yet.</div>
          ) : (
            auditEvents.map((event, idx) => (
              <div key={event.id} style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                {idx !== auditEvents.length - 1 && (
                  <div style={{ position: 'absolute', left: '16px', top: '32px', bottom: '-32px', width: '2px', background: 'var(--border-color)' }}></div>
                )}
                
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: getColorForEvent(event.event_type) === 'var(--text-muted)' ? 'var(--bg-card-hover)' : `rgba(255,255,255,0.05)`,
                  color: getColorForEvent(event.event_type),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
                  flexShrink: 0
                }}>
                  {getIconForEvent(event.event_type)}
                </div>
                
                <div style={{ paddingBottom: '1rem' }}>
                   <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>{event.event_type}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</div>
                   </div>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                     {event.details}
                   </div>
                   <div style={{ marginTop: '0.5rem' }}>
                      <span className="badge" style={{ background: 'var(--bg-color)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontSize: '0.7rem' }}>Task ID: {event.task_id}</span>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;
