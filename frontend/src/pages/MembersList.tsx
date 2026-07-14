import React, { useEffect, useState } from 'react';
import { memberService } from '../services/memberService';
import { skillsService } from '../services/skillsService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, MapPin, User, Award, ShieldCheck, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MembersList: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const tehsils = ['Jhang', 'Shorkot', 'EighteenHazari', 'AhmadpurSial'];

  const fetchFiltersAndMembers = async () => {
    setLoading(true);
    try {
      // Fetch skills for filters
      const categories = await skillsService.getSkills();
      const allSkills = categories.flatMap(cat => cat.skills.map(s => s.name));
      setSkills(Array.from(new Set(allSkills)));

      // Fetch directory
      const params: any = {};
      if (search) params.search = search;
      if (selectedDistrict !== 'All') params.district = selectedDistrict;
      if (selectedSkill !== 'All') params.skill = selectedSkill;

      const data = await memberService.getPublicDirectory(params);
      setMembers(data);
    } catch (err) {
      console.error('Failed to load directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiltersAndMembers();
  }, [selectedDistrict, selectedSkill]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFiltersAndMembers();
  };

  const handleReset = () => {
    setSearch('');
    setSelectedSkill('All');
    setSelectedDistrict('All');
  };

  return (
    <div className="relative min-h-screen bg-bg-section dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary-blue/5 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-blue/10 dark:bg-blue-500/10 text-primary-blue dark:text-blue-400 text-xs font-bold font-poppins">
            <Sparkles className="h-3.5 w-3.5" /> Community Directory
          </div>
          <h1 className="font-poppins text-4xl font-extrabold tracking-tight text-heading dark:text-white sm:text-5xl">
            Our Members
          </h1>
          <p className="text-sm text-text-body dark:text-slate-400">
            Meet the tech talent, freelancers, and builders of District Jhang. Discover profiles, skills, and connection portals.
          </p>
        </div>

        {/* Search & Filters */}
        <Card className="p-6 max-w-4xl mx-auto glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Bar */}
              <div className="md:col-span-5 relative">
                <input
                  type="text"
                  placeholder="Search by name, profession..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full rounded-xl border border-border-custom bg-white pl-10 pr-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
                <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>

              {/* District Filter */}
              <div className="md:col-span-3">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="All">All Districts</option>
                  {tehsils.map(t => (
                    <option key={t} value={t}>{t === 'EighteenHazari' ? '18 Hazari' : t === 'AhmadpurSial' ? 'Ahmadpur Sial' : t}</option>
                  ))}
                </select>
              </div>

              {/* Skill Filter */}
              <div className="md:col-span-3">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="All">All Skills</option>
                  {skills.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-1 flex justify-end">
                <Button type="submit" variant="primary" className="w-full flex items-center justify-center p-3">
                  <Filter className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-body/70 hover:text-primary-blue dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset Filters
              </button>
            </div>
          </form>
        </Card>

        {/* Directory Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="p-6 space-y-4 animate-pulse">
                <div className="flex gap-4 items-center">
                  <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-2 flex-grow">
                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="h-16 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="flex gap-2">
                  <div className="h-5 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-5 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map(member => {
              const theme = member.role?.theme;
              const borderClass = theme?.border_style || 'border-border-custom dark:border-slate-800/80';
              const accentColor = theme?.accent_color || '#3b82f6';
              const verificationStyle = theme?.verification_style || 'text-blue-500 fill-blue-500';

              return (
                <Card
                  key={member.id}
                  hoverLift
                  className={`p-6 flex flex-col justify-between glass-morphism dark:glass-morphism-dark transition-all duration-300 relative group border-t-2 ${borderClass}`}
                  style={{ borderTopColor: accentColor }}
                >
                  <div className="space-y-4">
                    {/* Photo & Identity */}
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-full bg-gradient-to-tr from-primary-blue to-primary-green p-0.5 shadow-md">
                        {member.profile_photo ? (
                          <img
                            src={member.profile_photo.startsWith('http') ? member.profile_photo : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${member.profile_photo}`}
                            alt={member.full_name}
                            className="h-full w-full rounded-full object-cover border-2 border-white dark:border-slate-900"
                          />
                        ) : (
                          <div className="h-full w-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-lg text-primary-blue dark:text-white uppercase">
                            {member.full_name?.[0]}
                          </div>
                        )}
                        {member.is_verified && (
                          <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-0.5 text-white border border-white dark:border-slate-900 shadow-sm" title="Verified Member">
                            <ShieldCheck className={`h-4 w-4 ${verificationStyle}`} />
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-poppins font-bold text-heading dark:text-white group-hover:text-primary-blue dark:group-hover:text-blue-400 transition-colors leading-tight">
                          {member.full_name}
                        </h3>
                        <p className="text-xs text-primary-green font-bold uppercase tracking-wider mt-0.5">{member.profession}</p>
                        {member.role && (
                          <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider mt-1 font-poppins">
                            {member.role.name}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-[10px] text-text-body/70 dark:text-slate-400 mt-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{member.district === 'EighteenHazari' ? '18 Hazari' : member.district === 'AhmadpurSial' ? 'Ahmadpur Sial' : member.district}</span>
                        </div>
                      </div>
                    </div>

                  {/* Bio */}
                  <p className="text-xs text-text-body/90 dark:text-slate-400 line-clamp-3 leading-normal pt-1">
                    {member.bio}
                  </p>

                  {/* Skill tags */}
                  {member.skills && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {member.skills.split(',').map((skill: string) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-text-body dark:text-slate-400 border border-border-custom dark:border-slate-800"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Profile Link */}
                <div className="pt-6 border-t border-border-custom/50 dark:border-slate-800/50 mt-6 flex justify-end">
                  <Link to={`/member/${member.member_id}`}>
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-primary-blue hover:text-primary-green dark:text-blue-400 dark:hover:text-green-400 p-0 hover:bg-transparent">
                      View Profile & Card <Award className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
        ) : (
          <Card className="p-12 text-center max-w-lg mx-auto space-y-4 border-dashed border-border-custom dark:border-slate-800">
            <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
              <User className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-poppins font-bold text-heading dark:text-white">No members found</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No approved members matched your active search queries or filters. Try adjusting your parameters.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
