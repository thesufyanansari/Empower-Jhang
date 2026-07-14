import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { Card } from '../../components/ui/Card';
import { Terminal, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await settingsService.getActivityLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load activity audit trail.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border-custom dark:border-slate-800 pb-4">
        <h2 className="font-poppins text-lg font-bold text-heading dark:text-white flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary-green" /> System Activity Logs
        </h2>
        <p className="text-xs text-slate-400 mt-1">Audit log records representing system actions, modifications, and administrative sessions.</p>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-custom dark:border-slate-800 text-slate-400 uppercase font-poppins">
              <th className="p-4 font-semibold">Log Timestamp</th>
              <th className="p-4 font-semibold">User Type</th>
              <th className="p-4 font-semibold">Event Module</th>
              <th className="p-4 font-semibold">Action Performed</th>
              <th className="p-4 font-semibold text-right">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-custom/50 dark:divide-slate-800/50 font-mono text-[10px]">
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <td className="p-4 text-text-body dark:text-slate-400">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-0.5 font-bold ${
                      log.user_type === 'Admin' 
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-green-500/10 text-green-500'
                    }`}>
                      {log.user_type}
                    </span>
                  </td>
                  <td className="p-4 text-text-body dark:text-slate-300 font-semibold">{log.module}</td>
                  <td className="p-4 text-heading dark:text-white font-medium">{log.action}</td>
                  <td className="p-4 text-right text-text-body dark:text-slate-400">{log.ip_address || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 font-poppins text-xs">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  No audit logs found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
