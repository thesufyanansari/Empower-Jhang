import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { otpService } from '../services/otpService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import logo from '../assets/empower-jhang-logo.png';
import { Mail, KeyRound, ArrowLeft, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { refreshSession, saveLocalProfile } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Trim and convert email inputs to lowercase
  const getCleanEmail = () => email.trim().toLowerCase();

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = getCleanEmail();
    
    if (!cleanEmail || !validateEmail(cleanEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const data = await otpService.sendOtp(cleanEmail);
      setOtpSent(true);
      setCountdown(60);
      toast.success(data.message || 'OTP verification code sent.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to send code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    const cleanEmail = getCleanEmail();

    setLoading(true);
    try {
      const data = await otpService.resendOtp(cleanEmail);
      setCountdown(60);
      setOtp('');
      toast.success(data.message || 'A fresh code has been sent.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = getCleanEmail();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP verification code.');
      return;
    }

    setLoading(true);
    try {
      const data = await otpService.verifyOtp(cleanEmail, otp);
      
      if (data.verified) {
        toast.success('Email successfully verified!');
        
        if (data.is_admin) {
          await refreshSession();
          navigate('/admin');
        } else if (data.exists) {
          if (data.id && data.member_id) {
            saveLocalProfile(data.id, data.member_id);
          }
          navigate(`/member/${data.member_id}`);
        } else {
          // Send user details into Signup with state details
          navigate('/signup', { state: { email: data.email } });
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-bg-section dark:bg-slate-950 transition-colors duration-300">
      {/* Dynamic Gradients */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] bg-primary-green/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] bg-primary-blue/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" />

      <Card className="w-full max-w-md p-8 glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800 shadow-xl space-y-6 animate-scale-in">
        <div className="text-center space-y-2">
          <img src={logo} alt="Empower Jhang Logo" className="h-14 w-auto mx-auto object-contain" />
          <h2 className="font-poppins text-2xl font-bold tracking-tight text-heading dark:text-white">
            {otpSent ? 'Verify OTP Code' : 'Join Empower Jhang'}
          </h2>
          <p className="text-xs text-text-body dark:text-slate-400">
            {otpSent 
              ? `We sent a 6-digit verification code to ${getCleanEmail()}`
              : 'Enter your email address to verification.'
            }
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4.5 w-4.5" />}
              disabled={loading}
            />

            <Button
              type="submit"
              className="w-full bg-primary-green hover:bg-primary-green/95 border-none"
              isLoading={loading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Send OTP Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <Input
              label="OTP Verification Code"
              type="text"
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              leftIcon={<KeyRound className="h-4.5 w-4.5" />}
              disabled={loading}
            />

            <Button
              type="submit"
              className="w-full bg-primary-blue hover:bg-primary-blue/95 border-none"
              isLoading={loading}
              rightIcon={<ShieldCheck className="h-4 w-4" />}
            >
              Verify Code
            </Button>

            <div className="flex flex-col gap-3 mt-4">
              <Button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || loading}
                variant="outline"
                className="w-full text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                {countdown > 0 ? `Resend Code in ${countdown}s` : 'Resend Verification Code'}
              </Button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold text-text-body/70 hover:text-heading dark:text-slate-400 mt-1"
                disabled={loading}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Email
              </button>
            </div>
          </form>
        )}

        <div className="border-t border-border-custom dark:border-slate-800 pt-4 text-center">
          <p className="text-[10px] text-text-body/70 dark:text-slate-500">
            By joining, you agree to Empower Jhang's Terms of Service and Privacy Policy. All educational programs are 100% free.
          </p>
        </div>
      </Card>
    </div>
  );
};
