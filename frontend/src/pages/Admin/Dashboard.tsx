import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { Card } from '../../components/ui/Card';
import { 
  Users, Megaphone, 
  Clock, ArrowUpRight, UserCheck, AlertTriangle 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
    announcements: 0
  });
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const data = await settingsService.getStatistics();
        setStats({
          total: data.totalMembers,
          verified: data.verifiedMembers,
          unverified: data.pendingVerifications,
          announcements: data.announcementsCount
        });
        if (data.recentMembers) setRecentMembers(data.recentMembers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Members', value: stats.total, desc: 'Registered youth profiles', icon: <Users className="h-5 w-5" />, color: 'bg-blue-500/10 text-blue-500' },
    { title: 'Verified Members', value: stats.verified, desc: 'Approved identity cards', icon: <UserCheck className="h-5 w-5" />, color: 'bg-green-500/10 text-green-500' },
    { title: 'Pending Approval', value: stats.unverified, desc: 'Requires review', icon: <Clock className="h-5 w-5" />, color: 'bg-amber-500/10 text-amber-500' },
    { title: 'Announcements', value: stats.announcements, desc: 'Live alerts posted', icon: <Megaphone className="h-5 w-5" />, color: 'bg-purple-500/10 text-purple-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-text-body dark:text-slate-400 font-poppins">{stat.title}</p>
              <h3 className="text-2xl font-black text-heading dark:text-white font-poppins">{stat.value}</h3>
              <p className="text-[10px] text-text-body/70 dark:text-slate-500">{stat.desc}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Registrants */}
        <Card className="lg:col-span-2 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border-custom dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-poppins font-bold text-md text-heading dark:text-white">Recent Registrations</h3>
              <p className="text-xs text-slate-400 mt-0.5">Review the latest members joined.</p>
            </div>
            <Link to="/admin/members" className="text-xs font-bold text-primary-blue hover:underline dark:text-blue-400 flex items-center gap-1">
              View All Members <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentMembers.length > 0 ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-custom dark:border-slate-800 text-slate-400 uppercase font-poppins">
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Member ID</th>
                    <th className="pb-3 font-semibold">Tehsil</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/50 dark:divide-slate-800/50">
                  {recentMembers.map((member) => (
                    <tr key={member.member_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="py-3.5 font-semibold text-heading dark:text-slate-200">{member.full_name}</td>
                      <td className="py-3.5 text-text-body dark:text-slate-400">
                        <Link to={`/member/${member.member_id}`} className="hover:text-primary-blue underline">
                          {member.member_id}
                        </Link>
                      </td>
                      <td className="py-3.5 text-text-body dark:text-slate-400">{member.district}</td>
                      <td className="py-3.5 text-text-body dark:text-slate-400">{member.occupation}</td>
                      <td className="py-3.5 text-right">
                        {member.is_verified ? (
                          <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-bold text-green-600 border border-green-500/20">
                            Verified
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-slate-400">
                No recent members registered yet.
              </div>
            )}
          </div>
        </Card>

        {/* Right Column: Platform Alerts / Checklist */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-poppins font-bold text-md text-heading dark:text-white border-b border-border-custom dark:border-slate-800 pb-3">
              Admin Shortcuts
            </h3>
            
            <div className="space-y-2">
              <Link to="/admin/members" className="block w-full text-left p-3 rounded-xl border border-border-custom hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50 text-xs font-semibold text-heading dark:text-slate-200">
                Manage Members Directory
              </Link>
              <Link to="/admin/settings" className="block w-full text-left p-3 rounded-xl border border-border-custom hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50 text-xs font-semibold text-heading dark:text-slate-200">
                Update Website & Contacts
              </Link>
              <Link to="/admin/announcements" className="block w-full text-left p-3 rounded-xl border border-border-custom hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50 text-xs font-semibold text-heading dark:text-slate-200">
                Post Community Announcement
              </Link>
              <Link to="/admin/links" className="block w-full text-left p-3 rounded-xl border border-border-custom hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50 text-xs font-semibold text-heading dark:text-slate-200">
                Configure Social Group Links
              </Link>
            </div>
          </Card>

          {stats.unverified > 0 && (
            <Card className="p-6 space-y-3 border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-400">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h4 className="font-poppins font-bold text-sm">Action Needed</h4>
              </div>
              <p className="text-xs leading-relaxed">
                There are **{stats.unverified} pending member profiles** awaiting registration review and card verification.
              </p>
              <Link to="/admin/members?filter=unverified" className="inline-block text-xs font-bold underline hover:no-underline">
                Review profiles now
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
