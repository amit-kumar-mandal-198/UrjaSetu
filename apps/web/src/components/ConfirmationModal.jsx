import React from 'react';
import { Check, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, confirmText = "Confirm" }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 31, 51, 0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-8 text-muted">
          {children}
        </div>
        
        <div className="flex justify-end gap-4">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            <Check size={18} /> {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
