import React, { useEffect, useState } from 'react';
import { memberService } from '../services/memberService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Award, ShieldCheck, Heart } from 'lucide-react';
import { 
  FacebookIcon, LinkedinIcon, GithubIcon, YoutubeIcon, InstagramIcon
} from '../components/ui/SocialIcons';
import { Link } from 'react-router-dom';

export const VolunteersList: React.FC = () => {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const data = await memberService.getPublicVolunteers();
      setVolunteers(data);
    } catch (err) {
      console.error('Failed to load volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  // Check if position is part of core leadership
  const isLeadership = (role: string) => {
    const corePositions = [
      'Founder', 'Co-Founder', 'President', 'Vice President', 
      'General Secretary', 'Joint Secretary', 'Treasurer', 
      'Community Director', 'Program Director', 'Operations Manager'
    ];
    return corePositions.includes(role);
  };

  return (
    <div className="relative min-h-screen bg-bg-section dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary-green/5 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold font-poppins">
            <Heart className="h-3.5 w-3.5 text-primary-green fill-primary-green/10" /> Volunteer Network
          </div>
          <h1 className="font-poppins text-4xl font-extrabold tracking-tight text-heading dark:text-white sm:text-5xl">
            Our Volunteers
          </h1>
          <p className="text-sm text-text-body dark:text-slate-400">
            Meet the leaders and team members working to educate and connect Jhang's youth.
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
        ) : volunteers.length > 0 ? (
          <div className="space-y-16">
            
            {/* Leadership Section */}
            {volunteers.filter(v => isLeadership(v.volunteer_role || '')).length > 0 && (
              <div className="space-y-8">
                <div className="border-b border-border-custom dark:border-slate-800 pb-3">
                  <h2 className="font-poppins text-xl font-black text-heading dark:text-white tracking-tight flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary-green" /> Core Leadership Team
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {volunteers.filter(v => isLeadership(v.volunteer_role || '')).map(volunteer => (
                    <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                  ))}
                </div>
              </div>
            )}

            {/* General Volunteer Section */}
            {volunteers.filter(v => !isLeadership(v.volunteer_role || '')).length > 0 && (
              <div className="space-y-8">
                <div className="border-b border-border-custom dark:border-slate-800 pb-3">
                  <h2 className="font-poppins text-xl font-black text-heading dark:text-white tracking-tight flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary-blue dark:text-blue-400" /> Volunteers & Ambassadors
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {volunteers.filter(v => !isLeadership(v.volunteer_role || '')).map(volunteer => (
                    <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <Card className="p-12 text-center max-w-lg mx-auto space-y-4 border-dashed border-border-custom dark:border-slate-800">
            <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
              <Heart className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-poppins font-bold text-heading dark:text-white">No volunteers registered</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Applications are open! If you want to contribute, apply to volunteer.
              </p>
            </div>
            <Link to="/volunteer">
              <Button variant="primary" size="sm" className="mt-2">Apply to Volunteer</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

interface VolunteerCardProps {
  volunteer: any;
}

const VolunteerCard: React.FC<VolunteerCardProps> = ({ volunteer }) => {
  const isLeader = [
    'Founder', 'Co-Founder', 'President', 'Vice President', 
    'General Secretary', 'Joint Secretary', 'Treasurer', 
    'Community Director', 'Program Director', 'Operations Manager'
  ].includes(volunteer.volunteer_role || '');

  return (
    <Card
      hoverLift
      className={`p-6 flex flex-col justify-between glass-morphism dark:glass-morphism-dark transition-all duration-300 relative group text-center ${
        isLeader ? 'border-primary-green/30 dark:border-primary-green/20' : 'border-border-custom dark:border-slate-800/80'
      }`}
    >
      <div className="space-y-4">
        {/* Photo */}
        <div className="relative h-24 w-24 rounded-full bg-gradient-to-tr from-primary-green to-secondary-green p-0.5 mx-auto shadow-md">
          {volunteer.profile_photo ? (
            <img
              src={volunteer.profile_photo.startsWith('http') ? volunteer.profile_photo : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${volunteer.profile_photo}`}
              alt={volunteer.full_name}
              className="h-full w-full rounded-full object-cover border-2 border-white dark:border-slate-900"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xl text-primary-green dark:text-white uppercase">
              {volunteer.full_name?.[0]}
            </div>
          )}
          {volunteer.is_verified && (
            <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-0.5 text-white border border-white dark:border-slate-900 shadow-sm" title="Verified Profile">
              <ShieldCheck className="h-4 w-4 fill-green-500" />
            </div>
          )}
        </div>

        {/* Identity Details */}
        <div className="space-y-1">
          <h3 className="font-poppins font-bold text-heading dark:text-white group-hover:text-primary-green transition-colors leading-tight">
            {volunteer.full_name}
          </h3>
          
          {/* Volunteer Position Badge */}
          <div className="inline-flex rounded-full bg-green-500/10 px-3 py-0.5 text-[10px] font-bold text-green-600 dark:text-green-400 border border-green-500/10 uppercase tracking-wider font-poppins">
            {volunteer.volunteer_role || 'Volunteer'}
          </div>

          <p className="text-[10px] text-text-body/70 dark:text-slate-400 font-medium">
            {volunteer.volunteer_department || 'General Volunteer'}
          </p>
        </div>

        {/* Skills Tag */}
        {volunteer.skills && (
          <div className="flex flex-wrap justify-center gap-1">
            {volunteer.skills.split(',').slice(0, 3).map((skill: string) => (
              <span
                key={skill}
                className="rounded-lg bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 text-[9px] font-medium text-text-body dark:text-slate-400 border border-border-custom dark:border-slate-800"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Community Interests */}
        {volunteer.interests && (
          <div className="space-y-1 pt-1">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Community Interests:</span>
            <div className="flex flex-wrap justify-center gap-1">
              {volunteer.interests.split(',').slice(0, 3).map((interest: string) => (
                <span
                  key={interest}
                  className="rounded-lg bg-green-500/5 px-2 py-0.5 text-[9px] font-medium text-green-600 dark:text-green-400 border border-green-500/10"
                >
                  {interest.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Social Links & View Profile */}
      <div className="space-y-4 pt-6 border-t border-border-custom/50 dark:border-slate-800/50 mt-6">
        {/* Social Icons row */}
        <div className="flex justify-center gap-3">
          {volunteer.linkedin && (
            <a href={volunteer.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary-blue dark:hover:text-blue-400 transition-colors">
              <LinkedinIcon className="h-4 w-4" />
            </a>
          )}
          {volunteer.github && (
            <a href={volunteer.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-heading dark:hover:text-white transition-colors">
              <GithubIcon className="h-4 w-4" />
            </a>
          )}
          {volunteer.facebook && (
            <a href={volunteer.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary-blue transition-colors">
              <FacebookIcon className="h-4 w-4" />
            </a>
          )}
          {volunteer.instagram && (
            <a href={volunteer.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors">
              <InstagramIcon className="h-4 w-4" />
            </a>
          )}
          {volunteer.youtube && (
            <a href={volunteer.youtube} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-600 transition-colors">
              <YoutubeIcon className="h-4 w-4" />
            </a>
          )}
        </div>

        <Link to={`/member/${volunteer.member_id}`}>
          <Button variant="outline" size="sm" className="w-full text-xs font-bold py-2 border-border-custom hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
            View Volunteer Card
          </Button>
        </Link>
      </div>
    </Card>
  );
};
