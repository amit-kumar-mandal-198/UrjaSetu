import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Cpu, Receipt, Settings, Bell, Zap as Flash, MonitorPlay, PieChart } from 'lucide-react';

const AppSidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      padding: '2rem 1.5rem', backgroundColor: 'var(--bg-card)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--border-color)'
    }} className="animate-fade-in">
      
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px',
        color: 'var(--text-main)'
      }}>
        <Flash style={{ color: 'var(--color-teal)' }} size={32} />
        URJASETU
      </div>
      
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
        flex: 1, marginTop: '2.5rem'
      }}>
        {[
          { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
          { to: '/insights', icon: PieChart, label: 'Insights' },
          { to: '/devices', icon: Cpu, label: 'Devices' },
          { to: '/savings', icon: Receipt, label: 'Savings Receipt' },
          { to: '/demo', icon: MonitorPlay, label: 'Demo Controller' },
          { to: '/alerts', icon: Bell, label: 'Alerts & Activity' },
          { to: '/setup', icon: Settings, label: 'Setup & Connection' }
        ].map((item) => {
          const isActive = path === item.to;
          return (
            <Link 
              key={item.to}
              to={item.to} 
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: '8px',
                color: isActive ? 'var(--color-teal)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--bg-teal)' : 'transparent',
                textDecoration: 'none', fontWeight: isActive ? '600' : '500',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                boxShadow: isActive ? '0 0 15px rgba(45, 212, 191, 0.2)' : 'none',
                border: isActive ? '1px solid rgba(45, 212, 191, 0.3)' : '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                if(!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                  e.currentTarget.style.color = 'var(--text-main)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if(!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <item.icon size={20} /> {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AppSidebar;
