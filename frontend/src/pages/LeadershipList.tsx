import React, { useEffect, useState } from 'react';
import { memberService } from '../services/memberService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Globe, Award, ExternalLink } from 'lucide-react';
import { LinkedinIcon, GithubIcon, FacebookIcon, InstagramIcon } from '../components/ui/SocialIcons';
import { Link } from 'react-router-dom';

export const LeadershipList: React.FC = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memberService.getPublicLeadership()
      .then((data) => {
        setLeaders(data || []);
      })
      .catch((err) => console.error('Failed to load leadership team:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-bg-section dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-primary-blue dark:bg-blue-500/20 dark:text-blue-400 text-xs font-bold font-poppins border border-blue-500/20">
            <Award className="h-4 w-4 text-primary-green" /> Organization Hierarchy
          </div>
          <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-heading dark:text-white tracking-tight">
            Our Leadership Team
          </h1>
          <p className="text-sm text-text-body dark:text-slate-400">
            Meet the visionaries, coordinators, and directors driving technical instruction, operations, and placements in District Jhang.
          </p>
        </div>

        {/* Loading skeleton state */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-3xl h-96 border border-border-custom dark:border-slate-800" />
            ))}
          </div>
        ) : leaders.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border-custom dark:border-slate-800 max-w-md mx-auto">
            <ShieldCheck className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="font-poppins font-bold text-heading dark:text-white text-md">No Leaders Listed</h3>
            <p className="text-xs text-text-body dark:text-slate-400 mt-2">
              The hierarchy listing is currently empty or pending configuration. Check back shortly.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((lead) => {
              const theme = lead.role?.theme;
              const borderClass = theme?.border_style || 'border-slate-200 dark:border-slate-800';
              const gradientClass = theme?.gradient_css ? `bg-gradient-to-tr ${theme.gradient_css}` : 'bg-gradient-to-tr from-slate-900 to-blue-900';
              const badgeLabel = lead.role?.name || lead.profession;

              return (
                <Card
                  key={lead.id}
                  className={`overflow-hidden border-t-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${borderClass}`}
                  style={{ borderTopColor: theme?.accent_color || '#3b82f6' }}
                >
                  <div className="space-y-6">
                    {/* Header banner background */}
                    <div className={`h-24 ${gradientClass} relative`}>
                      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                      {/* Avatar picture positioning */}
                      <div className="absolute -bottom-10 left-6">
                        <img
                          src={lead.profile_photo || '/avatar-placeholder.png'}
                          alt={lead.full_name}
                          className="h-20 w-20 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-md bg-white"
                        />
                      </div>
                    </div>

                    {/* Content text */}
                    <div className="px-6 pt-6 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-poppins font-bold text-heading dark:text-white text-md leading-tight">
                            {lead.full_name}
                          </h3>
                          {lead.email_verified && (
                            <span className={theme?.verification_style || 'text-blue-500'}>
                              <ShieldCheck className="h-4.5 w-4.5" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-primary-blue dark:text-blue-400 font-poppins">
                          {lead.profession}
                        </p>
                        <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider mt-1">
                          {badgeLabel}
                        </span>
                      </div>

                      <p className="text-xs text-text-body dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {lead.bio || 'Organizing community digital skills training and networking setups.'}
                      </p>

                      {/* Skills Tags list */}
                      {lead.skills && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {lead.skills.split(',').slice(0, 4).map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card bottom actions row */}
                  <div className="px-6 pb-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-6">
                    {/* Socials group */}
                    <div className="flex gap-2 text-slate-400 dark:text-slate-500">
                      {lead.linkedin && (
                        <a href={lead.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                          <LinkedinIcon className="h-4 w-4" />
                        </a>
                      )}
                      {lead.github && (
                        <a href={lead.github} target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                          <GithubIcon className="h-4 w-4" />
                        </a>
                      )}
                      {lead.facebook && (
                        <a href={lead.facebook} target="_blank" rel="noreferrer" className="hover:text-blue-800 transition-colors">
                          <FacebookIcon className="h-4 w-4" />
                        </a>
                      )}
                      {lead.instagram && (
                        <a href={lead.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-600 transition-colors">
                          <InstagramIcon className="h-4 w-4" />
                        </a>
                      )}
                      {lead.website && (
                        <a href={lead.website} target="_blank" rel="noreferrer" className="hover:text-primary-green transition-colors">
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <Link to={`/member/${lead.member_id}`}>
                      <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                        Profile
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
