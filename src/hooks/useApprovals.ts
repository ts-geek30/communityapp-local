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
  const [pendingRequests, setPendingRequests] = useState<PendingMember[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<PendingMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'rejected'>('pending');

  const fetchAllRequests = async (commId: string) => {
    setLoading(true);
    try {
      const [pendingRes, rejectedRes] = await Promise.all([
        apiGet(`/communities/${commId}/pending`),
        apiGet(`/communities/${commId}/rejected`),
      ]);
      if (pendingRes.success && Array.isArray(pendingRes.data)) {
        setPendingRequests(pendingRes.data);
      }
      if (rejectedRes.success && Array.isArray(rejectedRes.data)) {
        setRejectedRequests(rejectedRes.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to retrieve join requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (communityId) {
      fetchAllRequests(communityId);
    } else {
      setPendingRequests([]);
      setRejectedRequests([]);
    }
  }, [communityId]);

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
        if (activeTab === 'pending') {
          setPendingRequests(prev => prev.filter(req => req.id !== membershipId));
        } else {
          setRejectedRequests(prev => prev.filter(req => req.id !== membershipId));
        }
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
        const targetReq = pendingRequests.find(req => req.id === membershipId);
        setPendingRequests(prev => prev.filter(req => req.id !== membershipId));
        if (targetReq) {
          setRejectedRequests(prev => [targetReq, ...prev]);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Rejection failed', 'error');
    } finally {
      setActioningId(null);
    }
  };

  const requests = activeTab === 'pending' ? pendingRequests : rejectedRequests;

  return {
    requests,
    pendingCount: pendingRequests.length,
    rejectedCount: rejectedRequests.length,
    loading,
    actioningId,
    activeTab,
    setActiveTab,
    handleApprove,
    handleReject,
    refetchRequests: () => communityId && fetchAllRequests(communityId),
  };
};
export type { PendingMember };
