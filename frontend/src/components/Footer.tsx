import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { useTheme } from '../context/ThemeContext';
import { Phone, Mail, MapPin } from 'lucide-react';
import { FacebookIcon, YoutubeIcon, InstagramIcon, LinkedinIcon } from './ui/SocialIcons';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [links, setLinks] = useState<any>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Fetch settings
    apiClient.get('/api/member/public/settings').then(({ data }) => {
      if (data) setSettings(data);
    }).catch(err => console.error(err));
    // Fetch links
    apiClient.get('/api/member/public/links').then(({ data }) => {
      if (data) setLinks(data);
    }).catch(err => console.error(err));
  }, []);

  const currentYear = new Date().getFullYear();
  const logoUrl = theme === 'dark' ? '/logo-dark.png' : '/logo-light.png';

  return (
    <footer className="border-t border-border-custom bg-white dark:border-slate-800 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src={logoUrl} alt="Empower Jhang Logo" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-sm text-text-body/80 dark:text-slate-400 max-w-xs font-poppins">
              {settings?.tagline || 'Learn • Connect • Grow'}
            </p>
            <p className="text-xs text-text-body/60 dark:text-slate-500 max-w-xs">
              A community platform for the youth of District Jhang. Connecting youth, teaching digital skills for free, and building careers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-heading dark:text-white uppercase font-poppins mb-4">
              Community
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-text-body hover:text-primary-blue dark:text-slate-400 dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-sm text-text-body hover:text-primary-blue dark:text-slate-400 dark:hover:text-white transition-colors">
                  Volunteer Program
                </Link>
              </li>
              <li>
                <Link to="/mentor" className="text-sm text-text-body hover:text-primary-blue dark:text-slate-400 dark:hover:text-white transition-colors">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-text-body hover:text-primary-blue dark:text-slate-400 dark:hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-heading dark:text-white uppercase font-poppins mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-text-body dark:text-slate-400">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-primary-green" />
                <a href={`mailto:${settings?.email || 'info@empowerjhang.org'}`} className="hover:text-primary-blue dark:hover:text-white transition-colors">
                  {settings?.email || 'info@empowerjhang.org'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-primary-green" />
                <a href={`tel:${settings?.phone || '+923001234567'}`} className="hover:text-primary-blue dark:hover:text-white transition-colors">
                  {settings?.phone || '+92 300 1234567'}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-primary-green mt-0.5" />
                <span>{settings?.address || 'Jhang, Punjab, Pakistan'}</span>
              </li>
            </ul>
          </div>

          {/* Social Links & Channels */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-heading dark:text-white uppercase font-poppins mb-4">
              Connect With Us
            </h3>
            <div className="flex gap-4">
              <a
                href={links?.facebook_group || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-primary-blue hover:text-white dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-primary-blue dark:hover:text-white transition-all duration-200 cursor-pointer"
                title="Facebook Group"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href={links?.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-red-600 hover:text-white dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-red-600 dark:hover:text-white transition-all duration-200 cursor-pointer"
                title="YouTube Channel"
              >
                <YoutubeIcon className="h-5 w-5" />
              </a>
              <a
                href={settings?.socials?.instagram || links?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-pink-600 hover:text-white dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-pink-600 dark:hover:text-white transition-all duration-200 cursor-pointer"
                title="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={settings?.socials?.linkedin || links?.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-primary-blue hover:text-white dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-primary-blue dark:hover:text-white transition-all duration-200 cursor-pointer"
                title="LinkedIn"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-4">
              <a
                href={links?.whatsapp_community || 'https://whatsapp.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500/10 px-3.5 py-2 text-xs font-semibold text-green-600 hover:bg-green-500/20 dark:bg-green-500/5 dark:text-green-400 dark:hover:bg-green-500/10 transition-colors duration-200"
              >
                Join WhatsApp Community
              </a>
            </div>
          </div>
        </div>

        <hr className="border-border-custom dark:border-slate-800 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-body/70 dark:text-slate-500">
          <div>
            &copy; {currentYear} Empower Jhang. All rights reserved.
          </div>
          <div className="text-center font-semibold text-text-body/80 dark:text-slate-400">
            Developed with ❤️ by Soofee
          </div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-primary-blue dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary-blue dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
