import React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.1) 0%, var(--bg-primary) 70%)',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px 32px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: 'var(--accent-gradient)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: 'var(--text-muted)',
  },
  paddedInput: {
    paddingLeft: '48px',
  },
  submitBtn: {
    width: '100%',
    marginTop: '10px',
    padding: '12px',
    fontSize: '0.95rem',
  },
  backBtn: {
    width: '100%',
    marginTop: '12px',
    padding: '10px',
    fontSize: '0.85rem',
  },
};
