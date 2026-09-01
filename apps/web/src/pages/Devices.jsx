import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cpu, Droplets, Power, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';

const API_URL = 'http://localhost:8001';

const Devices = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/dashboard`);
        setTasks(response.data.tasks || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };
    fetchDevices();
    const interval = setInterval(fetchDevices, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', display: 'flex' }}>Loading Devices...</div>;
  }

  return (
    <div className="fade-in">
      <div className="header animate-in d-1">
        <div>
           <h1 style={{fontSize: '1.75rem', marginBottom: '0.25rem', fontWeight: 700}}>Connected Devices</h1>
           <p style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>Manage flexible loads and critical systems</p>
        </div>
      </div>

      <div className="bento-grid">
        {tasks.map((task, index) => (
          <div key={task.id} className={`bento-card animate-in d-${(index % 4) + 2}`} style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className={`stat-icon ${task.is_critical ? 'purple' : 'blue'}`}>
                  {task.name === "Water Pump" ? <Droplets size={20} /> : <Cpu size={20} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', color: 'var(--text-main)', fontWeight: 600 }}>{task.name}</h3>
                  <div className="status-indicator">
                    <div className={`status-dot dot-${(task.status || "pending").split(' ')[0].toLowerCase()}`}></div>
                    {task.status}
                  </div>
                  {task.status === 'Running' && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                      <Zap size={14} /> Currently drawing: {task.name === "Water Pump" ? '840W' : '150W'}
                    </div>
                  )}
                </div>
              </div>
              
              {task.is_critical ? (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)', fontSize: '0.85rem', background: 'rgba(139, 92, 246, 0.05)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontWeight: 600 }}>
                   <ShieldCheck size={16} /> CRITICAL LOAD
                 </div>
              ) : (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', fontSize: '0.85rem', background: 'rgba(59, 130, 246, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontWeight: 600 }}>
                   <Power size={16} /> FLEXIBLE LOAD
                 </div>
              )}
            </div>
            
            <div style={{ background: 'var(--bg-card-hover)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                 <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Execution Plan</span>
                 <span style={{ fontWeight: 500 }}>{task.duration_mins > 0 ? `${task.duration_mins} mins` : 'Continuous'}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Deadline</span>
                 <span style={{ fontWeight: 500 }}>{task.deadline}</span>
               </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              {task.status === 'Pending approval' && (
                <button className="btn btn-primary" style={{ flex: 1 }}>
                  Authorize AI Plan
                </button>
              )}
              {task.status === 'Running' && !task.is_critical && (
                <button className="btn btn-outline" style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
                  <AlertTriangle size={16} /> Emergency Cutoff
                </button>
              )}
              {task.status === 'Off' && (
                <button className="btn btn-outline" style={{ flex: 1 }}>
                  Manual Override (Start)
                </button>
              )}
              {task.is_critical && (
                <div style={{ width: '100%', textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--bg-card-hover)', borderRadius: '10px' }}>
                  <AlertTriangle size={16} /> System protection active. Cannot be manually turned off.
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="bento-card animate-in d-4" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '250px', borderStyle: 'dashed', background: 'transparent' }}>
           <div style={{ textAlign: 'center', cursor: 'pointer' }}>
             <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
               <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>+</span>
             </div>
             <h3 style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Pair New Smart Actuator</h3>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Devices;
