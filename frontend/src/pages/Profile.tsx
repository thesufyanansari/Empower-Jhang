import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { memberService } from '../services/memberService';
import { otpService } from '../services/otpService';
import { MemberCard } from '../components/MemberCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { 
  User, Briefcase, MapPin, Calendar, Globe, Edit2, Check, X, ShieldCheck, 
  ArrowLeft, ArrowRight, Share2, Copy, Printer, KeyRound, Mail, Star 
} from 'lucide-react';
import { LinkedinIcon, FacebookIcon, InstagramIcon, GithubIcon } from '../components/ui/SocialIcons';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // Admin context

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Edit fields state
  const [editData, setEditData] = useState({
    occupation: '',
    education: '',
    bio: '',
    whatsapp: '',
    address: '',
    skills: '',
    interests: '',
    linkedin: '',
    github: '',
    facebook: '',
    instagram: '',
    portfolio: ''
  });

  // Edit Authorization states
  const [verifiedProfileSecretId, setVerifiedProfileSecretId] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const fetchProfileByMemberId = async () => {
    setLoading(true);
    try {
      if (!id) return;
      const profileData = await memberService.getProfile(id);

      if (profileData) {
        const skillsArray = typeof profileData.skills === 'string'
          ? profileData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '')
          : (profileData.skills || []);

        const interestsArray = typeof profileData.interests === 'string'
          ? profileData.interests.split(',').map((i: string) => i.trim()).filter((i: string) => i !== '')
          : (profileData.interests || []);

        const parsedProfile = {
          ...profileData,
          skills: skillsArray,
          interests: interestsArray
        };

        setProfile(parsedProfile);
        
        setEditData({
          occupation: profileData.profession || profileData.occupation || '',
          education: profileData.education || '',
          bio: profileData.bio || '',
          whatsapp: profileData.whatsapp || '',
          address: profileData.address || '',
          skills: typeof profileData.skills === 'string' ? profileData.skills : (profileData.skills ? profileData.skills.join(', ') : ''),
          interests: typeof profileData.interests === 'string' ? profileData.interests : (profileData.interests ? profileData.interests.join(', ') : ''),
          linkedin: profileData.linkedin || '',
          github: profileData.github || '',
          facebook: profileData.facebook || '',
          instagram: profileData.instagram || '',
          portfolio: profileData.portfolio || ''
        });
      }
    } catch (err: any) {
      console.error(err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileByMemberId();
  }, [id]);

  // Dynamic SEO Page Title
  useEffect(() => {
    if (profile) {
      document.title = `${profile.full_name} (${profile.member_id}) – Verified Community Identity | Empower Jhang`;
    }
  }, [profile]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // OTP Verification for Profile Editing
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      toast.error('Please enter your registered email address.');
      return;
    }

    setOtpLoading(true);
    try {
      await otpService.sendOtp(emailInput.trim().toLowerCase());
      setOtpSent(true);
      toast.success('Verification code dispatched to your email.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Verification request failed.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) {
      toast.error('Please enter the 6-digit OTP code.');
      return;
    }

    setOtpLoading(true);
    try {
      const data = await otpService.verifyOtp(emailInput.trim().toLowerCase(), otpInput);
      
      if (data.verified) {
        if (data.member_id?.toLowerCase() !== id?.toLowerCase()) {
          toast.error('Access denied. You do not own this member profile.');
          return;
        }

        setVerifiedProfileSecretId(data.id);
        setShowOtpModal(false);
        setEditMode(true);
        toast.success('Identity verified! Profile editing unlocked.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'OTP verification failed.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      if (!id) return;
      
      const targetSecretId = verifiedProfileSecretId || user?.id || '';

      await memberService.updateProfile(id, {
        occupation: editData.occupation,
        education: editData.education,
        bio: editData.bio,
        whatsapp: editData.whatsapp,
        address: editData.address,
        skills: editData.skills,
        interests: editData.interests,
        linkedin: editData.linkedin,
        github: editData.github,
        facebook: editData.facebook,
        instagram: editData.instagram,
        portfolio: editData.portfolio
      }, targetSecretId);

      toast.success('Profile changes saved successfully!');
      setEditMode(false);
      await fetchProfileByMemberId();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Profile save failed.');
    } finally {
      setUpdating(false);
    }
  };

  const copyMemberId = () => {
    if (profile) {
      navigator.clipboard.writeText(profile.member_id);
      toast.success('Member ID copied to clipboard!');
    }
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile URL copied!');
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.full_name} – Empower Jhang Profile`,
          text: `Verified community profile of ${profile.full_name} on Empower Jhang.`,
          url: window.location.href
        });
      } catch (err) {
        copyProfileLink();
      }
    } else {
      copyProfileLink();
    }
  };

  const printProfile = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="font-poppins text-2xl font-bold text-heading dark:text-white">Profile Not Found</h2>
        <p className="text-sm text-text-body dark:text-slate-400 max-w-sm">
          The requested member profile does not exist, was suspended, or has been deleted.
        </p>
        <Link to="/">
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    );
  }

  const formattedJoinDate = new Date(profile.registration_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-bg-section dark:bg-slate-950 py-12 px-4 transition-colors duration-300 print:bg-white print:py-0">
      <div className="max-w-6xl mx-auto space-y-8 print:space-y-4">
        
        {/* Dynamic Theme Banner strip */}
        {profile.role?.theme?.gradient_css && (
          <div 
            className={`w-full h-36 rounded-3xl mb-6 bg-gradient-to-r ${profile.role.theme.gradient_css} border-2 ${profile.role.theme.border_style || 'border-transparent'} relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute right-6 bottom-4 text-white/5" dangerouslySetInnerHTML={{ __html: profile.role.badge?.svg_template?.replace('h-6 w-6', 'h-24 w-24') || '' }} />
          </div>
        )}

        {/* Navigation & Toolbar */}
        <div className="flex items-center justify-between print:hidden">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={shareProfile} leftIcon={<Share2 className="h-4 w-4" />}>
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={printProfile} leftIcon={<Printer className="h-4 w-4" />}>
              Print
            </Button>
            {!editMode && (
              <Button 
                variant="primary" 
                size="sm" 
                className="bg-primary-green hover:bg-primary-green/95 border-none"
                onClick={() => {
                  if (verifiedProfileSecretId || user) {
                    setEditMode(true);
                  } else {
                    setShowOtpModal(true);
                  }
                }}
                leftIcon={<Edit2 className="h-4 w-4" />}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* View Mode Layout */}
        {!editMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start print:grid-cols-1 print:gap-4">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-7 space-y-8 print:space-y-4">
              
              {/* Dynamic Role Badge */}
              {profile.role && (
                <div className="flex items-center gap-3.5 mb-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-border-custom dark:border-slate-800 shadow-sm max-w-sm">
                  <div 
                    className="p-3 rounded-xl text-white flex items-center justify-center shadow-inner"
                    style={{ backgroundColor: profile.role.theme?.accent_color || '#3b82f6' }}
                    dangerouslySetInnerHTML={{ __html: profile.role.badge?.svg_template || '' }}
                  />
                  <div>
                    <span 
                      className="text-[10px] font-extrabold uppercase tracking-widest font-poppins block"
                      style={{ color: profile.role.theme?.accent_color || '#3b82f6' }}
                    >
                      {profile.role.category}
                    </span>
                    <h2 className="text-xs font-bold text-heading dark:text-white leading-tight font-poppins mt-0.5">
                      {profile.role.name} Badge
                    </h2>
                  </div>
                </div>
              )}

              {/* Header profile cards */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-poppins text-3xl font-extrabold tracking-tight text-heading dark:text-white leading-none">
                    {profile.full_name}
                  </h1>
                  {profile.email_verified && profile.status === 'Active' && (
                    <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-600 dark:text-green-400 border border-green-500/20">
                      <ShieldCheck className="h-4 w-4" /> Verified Member
                    </div>
                  )}
                </div>
                
                <p className="text-sm font-semibold text-primary-green uppercase tracking-wider font-poppins">
                  {profile.profession}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-text-body/75 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary-blue" /> {profile.district}, Jhang</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-primary-blue" /> Registered: {formattedJoinDate}</span>
                </div>
              </div>

              {/* Bio Section */}
              {profile.bio && (
                <div className="space-y-2">
                  <h3 className="font-poppins font-bold text-md text-heading dark:text-white border-b border-border-custom dark:border-slate-800 pb-2">
                    About Member
                  </h3>
                  <p className="text-sm text-text-body dark:text-slate-300 leading-relaxed font-poppins">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Details card block */}
              <Card className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-primary-blue mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-bold text-text-body/60 dark:text-slate-400 uppercase tracking-wider font-poppins">Member ID</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-heading dark:text-white">{profile.member_id}</span>
                      <button onClick={copyMemberId} className="text-slate-400 hover:text-heading dark:hover:text-white print:hidden">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary-blue mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-bold text-text-body/60 dark:text-slate-400 uppercase tracking-wider font-poppins">Education</h4>
                    <p className="text-sm font-medium text-heading dark:text-slate-200 mt-1">{profile.education || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary-blue mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-bold text-text-body/60 dark:text-slate-400 uppercase tracking-wider font-poppins">Community Status</h4>
                    <p className="text-sm font-medium text-heading dark:text-slate-200 mt-1">
                      {profile.status === 'Active' ? 'Active Member' : profile.status}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Skills Tags */}
              <div className="space-y-3">
                <h3 className="font-poppins font-bold text-md text-heading dark:text-white">Digital Skill Sets</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill: string) => (
                      <span key={skill} className="rounded-xl bg-slate-100 dark:bg-slate-900 border border-border-custom dark:border-slate-800 px-3.5 py-1.5 text-xs font-semibold text-text-body dark:text-slate-300">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-text-body/60 dark:text-slate-500">No skills specified.</p>
                  )}
                </div>
              </div>

              {/* Interests Tags */}
              <div className="space-y-3">
                <h3 className="font-poppins font-bold text-md text-heading dark:text-white">Interested Fields</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests && profile.interests.length > 0 ? (
                    profile.interests.map((interest: string) => (
                      <span key={interest} className="rounded-xl bg-slate-100 dark:bg-slate-900 border border-border-custom dark:border-slate-800 px-3.5 py-1.5 text-xs font-semibold text-text-body dark:text-slate-300">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-text-body/60 dark:text-slate-500">No interests specified.</p>
                  )}
                </div>
              </div>

              {/* Connections (Social Links) */}
              <div className="space-y-3 print:hidden">
                <h3 className="font-poppins font-bold text-md text-heading dark:text-white">Professional Contacts</h3>
                <div className="flex flex-wrap gap-5">
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-text-body hover:text-primary-blue dark:text-slate-400 dark:hover:text-white transition-colors">
                      <LinkedinIcon className="h-4.5 w-4.5 text-blue-600" /> LinkedIn
                    </a>
                  )}
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-text-body hover:text-primary-blue dark:text-slate-400 dark:hover:text-white transition-colors">
                      <GithubIcon className="h-4.5 w-4.5 text-slate-800 dark:text-white" /> GitHub
                    </a>
                  )}
                  {profile.portfolio && (
                    <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-text-body hover:text-primary-blue dark:text-slate-400 dark:hover:text-white transition-colors">
                      <Globe className="h-4.5 w-4.5 text-green-500" /> Portfolio Website
                    </a>
                  )}
                  {profile.facebook && (
                    <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-text-body hover:text-primary-blue dark:text-slate-400 dark:hover:text-white transition-colors">
                      <FacebookIcon className="h-4.5 w-4.5 text-blue-600" /> Facebook
                    </a>
                  )}
                  {profile.instagram && (
                    <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-text-body hover:text-primary-blue dark:text-slate-400 dark:hover:text-white transition-colors">
                      <InstagramIcon className="h-4.5 w-4.5 text-pink-600" /> Instagram
                    </a>
                  )}
                  {!profile.linkedin && !profile.github && !profile.portfolio && !profile.facebook && !profile.instagram && (
                    <p className="text-xs text-text-body/60 dark:text-slate-500">No links added.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Member Card Display */}
            <div className="lg:col-span-5 flex flex-col items-center print:hidden">
              <div className="text-center mb-6">
                <h3 className="font-poppins font-bold text-heading dark:text-white">Identity Credentials</h3>
                <p className="text-xs text-slate-400 mt-1">Tap the card below to flip front/back.</p>
              </div>
              <MemberCard profile={{
                member_id: profile.member_id,
                full_name: profile.full_name,
                district: profile.district,
                joined_at: profile.registration_date,
                profile_photo: profile.profile_photo,
                occupation: profile.profession || profile.occupation,
                is_verified: profile.email_verified,
                role: profile.role
              }} />
            </div>
          </div>
        ) : (
          /* Edit Mode Form View */
          <Card className="max-w-3xl mx-auto p-8 shadow-lg glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-border-custom dark:border-slate-800 pb-4 mb-6">
              <h2 className="font-poppins text-lg font-bold text-heading dark:text-white flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-primary-green" /> Edit Profile Details
              </h2>
              <button onClick={() => setEditMode(false)} className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Current Profession"
                  name="occupation"
                  type="text"
                  value={editData.occupation}
                  onChange={handleEditChange}
                  required
                />
                <Input
                  label="Education"
                  name="education"
                  type="text"
                  value={editData.education}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-heading dark:text-slate-200 mb-1.5 font-poppins">
                  Bio Description
                </label>
                <textarea
                  name="bio"
                  value={editData.bio}
                  onChange={handleEditChange}
                  rows={3}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-poppins"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="WhatsApp Contact"
                  name="whatsapp"
                  type="tel"
                  value={editData.whatsapp}
                  onChange={handleEditChange}
                  required
                />
                <Input
                  label="Home Address"
                  name="address"
                  type="text"
                  value={editData.address}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Digital Skills (Comma Separated)"
                  name="skills"
                  type="text"
                  value={editData.skills}
                  onChange={handleEditChange}
                  helperText="e.g. React, Coding, Design"
                />
                <Input
                  label="Interests (Comma Separated)"
                  name="interests"
                  type="text"
                  value={editData.interests}
                  onChange={handleEditChange}
                  helperText="e.g. Freelancing, Mentorship"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-border-custom dark:border-slate-800">
                <h3 className="font-poppins font-bold text-heading dark:text-white text-sm">Update Social Connections</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="LinkedIn Profile URL"
                    name="linkedin"
                    type="url"
                    value={editData.linkedin}
                    onChange={handleEditChange}
                    leftIcon={<LinkedinIcon className="h-4 w-4" />}
                  />
                  <Input
                    label="GitHub Profile URL"
                    name="github"
                    type="url"
                    value={editData.github}
                    onChange={handleEditChange}
                    leftIcon={<GithubIcon className="h-4 w-4" />}
                  />
                </div>
                <Input
                  label="Portfolio Link"
                  name="portfolio"
                  type="url"
                  value={editData.portfolio}
                  onChange={handleEditChange}
                  leftIcon={<Globe className="h-4 w-4" />}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Facebook URL"
                    name="facebook"
                    type="url"
                    value={editData.facebook}
                    onChange={handleEditChange}
                    leftIcon={<FacebookIcon className="h-4 w-4" />}
                  />
                  <Input
                    label="Instagram URL"
                    name="instagram"
                    type="url"
                    value={editData.instagram}
                    onChange={handleEditChange}
                    leftIcon={<InstagramIcon className="h-4 w-4" />}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-custom dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setEditMode(false)} disabled={updating}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" className="bg-primary-green hover:bg-primary-green/95 border-none" isLoading={updating} leftIcon={<Check className="h-4 w-4" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        )}

      </div>

      {/* Verification OTP Modal to unlock Edit Mode */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800 shadow-2xl relative space-y-4 animate-scale-in">
            <button 
              onClick={() => {
                setShowOtpModal(false);
                setOtpSent(false);
                setEmailInput('');
                setOtpInput('');
              }} 
              className="absolute top-4 right-4 text-slate-400 hover:text-heading dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="font-poppins text-lg font-bold text-heading dark:text-white">Verify Profile Ownership</h3>
              <p className="text-xs text-text-body dark:text-slate-400">
                {otpSent 
                  ? `Enter the verification code sent to ${emailInput}`
                  : 'Enter your registered email address to receive an editing OTP code.'
                }
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <Input
                  label="Registered Email"
                  type="email"
                  placeholder="e.g. name@example.com"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  leftIcon={<Mail className="h-4.5 w-4.5" />}
                  disabled={otpLoading}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-primary-green hover:bg-primary-green/95 border-none" 
                  isLoading={otpLoading}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Send Verification Code
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <Input
                  label="Verification OTP"
                  type="text"
                  placeholder="Enter 6-digit code"
                  required
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  leftIcon={<KeyRound className="h-4.5 w-4.5" />}
                  disabled={otpLoading}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-primary-blue hover:bg-primary-blue/95 border-none" 
                  isLoading={otpLoading}
                  rightIcon={<ShieldCheck className="h-4 w-4" />}
                >
                  Verify & Edit Profile
                </Button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-primary-blue dark:text-blue-400 hover:underline block text-center w-full"
                >
                  Back to Email
                </button>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
