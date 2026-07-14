import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { memberService } from '../services/memberService';
import { settingsService } from '../services/settingsService';
import { MemberCard } from '../components/MemberCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MessageSquare, ArrowRight, CheckCircle, ExternalLink, Globe, Hash, Sparkles } from 'lucide-react';
import { FacebookIcon, YoutubeIcon } from '../components/ui/SocialIcons';

export const Welcome: React.FC = () => {
  const { localMemberId } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [links, setLinks] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const memberId = searchParams.get('id') || localMemberId;

  useEffect(() => {
    if (!memberId) {
      navigate('/auth');
      return;
    }

    Promise.all([
      memberService.getProfile(memberId),
      settingsService.getPublicLinks()
    ])
      .then(([profileData, linksData]) => {
        setProfile(profileData);
        setLinks(linksData);
      })
      .catch((err) => {
        console.error('Failed to load welcome page data:', err);
        navigate('/auth');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [memberId, navigate]);

  if (loading || !profile) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent"></div>
      </div>
    );
  }

  const socialLinks = [
    {
      name: 'Join WhatsApp Community',
      url: links?.whatsapp_community || 'https://chat.whatsapp.com',
      description: 'Connect directly with local developers, designers, and marketers in Jhang.',
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-500/10',
      bgColor: 'bg-green-500/5 hover:bg-green-500/10',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      name: 'Join Facebook Group',
      url: links?.facebook_group || 'https://facebook.com/groups',
      description: 'Join our larger community group to see member announcements and webinars.',
      color: 'bg-blue-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-500/10',
      bgColor: 'bg-blue-500/5 hover:bg-blue-500/10',
      icon: <FacebookIcon className="h-5 w-5" />
    },
    {
      name: 'Subscribe YouTube Channel',
      url: links?.youtube || 'https://youtube.com',
      description: 'Watch free masterclasses on coding, design, and freelancing.',
      color: 'bg-red-600',
      textColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-500/10',
      bgColor: 'bg-red-500/5 hover:bg-red-500/10',
      icon: <YoutubeIcon className="h-5 w-5" />
    },
    {
      name: 'Join Discord Server',
      url: links?.discord || 'https://discord.com',
      description: 'Interact with our community real-time via chat and collaborative spaces.',
      color: 'bg-indigo-600',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-indigo-500/10',
      bgColor: 'bg-indigo-500/5 hover:bg-indigo-500/10',
      icon: <Hash className="h-5 w-5" />
    },
    {
      name: 'Follow Instagram Profile',
      url: links?.instagram || 'https://instagram.com',
      description: 'Get daily educational insights, student stories, and event updates.',
      color: 'bg-pink-600',
      textColor: 'text-pink-600 dark:text-pink-400',
      borderColor: 'border-pink-500/10',
      bgColor: 'bg-pink-500/5 hover:bg-pink-500/10',
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      name: 'Visit Official Website',
      url: links?.website || 'https://empowerjhang.org',
      description: 'Read blogs, discover future announcements, and verify membership status.',
      color: 'bg-slate-700',
      textColor: 'text-slate-600 dark:text-slate-400',
      borderColor: 'border-slate-500/10',
      bgColor: 'bg-slate-500/5 hover:bg-slate-500/10',
      icon: <Globe className="h-5 w-5" />
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-bg-section dark:bg-slate-950 py-12 px-4 transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary-green/5 to-transparent pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Congratulations & Networking Channels */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3.5 py-1.5 text-xs font-semibold text-green-600 dark:text-green-400 animate-scale-in">
              <CheckCircle className="h-4 w-4" /> Registration Completed
            </div>
            
            <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-heading dark:text-white tracking-tight leading-tight">
              Congratulations, {profile.full_name.split(' ')[0]}!
            </h1>
            
            <p className="text-sm font-semibold text-primary-blue dark:text-blue-400">
              Official Member ID: {profile.member_id}
            </p>

            <div className="border-l-4 border-primary-green pl-4 py-1.5 my-4 bg-slate-50 dark:bg-slate-900/40 rounded-r-lg">
              <p className="text-xs text-text-body dark:text-slate-300 italic font-medium leading-relaxed">
                "Welcome to Empower Jhang! You are now officially part of our growing digital community. Together we learn, connect, and grow. We are excited to have you with us."
              </p>
            </div>
          </div>

          {/* Social Channels List */}
          <Card className="p-6 space-y-5">
            <h3 className="font-poppins font-bold text-sm text-heading dark:text-white border-b border-border-custom dark:border-slate-800 pb-3">
              Official Community Networks
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socialLinks.map((chan, idx) => (
                <a
                  key={idx}
                  href={chan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-start gap-3 p-3.5 rounded-xl border ${chan.borderColor} ${chan.bgColor} transition-all duration-200`}
                >
                  <div className={`rounded-lg ${chan.color} p-2 text-white shadow-sm`}>
                    {chan.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className={`font-poppins text-xs font-bold truncate ${chan.textColor}`}>
                        {chan.name}
                      </h4>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                    <p className="text-[10px] text-text-body/80 dark:text-slate-400 mt-1 leading-normal">
                      {chan.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </Card>

          <div className="flex items-center justify-between pt-2">
            <Link to={`/member/${profile.member_id}`}>
              <Button variant="outline" className="text-xs" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View Public Profile Page
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Member Identity Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-center mb-6">
            <h3 className="font-poppins font-bold text-heading dark:text-white">Your Digital Identity Card</h3>
            <p className="text-xs text-slate-400 mt-1">Click below to flip, save, or print.</p>
          </div>
          <MemberCard profile={{
            member_id: profile.member_id,
            full_name: profile.full_name,
            district: profile.district,
            joined_at: profile.registration_date,
            profile_photo: profile.profile_photo,
            occupation: profile.profession,
            is_verified: profile.email_verified
          }} />
        </div>
      </div>
    </div>
  );
};
