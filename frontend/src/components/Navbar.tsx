import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/Button';
import { Sun, Moon, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, profile, signOut, localMemberId } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Members', path: '/members' },
    { label: 'Volunteers', path: '/volunteers' },
    { label: 'Mentors', path: '/mentors' },
    { label: 'Courses', path: '/courses' },
    { label: 'Resources', path: '/resources' },
    { label: 'Contact', path: '/contact' },
  ];

  const logoUrl = theme === 'dark' ? '/logo-dark.png' : '/logo-light.png';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-custom bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logoUrl} alt="Empower Jhang Logo" className="h-11 w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-text-body hover:text-primary-blue dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2.5 text-slate-500 hover:bg-bg-section hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all duration-200 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {profile?.is_admin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" leftIcon={<LayoutDashboard className="h-4 w-4" />}>
                      Admin
                    </Button>
                  </Link>
                )}
                {profile ? (
                  <Link to={`/member/${profile.member_id}`}>
                    <Button variant="outline" size="sm" leftIcon={<User className="h-4 w-4" />}>
                      Profile
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <Button variant="secondary" size="sm">
                      Complete Signup
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleSignOut} leftIcon={<LogOut className="h-4 w-4" />}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {localMemberId ? (
                  <Link to={`/member/${localMemberId}`}>
                    <Button variant="outline" size="sm" leftIcon={<User className="h-4 w-4" />}>
                      My Profile
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button variant="primary" size="sm">
                      Join Community
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 text-slate-500 hover:bg-bg-section dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl p-2 text-slate-500 hover:bg-bg-section dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border-custom bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-base font-medium text-text-body hover:bg-bg-section hover:text-primary-blue dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              <hr className="my-2 border-border-custom dark:border-slate-800" />

              {user ? (
                <div className="space-y-2 pt-2">
                  {profile?.is_admin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="block w-full">
                      <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<LayoutDashboard className="h-4 w-4" />}>
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  {profile ? (
                    <Link to={`/member/${profile.member_id}`} onClick={() => setIsOpen(false)} className="block w-full">
                      <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<User className="h-4 w-4" />}>
                        My Profile
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full">
                      <Button variant="secondary" size="sm" className="w-full">
                        Complete Signup
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20" leftIcon={<LogOut className="h-4 w-4" />}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  {localMemberId ? (
                    <Link to={`/member/${localMemberId}`} onClick={() => setIsOpen(false)} className="block w-full">
                      <Button variant="outline" size="sm" className="w-full justify-start" leftIcon={<User className="h-4 w-4" />}>
                        My Profile
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="block pt-2">
                      <Button variant="primary" className="w-full">
                        Join Community
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
