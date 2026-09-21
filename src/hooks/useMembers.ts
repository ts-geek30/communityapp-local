import { useState, useEffect } from 'react';
import { apiGet } from '../config/api';
import { downloadMembersCsv } from '../utils/csvExport';

interface MemberRecord {
  id: string;
  userId: string;
  joinedAt: string;
  role: string;
  familyMemberCount?: number;
  user: {
    mobileNumber: string;
    profile?: {
      fullName: string;
      city: string;
      nativeVillage?: string;
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
  const [exporting, setExporting] = useState(false);

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

  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');

  const exportMembers = async (startDate?: string, endDate?: string) => {
    if (!communityId) return;
    setExporting(true);
    setExportProgress(15);
    setExportStatus('Connecting to directory...');
    try {
      let allMembers: MemberRecord[] = [];
      let currentPage = 1;
      let moreToFetch = true;
      const exportLimit = 100;

      while (moreToFetch) {
        setExportStatus(`Fetching records (page ${currentPage})...`);
        const res = await apiGet(
          `/communities/${communityId}/members?limit=${exportLimit}&page=${currentPage}`
        );
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          allMembers = [...allMembers, ...res.data];
          setExportProgress(Math.min(20 + currentPage * 20, 75));
          if (res.data.length < exportLimit) {
            moreToFetch = false;
          } else {
            currentPage++;
          }
        } else {
          moreToFetch = false;
        }
      }

      if (allMembers.length === 0) {
        showToast('No approved members found to export', 'info');
        return;
      }

      setExportProgress(80);
      setExportStatus('Filtering records by date...');

      let filtered = allMembers;
      if (startDate) {
        const start = new Date(`${startDate}T00:00:00.000Z`).getTime();
        filtered = filtered.filter((m) => {
          const raw = m.joinedAt || (m as any).createdAt || (m as any).joined_at || (m as any).created_at;
          const time = raw ? new Date(raw).getTime() : NaN;
          return !isNaN(time) && time >= start;
        });
      }
      if (endDate) {
        const end = new Date(`${endDate}T23:59:59.999Z`).getTime();
        filtered = filtered.filter((m) => {
          const raw = m.joinedAt || (m as any).createdAt || (m as any).joined_at || (m as any).created_at;
          const time = raw ? new Date(raw).getTime() : NaN;
          return !isNaN(time) && time <= end;
        });
      }

      if (filtered.length === 0) {
        showToast('No members found within the selected date range', 'info');
        return;
      }

      setExportProgress(95);
      setExportStatus(`Generating CSV for ${filtered.length} member${filtered.length > 1 ? 's' : ''}...`);
      await new Promise((r) => setTimeout(r, 200));

      downloadMembersCsv(filtered, 'community_members');
      setExportProgress(100);
      setExportStatus('Download started!');
      await new Promise((r) => setTimeout(r, 250));

      showToast(`Exported ${filtered.length} members successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to export members', 'error');
    } finally {
      setExporting(false);
      setExportProgress(0);
      setExportStatus('');
    }
  };

  return {
    members,
    filteredMembers,
    searchQuery,
    setSearchQuery,
    loading,
    exporting,
    exportProgress,
    exportStatus,
    exportMembers,
    page,
    setPage,
    hasMore,
  };
};
export type { MemberRecord };
