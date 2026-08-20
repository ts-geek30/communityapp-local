import { useState, useEffect } from 'react';
import { apiGet } from '../config/api';

interface StatsData {
  totalMembers: number;
  pendingRequests: number;
  recentMembers: Array<{
    id: string;
    joinedAt: string;
    user: {
      mobileNumber: string;
      profile?: {
        fullName: string;
        city: string;
        profilePhotoUrl?: string | null;
      };
    };
  }>;
}

interface UseDashboardProps {
  communityId: string | null;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const useDashboard = ({ communityId, showToast }: UseDashboardProps) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async (commId: string) => {
    setLoading(true);
    try {
      const res = await apiGet(`/admin/${commId}/dashboard`);
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load dashboard statistics', 'error');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (communityId) {
      fetchStats(communityId);
    }
  }, [communityId]);

  return {
    stats,
    loading,
    refetchStats: () => communityId && fetchStats(communityId),
  };
};
export type { StatsData };
