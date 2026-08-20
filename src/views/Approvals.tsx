import React from 'react';
import { UserCheck, UserX, Clock, ClipboardList } from 'lucide-react';
import { useApprovals } from '../hooks/useApprovals';
import { styles } from '../styles/Approvals.styles';

interface ApprovalsProps {
  communityId: string | null;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const Approvals: React.FC<ApprovalsProps> = ({ communityId, showToast }) => {
  const {
    requests,
    loading,
    actioningId,
    activeTab,
    setActiveTab,
    handleApprove,
    handleReject,
  } = useApprovals({ communityId, showToast });

  return (
    <div className="glass-panel animate-fade-in" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleInfo}>
          <ClipboardList size={22} color="var(--accent)" />
          <h2 style={styles.title}>
            {activeTab === 'pending' ? 'Pending Join Requests' : 'Rejected Join Requests'}
          </h2>
        </div>
        <p style={styles.subtitle}>
          {activeTab === 'pending'
            ? 'Review new signups requesting to join the community directory'
            : 'Review previously rejected applications. You can re-approve them to add them to the directory.'}
        </p>
      </div>

      {/* Sub tabs selector */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('pending')}
          className="btn"
          style={{
            background: activeTab === 'pending' ? 'var(--accent-glow)' : 'transparent',
            borderColor: activeTab === 'pending' ? 'var(--accent)' : 'transparent',
            borderWidth: '1px',
            borderStyle: 'solid',
            color: activeTab === 'pending' ? 'var(--text-accent)' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            padding: '6px 16px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          Pending ({activeTab === 'pending' ? requests.length : '...'})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className="btn"
          style={{
            background: activeTab === 'rejected' ? 'var(--accent-glow)' : 'transparent',
            borderColor: activeTab === 'rejected' ? 'var(--accent)' : 'transparent',
            borderWidth: '1px',
            borderStyle: 'solid',
            color: activeTab === 'rejected' ? 'var(--text-accent)' : 'var(--text-secondary)',
            fontSize: '0.8rem',
            padding: '6px 16px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          Rejected ({activeTab === 'rejected' ? requests.length : '...'})
        </button>
      </div>

      {loading ? (
        <div style={styles.loadingState}>
          <Clock className="animate-spin" size={24} color="var(--text-muted)" />
          <span>Retrieving join applications...</span>
        </div>
      ) : requests.length > 0 ? (
        <div style={styles.tableWrapper}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Contact Info</th>
                <th>Gotra & Surname</th>
                <th>Request Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => {
                const profile = req.user.profile;
                const isWorking = actioningId === req.id;
                return (
                  <tr key={req.id}>
                    <td>
                      <div style={styles.applicantName}>
                        {profile?.fullName || 'Anonymous Profile'}
                      </div>
                      <div style={styles.applicantLocation}>
                        {profile?.city ? `${profile.city}` : 'No location specified'}
                      </div>
                    </td>
                    <td>
                      <div style={styles.mobileNo}>{req.user.mobileNumber}</div>
                    </td>
                    <td>
                      <div style={styles.gotraDetails}>
                        {profile?.gotra || 'N/A'} • {profile?.surname || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div style={styles.dateText}>
                        {new Date(req.joinedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                         })}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={styles.actions}>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="btn"
                          style={styles.approveBtn}
                          disabled={isWorking}
                        >
                          <UserCheck size={14} />
                          <span>{activeTab === 'rejected' ? 'Re-Approve' : 'Approve'}</span>
                        </button>
                        {activeTab === 'pending' && (
                          <button
                            onClick={() => handleReject(req.id)}
                            className="btn"
                            style={styles.rejectBtn}
                            disabled={isWorking}
                          >
                            <UserX size={14} />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <UserCheck size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h3>All caught up!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            There are no {activeTab === 'pending' ? 'pending' : 'rejected'} join requests currently waiting for admin review.
          </p>
        </div>
      )}
    </div>
  );
};

export default Approvals;
