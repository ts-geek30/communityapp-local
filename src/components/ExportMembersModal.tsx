import React, { useState, useEffect } from 'react';
import { Download, Calendar, X, FileSpreadsheet, Loader2 } from 'lucide-react';

interface ExportMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (startDate?: string, endDate?: string) => Promise<void>;
  loading: boolean;
  progress?: number;
  statusText?: string;
}

type PresetType = 'all' | '7d' | '30d' | 'month' | 'custom';

export const ExportMembersModal: React.FC<ExportMembersModalProps> = ({
  isOpen,
  onClose,
  onExport,
  loading,
  progress = 0,
  statusText = '',
}) => {
  const [preset, setPreset] = useState<PresetType>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePresetSelect = (type: PresetType) => {
    setPreset(type);
    const today = new Date();
    const todayStr = formatDate(today);

    if (type === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (type === '7d') {
      const past = new Date();
      past.setDate(today.getDate() - 7);
      setStartDate(formatDate(past));
      setEndDate(todayStr);
    } else if (type === '30d') {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      setStartDate(formatDate(past));
      setEndDate(todayStr);
    } else if (type === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(formatDate(firstDay));
      setEndDate(todayStr);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (preset === 'custom' && startDate && endDate && startDate > endDate) {
      alert('Start Date cannot be after End Date.');
      return;
    }
    try {
      await onExport(startDate || undefined, endDate || undefined);
    } finally {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '490px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '28px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          animation: 'modalScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: loading ? 'not-allowed' : 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Close"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileSpreadsheet size={22} color="var(--accent)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Export Members to CSV
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Export approved directory records with date filtering
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ marginBottom: '10px' }}>
              Select Date Range Preset
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { id: 'all', label: 'All Time' },
                { id: '7d', label: 'Last 7 Days' },
                { id: '30d', label: 'Last 30 Days' },
                { id: 'month', label: 'This Month' },
                { id: 'custom', label: 'Custom Range' },
              ].map((item) => {
                const isActive = preset === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={loading}
                    onClick={() => handlePresetSelect(item.id as PresetType)}
                    className="btn"
                    style={{
                      background: isActive ? 'var(--accent)' : 'var(--bg-hover)',
                      borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 500 : 400,
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {(preset === 'custom' || startDate || endDate) && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginTop: '16px',
                padding: '14px',
                background: 'var(--bg-hover)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
                  From (Joined Date)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setPreset('custom');
                      setStartDate(e.target.value);
                    }}
                    className="form-input"
                    style={{ fontSize: '0.85rem', padding: '8px 10px' }}
                    disabled={loading}
                    required={preset === 'custom'}
                  />
                </div>
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
                  To (Joined Date)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setPreset('custom');
                      setEndDate(e.target.value);
                    }}
                    className="form-input"
                    style={{ fontSize: '0.85rem', padding: '8px 10px' }}
                    disabled={loading}
                    required={preset === 'custom'}
                  />
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '16px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <Calendar size={14} />
            <span>
              {preset === 'all'
                ? 'Will export all community members registered to date.'
                : `Filtering members joined between ${startDate || 'beginning'} and ${
                    endDate || 'today'
                  }.`}
            </span>
          </div>

          {/* Progress Bar Display when loading */}
          {loading && (
            <div
              style={{
                marginTop: '18px',
                padding: '14px 16px',
                background: 'var(--bg-hover)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  fontSize: '0.82rem',
                }}
              >
                <span
                  style={{
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Loader2 size={14} className="animate-spin" />
                  {statusText || 'Preparing CSV export...'}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.8rem' }}>
                  {progress && progress > 0 ? `${progress}%` : ''}
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: progress && progress > 0 ? `${progress}%` : '100%',
                    height: '100%',
                    background: 'var(--accent-gradient, linear-gradient(90deg, #6366f1, #a855f7))',
                    borderRadius: '9999px',
                    transition: 'width 0.3s ease-in-out',
                    ...(progress && progress > 0
                      ? {}
                      : { animation: 'progressIndeterminate 1.5s infinite ease-in-out' }),
                  }}
                />
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '22px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Preparing...</span>
                </>
              ) : (
                <>
                  <Download size={15} />
                  <span>Download CSV</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
