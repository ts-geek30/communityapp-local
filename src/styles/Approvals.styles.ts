import React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  card: {
    padding: '30px',
  },
  header: {
    marginBottom: '28px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '20px',
  },
  titleInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '60px 0',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 0',
    textAlign: 'center',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  applicantName: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
  },
  applicantLocation: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  mobileNo: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
  },
  gotraDetails: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  dateText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  actions: {
    display: 'inline-flex',
    gap: '8px',
  },
  approveBtn: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--success)',
    padding: '6px 12px',
    fontSize: '0.8rem',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  rejectBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--error)',
    padding: '6px 12px',
    fontSize: '0.8rem',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
};
