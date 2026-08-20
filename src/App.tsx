import React, { useState, useEffect } from 'react';
import { getAuthToken, removeAuthToken, getSelectedCommunity, setSelectedCommunity, apiGet } from './config/api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import type { ToastType } from './components/Toast';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { Approvals } from './views/Approvals';
import { Members } from './views/Members';
import { Publish } from './views/Publish';
import { ApiTester } from './views/ApiTester';

export const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [adminMobile, setAdminMobile] = useState<string>('');
  const [communityId, setCommunityIdState] = useState<string | null>(getSelectedCommunity());
  const [communityName, setCommunityName] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);
  
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>((localStorage.getItem('admin_theme') as 'dark' | 'light') || 'dark');

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  const handleSetCommunityId = (id: string | null) => {
    setCommunityIdState(id);
    if (id) {
      setSelectedCommunity(id);
    } else {
      localStorage.removeItem('admin_selected_community');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('admin_theme', nextTheme);
  };

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const fetchAdminDetails = async () => {
    try {
      // 1. Fetch own profile to display mobile number and photo
      const profileRes = await apiGet('/profiles');
      if (profileRes.success && profileRes.data) {
        setAdminMobile(profileRes.data.mobileNumber || 'Admin');
        setAdminAvatar(profileRes.data.profile?.profilePhotoUrl || null);
      }

      // 2. Fetch memberships to connect to the single seeded community
      const membershipsRes = await apiGet('/communities/my-memberships');
      if (membershipsRes.success && Array.isArray(membershipsRes.data) && membershipsRes.data.length > 0) {
        const targetComm = membershipsRes.data[0].community;
        handleSetCommunityId(targetComm.id);
        setCommunityName(targetComm.name);
      } else {
        handleSetCommunityId(null);
        setCommunityName('');
      }
    } catch (err: any) {
      console.error('Error fetching admin metadata:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminDetails();
    }
  }, [token]);

  const handleLoginSuccess = (newToken: string, mobile: string) => {
    setToken(newToken);
    setAdminMobile(mobile);
  };

  const handleLogout = () => {
    removeAuthToken();
    setToken(null);
    setAdminMobile('');
    setAdminAvatar(null);
    handleSetCommunityId(null);
    setCommunityName('');
    setCurrentTab('dashboard');
    showToast('Logged out successfully', 'success');
  };

  if (!token) {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} showToast={showToast} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard
            communityId={communityId}
            setCurrentTab={setCurrentTab}
            showToast={showToast}
          />
        );
      case 'approvals':
        return <Approvals communityId={communityId} showToast={showToast} />;
      case 'members':
        return <Members communityId={communityId} showToast={showToast} />;
      case 'publish':
        return <Publish communityId={communityId} showToast={showToast} />;
      case 'api_tester':
        return <ApiTester communityId={communityId} showToast={showToast} />;
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className={`admin-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={handleLogout}
        communityName={communityName}
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <Header
        tabTitle={currentTab}
        adminMobile={adminMobile}
        theme={theme}
        onToggleTheme={toggleTheme}
        profilePhotoUrl={adminAvatar}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className="main-content">
        {renderContent()}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;
