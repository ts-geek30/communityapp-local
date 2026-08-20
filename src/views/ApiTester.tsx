import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, Info, FileUp, Sparkles } from 'lucide-react';
import { BASE_URL } from '../config/api';

interface Endpoint {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requiresAuth: boolean;
  defaultBody?: any;
  isMultipart?: boolean;
}

interface EndpointGroup {
  groupName: string;
  endpoints: Endpoint[];
}

interface ApiTesterProps {
  communityId: string | null;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ApiTester: React.FC<ApiTesterProps> = ({ communityId, showToast }) => {
  // Shared context variables for path/body replacements
  const [vars, setVars] = useState({
    communityId: communityId || localStorage.getItem('admin_selected_community') || '',
    profileId: '',
    familyMemberId: '',
    notificationId: '',
    refreshToken: localStorage.getItem('admin_refresh_token') || '',
    mobileNumber: localStorage.getItem('admin_mobile_number') || '912345678934',
  });

  const endpointGroups: EndpointGroup[] = [
    {
      groupName: '1. Authentication',
      endpoints: [
        {
          name: 'Request OTP',
          method: 'POST',
          path: '/auth/login',
          description: 'Request a mock 6-digit OTP code to be sent to a mobile number.',
          requiresAuth: false,
          defaultBody: { mobileNumber: '{{mobileNumber}}', purpose: 'Login' }
        },
        {
          name: 'Verify OTP',
          method: 'POST',
          path: '/auth/verify-otp',
          description: 'Verify OTP and retrieve access + refresh tokens.',
          requiresAuth: false,
          defaultBody: { mobileNumber: '{{mobileNumber}}', code: '123456', purpose: 'Login' }
        },
        {
          name: 'Refresh Session',
          method: 'POST',
          path: '/auth/refresh',
          description: 'Exchange a valid refresh token for a new access token.',
          requiresAuth: false,
          defaultBody: { refreshToken: '{{refreshToken}}' }
        },
        {
          name: 'Logout Session',
          method: 'POST',
          path: '/auth/logout',
          description: 'Revoke the active refresh token session.',
          requiresAuth: false,
          defaultBody: { refreshToken: '{{refreshToken}}' }
        }
      ]
    },
    {
      groupName: '2. Profiles',
      endpoints: [
        {
          name: 'Retrieve Own Profile',
          method: 'GET',
          path: '/profiles',
          description: 'Fetch the logged-in user profile, professional, and business details.',
          requiresAuth: true
        },
        {
          name: 'Create/Update Core Profile',
          method: 'POST',
          path: '/profiles',
          description: 'Add or update the core profile details of the user.',
          requiresAuth: true,
          defaultBody: {
            fullName: 'Techstaunch Admin',
            dob: '1990-01-01',
            gender: 'Male',
            city: 'Mumbai',
            nativeVillage: 'Village Apex',
            surname: 'Admin',
            gotra: 'Kashyap',
            email: 'admin@communityapp.com'
          }
        },
        {
          name: 'Upload Profile Photo',
          method: 'POST',
          path: '/profiles/photo',
          description: 'Upload a compressed image file as profile photo.',
          requiresAuth: true,
          isMultipart: true
        },
        {
          name: 'Delete Profile Photo',
          method: 'DELETE',
          path: '/profiles/photo',
          description: 'Delete the active profile photo.',
          requiresAuth: true
        },
        {
          name: 'Add/Update Job Details',
          method: 'POST',
          path: '/profiles/job',
          description: 'Specify details about employment and profession.',
          requiresAuth: true,
          defaultBody: {
            companyName: 'Techstaunch Solutions',
            designation: 'Staff Engineer',
            industry: 'Information Technology',
            yearsOfExperience: 6
          }
        },
        {
          name: 'Delete Job Details',
          method: 'DELETE',
          path: '/profiles/job',
          description: 'Remove professional/job details.',
          requiresAuth: true
        },
        {
          name: 'Add/Update Business Details',
          method: 'POST',
          path: '/profiles/business',
          description: 'Specify details about a business owned by the user.',
          requiresAuth: true,
          defaultBody: {
            businessName: 'Techstaunch Consulting',
            category: 'Tech Services',
            productsServices: 'Software development, cloud design',
            website: 'https://techstaunch.com',
            address: '101 Tech Hub, BKC'
          }
        },
        {
          name: 'Delete Business Details',
          method: 'DELETE',
          path: '/profiles/business',
          description: 'Remove business details.',
          requiresAuth: true
        },
        {
          name: 'Update Privacy Settings',
          method: 'POST',
          path: '/profiles/privacy',
          description: 'Modify privacy visibility switches for personal fields.',
          requiresAuth: true,
          defaultBody: {
            showMobileNumber: true,
            showEmail: true,
            showFamilyInfo: true,
            showBusinessInfo: true,
            showProfessionalInfo: true
          }
        }
      ]
    },
    {
      groupName: '3. Communities',
      endpoints: [
        {
          name: 'Create Community',
          method: 'POST',
          path: '/communities',
          description: 'Create a brand new community node (Admin role automatically assigned).',
          requiresAuth: true,
          defaultBody: {
            name: 'New Horizon Community',
            description: 'A shared hub for connection and resource allocation.',
            location: 'Mumbai',
            bannerUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600'
          }
        },
        {
          name: 'Join Community',
          method: 'POST',
          path: '/communities/join',
          description: 'Submit a membership request to join a community.',
          requiresAuth: true,
          defaultBody: {
            inviteCode: 'MARWADI_SORCE'
          }
        },
        {
          name: 'Get My Memberships',
          method: 'GET',
          path: '/communities/my-memberships',
          description: 'Fetch all communities where the user is a registered member or admin.',
          requiresAuth: true
        },
        {
          name: 'Get Community Details',
          method: 'GET',
          path: '/communities/{{communityId}}',
          description: 'Fetch general metadata of a community.',
          requiresAuth: true
        },
        {
          name: 'Get Community Members',
          method: 'GET',
          path: '/communities/{{communityId}}/members',
          description: 'Retrieve lists of active members within a community.',
          requiresAuth: true
        },
        {
          name: 'Get Pending Requests',
          method: 'GET',
          path: '/communities/{{communityId}}/pending',
          description: 'Retrieve list of pending memberships awaiting approval (Admin only).',
          requiresAuth: true
        },
        {
          name: 'Approve Membership',
          method: 'POST',
          path: '/communities/{{communityId}}/approve',
          description: 'Approve a pending membership request (Admin only).',
          requiresAuth: true,
          defaultBody: {
            userId: '{{profileId}}'
          }
        },
        {
          name: 'Reject Membership',
          method: 'POST',
          path: '/communities/{{communityId}}/reject',
          description: 'Reject and discard a pending membership request (Admin only).',
          requiresAuth: true,
          defaultBody: {
            userId: '{{profileId}}'
          }
        }
      ]
    },
    {
      groupName: '4. Family Tree',
      endpoints: [
        {
          name: 'Get Family Members',
          method: 'GET',
          path: '/family',
          description: 'Retrieve all mapped family nodes for the logged-in user profile.',
          requiresAuth: true
        },
        {
          name: 'Add Family Member',
          method: 'POST',
          path: '/family',
          description: 'Append a new node to the family graph (contains graph safety loops check).',
          requiresAuth: true,
          defaultBody: {
            fullName: 'Spouse Doe',
            gender: 'Female',
            dob: '1992-05-15',
            relationshipType: 'Wife',
            isDeceased: false,
            photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            linkedMobile: '9876543210'
          }
        },
        {
          name: 'Update Family Member',
          method: 'PUT',
          path: '/family/{{familyMemberId}}',
          description: 'Edit fields of an existing family tree node.',
          requiresAuth: true,
          defaultBody: {
            fullName: 'Spouse Doe Updated',
            gender: 'Female',
            dob: '1992-05-15',
            relationshipType: 'Wife',
            isDeceased: false,
            photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            linkedMobile: '9876543211'
          }
        },
        {
          name: 'Delete Family Member',
          method: 'DELETE',
          path: '/family/{{familyMemberId}}',
          description: 'Remove a node from the family tree.',
          requiresAuth: true
        }
      ]
    },
    {
      groupName: '5. Search & Filters',
      endpoints: [
        {
          name: 'Search/Filter Members',
          method: 'GET',
          path: '/search?query=Admin&city=Mumbai',
          description: 'Find members by name, occupation, gotra, village, or business category.',
          requiresAuth: true
        },
        {
          name: 'Get Member Detail Profile',
          method: 'GET',
          path: '/search/{{profileId}}',
          description: 'Retrieve details of another member, privacy mask applied dynamically.',
          requiresAuth: true
        }
      ]
    },
    {
      groupName: '6. Document Exports',
      endpoints: [
        {
          name: 'Export Biodata PDF',
          method: 'POST',
          path: '/exports/pdf',
          description: 'Compile and build an official PDF biodata document of a profile.',
          requiresAuth: true,
          defaultBody: {
            targetUserId: '{{profileId}}'
          }
        },
        {
          name: 'Generate QR Code',
          method: 'POST',
          path: '/exports/qr',
          description: 'Generate a base64 png QR code linking to the user profile details.',
          requiresAuth: true
        }
      ]
    },
    {
      groupName: '7. Notifications',
      endpoints: [
        {
          name: 'Get Notifications',
          method: 'GET',
          path: '/notifications',
          description: 'Fetch the system notification feed for the current user.',
          requiresAuth: true
        },
        {
          name: 'Mark Notification as Read',
          method: 'POST',
          path: '/notifications/{{notificationId}}/read',
          description: 'Mark a targeted notification as read.',
          requiresAuth: true
        }
      ]
    },
    {
      groupName: '8. Admin Core',
      endpoints: [
        {
          name: 'Get Dashboard Statistics',
          method: 'GET',
          path: '/admin/{{communityId}}/dashboard',
          description: 'Retrieve admin statistics (total counts, pending ratios, recent feed).',
          requiresAuth: true
        },
        {
          name: 'Get Announcements',
          method: 'GET',
          path: '/admin/{{communityId}}/announcements',
          description: 'List announcements published in this community.',
          requiresAuth: true
        },
        {
          name: 'Publish Announcement',
          method: 'POST',
          path: '/admin/{{communityId}}/announcements',
          description: 'Publish a new announcement to community broadcast feed.',
          requiresAuth: true,
          defaultBody: {
            title: 'Community Upgrade Scheduled',
            content: 'We are introducing the new API playground tools this week!',
            imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'
          }
        },
        {
          name: 'Get Events List',
          method: 'GET',
          path: '/admin/{{communityId}}/events',
          description: 'List upcoming events in this community.',
          requiresAuth: true
        },
        {
          name: 'Publish Event',
          method: 'POST',
          path: '/admin/{{communityId}}/events',
          description: 'Publish a new event to community feed.',
          requiresAuth: true,
          defaultBody: {
            title: 'Grand Meetup & Dinner Gala',
            description: 'Annual gathering of all community members for networking and dinner.',
            dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Royal Banquet Hall, Block B',
            imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600'
          }
        }
      ]
    }
  ];

  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(endpointGroups[0].endpoints[0]);
  const [requestBody, setRequestBody] = useState<string>('');
  const [includeAuth, setIncludeAuth] = useState<boolean>(true);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  // Response status
  const [loading, setLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<any>(null);

  const [copied, setCopied] = useState<boolean>(false);

  // Sync variables with standard state changes
  useEffect(() => {
    if (communityId) {
      setVars(v => ({ ...v, communityId }));
    }
  }, [communityId]);

  // When selected endpoint changes, prefill request body
  useEffect(() => {
    if (selectedEndpoint.defaultBody) {
      let bodyStr = JSON.stringify(selectedEndpoint.defaultBody, null, 2);
      // Replace variables in templates
      bodyStr = bodyStr.replace('{{refreshToken}}', vars.refreshToken || '');
      bodyStr = bodyStr.replace('{{communityId}}', vars.communityId || '');
      bodyStr = bodyStr.replace('{{profileId}}', vars.profileId || '');
      bodyStr = bodyStr.replace('{{familyMemberId}}', vars.familyMemberId || '');
      bodyStr = bodyStr.replace('{{notificationId}}', vars.notificationId || '');
      bodyStr = bodyStr.replace('{{mobileNumber}}', vars.mobileNumber || '');
      setRequestBody(bodyStr);
    } else {
      setRequestBody('');
    }
    setFileToUpload(null);
    setResponseStatus('');
    setResponseTime(null);
    setResponseBody(null);
  }, [selectedEndpoint]);

  // Compute interpolated URL path
  const getInterpolatedPath = (rawPath: string) => {
    let result = rawPath;
    result = result.replace('{{communityId}}', vars.communityId || ':communityId');
    result = result.replace('{{profileId}}', vars.profileId || ':profileId');
    result = result.replace('{{familyMemberId}}', vars.familyMemberId || ':familyMemberId');
    result = result.replace('{{notificationId}}', vars.notificationId || ':notificationId');
    return result;
  };

  const handleSendRequest = async () => {
    const interpolatedPath = getInterpolatedPath(selectedEndpoint.path);
    
    // Validate variables replacement correctness
    if (interpolatedPath.includes(':') || interpolatedPath.includes('{{')) {
      showToast('Please specify all URL path parameters first.', 'error');
      return;
    }

    setLoading(true);
    setResponseStatus('Sending...');
    setResponseTime(null);
    setResponseBody(null);

    const startTime = performance.now();
    const token = localStorage.getItem('admin_access_token');
    const headers: Record<string, string> = {};

    if (includeAuth && token && selectedEndpoint.requiresAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const requestURL = `${BASE_URL}${interpolatedPath}`;

    try {
      let response: Response;

      if (selectedEndpoint.isMultipart && fileToUpload) {
        // Multipart request
        const formData = new FormData();
        formData.append('photo', fileToUpload);
        
        response = await fetch(requestURL, {
          method: selectedEndpoint.method,
          headers,
          body: formData,
        });
      } else {
        // Standard JSON request
        if (selectedEndpoint.method !== 'GET' && selectedEndpoint.method !== 'DELETE') {
          headers['Content-Type'] = 'application/json';
        }

        // Replace template variables in body string dynamically before sending
        let resolvedBodyStr = requestBody;
        resolvedBodyStr = resolvedBodyStr.replace('{{refreshToken}}', vars.refreshToken);
        resolvedBodyStr = resolvedBodyStr.replace('{{communityId}}', vars.communityId);
        resolvedBodyStr = resolvedBodyStr.replace('{{profileId}}', vars.profileId);
        resolvedBodyStr = resolvedBodyStr.replace('{{familyMemberId}}', vars.familyMemberId);
        resolvedBodyStr = resolvedBodyStr.replace('{{notificationId}}', vars.notificationId);
        resolvedBodyStr = resolvedBodyStr.replace('{{mobileNumber}}', vars.mobileNumber);

        const body = (selectedEndpoint.method !== 'GET' && selectedEndpoint.method !== 'DELETE') 
          ? resolvedBodyStr 
          : undefined;

        response = await fetch(requestURL, {
          method: selectedEndpoint.method,
          headers,
          body,
        });
      }

      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(`${response.status} ${response.statusText}`);



      const text = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = { rawResponse: text };
      }

      setResponseBody(data);

      // Check if access token or refresh token returned, auto-prompt or update
      if (data?.success && data?.data) {
        const d = data.data;
        if (d.accessToken) {
          localStorage.setItem('admin_access_token', d.accessToken);
          showToast('Updated access token automatically!', 'success');
          if (selectedEndpoint.path === '/auth/verify-otp' && vars.mobileNumber) {
            localStorage.setItem('admin_mobile_number', vars.mobileNumber);
          }
        }
        if (d.refreshToken) {
          localStorage.setItem('admin_refresh_token', d.refreshToken);
          setVars(v => ({ ...v, refreshToken: d.refreshToken }));
        }
        // Auto extract target variables if available
        if (d.community?.id) {
          setVars(v => ({ ...v, communityId: d.community.id }));
        } else if (d.id && selectedEndpoint.path === '/family') {
          // If family member added, save ID
          setVars(v => ({ ...v, familyMemberId: d.id }));
        } else if (d.profile?.id) {
          setVars(v => ({ ...v, profileId: d.profile.id }));
        } else if (Array.isArray(d) && d.length > 0 && selectedEndpoint.path === '/family') {
          // Auto fill first family node
          setVars(v => ({ ...v, familyMemberId: d[0].id }));
        }
      }
    } catch (err: any) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus('Network Error / Connection Refused');
      setResponseBody({ error: err.message || 'Check if backend server is running and accessible.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!responseBody) return;
    navigator.clipboard.writeText(JSON.stringify(responseBody, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'GET': return '#10b981'; // green
      case 'POST': return '#f59e0b'; // amber
      case 'PUT': return '#8b5cf6'; // purple
      case 'DELETE': return '#ef4444'; // red
      default: return '#6b7280';
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Dynamic Context Header */}
      <div className="glass-panel" style={styles.variablesCard}>
        <div style={styles.varsHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Shared Playground Context</h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Variables will automatically inject into URL paths (e.g. <code>{"{{communityId}}"}</code>) and JSON payloads.
          </span>
        </div>
        <div style={styles.varsGrid}>
          <div style={styles.varInputGroup}>
            <label style={styles.varLabel}>communityId</label>
            <input 
              style={styles.varInput} 
              type="text" 
              placeholder="e.g. UUID..." 
              value={vars.communityId} 
              onChange={e => setVars({ ...vars, communityId: e.target.value })}
            />
          </div>
          <div style={styles.varInputGroup}>
            <label style={styles.varLabel}>profileId (member ID)</label>
            <input 
              style={styles.varInput} 
              type="text" 
              placeholder="e.g. UUID..." 
              value={vars.profileId} 
              onChange={e => setVars({ ...vars, profileId: e.target.value })}
            />
          </div>
          <div style={styles.varInputGroup}>
            <label style={styles.varLabel}>familyMemberId</label>
            <input 
              style={styles.varInput} 
              type="text" 
              placeholder="e.g. UUID..." 
              value={vars.familyMemberId} 
              onChange={e => setVars({ ...vars, familyMemberId: e.target.value })}
            />
          </div>
          <div style={styles.varInputGroup}>
            <label style={styles.varLabel}>notificationId</label>
            <input 
              style={styles.varInput} 
              type="text" 
              placeholder="e.g. UUID..." 
              value={vars.notificationId} 
              onChange={e => setVars({ ...vars, notificationId: e.target.value })}
            />
          </div>
          <div style={styles.varInputGroup}>
            <label style={styles.varLabel}>refreshToken</label>
            <input 
              style={styles.varInput} 
              type="text" 
              placeholder="Token string..." 
              value={vars.refreshToken} 
              onChange={e => setVars({ ...vars, refreshToken: e.target.value })}
            />
          </div>
          <div style={styles.varInputGroup}>
            <label style={styles.varLabel}>mobileNumber</label>
            <input 
              style={styles.varInput} 
              type="text" 
              placeholder="e.g. 912345678934..." 
              value={vars.mobileNumber} 
              onChange={e => setVars({ ...vars, mobileNumber: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* Left Side: Endpoint Directory */}
        <div className="glass-panel" style={styles.directoryPanel}>
          <h3 style={styles.panelTitle}>API Endpoints</h3>
          <div style={styles.groupAccordionContainer}>
            {endpointGroups.map((group, gIdx) => (
              <div key={group.groupName} style={{ marginBottom: '12px' }}>
                <button 
                  onClick={() => setActiveGroupIndex(gIdx)}
                  style={{
                    ...styles.groupTab,
                    ...(activeGroupIndex === gIdx ? styles.groupTabActive : {})
                  }}
                >
                  {group.groupName}
                </button>
                {activeGroupIndex === gIdx && (
                  <div style={styles.endpointList}>
                    {group.endpoints.map((ep, eIdx) => {
                      const isSelected = selectedEndpoint.name === ep.name && selectedEndpoint.path === ep.path;
                      return (
                        <button
                          key={eIdx}
                          onClick={() => setSelectedEndpoint(ep)}
                          style={{
                            ...styles.endpointItem,
                            ...(isSelected ? styles.endpointItemActive : {})
                          }}
                        >
                          <span style={{
                            ...styles.methodBadge,
                            backgroundColor: getMethodBadgeColor(ep.method)
                          }}>{ep.method}</span>
                          <span style={styles.endpointName}>{ep.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center Pane: Request Builder */}
        <div className="glass-panel" style={styles.builderPanel}>
          <div style={styles.builderHeader}>
            <h3 style={styles.panelTitle}>Request Runner</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                id="auth-check" 
                checked={includeAuth} 
                onChange={(e) => setIncludeAuth(e.target.checked)}
                disabled={!selectedEndpoint.requiresAuth}
                style={{ cursor: 'pointer' }}
              />
              <label 
                htmlFor="auth-check" 
                style={{ 
                  fontSize: '0.8rem', 
                  color: selectedEndpoint.requiresAuth ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: selectedEndpoint.requiresAuth ? 'pointer' : 'not-allowed'
                }}
              >
                Inject JWT Auth Token
              </label>
            </div>
          </div>

          <div style={styles.requestRouteRow}>
            <span style={{
              ...styles.requestMethod,
              backgroundColor: getMethodBadgeColor(selectedEndpoint.method)
            }}>
              {selectedEndpoint.method}
            </span>
            <div style={styles.requestPathContainer}>
              <span style={styles.baseUrlLabel}>BASE_URL</span>
              <span style={styles.requestPath} title={selectedEndpoint.path}>
                {getInterpolatedPath(selectedEndpoint.path)}
              </span>
            </div>
          </div>

          <p style={styles.endpointDesc}>{selectedEndpoint.description}</p>

          {/* Form input details */}
          {selectedEndpoint.isMultipart ? (
            <div style={styles.formContainer}>
              <div style={styles.fileDropArea}>
                <FileUp size={24} color="var(--text-secondary)" style={{ marginBottom: '8px' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {fileToUpload ? fileToUpload.name : 'Choose profile photo'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Restricted to image MIMEs up to 5MB
                </span>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg"
                  style={styles.fileInputHidden}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFileToUpload(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            selectedEndpoint.method !== 'GET' && selectedEndpoint.method !== 'DELETE' && (
              <div style={styles.bodyInputContainer}>
                <div style={styles.bodyHeader}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>JSON Request Payload</span>
                  {selectedEndpoint.defaultBody && (
                    <button 
                      onClick={() => {
                        setRequestBody(JSON.stringify(selectedEndpoint.defaultBody, null, 2));
                      }} 
                      style={styles.resetButton}
                      title="Reset JSON to Default Template"
                    >
                      Reset Payload
                    </button>
                  )}
                </div>
                <textarea
                  style={styles.bodyTextarea}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder={'{\n  "key": "value"\n}'}
                />
              </div>
            )
          )}

          <button 
            onClick={handleSendRequest}
            disabled={loading}
            style={{
              ...styles.runButton,
              backgroundColor: loading ? 'rgba(99, 102, 241, 0.4)' : 'var(--accent)'
            }}
          >
            <Play size={16} fill="#fff" />
            <span>{loading ? 'Executing...' : 'Send Request'}</span>
          </button>
        </div>

        {/* Right Pane: Response Console */}
        <div className="glass-panel" style={styles.responsePanel}>
          <div style={styles.responseHeader}>
            <h3 style={styles.panelTitle}>Response Console</h3>
            {responseBody && (
              <button onClick={handleCopyResponse} style={styles.copyButton}>
                {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            )}
          </div>

          {!responseStatus ? (
            <div style={styles.emptyConsole}>
              <Info size={28} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
              <span>Console Idle</span>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'center' }}>
                Select an endpoint, specify parameters, and run the query to see full status, logs, and payloads.
              </p>
            </div>
          ) : (
            <div style={styles.consoleBody}>
              <div style={styles.metaRow}>
                <div style={styles.metaBadgeGroup}>
                  <span style={styles.metaLabel}>Status</span>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: responseStatus.startsWith('2') ? 'var(--success-glow)' : 'var(--error-glow)',
                    color: responseStatus.startsWith('2') ? 'var(--success)' : 'var(--error)',
                    borderColor: responseStatus.startsWith('2') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                  }}>
                    {responseStatus}
                  </span>
                </div>
                {responseTime !== null && (
                  <div style={styles.metaBadgeGroup}>
                    <span style={styles.metaLabel}>Time</span>
                    <span style={styles.timeValue}>{responseTime} ms</span>
                  </div>
                )}
              </div>

              <div style={styles.responseContent}>
                <pre style={styles.responsePre}>
                  {responseBody ? JSON.stringify(responseBody, null, 2) : 'No payload'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1600px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  variablesCard: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    borderRadius: 'var(--radius-md)',
  },
  varsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '8px',
  },
  varsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '12px',
  },
  varInputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  varLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
  },
  varInput: {
    padding: '8px 12px',
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border-input)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    fontFamily: 'monospace',
    outline: 'none',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr 1fr',
    gap: '20px',
    minHeight: '650px',
  },
  directoryPanel: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'var(--radius-md)',
  },
  panelTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '16px',
    fontFamily: 'var(--font-display)',
  },
  groupAccordionContainer: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '580px',
    paddingRight: '4px',
  },
  groupTab: {
    width: '100%',
    padding: '10px 12px',
    textAlign: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontWeight: 600,
    fontSize: '0.8rem',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupTabActive: {
    borderColor: 'var(--accent-focus)',
    backgroundColor: 'var(--accent-glow)',
    color: 'var(--text-accent)',
  },
  endpointList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '8px 4px 4px 8px',
    borderLeft: '1px dashed var(--border)',
    marginLeft: '12px',
  },
  endpointItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    outline: 'none',
    transition: 'all var(--transition-fast)',
  },
  endpointItemActive: {
    backgroundColor: 'var(--bg-hover)',
    color: 'var(--text-primary)',
    fontWeight: 500,
  },
  methodBadge: {
    fontSize: '0.6rem',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '4px',
    color: '#ffffff',
    minWidth: '50px',
    textAlign: 'center',
  },
  endpointName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  builderPanel: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'var(--radius-md)',
  },
  builderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  requestRouteRow: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '8px',
    marginBottom: '12px',
  },
  requestMethod: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '0 16px',
    borderRadius: 'var(--radius-sm)',
    color: '#ffffff',
  },
  requestPathContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border-input)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
    padding: '0 12px',
  },
  baseUrlLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    marginRight: '8px',
    borderRight: '1px solid var(--border)',
    paddingRight: '8px',
  },
  requestPath: {
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  endpointDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    marginBottom: '20px',
  },
  bodyInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    minHeight: '260px',
    marginBottom: '16px',
  },
  bodyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'var(--text-secondary)',
  },
  resetButton: {
    background: 'none',
    border: 'none',
    color: 'var(--text-accent)',
    fontSize: '0.7rem',
    cursor: 'pointer',
    fontWeight: 500,
    outline: 'none',
    padding: '2px 6px',
  },
  bodyTextarea: {
    flex: 1,
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border-input)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px',
    color: 'var(--text-primary)',
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    resize: 'none',
    outline: 'none',
    lineHeight: '1.4',
  },
  formContainer: {
    flex: 1,
    minHeight: '260px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  fileDropArea: {
    width: '100%',
    height: '180px',
    border: '2px dashed var(--border)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all var(--transition-fast)',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  fileInputHidden: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  runButton: {
    padding: '12px 20px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    outline: 'none',
    transition: 'all var(--transition-fast)',
  },
  responsePanel: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'var(--radius-md)',
  },
  responseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  copyButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border)',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '0.7rem',
    cursor: 'pointer',
    fontWeight: 500,
    outline: 'none',
    transition: 'all var(--transition-fast)',
  },
  emptyConsole: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    padding: '20px',
  },
  consoleBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  metaRow: {
    display: 'flex',
    gap: '16px',
  },
  metaBadgeGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  metaLabel: {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  statusBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid',
  },
  timeValue: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    padding: '4px 0',
  },
  responseContent: {
    flex: 1,
    backgroundColor: '#070a13',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'auto',
    maxHeight: '460px',
  },
  responsePre: {
    margin: 0,
    padding: '16px',
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    color: '#818cf8', // light indigo
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  }
};
