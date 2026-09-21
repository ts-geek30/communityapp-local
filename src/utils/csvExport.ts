import type { MemberRecord } from '../hooks/useMembers';

const escapeCsvValue = (val: any): string => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
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
    const joinedFormatted = m.joinedAt ? new Date(m.joinedAt).toISOString().split('T')[0] : '';
    return [
      escapeCsvValue(p?.fullName || ''),
      escapeCsvValue(m.user?.mobileNumber || ''),
      escapeCsvValue(p?.city || ''),
      escapeCsvValue(p?.nativeVillage || ''),
      escapeCsvValue(p?.surname || ''),
      escapeCsvValue(p?.gotra || ''),
      escapeCsvValue(m.familyMemberCount ?? 0),
      escapeCsvValue(m.role || 'Member'),
      escapeCsvValue(joinedFormatted),
      escapeCsvValue('Approved'),
    ].join(',');
  });

  const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `${filenamePrefix}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
