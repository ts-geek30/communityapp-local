import React from 'react';
import { Smartphone, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import { styles } from '../styles/Login.styles';

interface LoginProps {
  onLoginSuccess: (token: string, mobileNumber: string) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, showToast }) => {
  const {
    countryCode,
    setCountryCode,
    mobileInput,
    setMobileInput,
    otpCode,
    setOtpCode,
    step,
    setStep,
    loading,
    handleRequestOtp,
    handleVerifyOtp,
  } = useLogin({ onLoginSuccess, showToast });

  return (
    <div style={styles.container}>
      <div style={styles.card} className="glass-panel animate-fade-in">
        <div style={styles.header}>
          <div style={styles.logoCircle}>
            <ShieldCheck size={28} color="#fff" />
          </div>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>Enter your details to access the dashboard</p>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative', width: '108px' }}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="form-input"
                    style={{ paddingRight: '22px', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}
                    disabled={loading}
                  >
                    <option value="+91">+91 (IN)</option>
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+971">+971 (AE)</option>
                    <option value="+61">+61 (AU)</option>
                  </select>
                  <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>▼</span>
                </div>
                <div style={{ ...styles.inputWrapper, flex: 1 }}>
                  <Smartphone size={18} style={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="9876500001"
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    className="form-input"
                    style={styles.paddedInput}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Sending...' : 'Request OTP Code'}
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label className="form-label">6-Digit Verification Code</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="form-input"
                  style={styles.paddedInput}
                  disabled={loading}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Verifying...' : 'Access Dashboard'}
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => setStep('request')}
              className="btn btn-secondary"
              style={styles.backBtn}
              disabled={loading}
            >
              Back to Mobile Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
