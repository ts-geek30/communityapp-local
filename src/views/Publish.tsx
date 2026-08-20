import React from 'react';
import { Send, Calendar, RefreshCw, ExternalLink, Megaphone, Check, Edit, Trash2 } from 'lucide-react';
import { usePublish } from '../hooks/usePublish';
import { useEvents } from '../hooks/useEvents';
import { styles } from '../styles/Publish.styles';

interface PublishProps {
  communityId: string | null;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const Publish: React.FC<PublishProps> = ({ communityId, showToast }) => {
  const {
    activeForm,
    setActiveForm,
    loading,
    annTitle,
    setAnnTitle,
    annContent,
    setAnnContent,
    announcements,
    fetchingAnnouncements,
    editingId,
    handlePublishAnnouncement,
    handleEditSelect,
    handleCancelEdit,
    handleDeleteAnnouncement,
  } = usePublish({ communityId, showToast });

  const {
    events,
    loading: eventsLoading,
    syncing,
    publishingId,
    handleSync,
    handlePublishAnnouncement: handlePublishEventAnnouncement,
  } = useEvents({ communityId, showToast });

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.tabHeaders}>
        <button
          onClick={() => setActiveForm('announcement')}
          style={{
            ...styles.tabBtn,
            ...(activeForm === 'announcement' ? styles.tabBtnActive : {}),
          }}
        >
          <Send size={16} />
          <span>Publish Announcement</span>
        </button>
        <button
          onClick={() => setActiveForm('ziingup_manager')}
          style={{
            ...styles.tabBtn,
            ...(activeForm === 'ziingup_manager' ? styles.tabBtnActive : {}),
          }}
        >
          <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
          <span>Ziingup Events Manager</span>
        </button>
      </div>

      {activeForm === 'announcement' ? (
        <>
          <div className="glass-panel" style={styles.formCard}>
          <div style={styles.cardHeader}>
            <h3>{editingId ? 'Edit Announcement' : 'Broadcast Announcement'}</h3>
            <p style={styles.subtitle}>
              {editingId
                ? 'Modify the details of your announcement.'
                : 'Sends a real-time push notification announcement to all approved community members.'}
            </p>
          </div>

          <form onSubmit={handlePublishAnnouncement}>
            <div className="form-group">
              <label className="form-label">Announcement Title</label>
              <input
                type="text"
                placeholder="Important Meeting This Sunday"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="form-input"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Content / Message</label>
              <textarea
                placeholder="Write your announcement details here..."
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                className="form-input"
                style={styles.textarea}
                required
                disabled={loading}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Announcement' : 'Broadcast Announcement'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn"
                  onClick={handleCancelEdit}
                  style={{ padding: '10px 18px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)' }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="glass-panel" style={{ ...styles.formCard, marginTop: '24px' }}>
          <div style={styles.cardHeader}>
            <h3>Past Announcements</h3>
            <p style={styles.subtitle}>List of all broadcasted announcements in this community.</p>
          </div>

          {fetchingAnnouncements ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <span>Loading past announcements...</span>
            </div>
          ) : announcements.length > 0 ? (
            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Title</th>
                    <th style={{ width: '45%' }}>Content</th>
                    <th style={{ width: '18%' }}>Broadcast Date</th>
                    <th style={{ width: '12%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((ann) => (
                    <tr key={ann.id}>
                      <td style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {ann.title}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                        {ann.content}
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(ann.createdAt).toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEditSelect(ann)}
                            className="btn"
                            style={{ padding: '6px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Edit Announcement"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            className="btn"
                            style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Delete Announcement"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <span>No announcements broadcasted yet.</span>
            </div>
          )}
          </div>
        </>
      ) : (
        <div className="glass-panel" style={styles.formCard}>
          <div style={styles.syncHeader}>
            <div style={styles.syncTitleSection}>
              <h3>Ziingup Events Manager</h3>
              <p style={styles.subtitle}>Sync events from the external Ziingup API and publish announcements to community members.</p>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing || eventsLoading}
              className="btn btn-primary"
              style={styles.syncBtn}
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? 'Syncing...' : 'Sync from Ziingup'}</span>
            </button>
          </div>

          {eventsLoading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <span>Loading synchronized events...</span>
            </div>
          ) : events.length > 0 ? (
            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Event Details</th>
                    <th>Ziingup Event ID</th>
                    <th>URL</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => {
                    const isPublished = event.isPublishedAsAnnouncement;
                    const isPublishingThis = publishingId === event.id;

                    return (
                      <tr key={event.id}>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {event.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {event.eventDate
                              ? new Date(event.eventDate).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'Date TBD'}
                          </div>
                        </td>
                        <td>
                          <code style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {event.ziingupEventId}
                          </code>
                        </td>
                        <td>
                          <a
                            href={event.ziingupEventUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.eventLink}
                          >
                            <span>Link</span>
                            <ExternalLink size={12} />
                          </a>
                        </td>
                        <td>
                          {isPublished ? (
                            <span style={styles.publishedBadge}>
                              <Check size={12} />
                              <span>Broadcasted</span>
                            </span>
                          ) : event.status === 'published' ? (
                            <span className="badge badge-approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textTransform: 'capitalize' }}>
                              <span>Published</span>
                            </span>
                          ) : (
                            <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textTransform: 'capitalize', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
                              <span>{event.status || 'Draft'}</span>
                            </span>
                          )}
                        </td>
                        <td>
                          {isPublished ? (
                            <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'default' }} disabled>
                              Published
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePublishEventAnnouncement(event.id)}
                              disabled={isPublishingThis || syncing || event.status !== 'published'}
                              className="btn btn-primary"
                              style={{
                                ...styles.publishBtn,
                                ...(event.status !== 'published'
                                  ? {
                                      opacity: 0.5,
                                      cursor: 'not-allowed',
                                      background: 'var(--text-muted)',
                                      color: 'var(--bg-primary)',
                                    }
                                  : {}),
                              }}
                              title={
                                event.status !== 'published'
                                  ? 'This event needs to be first published from the Ziingup'
                                  : 'Publish event to community announcement'
                              }
                            >
                              <Megaphone size={12} />
                              <span>{isPublishingThis ? 'Publishing...' : 'Publish'}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <Calendar size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
              <h3>No events synchronized yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                Use the button above to import your events list from the Ziingup API.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
