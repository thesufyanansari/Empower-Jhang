import React, { createContext, useContext, useEffect, useState } from 'react';
import { otpService } from '../services/otpService';
import { memberService } from '../services/memberService';

export interface UserProfile {
  id: string;
  member_id: string;
  full_name: string;
  father_name: string;
  gender: string;
  date_of_birth: string;
  whatsapp: string;
  email: string;
  district: string;
  address: string;
  education: string;
  occupation: string;
  profile_photo: string | null;
  bio: string;
  skills: string[];
  interests: string[];
  facebook: string;
  instagram: string;
  linkedin: string;
  github: string;
  portfolio: string;
  joined_at: string;
  is_active: boolean;
  is_verified: boolean;
  is_admin: boolean;
}

interface AuthContextType {
  user: { id: string; email: string; full_name: string; member_id: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  localProfileId: string | null;
  localMemberId: string | null;
  saveLocalProfile: (id: string, memberId: string) => void;
  clearLocalProfile: () => void;
  adminLogin: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Local profile states (for direct registration flow ownership checking)
  const [localProfileId, setLocalProfileId] = useState<string | null>(() => localStorage.getItem('ej_profile_id'));
  const [localMemberId, setLocalMemberId] = useState<string | null>(() => localStorage.getItem('ej_member_id'));

  const saveLocalProfile = (id: string, memberId: string) => {
    localStorage.setItem('ej_profile_id', id);
    localStorage.setItem('ej_member_id', memberId);
    setLocalProfileId(id);
    setLocalMemberId(memberId);
  };

  const clearLocalProfile = () => {
    localStorage.removeItem('ej_profile_id');
    localStorage.removeItem('ej_member_id');
    setLocalProfileId(null);
    setLocalMemberId(null);
  };

  const refreshSession = async () => {
    try {
      const data = await otpService.getSession();
      if (data && data.authenticated) {
        setUser(data.admin);
        if (data.admin.member_id) {
          try {
            const memberData = await memberService.getProfile(data.admin.member_id);
            setProfile(memberData);
          } catch (profileErr) {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email: string, code: string) => {
    const data = await otpService.verifyOtp(email, code);
    if (data && data.is_admin) {
      await refreshSession();
    }
  };

  const signOut = async () => {
    await otpService.logout();
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      localProfileId, 
      localMemberId, 
      saveLocalProfile, 
      clearLocalProfile, 
      adminLogin, 
      signOut, 
      refreshSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
