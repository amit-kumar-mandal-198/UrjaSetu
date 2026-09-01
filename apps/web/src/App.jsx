import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import DemoController from './pages/DemoController';
import Devices from './pages/Devices';
import Savings from './pages/Savings';
import PaymentUnlock from './pages/PaymentUnlock';
import Alerts from './pages/Alerts';
import Setup from './pages/Setup';
import TaskReview from './pages/TaskReview';
import TaskLive from './pages/TaskLive';
import SavingsReceipt from './pages/SavingsReceipt';
import Insights from './pages/Insights';
import AppLayout from './components/AppLayout';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Landing />} />
          
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/demo" element={<DemoController />} />
            <Route path="/payment" element={<PaymentUnlock />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/tasks/water-pump/review" element={<TaskReview />} />
            <Route path="/tasks/water-pump/live" element={<TaskLive />} />
            <Route path="/receipts/:id" element={<SavingsReceipt />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
