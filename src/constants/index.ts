import { LayoutDashboard, UserCheck, Users, Send, FlaskConical } from 'lucide-react';

export const TABS = {
  DASHBOARD: 'dashboard',
  APPROVALS: 'approvals',
  MEMBERS: 'members',
  PUBLISH: 'publish',
  API_TESTER: 'api_tester',
} as const;

export type TabId = typeof TABS[keyof typeof TABS];

export const MENU_ITEMS = [
  { id: TABS.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { id: TABS.APPROVALS, label: 'Pending Approvals', icon: UserCheck },
  { id: TABS.MEMBERS, label: 'Members Directory', icon: Users },
  { id: TABS.PUBLISH, label: 'Announcements & Events', icon: Send },
  { id: TABS.API_TESTER, label: 'API Playground', icon: FlaskConical },
];

export const DEFAULT_MOCK_OTP = '123456';
export const DEFAULT_LOGIN_MOBILE = '912345678934';

