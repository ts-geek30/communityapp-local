import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { styles, borderColors } from '../styles/Toast.styles';
import type { ToastType } from '../styles/Toast.styles';

export type { ToastType };

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle size={18} color="var(--success)" />,
    error: <AlertCircle size={18} color="var(--error)" />,
    info: <Info size={18} color="var(--accent)" />,
  };

  return (
    <div
      style={{
        ...styles.toast,
        borderColor: borderColors[type],
      }}
      className="animate-fade-in"
    >
      <div style={styles.content}>
        {icons[type]}
        <span style={styles.message}>{message}</span>
      </div>
      <button onClick={onClose} style={styles.closeBtn}>
        <X size={14} />
      </button>
    </div>
  );
};
