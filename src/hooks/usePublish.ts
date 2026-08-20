import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../config/api';

export interface AnnouncementItem {
  id: string;
  communityId: string;
  postedById: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface UsePublishProps {
  communityId: string | null;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const usePublish = ({ communityId, showToast }: UsePublishProps) => {
  const [activeForm, setActiveForm] = useState<'announcement' | 'ziingup_manager'>('announcement');
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [fetchingAnnouncements, setFetchingAnnouncements] = useState(false);

  // Announcement form states
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    if (!communityId) return;
    setFetchingAnnouncements(true);
    try {
      const res = await apiGet(`/admin/${communityId}/announcements`);
      if (res.success && Array.isArray(res.data)) {
        setAnnouncements(res.data);
      } else {
        setAnnouncements([]);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch announcements', 'error');
    } finally {
      setFetchingAnnouncements(false);
    }
  }, [communityId, showToast]);

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityId) return;
    if (!annTitle || !annContent) {
      showToast('Title and Content are required', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // Edit announcement
        const res = await apiPut(`/admin/${communityId}/announcements/${editingId}`, {
          title: annTitle,
          content: annContent,
        });
        if (res.success) {
          showToast('Announcement updated successfully!', 'success');
          setAnnTitle('');
          setAnnContent('');
          setEditingId(null);
          await fetchAnnouncements();
        }
      } else {
        // Create new announcement
        const res = await apiPost(`/admin/${communityId}/announcements`, {
          title: annTitle,
          content: annContent,
        });
        if (res.success) {
          showToast('Announcement broadcasted successfully!', 'success');
          setAnnTitle('');
          setAnnContent('');
          await fetchAnnouncements();
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to publish announcement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSelect = (ann: AnnouncementItem) => {
    setEditingId(ann.id);
    setAnnTitle(ann.title);
    setAnnContent(ann.content);
    // Scroll form into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setAnnTitle('');
    setAnnContent('');
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!communityId) return;
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const res = await apiDelete(`/admin/${communityId}/announcements/${announcementId}`);
      if (res.success) {
        showToast('Announcement deleted successfully', 'success');
        if (editingId === announcementId) {
          handleCancelEdit();
        }
        await fetchAnnouncements();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete announcement', 'error');
    }
  };

  useEffect(() => {
    if (communityId && activeForm === 'announcement') {
      fetchAnnouncements();
    }
  }, [communityId, activeForm, fetchAnnouncements]);

  return {
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
    refetchAnnouncements: fetchAnnouncements,
  };
};
