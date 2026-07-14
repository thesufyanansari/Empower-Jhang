import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, BookOpen, Users, Trophy, GraduationCap, 
  Video, Code, Palette, Share2, Megaphone, Terminal, 
  TrendingUp, Award, CheckCircle, ChevronDown, 
  HelpCircle, Star, Zap
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { memberService } from '../services/memberService';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    membersCount: 0,
    mentorsCount: 0,
    volunteersCount: 0,
    coursesCount: 0,
    resourcesCount: 0
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    // Dynamic stats load from DB
    memberService.getMemberCount()
      .then((data) => {
        if (data) {
          setStats({
            membersCount: data.approvedMembers || 0,
            mentorsCount: data.approvedMentors || 0,
            volunteersCount: data.approvedVolunteers || 0,
            coursesCount: data.coursesCount || 0,
            resourcesCount: data.resourcesCount || 0
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load public count:', err);
      });
  }, []);

  const learningAreas = [
    { title: 'Programming & CS', desc: 'Web development, mobile apps, and core database design.', icon: <Code className="h-6 w-6 text-blue-500" />, color: 'from-blue-500/10 to-indigo-500/5' },
    { title: 'Artificial Intelligence', desc: 'Prompt engineering, custom LLM integration, and automation.', icon: <Terminal className="h-6 w-6 text-purple-500" />, color: 'from-purple-500/10 to-pink-500/5' },
    { title: 'Graphic Design', desc: 'UI/UX layout, Figma prototyping, Photoshop, and branding.', icon: <Palette className="h-6 w-6 text-pink-500" />, color: 'from-pink-500/10 to-rose-500/5' },
    { title: 'Video Editing', desc: 'Premiere Pro, After Effects, cinematic pacing, and storytelling.', icon: <Video className="h-6 w-6 text-red-500" />, color: 'from-red-500/10 to-orange-500/5' },
    { title: 'Digital Marketing', desc: 'SEO rankings, social media advertising, and marketing analysis.', icon: <TrendingUp className="h-6 w-6 text-green-500" />, color: 'from-green-500/10 to-emerald-500/5' },
    { title: 'Freelancing Tracks', desc: 'Upwork setups, Fiverr bidding, cold emailing, and proposals.', icon: <Award className="h-6 w-6 text-amber-500" />, color: 'from-amber-500/10 to-yellow-500/5' },
    { title: 'Content Creation', desc: 'Scriptwriting, podcast production, and personal brand building.', icon: <Share2 className="h-6 w-6 text-teal-500" />, color: 'from-teal-500/10 to-cyan-500/5' },
    { title: 'Shopify & eCommerce', desc: 'Store building, dropshipping setups, and local logistics.', icon: <BookOpen className="h-6 w-6 text-indigo-500" />, color: 'from-indigo-500/10 to-violet-500/5' },
    { title: 'Amazon Mastery', desc: 'FBA, wholesale, product hunting, and sourcing strategies.', icon: <Zap className="h-6 w-6 text-orange-500" />, color: 'from-orange-500/10 to-amber-500/5' },
    { title: 'YouTube Strategy', desc: 'Channel optimization, thumbnail psychology, and monetization.', icon: <YoutubeIcon className="h-6 w-6 text-red-600" />, color: 'from-red-600/10 to-rose-500/5' },
    { title: 'Blogging & Copy', desc: 'SEO-driven articles, affiliate marketing, and newsletters.', icon: <Megaphone className="h-6 w-6 text-sky-500" />, color: 'from-sky-500/10 to-blue-500/5' },
    { title: 'Career Guidance', desc: 'Resume workshops, practice interviews, and job placements.', icon: <GraduationCap className="h-6 w-6 text-emerald-500" />, color: 'from-emerald-500/10 to-teal-500/5' }
  ];

  const journeySteps = [
    { title: 'Sign Up Online', desc: 'Register in seconds using email or WhatsApp OTP. It is completely free.' },
    { title: 'Get Member ID', desc: 'Receive a digital member identity card with a unique QR code.' },
    { title: 'Join Official Channels', desc: 'Gain access to our premium WhatsApp communities and local groups.' },
    { title: 'Learn, Connect & Grow', desc: 'Access free mentorship, build portfolios, and secure remote jobs.' }
  ];

  const benefits = [
    { title: '100% Free Education', desc: 'No admission fees, no hidden subscription costs. Ever.', icon: <CheckCircle className="h-5 w-5 text-primary-green" /> },
    { title: 'Direct Mentorship', desc: 'Learn directly from industry experts working in top tech companies.', icon: <CheckCircle className="h-5 w-5 text-primary-green" /> },
    { title: 'Exclusive Network', desc: 'Connect with developers, designers, and marketers in District Jhang.', icon: <CheckCircle className="h-5 w-5 text-primary-green" /> },
    { title: 'Local Job Placements', desc: 'Get linked with local startups and international remote job channels.', icon: <CheckCircle className="h-5 w-5 text-primary-green" /> }
  ];

  const team = [
    { name: 'M. Haseeb Jafar', role: 'Founder & Strategy Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200', bio: 'Product strategist focused on community development.' },
    { name: 'Ayesha Khan', role: 'Lead Design Instructor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200', bio: 'Senior Product Designer helping youth break into Figma.' },
    { name: 'Zeeshan Ali', role: 'Web Development Mentor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200', bio: 'Full-stack software engineer specialized in Node & React.' },
    { name: 'Dr. Sarah Smith', role: 'Academic Advisor', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200', bio: 'Curriculum expert with 10+ years in technical training.' },
    { name: 'Bilal Hassan', role: 'Operations Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200', bio: 'Experienced project coordinator driving operations and youth placement.' }
  ];

  const duplicatedTeam = [...team, ...team, ...team];

  const testimonials = [
    { quote: 'Empower Jhang guided me from zero skills to making $1000/month as a freelance video editor. The community is incredibly supportive!', author: 'Ahmad Raza', location: 'Jhang Sadar', role: 'Freelance Video Editor' },
    { quote: 'I joined as a curious student and now I am working remotely for a US startup. The free workshops and networking events changed my career path.', author: 'Fatima Batool', location: 'Shorkot', role: 'Junior Frontend Developer' },
    { quote: 'A local space that provides top-tier tech education for free is a blessing. Every young person in Jhang should join this movement.', author: 'Bilal Hassan', location: '18 Hazari', role: 'Shopify Store Owner' }
  ];

  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  const faqs = [
    { q: 'Is Empower Jhang really 100% free?', a: 'Yes! Empower Jhang is a community-driven initiative. All our workshops, skills classes, community channels, and digital membership certificates are completely free of charge.' },
    { q: 'Who can join the community?', a: 'Any resident of District Jhang (including Jhang Sadar, Shorkot, 18 Hazari, Ahmadpur Sial) who wants to learn digital skills, network with tech professionals, or grow their career.' },
    { q: 'What happens after I register?', a: 'You will instantly receive your unique Member ID (e.g. EMP-000045) and a digital Member Identity Card with a dynamic QR code. You will then be redirected to join our official WhatsApp communities and social groups to start networking.' },
    { q: 'How do I download my Member Card?', a: 'Once registered, you can view your digital card on your profile page and download it either as a premium PNG image or a PDF document to share on social media.' },
    { q: 'Can I volunteer or teach as a mentor?', a: 'Absolutely! We are always looking for passionate volunteers and experienced mentors. You can apply directly using the links in the footer or contact our support team.' }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden dark:bg-slate-950">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-primary-blue/5 via-primary-green/2 to-transparent dark:from-slate-900/50 dark:to-transparent pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Intro */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary-blue/5 dark:bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-primary-blue dark:text-blue-400 font-poppins"
            >
              <Zap className="h-4.5 w-4.5 text-primary-green fill-primary-green animate-pulse" />
              Pakistan's Strongest Local Digital Community
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-heading dark:text-white"
            >
              Empower <span className="premium-gradient-text dark:premium-gradient-text-dark">Jhang</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-poppins text-lg sm:text-xl font-medium text-heading/90 dark:text-slate-200 leading-relaxed max-w-xl"
            >
              Learn Digital Skills.<br />
              Connect with Amazing People.<br />
              Build Your Future.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base text-text-body dark:text-slate-400 max-w-lg leading-relaxed"
            >
              We are connecting youth, teaching free tech skills, and establishing a powerhouse digital network right here in District Jhang.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link to={user ? "/signup" : "/auth"}>
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Join Community
                </Button>
              </Link>
              <a href="#learning-areas">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-border-custom dark:border-slate-800 max-w-md"
            >
              <div>
                <p className="text-2xl font-bold font-poppins text-primary-blue dark:text-blue-400">{stats.membersCount}</p>
                <p className="text-xs text-text-body/80 dark:text-slate-400">Members Joined</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-poppins text-primary-green">{stats.mentorsCount}</p>
                <p className="text-xs text-text-body/80 dark:text-slate-400">Expert Mentors</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-poppins text-primary-blue dark:text-blue-400">{stats.volunteersCount}</p>
                <p className="text-xs text-text-body/80 dark:text-slate-400">Active Volunteers</p>
              </div>
            </motion.div>
          </div>

          {/* Hero CSS Illustration */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-[400px] h-[480px] rounded-3xl bg-gradient-to-tr from-primary-blue to-primary-green p-0.5 shadow-2xl shadow-primary-blue/20"
            >
              <div className="w-full h-full rounded-3xl bg-slate-900 overflow-hidden relative flex flex-col p-6 text-white justify-between">
                {/* Background lighting */}
                <div className="absolute top-0 right-0 h-40 w-40 bg-primary-green/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 h-40 w-40 bg-primary-blue/30 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm text-primary-green">
                      EJ
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-poppins tracking-wider">EMPOWER JHANG</h4>
                      <p className="text-[8px] text-white/50">OFFICIAL MEMBER CARD</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-green-500/10 px-2 py-0.5 text-[8px] font-semibold text-green-400 border border-green-500/20">
                    VERIFIED
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="flex flex-col items-center my-6 space-y-3">
                  <div className="relative">
                    <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-primary-green to-secondary-green p-1">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200"
                        alt="Profile Mock"
                        className="h-full w-full rounded-full object-cover border-2 border-slate-900"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs">
                      🇵🇰
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold font-poppins tracking-tight">Khadija Noor</h3>
                    <p className="text-[10px] text-primary-green font-semibold uppercase tracking-wider">Full Stack Engineer</p>
                    <p className="text-[9px] text-white/60">Jhang Sadar, Punjab</p>
                  </div>
                </div>

                {/* Card Footer details */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 bg-slate-900/50">
                  <div>
                    <p className="text-[8px] text-white/40">MEMBER ID</p>
                    <p className="text-xs font-bold font-poppins text-white/95">EMP-001402</p>
                  </div>
                  <div className="h-10 w-10 bg-white p-1 rounded-md flex items-center justify-center">
                    {/* Simulated QR Code */}
                    <div className="grid grid-cols-4 gap-0.5 w-full h-full bg-slate-900 p-0.5 rounded-sm">
                      <div className="bg-white rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-slate-900"></div><div className="bg-white rounded-xs"></div>
                      <div className="bg-slate-900"></div><div className="bg-white rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-slate-900"></div>
                      <div className="bg-white rounded-xs"></div><div className="bg-slate-900"></div><div className="bg-white rounded-xs"></div><div className="bg-white rounded-xs"></div>
                      <div className="bg-white rounded-xs"></div><div className="bg-white rounded-xs"></div><div className="bg-slate-900"></div><div className="bg-white rounded-xs"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating element 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 glass-morphism dark:glass-morphism-dark rounded-2xl p-4 shadow-lg flex items-center gap-3 border border-border-custom max-w-[180px]"
              >
                <div className="rounded-lg bg-green-500/10 p-2 text-green-500">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-text-body/60 dark:text-slate-400">Join Channels</p>
                  <p className="text-xs font-bold text-heading dark:text-white">Learn for Free</p>
                </div>
              </motion.div>

              {/* Floating element 2 */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-6 glass-morphism dark:glass-morphism-dark rounded-2xl p-4 shadow-lg flex items-center gap-3 border border-border-custom max-w-[180px]"
              >
                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-text-body/60 dark:text-slate-400">Jhang Network</p>
                  <p className="text-xs font-bold text-heading dark:text-white">Connect & Grow</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-bg-section dark:bg-slate-900/40 py-20 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold tracking-wider text-primary-green uppercase font-poppins">Our Mission</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-heading dark:text-white font-poppins tracking-tight">
              Empowering the youth of Jhang
            </p>
            <p className="text-base text-text-body dark:text-slate-400 leading-relaxed">
              District Jhang holds massive untapped potential. Our mission is to build a vibrant local digital ecosystem that enables students and professionals to learn skills, collaborate, and access high-paying international remote jobs without leaving their hometown.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card hoverLift className="space-y-4">
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary-blue/5 dark:bg-blue-500/10 flex items-center justify-center text-primary-blue dark:text-blue-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-poppins">Zero-Cost Education</h3>
              <p className="text-sm text-text-body/80 dark:text-slate-400">
                Access premium courses and learning materials in technology, coding, design, and marketing at absolutely no cost.
              </p>
            </Card>
            <Card hoverLift className="space-y-4">
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary-green/10 flex items-center justify-center text-primary-green">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-poppins">Youth Connections</h3>
              <p className="text-sm text-text-body/80 dark:text-slate-400">
                Connect and collaborate with like-minded peers, dev circles, freelance agencies, and mentors located inside Jhang.
              </p>
            </Card>
            <Card hoverLift className="space-y-4">
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary-blue/5 dark:bg-blue-500/10 flex items-center justify-center text-primary-blue dark:text-blue-400">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-poppins">Global Careers</h3>
              <p className="text-sm text-text-body/80 dark:text-slate-400">
                Get assistance building high-quality portfolios, writing proposals, setting up freelance profiles, and landing remote jobs.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Empower Jhang */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-xs font-bold tracking-wider text-primary-green uppercase font-poppins">Why Empower Jhang?</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-heading dark:text-white font-poppins tracking-tight">
                Built specifically for our local youth
              </p>
              <p className="text-base text-text-body dark:text-slate-400 leading-relaxed">
                Many online platforms offer courses, but they lack local context, support, and direct networking. Empower Jhang bridges this gap by bringing people together in a trusted, digital environment.
              </p>

              <div className="space-y-4 pt-2">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1">{benefit.icon}</div>
                    <div>
                      <h4 className="font-semibold text-heading dark:text-white text-sm font-poppins">{benefit.title}</h4>
                      <p className="text-xs text-text-body/80 dark:text-slate-400">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-3xl bg-slate-100 dark:bg-slate-900/60 p-8 border border-border-custom dark:border-slate-800">
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-primary-green/10 px-3.5 py-1 text-xs font-semibold text-primary-green">
                  Community Benefit
                </div>
                <h3 className="text-xl font-bold font-poppins">Get a Verified Digital Member ID Card</h3>
                <p className="text-sm text-text-body dark:text-slate-400">
                  Every registered member receives a unique digital identity card containing their specialization, location, and registration number. The QR code links directly to their public profile, enabling clients and employers to easily verify their credentials.
                </p>
                <div className="rounded-2xl border border-border-custom dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-blue/10 flex items-center justify-center font-bold text-primary-blue dark:text-blue-400 uppercase">
                      EJ
                    </div>
                    <div>
                      <p className="text-xs font-bold text-heading dark:text-white font-poppins">Member Card Generation</p>
                      <p className="text-[10px] text-slate-400">Generate as PNG and PDF</p>
                    </div>
                  </div>
                  <Link to="/auth">
                    <Button size="sm" variant="secondary">Join to Get Card</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Areas */}
      <section id="learning-areas" className="bg-bg-section dark:bg-slate-900/40 py-20 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold tracking-wider text-primary-green uppercase font-poppins">Skill Tracks</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-heading dark:text-white font-poppins tracking-tight">
              Learning Tracks & Specialize Areas
            </p>
            <p className="text-sm text-text-body dark:text-slate-400">
              We focus on high-income skills currently in demand globally. Get peer support and mentorship across these domains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningAreas.map((area, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full flex flex-col justify-between p-6">
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${area.color} flex items-center justify-center`}>
                      {area.icon}
                    </div>
                    <h3 className="text-md font-bold font-poppins text-heading dark:text-white">{area.title}</h3>
                    <p className="text-xs text-text-body/80 dark:text-slate-400 leading-relaxed">{area.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Journey */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold tracking-wider text-primary-green uppercase font-poppins">Get Started</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-heading dark:text-white font-poppins tracking-tight">
              Your Journey to Growth
            </p>
            <p className="text-sm text-text-body dark:text-slate-400">
              Follow these simple steps to register, join channels, and start growing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {journeySteps.map((step, idx) => (
              <div key={idx} className="relative space-y-4 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold text-lg font-poppins shadow-md shadow-primary-blue/20">
                  {idx + 1}
                </div>
                <h3 className="text-md font-bold font-poppins text-heading dark:text-white">{step.title}</h3>
                <p className="text-xs text-text-body/80 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Team */}
      <section className="bg-bg-section dark:bg-slate-900/40 py-20 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold tracking-wider text-primary-green uppercase font-poppins">Our Leaders</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-heading dark:text-white font-poppins tracking-tight">
              Meet the Core Committee & Mentors
            </p>
            <p className="text-sm text-text-body dark:text-slate-400">
              Dedicated mentors leading the mission to empower District Jhang.
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-4">
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-section via-bg-section/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 z-10 pointer-events-none" />
            
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: [0, -1000] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 25
              }}
            >
              {duplicatedTeam.map((mentor, idx) => (
                <Card key={idx} className="w-72 text-center space-y-4 flex-shrink-0 flex flex-col justify-between p-6 glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800">
                  <div className="space-y-4">
                    <div className="mx-auto h-20 w-20 rounded-full bg-primary-blue/10 p-0.5 border border-primary-green/20">
                      <img src={mentor.avatar} alt={mentor.name} className="h-full w-full rounded-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-poppins text-heading dark:text-white leading-tight">{mentor.name}</h3>
                      <p className="text-[10px] text-primary-green font-semibold uppercase mt-0.5">{mentor.role}</p>
                    </div>
                    <p className="text-xs text-text-body/80 dark:text-slate-400 line-clamp-2 leading-normal">{mentor.bio}</p>
                  </div>
                </Card>
              ))}
            </motion.div>

            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-section via-bg-section/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold tracking-wider text-primary-green uppercase font-poppins">Success Stories</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-heading dark:text-white font-poppins tracking-tight">
              Loved by Youth in Jhang
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-4">
            {/* Gradient overlays to smooth transitions */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 z-10 pointer-events-none" />
            
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: [0, -1000] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 25
              }}
            >
              {duplicatedTestimonials.map((t, idx) => (
                <Card key={idx} className="w-80 flex flex-col justify-between space-y-6 flex-shrink-0 p-6 glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800 shadow-md">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-500" />)}
                  </div>
                  <p className="text-xs italic text-heading/90 dark:text-slate-200 leading-relaxed text-left">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="h-9 w-9 rounded-full bg-primary-green/10 flex items-center justify-center font-bold text-xs text-primary-green flex-shrink-0">
                      {t.author[0]}
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-heading dark:text-white font-poppins leading-none">{t.author}</h4>
                      <p className="text-[9px] text-text-body dark:text-slate-400 mt-1">{t.role} • {t.location}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>

            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-bg-section dark:bg-slate-900/40 py-20 transition-colors duration-300">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold tracking-wider text-primary-green uppercase font-poppins">Got Questions?</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-heading dark:text-white font-poppins tracking-tight">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border-custom bg-white dark:border-slate-800 dark:bg-slate-900/40 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold font-poppins text-heading dark:text-white"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-4.5 w-4.5 text-primary-green" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border-custom dark:border-slate-800"
                    >
                      <p className="p-5 text-xs text-text-body dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/20">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-tr from-primary-blue to-primary-blue/90 dark:from-slate-900 dark:to-slate-900/50 px-8 py-16 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto text-white">
              <h2 className="font-poppins text-3xl sm:text-4xl font-extrabold tracking-tight">
                Become a Part of Pakistan's Strongest Local Digital Circle
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                Connect with like-minded peers in Jhang, learn industry-standard skills for free, get certificates, and launch a global remote career today.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <Link to={user ? "/signup" : "/auth"}>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Register Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10 dark:text-white">
                    Learn About Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// YouTube icon component helper
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.021 0 12 0 12s0 3.979.502 5.837a3.002 3.002 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107c.502-1.858.502-5.837.502-5.837s0-3.979-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
