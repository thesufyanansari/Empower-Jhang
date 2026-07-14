import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { memberService } from '../../services/memberService';
import { 
  Heart, Award, ShieldCheck, Sparkles, Target, Compass, 
  Milestone, Calendar, UserCheck, GraduationCap, BookOpen 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    approvedMembers: 0,
    approvedVolunteers: 0,
    approvedMentors: 0,
    coursesCount: 0,
    resourcesCount: 0
  });

  useEffect(() => {
    memberService.getMemberCount()
      .then(data => {
        if (data) {
          setStats({
            approvedMembers: data.approvedMembers || 0,
            approvedVolunteers: data.approvedVolunteers || 0,
            approvedMentors: data.approvedMentors || 0,
            coursesCount: data.coursesCount || 0,
            resourcesCount: data.resourcesCount || 0
          });
        }
      })
      .catch(err => console.error('Failed to load about stats:', err));
  }, []);

  const logoUrl = theme === 'dark' ? '/logo-dark.png' : '/logo-light.png';

  const values = [
    { title: 'Community Collaboration', desc: 'Fostering a collaborative peer support system where senior developers and freelancers guide beginners.', icon: <Heart className="h-6 w-6 text-primary-green" /> },
    { title: 'Zero-Cost Tech Education', desc: 'Breaking financial barriers by offering high-quality technical skills classes completely free of cost.', icon: <Award className="h-6 w-6 text-primary-blue dark:text-blue-400" /> },
    { title: 'Professional Identity', desc: 'Equipping members with digital ID credentials and verified profile badges to boost global career credibility.', icon: <ShieldCheck className="h-6 w-6 text-primary-blue dark:text-blue-400" /> },
    { title: 'Economic Empowerment', desc: 'Connecting trained youth with global remote job pipelines, freelance platforms, and local startup hubs.', icon: <Sparkles className="h-6 w-6 text-primary-green" /> }
  ];

  const milestones = [
    { year: '2024', title: 'Community Foundation', desc: 'Empower Jhang was established as a localized tech community group with 50 pioneering students.' },
    { year: '2025', title: 'Free Technical Workshops', desc: 'Successfully launched zero-cost physical bootcamps covering web development, video editing, and UI design.' },
    { year: '2026', title: 'Digital Card Onboarding', desc: 'Introduced the dynamic digital member card platform, registering hundreds of verified profiles in District Jhang.' }
  ];

  return (
    <div className="relative min-h-screen bg-bg-section dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-primary-blue/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 h-[600px] w-[600px] bg-primary-green/5 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <img src={logoUrl} alt="Empower Jhang Logo" className="h-20 w-auto mx-auto object-contain" />
          <h1 className="font-poppins text-4xl sm:text-5xl font-extrabold text-heading dark:text-white tracking-tight leading-tight">
            Empowering District Jhang
          </h1>
          <p className="text-sm sm:text-base text-text-body dark:text-slate-400 leading-relaxed">
            Empower Jhang is Pakistan's strongest local digital community. We connect ambitious youth, teach free modern digital skills, and build high-paying remote career opportunities.
          </p>
        </div>

        {/* Our Story & Mission/Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <Card className="lg:col-span-7 p-8 space-y-6 border border-border-custom dark:border-slate-800">
            <h2 className="font-poppins text-2xl font-bold text-heading dark:text-white">Our Story & Inspiration</h2>
            <p className="text-sm text-text-body dark:text-slate-300 leading-relaxed">
              District Jhang holds immense untapped potential. Thousands of ambitious youths graduate every year, but a lack of local tech infrastructure, software houses, and career guidance leaves many unemployed or underemployed.
            </p>
            <p className="text-sm text-text-body dark:text-slate-300 leading-relaxed">
              Empower Jhang was established to change this narrative. Our core belief is that code, design, and digital expertise know no geographical bounds. By organizing our youth, providing structured mentorship, and creating a unified digital network, we enable young professionals to build global remote careers from their homes in Jhang.
            </p>
          </Card>

          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-3 border border-border-custom dark:border-slate-800">
              <div className="inline-flex rounded-lg bg-green-500/10 p-2 text-primary-green">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-poppins font-bold text-heading dark:text-white text-md">Our Mission</h3>
              <p className="text-xs text-text-body/90 dark:text-slate-400 leading-relaxed">
                To build a self-sustaining tech ecosystem in Jhang that provides zero-cost modern skills education, connects youth to expert mentors, and creates local career growth paths.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border border-border-custom dark:border-slate-800">
              <div className="inline-flex rounded-lg bg-blue-500/10 p-2 text-primary-blue dark:text-blue-400">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-poppins font-bold text-heading dark:text-white text-md">Our Vision</h3>
              <p className="text-xs text-text-body/90 dark:text-slate-400 leading-relaxed">
                To transform District Jhang into a vibrant technology and freelancing hub where every young person has direct access to high-paying global digital markets.
              </p>
            </Card>
          </div>
        </div>

        {/* Live MySQL Statistics */}
        <div className="space-y-6 text-center">
          <div className="border-b border-border-custom dark:border-slate-800 pb-3 max-w-md mx-auto">
            <h2 className="font-poppins text-2xl font-bold text-heading dark:text-white">Community Statistics</h2>
            <p className="text-xs text-slate-400 mt-1">Live metrics compiled directly from our database.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto pt-4">
            <Card className="p-6 text-center space-y-2">
              <UserCheck className="h-8 w-8 mx-auto text-primary-blue dark:text-blue-400" />
              <h3 className="text-2xl font-black text-heading dark:text-white font-poppins">{stats.approvedMembers}</h3>
              <p className="text-[10px] text-text-body dark:text-slate-400 font-bold uppercase tracking-wider">Approved Members</p>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <Heart className="h-8 w-8 mx-auto text-primary-green" />
              <h3 className="text-2xl font-black text-heading dark:text-white font-poppins">{stats.approvedVolunteers}</h3>
              <p className="text-[10px] text-text-body dark:text-slate-400 font-bold uppercase tracking-wider">Active Volunteers</p>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <GraduationCap className="h-8 w-8 mx-auto text-yellow-500" />
              <h3 className="text-2xl font-black text-heading dark:text-white font-poppins">{stats.approvedMentors}</h3>
              <p className="text-[10px] text-text-body dark:text-slate-400 font-bold uppercase tracking-wider">Expert Mentors</p>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <BookOpen className="h-8 w-8 mx-auto text-primary-blue dark:text-blue-400" />
              <h3 className="text-2xl font-black text-heading dark:text-white font-poppins">{stats.coursesCount}</h3>
              <p className="text-[10px] text-text-body dark:text-slate-400 font-bold uppercase tracking-wider">Video Courses</p>
            </Card>
            <Card className="p-6 text-center space-y-2">
              <Compass className="h-8 w-8 mx-auto text-primary-green" />
              <h3 className="text-2xl font-black text-heading dark:text-white font-poppins">{stats.resourcesCount}</h3>
              <p className="text-[10px] text-text-body dark:text-slate-400 font-bold uppercase tracking-wider">Shared Resources</p>
            </Card>
          </div>
        </div>

        {/* Timeline Milestones */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-poppins text-2xl font-bold text-heading dark:text-white flex items-center justify-center gap-2">
              <Milestone className="h-6 w-6 text-primary-green" /> Community Journey
            </h2>
            <p className="text-xs text-slate-400">Chronological history of major Empower Jhang achievements.</p>
          </div>

          <div className="relative max-w-4xl mx-auto border-l-2 border-border-custom dark:border-slate-800 pl-6 space-y-10">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-primary-green border-4 border-bg-section dark:border-slate-950 group-hover:scale-125 transition-transform" />
                <Card className="p-6 space-y-2 border border-border-custom dark:border-slate-800 transition-all duration-300">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary-green font-poppins">
                    <Calendar className="h-3.5 w-3.5" /> {m.year}
                  </div>
                  <h3 className="font-poppins font-bold text-heading dark:text-white text-sm">{m.title}</h3>
                  <p className="text-xs text-text-body/90 dark:text-slate-400 leading-relaxed">{m.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-poppins text-2xl font-bold text-heading dark:text-white">Our Core Values</h2>
            <p className="text-xs text-slate-400">The guiding principles behind everything we build.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {values.map((v, idx) => (
              <Card key={idx} className="p-6 flex items-start gap-4 border border-border-custom dark:border-slate-800">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-2.5 flex items-center justify-center">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-heading dark:text-white text-sm">{v.title}</h3>
                  <p className="text-xs text-text-body/95 dark:text-slate-400 mt-1 leading-relaxed">{v.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Founder Section */}
        <Card className="p-8 border border-border-custom dark:border-slate-800 max-w-4xl mx-auto bg-gradient-to-tr from-slate-50/50 via-white to-slate-50/50 dark:from-slate-950/20 dark:via-slate-900/40 dark:to-slate-950/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Photo */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="h-44 w-44 rounded-2xl overflow-hidden shadow-lg border-2 border-primary-green p-0.5">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300" 
                  alt="M. Haseeb Jafar" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="font-poppins font-bold text-heading dark:text-white mt-4 text-md">M. Haseeb Jafar</h3>
              <p className="text-[10px] text-primary-green font-bold uppercase tracking-wider mt-0.5">Founder & Strategy Lead</p>
            </div>

            {/* Content */}
            <div className="md:col-span-8 space-y-4">
              <h3 className="font-poppins text-lg font-bold text-heading dark:text-white border-b border-border-custom dark:border-slate-800 pb-2">
                Founder's Message
              </h3>
              <p className="text-xs text-text-body/90 dark:text-slate-350 italic leading-relaxed">
                "When I started my digital journey, there were no local guides, code clubs, or workspaces in Jhang. The youth had to migrate to larger cities like Lahore or Islamabad to access basic opportunities. I founded Empower Jhang to bring the highest-tier digital guidance directly to our hometown. We want our youth to study free, work remote, and build a local digital future."
              </p>
              <div className="space-y-2 pt-2">
                <p className="text-xs text-text-body dark:text-slate-400">
                  <strong>Our Journey:</strong> Starting as a simple study group, we have structured free training courses, registered hundreds of digital ID cards, and successfully supported many members into international freelancing contracts.
                </p>
                <p className="text-xs text-text-body dark:text-slate-400">
                  <strong>Future Vision:</strong> We aim to secure local co-working workspaces, support startup incubators, and host regional tech conferences inside Jhang, building a sustainable local technology district.
                </p>
              </div>
            </div>

          </div>
        </Card>

        {/* CTA */}
        <Card className="p-8 text-center max-w-3xl mx-auto bg-gradient-to-tr from-primary-blue to-primary-green text-white space-y-6 shadow-2xl relative overflow-hidden rounded-3xl">
          <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 bg-black/10 rounded-full blur-2xl" />
          
          <div className="space-y-2 relative z-10">
            <h3 className="font-poppins text-2xl font-bold tracking-tight">Join Jhang's Digital Movement</h3>
            <p className="text-xs text-white/80 max-w-md mx-auto">
              Get your verified member card, learn free skills, connect with local mentors, and start your career.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/auth">
              <Button variant="secondary" className="px-6 py-2.5 font-bold text-xs">
                Register as Member
              </Button>
            </Link>
            <Link to="/volunteer">
              <Button variant="outline" className="px-6 py-2.5 font-bold text-xs border-white text-white hover:bg-white/10">
                Join Volunteer Team
              </Button>
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};
