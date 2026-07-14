import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/empower-jhang-logo.png';
import { 
  LayoutDashboard, Users, Settings, Link2, Megaphone, 
  ChevronRight, ArrowLeft, Sun, Moon, Menu, X, LogOut,
  Shield, Activity, Database, Terminal, UserCheck, BookOpen, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, profile, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent font-poppins"></div>
      </div>
    );
  }

  // Admin route protection
  if (!user || !profile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  const logoUrl = theme === 'dark' ? '/logo-dark.png' : '/logo-light.png';

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Onboarding Reviews', path: '/admin/applications', icon: <UserCheck className="h-5 w-5" /> },
    { label: 'Members', path: '/admin/members', icon: <Users className="h-5 w-5" /> },
    { label: 'Volunteers', path: '/admin/volunteers', icon: <UserCheck className="h-5 w-5" /> },
    { label: 'Skills Database', path: '/admin/skills', icon: <BookOpen className="h-5 w-5" /> },
    { label: 'Learning Center', path: '/admin/learning', icon: <GraduationCap className="h-5 w-5" /> },
    { label: 'Announcements', path: '/admin/announcements', icon: <Megaphone className="h-5 w-5" /> },
    { label: 'Community Links', path: '/admin/links', icon: <Link2 className="h-5 w-5" /> },
    { label: 'Activity Logs', path: '/admin/activity-logs', icon: <Terminal className="h-5 w-5" /> },
    { label: 'System Health', path: '/admin/health', icon: <Activity className="h-5 w-5" /> },
    { label: 'Backups', path: '/admin/backups', icon: <Database className="h-5 w-5" /> },
    { label: 'Administrators', path: '/admin/admins', icon: <Shield className="h-5 w-5" /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-bg-section dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border-custom bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-16 items-center px-6 border-b border-border-custom dark:border-slate-800">
          <Link to="/" className="flex items-center">
            <img src={logoUrl} alt="Logo" className="h-9 w-auto object-contain" />
            <span className="rounded-full bg-primary-blue/10 px-2 py-0.5 text-[10px] font-semibold text-primary-blue dark:bg-blue-500/10 dark:text-blue-400 ml-2">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-blue text-white shadow-md shadow-primary-blue/15 dark:bg-primary-blue'
                    : 'text-text-body hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-custom dark:border-slate-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl text-text-body hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-5 w-5" /> Light Mode
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" /> Dark Mode
              </>
            )}
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl text-text-body hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
          >
            <ArrowLeft className="h-5 w-5" /> Exit Admin
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
          >
            <LogOut className="h-5 w-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Topbar - Mobile & Header */}
        <header className="flex h-16 items-center justify-between px-4 lg:px-8 border-b border-border-custom bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-bg-section dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-poppins text-lg font-bold text-heading dark:text-white">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Admin Panel'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-heading dark:text-white">{profile?.full_name}</p>
              <p className="text-[10px] text-text-body/80 dark:text-slate-400">System Admin</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary-blue/10 flex items-center justify-center font-bold text-primary-blue dark:bg-blue-500/10 dark:text-blue-400 uppercase">
              {profile?.full_name?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* Dynamic Admin View */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-border-custom bg-white dark:border-slate-800 dark:bg-slate-900 lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-6 border-b border-border-custom dark:border-slate-800">
                <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2">
                  <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                  <span className="font-poppins text-md font-bold tracking-tight text-primary-blue dark:text-white">
                    Empower Jhang
                  </span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-xl text-slate-500 hover:bg-bg-section dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-grow p-4 space-y-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-blue text-white shadow-md shadow-primary-blue/15'
                          : 'text-text-body hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-border-custom dark:border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    toggleTheme();
                    setSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl text-text-body hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-5 w-5" /> Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5" /> Dark Mode
                    </>
                  )}
                </button>
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl text-text-body hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                >
                  <ArrowLeft className="h-5 w-5" /> Exit Admin
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                >
                  <LogOut className="h-5 w-5" /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
