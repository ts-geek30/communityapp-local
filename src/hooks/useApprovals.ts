import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../config/api';

interface PendingMember {
  id: string; // membershipId
  userId: string;
  joinedAt: string;
  user: {
    mobileNumber: string;
    profile?: {
      fullName: string;
      city: string;
      nativeVillage: string;
      surname: string;
      gotra: string;
    };
  };
}

interface UseApprovalsProps {
  communityId: string | null;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const useApprovals = ({ communityId, showToast }: UseApprovalsProps) => {
  const [requests, setRequests] = useState<PendingMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'rejected'>('pending');

  const fetchRequests = async (commId: string, tabType: 'pending' | 'rejected') => {
    setLoading(true);
    try {
      const res = await apiGet(`/communities/${commId}/${tabType}`);
      if (res.success && Array.isArray(res.data)) {
        setRequests(res.data);
      }
    } catch (err: any) {
      showToast(err.message || `Failed to retrieve ${tabType} join requests`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (communityId) {
      fetchRequests(communityId, activeTab);
    }
  }, [communityId, activeTab]);

  const handleApprove = async (membershipId: string) => {
    if (!communityId) return;
    setActioningId(membershipId);
    try {
      const res = await apiPost(`/communities/${communityId}/approve`, { membershipId });
      if (res.success) {
        showToast(
          activeTab === 'rejected' 
            ? 'Membership request re-approved successfully' 
            : 'Membership request approved successfully', 
          'success'
        );
        setRequests(prev => prev.filter(req => req.id !== membershipId));
      }
    } catch (err: any) {
      showToast(err.message || 'Approval failed', 'error');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (membershipId: string) => {
    if (!communityId) return;
    setActioningId(membershipId);
    try {
      const res = await apiPost(`/communities/${communityId}/reject`, { membershipId });
      if (res.success) {
        showToast('Membership request rejected successfully', 'success');
        setRequests(prev => prev.filter(req => req.id !== membershipId));
      }
    } catch (err: any) {
      showToast(err.message || 'Rejection failed', 'error');
    } finally {
      setActioningId(null);
    }
  };

  return {
    requests,
    loading,
    actioningId,
    activeTab,
    setActiveTab,
    handleApprove,
    handleReject,
    refetchRequests: () => communityId && fetchRequests(communityId, activeTab),
  };
};
export type { PendingMember };
