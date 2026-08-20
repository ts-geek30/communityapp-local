import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '../config/api';

export interface EventItem {
  id: string;
  communityId: string;
  title: string;
  ziingupEventId: string;
  ziingupEventUrl: string;
  eventDate: string | null;
  createdById: string;
  isPublishedAsAnnouncement: boolean;
  status: string | null;
}

interface UseEventsProps {
  communityId: string | null;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const useEvents = ({ communityId, showToast }: UseEventsProps) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!communityId) return;
    setLoading(true);
    try {
      const res = await apiGet(`/admin/${communityId}/events`);
      if (res.success && Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  }, [communityId, showToast]);

  const handleSync = async () => {
    if (!communityId) return;
    setSyncing(true);
    try {
      const res = await apiPost(`/admin/${communityId}/events/sync`, {});
      if (res.success) {
        showToast('Events synced from ZiingUp successfully!', 'success');
        await fetchEvents();
      } else {
        showToast(res.message || 'Failed to sync events', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to sync events', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handlePublishAnnouncement = async (eventId: string) => {
    if (!communityId) return;
    setPublishingId(eventId);
    try {
      const res = await apiPost(`/admin/${communityId}/events/${eventId}/publish-announcement`, {});
      if (res.success) {
        showToast('Announcement published and members notified!', 'success');
        setEvents(prev =>
          prev.map(evt =>
            evt.id === eventId ? { ...evt, isPublishedAsAnnouncement: true } : evt
          )
        );
      } else {
        showToast(res.message || 'Failed to publish announcement', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to publish announcement', 'error');
    } finally {
      setPublishingId(null);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    syncing,
    publishingId,
    handleSync,
    handlePublishAnnouncement,
    refetch: fetchEvents,
  };
};
