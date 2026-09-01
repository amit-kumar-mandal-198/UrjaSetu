import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Cpu, Receipt, Settings, CheckCircle, Zap as Flash, MonitorPlay } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import DemoController from './pages/DemoController';
import Devices from './pages/Devices';
import Savings from './pages/Savings';
import PaymentUnlock from './pages/PaymentUnlock';
import Audit from './pages/Audit';
import './index.css';

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="sidebar fade-in d-1">
      <div className="brand">
        <Flash className="brand-icon" size={32} />
        URJASETU
      </div>
      
      <div className="nav-menu">
        <Link to="/" className={`nav-item ${path === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Overview
        </Link>
        <Link to="/devices" className={`nav-item ${path === '/devices' ? 'active' : ''}`}>
          <Cpu size={20} /> Devices
        </Link>
        <Link to="/savings" className={`nav-item ${path === '/savings' ? 'active' : ''}`}>
          <Receipt size={20} /> Savings Receipt
        </Link>
        <Link to="/demo" className={`nav-item ${path === '/demo' ? 'active' : ''}`}>
          <MonitorPlay size={20} /> Demo Controller
        </Link>
        <Link to="/audit" className={`nav-item ${path === '/audit' ? 'active' : ''}`}>
          <CheckCircle size={20} /> Audit Trail
        </Link>
      </div>
      

    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container" style={{display: 'flex', flexDirection: 'row', gap: '2rem', padding: '0', maxWidth: '100%'}}>
        <div style={{width: '280px', height: '100vh', position: 'sticky', top: 0}}>
          <Sidebar />
        </div>
        <div style={{flex: 1, padding: '2rem 2rem 2rem 0', overflowY: 'auto', height: '100vh'}}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/demo" element={<DemoController />} />
            <Route path="/payment" element={<PaymentUnlock />} />
            <Route path="/audit" element={<Audit />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
