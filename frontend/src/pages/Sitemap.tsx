import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { SEO } from '../components/SEO';
import { Compass, Users, FileText, ArrowRight, HeartHandshake, Info } from 'lucide-react';

export const Sitemap: React.FC = () => {
  const categories = [
    {
      title: 'Portal Navigation',
      icon: <Compass className="h-5 w-5 text-primary-blue" />,
      links: [
        { label: 'Home Page', path: '/' },
        { label: 'About Empowerment Jhang', path: '/about' },
        { label: 'Contact Support', path: '/contact' }
      ]
    },
    {
      title: 'Community Pathways',
      icon: <Users className="h-5 w-5 text-primary-green" />,
      links: [
        { label: 'Start OTP Verification', path: '/auth' },
        { label: 'Complete Registration Form', path: '/signup' }
      ]
    },
    {
      title: 'Engagement Programs',
      icon: <HeartHandshake className="h-5 w-5 text-emerald-500" />,
      links: [
        { label: 'Join as Volunteer', path: '/volunteer' },
        { label: 'Become a Mentor', path: '/mentor' }
      ]
    },
    {
      title: 'Legal Terms',
      icon: <FileText className="h-5 w-5 text-slate-500" />,
      links: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms and Conditions', path: '/terms' }
      ]
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-bg-section dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <SEO 
        title="HTML Sitemap" 
        description="Navigate all public pages, skill programs, registrations, and volunteer programs of the Empower Jhang digital community platform."
        schema={{
          "@type": "WebPage",
          "name": "HTML Sitemap - Empower Jhang",
          "description": "Navigation links index for all public pages."
        }}
      />
      
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-blue/10 px-3.5 py-1.5 text-xs font-semibold text-primary-blue dark:text-blue-400">
            <Info className="h-4 w-4" /> Site Directory
          </div>
          <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold tracking-tight text-heading dark:text-white leading-tight">
            Empower Jhang Sitemap
          </h1>
          <p className="text-sm text-text-body dark:text-slate-400 max-w-lg mx-auto">
            A comprehensive index of all verified public directories, registration wizards, and resource links.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <Card key={idx} className="p-6 space-y-5 shadow-sm dark:bg-slate-900/40">
              <div className="flex items-center gap-2.5 border-b border-border-custom dark:border-slate-800 pb-3">
                {cat.icon}
                <h2 className="font-poppins text-sm font-bold text-heading dark:text-white">
                  {cat.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {cat.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      to={link.path}
                      className="group flex items-center justify-between text-xs text-text-body/90 hover:text-primary-blue dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Sitemap;
