import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sun, Home, Cpu, WifiOff, Wifi } from 'lucide-react';
import { MOCK_DASHBOARD_DATA } from '../mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const DemoController = () => {
  const [solar, setSolar] = useState(2.4);
  const [home, setHome] = useState(1.6);
  const [status, setStatus] = useState('Idle');
  const [networkConnected, setNetworkConnected] = useState(true);

  // Fallback to fetch data to check if backend is alive
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        await axios.get(`${API_URL}/api/v1/dashboard`);
        setNetworkConnected(true);
      } catch (error) {
        setNetworkConnected(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const gridImport = Math.max(0, home - solar).toFixed(2);
  const gridExport = Math.max(0, solar - home).toFixed(2);
  const aiTriggered = solar > home;

  // When sliders change, send the override to backend
  useEffect(() => {
    const override = async () => {
      if (!networkConnected) {
        setStatus('Sync Failed: MQTT Broker Unreachable');
        return;
      }
      setStatus('Syncing...');
      try {
        await axios.post(`${API_URL}/demo/override`, {
          solar_power: parseFloat(solar),
          home_consumption: parseFloat(home)
        });
        setStatus('Synced with Edge Node');
      } catch (error) {
        setStatus('Sync Failed');
      }
    };
    
    // Debounce slightly
    const timeout = setTimeout(override, 200);
    return () => clearTimeout(timeout);
  }, [solar, home, networkConnected]);

  return (
    <div className="fade-in">
      <div className="header animate-in d-1">
        <div>
           <h1 style={{fontSize: '2rem', marginBottom: '0.25rem'}}>Demo Controller</h1>
           <p style={{color: 'var(--text-muted)'}}>Manually inject telemetry to trigger AI logic</p>
        </div>
      </div>

      <div className="bento-grid">
        <div className="bento-card animate-in d-2" style={{ gridColumn: 'span 4' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            
            <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-card-hover)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="stat-icon green"><Sun size={24} /></div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-green)' }}>Simulate Solar Spike</h3>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--text-main)' }}>{solar} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>kW</span></div>
              </div>
              
              <input 
                type="range" 
                min="0" max="10" step="0.1" 
                value={solar} 
                onChange={(e) => setSolar(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-green)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                <span>0 kW (Cloudy)</span>
                <span>10 kW (Peak Sun)</span>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-card-hover)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="stat-icon blue"><Home size={24} /></div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-blue)' }}>Simulate Home Load</h3>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--text-main)' }}>{home} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>kW</span></div>
              </div>
              
              <input 
                type="range" 
                min="0" max="10" step="0.1" 
                value={home} 
                onChange={(e) => setHome(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                <span>0 kW (Empty Home)</span>
                <span>10 kW (All ACs On)</span>
              </div>
            </div>

          </div>

          <div style={{ marginTop: '2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Calculated Network State</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Live preview of the values being injected into the system</p>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Grid Export</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-green)' }}>{gridExport} kW</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Grid Import</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ef4444' }}>{gridImport} kW</span>
              </div>
              <div style={{ paddingLeft: '2rem', borderLeft: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                {aiTriggered ? (
                   <div style={{ background: 'rgba(0, 245, 212, 0.1)', color: 'var(--accent-green)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
                     AI Trigger: Solar Surplus Match
                   </div>
                ) : (
                   <div style={{ background: 'var(--bg-card-hover)', color: 'var(--text-muted)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 500, fontSize: '0.9rem' }}>
                     AI Status: Monitoring Grid
                   </div>
                )}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ flex: 1, padding: '1.25rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Cpu size={24} color="var(--accent-purple)" />
              <div>
                <h4 style={{ color: 'var(--accent-purple)', marginBottom: '0.25rem' }}>Edge Node Status</h4>
                <p style={{ color: status.includes('Failed') ? '#ef4444' : 'var(--text-muted)', fontSize: '0.9rem', fontWeight: status.includes('Failed') ? 600 : 400 }}>{status}</p>
              </div>
            </div>
            
            <button 
              className={`btn ${networkConnected ? 'btn-outline' : 'btn-primary'}`} 
              style={{ width: 'auto', padding: '0 2rem', borderColor: networkConnected ? '#ef4444' : 'var(--accent-green)', color: networkConnected ? '#ef4444' : 'var(--bg-color)', background: networkConnected ? 'rgba(239, 68, 68, 0.1)' : 'var(--accent-green)' }}
              onClick={() => { setNetworkConnected(!networkConnected); if(networkConnected) setStatus('Sync Failed: MQTT Broker Unreachable'); else setStatus('Synced with Edge Node'); }}
            >
              {networkConnected ? <><WifiOff size={16} /> Simulate Network Disconnect</> : <><Wifi size={16} /> Reconnect Edge Node</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoController;
