import React, { useEffect, useState } from 'react';
import { memberService } from '../services/memberService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MapPin, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';
import { 
  FacebookIcon, LinkedinIcon, GithubIcon, YoutubeIcon, InstagramIcon
} from '../components/ui/SocialIcons';
import { Link } from 'react-router-dom';

export const MentorsList: React.FC = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const data = await memberService.getPublicMentors();
      setMentors(data);
    } catch (err) {
      console.error('Failed to load mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return (
    <div className="relative min-h-screen bg-bg-section dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-bold font-poppins border border-yellow-500/20">
            <GraduationCap className="h-3.5 w-3.5" /> Professional Mentorship
          </div>
          <h1 className="font-poppins text-4xl font-extrabold tracking-tight text-heading dark:text-white sm:text-5xl">
            Our Mentors
          </h1>
          <p className="text-sm text-text-body dark:text-slate-400">
            Learn directly from developers, engineers, and digital marketing leaders in Jhang.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6 space-y-4 animate-pulse">
                <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto" />
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              </Card>
            ))}
          </div>
        ) : mentors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map(mentor => (
              <Card
                key={mentor.id}
                hoverLift
                className="p-6 flex flex-col justify-between glass-morphism dark:glass-morphism-dark border-yellow-500/20 dark:border-yellow-500/10 hover:border-yellow-500/40 dark:hover:border-yellow-500/30 transition-all duration-300 relative group"
              >
                {/* Gold Accent ribbon on the card */}
                <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

                <div className="space-y-4">
                  {/* Photo & Details */}
                  <div className="flex gap-4 items-center">
                    <div className="relative h-16 w-16 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-500 p-0.5 shadow-md">
                      {mentor.profile_photo ? (
                        <img
                          src={mentor.profile_photo.startsWith('http') ? mentor.profile_photo : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${mentor.profile_photo}`}
                          alt={mentor.full_name}
                          className="h-full w-full rounded-full object-cover border-2 border-white dark:border-slate-900"
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-lg text-yellow-600 dark:text-white uppercase">
                          {mentor.full_name?.[0]}
                        </div>
                      )}
                      {mentor.is_verified && (
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-yellow-500 p-0.5 text-slate-950 border border-white dark:border-slate-900 shadow-sm" title="Verified Mentor">
                          <ShieldCheck className="h-4 w-4 fill-yellow-500" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-poppins font-bold text-heading dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors leading-tight">
                        {mentor.full_name}
                      </h3>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-wider mt-0.5">{mentor.mentor_industry || 'Expert Mentor'}</p>
                      
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-0.5 text-[9px] font-semibold text-text-body/70 dark:text-slate-400">
                          <Briefcase className="h-3 w-3 text-yellow-600" />
                          <span>{mentor.mentor_experience_years || '5+'} Years Exp</span>
                        </div>
                        <span className="text-slate-400 text-[10px]">•</span>
                        <div className="flex items-center gap-0.5 text-[9px] font-semibold text-text-body/70 dark:text-slate-400">
                          <MapPin className="h-3 w-3 text-yellow-600" />
                          <span>{mentor.district === 'EighteenHazari' ? '18 Hazari' : mentor.district === 'AhmadpurSial' ? 'Ahmadpur Sial' : mentor.district}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specializations list */}
                  {mentor.mentor_specializations && (
                    <div className="bg-yellow-500/5 rounded-xl p-3 border border-yellow-500/10 space-y-1.5">
                      <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider block font-poppins">Specializations:</span>
                      <div className="flex flex-wrap gap-1">
                        {mentor.mentor_specializations.split(',').map((spec: string) => (
                          <span key={spec} className="bg-white dark:bg-slate-900 px-2 py-0.5 text-[9px] rounded-md font-semibold text-text-body dark:text-slate-400 border border-border-custom dark:border-slate-800">
                            {spec.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications & Languages */}
                  {(mentor.mentor_certifications || mentor.mentor_languages) && (
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-border-custom dark:border-slate-800 text-[10px]">
                      {mentor.mentor_certifications && (
                        <div>
                          <span className="font-bold text-slate-400 block uppercase text-[8px] tracking-wider">Certifications:</span>
                          <span className="text-heading dark:text-slate-300 font-semibold line-clamp-1" title={mentor.mentor_certifications}>
                            {mentor.mentor_certifications}
                          </span>
                        </div>
                      )}
                      {mentor.mentor_languages && (
                        <div>
                          <span className="font-bold text-slate-400 block uppercase text-[8px] tracking-wider">Languages:</span>
                          <span className="text-heading dark:text-slate-300 font-semibold line-clamp-1" title={mentor.mentor_languages}>
                            {mentor.mentor_languages}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Short Bio */}
                  <p className="text-xs text-text-body/90 dark:text-slate-400 line-clamp-3 leading-normal">
                    {mentor.bio}
                  </p>
                </div>

                {/* Social links & profile redirect */}
                <div className="space-y-4 pt-6 border-t border-border-custom/50 dark:border-slate-800/50 mt-6">
                  {/* Social row */}
                  <div className="flex justify-center gap-4">
                    {mentor.linkedin && (
                      <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary-blue dark:hover:text-blue-400 transition-colors">
                        <LinkedinIcon className="h-4.5 w-4.5" />
                      </a>
                    )}
                    {mentor.github && (
                      <a href={mentor.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-heading dark:hover:text-white transition-colors">
                        <GithubIcon className="h-4.5 w-4.5" />
                      </a>
                    )}
                    {mentor.facebook && (
                      <a href={mentor.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary-blue transition-colors">
                        <FacebookIcon className="h-4.5 w-4.5" />
                      </a>
                    )}
                    {mentor.instagram && (
                      <a href={mentor.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors">
                        <InstagramIcon className="h-4.5 w-4.5" />
                      </a>
                    )}
                    {mentor.youtube && (
                      <a href={mentor.youtube} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
                        <YoutubeIcon className="h-4.5 w-4.5" />
                      </a>
                    )}
                  </div>

                  <Link to={`/member/${mentor.member_id}`}>
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold py-2 border-yellow-500/20 dark:border-yellow-500/10 hover:border-yellow-500/40 hover:bg-yellow-500/5 text-yellow-600 dark:text-yellow-400">
                      View Mentor Profile & Card
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center max-w-lg mx-auto space-y-4 border-dashed border-border-custom dark:border-slate-800">
            <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-poppins font-bold text-heading dark:text-white">No mentors registered yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Applications are open! If you are a digital professional, apply to guide the youth of Jhang.
              </p>
            </div>
            <Link to="/mentor">
              <Button variant="primary" size="sm" className="mt-2">Apply to Mentor</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};
