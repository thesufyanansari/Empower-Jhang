import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages (Lazy Loaded)
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Auth = lazy(() => import('./pages/Auth').then(module => ({ default: module.Auth })));
const Signup = lazy(() => import('./pages/Signup').then(module => ({ default: module.Signup })));
const Welcome = lazy(() => import('./pages/Welcome').then(module => ({ default: module.Welcome })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const Sitemap = lazy(() => import('./pages/Sitemap').then(module => ({ default: module.Sitemap })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

// New Public Directory & Learning Pages
const MembersList = lazy(() => import('./pages/MembersList').then(module => ({ default: module.MembersList })));
const VolunteersList = lazy(() => import('./pages/VolunteersList').then(module => ({ default: module.VolunteersList })));
const MentorsList = lazy(() => import('./pages/MentorsList').then(module => ({ default: module.MentorsList })));
const LeadershipList = lazy(() => import('./pages/LeadershipList').then(module => ({ default: module.LeadershipList })));
const Courses = lazy(() => import('./pages/Courses').then(module => ({ default: module.Courses })));
const Resources = lazy(() => import('./pages/Resources').then(module => ({ default: module.Resources })));

// Static Support Pages (Lazy Loaded)
const About = lazy(() => import('./pages/Static/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('./pages/Static/Contact').then(module => ({ default: module.Contact })));
const Privacy = lazy(() => import('./pages/Static/Privacy').then(module => ({ default: module.Privacy })));
const Terms = lazy(() => import('./pages/Static/Terms').then(module => ({ default: module.Terms })));
const Volunteer = lazy(() => import('./pages/Static/Volunteer').then(module => ({ default: module.Volunteer })));
const BecomeMentor = lazy(() => import('./pages/Static/BecomeMentor').then(module => ({ default: module.BecomeMentor })));

// Admin Pages (Lazy Loaded)
const Dashboard = lazy(() => import('./pages/Admin/Dashboard').then(module => ({ default: module.Dashboard })));
const Members = lazy(() => import('./pages/Admin/Members').then(module => ({ default: module.Members })));
const Settings = lazy(() => import('./pages/Admin/Settings').then(module => ({ default: module.Settings })));
const Announcements = lazy(() => import('./pages/Admin/Announcements').then(module => ({ default: module.Announcements })));
const Links = lazy(() => import('./pages/Admin/Links').then(module => ({ default: module.Links })));
const Volunteers = lazy(() => import('./pages/Admin/Volunteers').then(module => ({ default: module.Volunteers })));
const ActivityLogs = lazy(() => import('./pages/Admin/ActivityLogs').then(module => ({ default: module.ActivityLogs })));
const Health = lazy(() => import('./pages/Admin/Health').then(module => ({ default: module.Health })));
const Backups = lazy(() => import('./pages/Admin/Backups').then(module => ({ default: module.Backups })));
const Admins = lazy(() => import('./pages/Admin/Admins').then(module => ({ default: module.Admins })));
const ManageSkills = lazy(() => import('./pages/Admin/ManageSkills').then(module => ({ default: module.ManageSkills })));
const ManageLearning = lazy(() => import('./pages/Admin/ManageLearning').then(module => ({ default: module.ManageLearning })));
const ManageApplications = lazy(() => import('./pages/Admin/ManageApplications').then(module => ({ default: module.ManageApplications })));
const ManageRoles = lazy(() => import('./pages/Admin/ManageRoles').then(module => ({ default: module.ManageRoles })));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const LoadingFallback: React.FC = () => (
  <div className="flex h-[80vh] items-center justify-center bg-white dark:bg-slate-950">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-blue border-t-transparent"></div>
      <p className="text-xs font-semibold text-text-body/60 dark:text-slate-400 font-poppins">
        Loading community portal...
      </p>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Toaster
              position="top-center"
              toastOptions={{
                className: 'font-poppins text-xs font-semibold rounded-xl bg-white text-heading dark:bg-slate-900 dark:text-slate-100 border border-border-custom dark:border-slate-800 shadow-lg',
                duration: 4000,
              }}
            />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public & Main Site Routes (using MainLayout) */}
                <Route
                  path="/"
                  element={
                    <MainLayout>
                      <Home />
                    </MainLayout>
                  }
                />
                <Route
                  path="/auth"
                  element={
                    <MainLayout>
                      <Auth />
                    </MainLayout>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <MainLayout>
                      <Signup />
                    </MainLayout>
                  }
                />
                <Route
                  path="/welcome"
                  element={
                    <MainLayout>
                      <Welcome />
                    </MainLayout>
                  }
                />
                <Route
                  path="/member/:id"
                  element={
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <MainLayout>
                      <About />
                    </MainLayout>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <MainLayout>
                      <Contact />
                    </MainLayout>
                  }
                />
                <Route
                  path="/privacy"
                  element={
                    <MainLayout>
                      <Privacy />
                    </MainLayout>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <MainLayout>
                      <Terms />
                    </MainLayout>
                  }
                />
                <Route
                  path="/volunteer"
                  element={
                    <MainLayout>
                      <Volunteer />
                    </MainLayout>
                  }
                />
                <Route
                  path="/mentor"
                  element={
                    <MainLayout>
                      <BecomeMentor />
                    </MainLayout>
                  }
                />
                <Route
                  path="/leadership"
                  element={
                    <MainLayout>
                      <LeadershipList />
                    </MainLayout>
                  }
                />
                <Route
                  path="/members"
                  element={
                    <MainLayout>
                      <MembersList />
                    </MainLayout>
                  }
                />
                <Route
                  path="/volunteers"
                  element={
                    <MainLayout>
                      <VolunteersList />
                    </MainLayout>
                  }
                />
                <Route
                  path="/mentors"
                  element={
                    <MainLayout>
                      <MentorsList />
                    </MainLayout>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <MainLayout>
                      <Courses />
                    </MainLayout>
                  }
                />
                <Route
                  path="/resources"
                  element={
                    <MainLayout>
                      <Resources />
                    </MainLayout>
                  }
                />
                <Route
                  path="/sitemap"
                  element={
                    <MainLayout>
                      <Sitemap />
                    </MainLayout>
                  }
                />

                {/* Admin Panel Routes (using AdminLayout) */}
                <Route
                  path="/admin"
                  element={
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/members"
                  element={
                    <AdminLayout>
                      <Members />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <AdminLayout>
                      <Settings />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/announcements"
                  element={
                    <AdminLayout>
                      <Announcements />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/links"
                  element={
                    <AdminLayout>
                      <Links />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/volunteers"
                  element={
                    <AdminLayout>
                      <Volunteers />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/skills"
                  element={
                    <AdminLayout>
                      <ManageSkills />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/learning"
                  element={
                    <AdminLayout>
                      <ManageLearning />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/roles"
                  element={
                    <AdminLayout>
                      <ManageRoles />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/applications"
                  element={
                    <AdminLayout>
                      <ManageApplications />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/activity-logs"
                  element={
                    <AdminLayout>
                      <ActivityLogs />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/health"
                  element={
                    <AdminLayout>
                      <Health />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/backups"
                  element={
                    <AdminLayout>
                      <Backups />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/admins"
                  element={
                    <AdminLayout>
                      <Admins />
                    </AdminLayout>
                  }
                />

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <MainLayout>
                      <NotFound />
                    </MainLayout>
                  }
                />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
