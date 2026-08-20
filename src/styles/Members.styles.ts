import React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  card: {
    padding: '30px',
  },
  header: {
    marginBottom: '20px',
  },
  titleInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  searchBarWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    color: 'var(--text-muted)',
  },
  searchInput: {
    paddingLeft: '48px',
  },
  loadingState: {
    padding: '60px 0',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  emptyState: {
    padding: '60px 0',
    textAlign: 'center',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  memberName: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
  },
  memberCity: {
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
  roleText: {
    fontSize: '0.85rem',
    color: 'var(--text-accent)',
    fontWeight: 500,
  },
  dateText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '24px',
    borderTop: '1px solid var(--border)',
    paddingTop: '20px',
  },
  pageLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  pBtn: {
    padding: '6px 12px',
    fontSize: '0.8rem',
  },
};
