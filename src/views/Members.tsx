import React from 'react';
import { Users, Search, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useMembers } from '../hooks/useMembers';
import { styles } from '../styles/Members.styles';

interface MembersProps {
  communityId: string | null;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const Members: React.FC<MembersProps> = ({ communityId, showToast }) => {
  const {
    filteredMembers,
    searchQuery,
    setSearchQuery,
    loading,
    page,
    setPage,
    hasMore,
  } = useMembers({ communityId, showToast });

  return (
    <div className="glass-panel animate-fade-in" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleInfo}>
          <Users size={22} color="var(--accent)" />
          <h2 style={styles.title}>Approved Members Directory</h2>
        </div>
        <p style={styles.subtitle}>Browse and search all approved members in this community</p>
      </div>

      <div style={styles.searchBarWrapper}>
        <Search size={18} style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Filter by name, mobile, city, gotra, surname..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
          className="form-input"
        />
      </div>

      {loading ? (
        <div style={styles.loadingState}>
          <span>Fetching directory records...</span>
        </div>
      ) : filteredMembers.length > 0 ? (
        <>
          <div style={styles.tableWrapper}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile Number</th>
                  <th>Gotra & Surname</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => {
                  const profile = member.user.profile;
                  return (
                    <tr key={member.id}>
                      <td>
                        <div style={styles.memberName}>
                          {profile?.fullName || 'Anonymous Profile'}
                        </div>
                        <div style={styles.memberCity}>
                          {profile?.city || 'No City'}
                        </div>
                      </td>
                      <td>
                        <div style={styles.mobileNo}>{member.user.mobileNumber}</div>
                      </td>
                      <td>
                        <div style={styles.gotraDetails}>
                          {profile?.gotra || 'N/A'} • {profile?.surname || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div style={styles.roleText}>{member.role}</div>
                      </td>
                      <td>
                        <div style={styles.dateText}>
                          {new Date(member.joinedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-approved" style={styles.statusBadge}>
                          <Check size={12} style={{ marginRight: '4px' }} />
                          <span>Approved</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={styles.pagination}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
              className="btn btn-secondary"
              style={styles.pBtn}
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>
            <span style={styles.pageLabel}>Page {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!hasMore || loading}
              className="btn btn-secondary"
              style={styles.pBtn}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </>
      ) : (
        <div style={styles.emptyState}>
          <Users size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h3>No members found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Try adjusting your search filter or checking other pages.
          </p>
        </div>
      )}
    </div>
  );
};
