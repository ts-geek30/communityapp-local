import React from 'react';

export type ToastType = 'success' | 'error' | 'info';

export const borderColors: Record<ToastType, string> = {
  success: 'rgba(16, 185, 129, 0.4)',
  error: 'rgba(239, 68, 68, 0.4)',
  info: 'rgba(99, 102, 241, 0.4)',
};

export const styles: Record<string, React.CSSProperties> = {
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid transparent',
    borderRadius: 'var(--radius-sm)',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    boxShadow: 'var(--glass-shadow)',
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
    minWidth: '320px',
    maxWidth: '450px',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
  },
  message: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color var(--transition-fast)',
  },
};
