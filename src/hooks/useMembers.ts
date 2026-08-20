import { useState, useEffect } from 'react';
import { apiGet } from '../config/api';

interface MemberRecord {
  id: string;
  userId: string;
  joinedAt: string;
  role: string;
  user: {
    mobileNumber: string;
    profile?: {
      fullName: string;
      city: string;
      surname: string;
      gotra: string;
    };
  };
}

interface UseMembersProps {
  communityId: string | null;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const useMembers = ({ communityId, showToast }: UseMembersProps) => {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MemberRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchMembers = async (commId: string, pageNum: number) => {
    setLoading(true);
    try {
      const res = await apiGet(`/communities/${commId}/members?limit=${limit}&page=${pageNum}`);
      if (res.success && Array.isArray(res.data)) {
        setMembers(res.data);
        setFilteredMembers(res.data);
        setHasMore(res.data.length === limit);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch community members', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (communityId) {
      fetchMembers(communityId, page);
    }
  }, [communityId, page]);

  // Client-side filtering when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredMembers(members);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = members.filter((member) => {
      const profile = member.user.profile;
      const fullName = profile?.fullName?.toLowerCase() || '';
      const mobile = member.user.mobileNumber || '';
      const city = profile?.city?.toLowerCase() || '';
      const gotra = profile?.gotra?.toLowerCase() || '';
      const surname = profile?.surname?.toLowerCase() || '';

      return (
        fullName.includes(query) ||
        mobile.includes(query) ||
        city.includes(query) ||
        gotra.includes(query) ||
        surname.includes(query)
      );
    });

    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  return {
    members,
    filteredMembers,
    searchQuery,
    setSearchQuery,
    loading,
    page,
    setPage,
    hasMore,
  };
};
export type { MemberRecord };
