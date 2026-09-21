import React, { useState, useEffect } from 'react';
import { Download, Calendar, X, FileSpreadsheet } from 'lucide-react';

interface ExportMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (startDate?: string, endDate?: string) => Promise<void>;
  loading: boolean;
}

type PresetType = 'all' | '7d' | '30d' | 'month' | 'custom';

export const ExportMembersModal: React.FC<ExportMembersModalProps> = ({
  isOpen,
  onClose,
  onExport,
  loading,
}) => {
  const [preset, setPreset] = useState<PresetType>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

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
    await onExport(startDate || undefined, endDate || undefined);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out forwards',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '28px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border)',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileSpreadsheet size={22} color="var(--accent)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
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
                    onClick={() => handlePresetSelect(item.id as PresetType)}
                    className="btn"
                    style={{
                      background: isActive ? 'var(--accent-glow)' : 'transparent',
                      borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '24px',
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
              <Download size={15} />
              <span>{loading ? 'Exporting...' : 'Download CSV'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
