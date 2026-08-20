import React from 'react';
import { Users, Hourglass, FileText, Send } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { styles } from '../styles/Dashboard.styles';

interface DashboardProps {
  communityId: string | null;
  setCurrentTab: (tab: string) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  communityId,
  setCurrentTab,
  showToast,
}) => {
  const { stats, loading } = useDashboard({ communityId, showToast });

  if (!communityId) {
    return (
      <div style={styles.emptyContainer} className="animate-fade-in">
        <div style={styles.emptyCard} className="glass-panel">
          <Hourglass className="animate-spin" size={32} color="var(--accent)" style={{ marginBottom: '16px' }} />
          <h2>Connecting to community node...</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.85rem' }}>
            Fetching community credentials and statistics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={styles.dashboardContainer}>
      <div style={styles.kpiGrid}>
        <div className="glass-panel glass-panel-interactive" style={styles.kpiCard}>
          <div style={styles.kpiInfo}>
            <span style={styles.kpiLabel}>Total Members</span>
            <span style={styles.kpiValue}>{stats ? stats.totalMembers : 0}</span>
          </div>
          <div style={{ ...styles.kpiIcon, background: 'rgba(99, 102, 241, 0.1)' }}>
            <Users size={24} color="var(--accent)" />
          </div>
        </div>

        <button
          className="glass-panel glass-panel-interactive"
          onClick={() => setCurrentTab('approvals')}
          style={{ ...styles.kpiCard, border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
        >
          <div style={styles.kpiInfo}>
            <span style={styles.kpiLabel}>Pending Approvals</span>
            <span style={{ ...styles.kpiValue, color: 'var(--warning)' }}>
              {stats ? stats.pendingRequests : 0}
            </span>
          </div>
          <div style={{ ...styles.kpiIcon, background: 'rgba(245, 158, 11, 0.1)' }}>
            <Hourglass size={24} color="var(--warning)" />
          </div>
        </button>
      </div>

      <div style={styles.bottomSection} className="dashboard-bottom-section">
        <div className="glass-panel" style={styles.feedCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Recent Members</h3>
            <span style={styles.cardSubtitle}>Newly joined user profiles</span>
          </div>
          
          {loading ? (
            <div style={styles.loadingText}>Fetching members feed...</div>
          ) : stats && stats.recentMembers.length > 0 ? (
            <div style={styles.membersList}>
              {stats.recentMembers.map((member) => (
                <div key={member.id} style={styles.memberItem}>
                  {member.user.profile?.profilePhotoUrl ? (
                    <img src={member.user.profile.profilePhotoUrl} alt="Avatar" style={styles.avatarImage} />
                  ) : (
                    <div style={styles.avatarLetter}>
                      {member.user.profile?.fullName?.charAt(0) || '?'}
                    </div>
                  )}
                  <div style={styles.memberDetails}>
                    <div style={styles.memberName}>
                      {member.user.profile?.fullName || 'Anonymous Profile'}
                    </div>
                    <div style={styles.memberSub}>
                      {member.user.mobileNumber} • {member.user.profile?.city || 'No City'}
                    </div>
                  </div>
                  <span style={styles.dateLabel}>
                    {new Date(member.joinedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyFeed}>
              <Users size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
              <span>No members have joined yet. Share the invite code!</span>
            </div>
          )}
        </div>

        <div className="glass-panel" style={styles.quickActionsCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Quick Operations</h3>
            <span style={styles.cardSubtitle}>Shortcut actions for Admins</span>
          </div>
          <div style={styles.actionButtons}>
            <button onClick={() => setCurrentTab('publish')} style={styles.shortcutBtn}>
              <Send size={18} />
              <div style={styles.shortcutText}>
                <strong>Broadcast Announcement</strong>
                <span>Publish announcement and notify all users</span>
              </div>
            </button>
            <button onClick={() => setCurrentTab('publish')} style={styles.shortcutBtn}>
              <FileText size={18} />
              <div style={styles.shortcutText}>
                <strong>Add Ziingup Event</strong>
                <span>Link a new community event metadata</span>
              </div>
            </button>
            {/* Single community model - no secondary options */}
          </div>
        </div>
      </div>
    </div>
  );
};
