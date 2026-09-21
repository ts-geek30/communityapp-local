import type { MemberRecord } from '../hooks/useMembers';

const escapeCsvValue = (val: any): string => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

export const formatCsvDate = (dateVal: any): string => {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime()) || d.getTime() <= 0) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

export const downloadMembersCsv = (members: MemberRecord[], filenamePrefix = 'community_members'): void => {
  const headers = [
    'Full Name',
    'Mobile Number',
    'City',
    'Native Village',
    'Surname',
    'Gotra',
    'Family Members Count',
    'Role',
    'Joined Date',
    'Status',
  ];

  const rows = members.map((m) => {
    const p = m.user?.profile;
    const rawDate = m.joinedAt || (m as any).createdAt || (m as any).created_at || (m as any).joined_at;
    const joinedFormatted = formatCsvDate(rawDate);

    return [
      escapeCsvValue(p?.fullName || (m as any).fullName || ''),
      escapeCsvValue(m.user?.mobileNumber || (m as any).mobileNumber || ''),
      escapeCsvValue(p?.city || (m as any).city || ''),
      escapeCsvValue(p?.nativeVillage || (m as any).nativeVillage || ''),
      escapeCsvValue(p?.surname || (m as any).surname || ''),
      escapeCsvValue(p?.gotra || (m as any).gotra || ''),
      escapeCsvValue(m.familyMemberCount ?? (m as any).familyCount ?? 0),
      escapeCsvValue(m.role || 'Member'),
      escapeCsvValue(joinedFormatted),
      escapeCsvValue((m as any).status || 'Approved'),
    ].join(',');
  });

  const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const today = new Date();
  const dateStr = formatCsvDate(today) || 'export';
  link.setAttribute('download', `${filenamePrefix}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
