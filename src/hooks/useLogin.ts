import { useState } from 'react';
import { apiPost, setAuthToken } from '../config/api';
import { DEFAULT_MOCK_OTP } from '../constants';

interface UseLoginProps {
  onLoginSuccess: (token: string, mobileNumber: string) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const useLogin = ({ onLoginSuccess, showToast }: UseLoginProps) => {
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileInput, setMobileInput] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileInput) {
      showToast('Mobile number is required', 'error');
      return;
    }

    const combinedMobile = countryCode + mobileInput;

    setLoading(true);
    try {
      await apiPost('/auth/login', { mobileNumber: combinedMobile, purpose: 'Login' });
      showToast(`OTP code sent successfully (Use ${DEFAULT_MOCK_OTP} in dev)`, 'success');
      setStep('verify');
      setOtpCode(DEFAULT_MOCK_OTP); // Default mock OTP in dev
    } catch (err: any) {
      showToast(err.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      showToast('OTP code is required', 'error');
      return;
    }

    const combinedMobile = countryCode + mobileInput;

    setLoading(true);
    try {
      const res = await apiPost('/auth/verify-otp', {
        mobileNumber: combinedMobile,
        code: otpCode,
        purpose: 'Login',
      });

      if (res.success && res.data?.accessToken) {
        setAuthToken(res.data.accessToken);
        showToast('Login successful', 'success');
        onLoginSuccess(res.data.accessToken, combinedMobile);
      } else {
        showToast('Invalid login response schema', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to verify OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
