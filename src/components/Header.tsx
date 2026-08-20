import React from 'react';
import { User, Shield, Sun, Moon, Menu } from 'lucide-react';
import { styles } from '../styles/Header.styles';

interface HeaderProps {
  tabTitle: string;
  adminMobile: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  profilePhotoUrl: string | null;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tabTitle,
  adminMobile,
  theme,
  onToggleTheme,
  profilePhotoUrl,
  onToggleSidebar,
}) => {
  return (
    <header style={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onToggleSidebar} style={styles.menuToggleBtn} className="header-menu-toggle" title="Toggle Sidebar">
          <Menu size={20} />
        </button>
        <h2 style={styles.title}>{tabTitle}</h2>
      </div>
      <div style={styles.userInfo}>
        <button onClick={onToggleTheme} style={styles.themeToggleBtn} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div style={styles.divider}></div>
        <div style={styles.badge}>
          <Shield size={12} style={{ marginRight: '4px' }} />
          <span>Admin Session</span>
        </div>
        <div style={styles.divider}></div>
        <div style={styles.profileSection}>
          <div style={styles.avatar}>
            {profilePhotoUrl ? (
              <img src={profilePhotoUrl} alt="Avatar" style={styles.avatarImg} />
            ) : (
              <User size={16} />
            )}
          </div>
          <span style={styles.mobileText}>{adminMobile || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
};
