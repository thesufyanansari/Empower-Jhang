import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { Card } from '../../components/ui/Card';
import { Cpu, HardDrive, Mail, Activity, Database, Server } from 'lucide-react';
import toast from 'react-hot-toast';

export const Health: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      setLoading(true);
      try {
        const data = await settingsService.getSystemHealth();
        setHealth(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load system health.');
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  if (loading || !health) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent"></div>
      </div>
    );
  }

  const metrics = [
    { title: 'Server Status', value: health.server_status, desc: `Running on ${health.platform}`, icon: <Server className="h-5 w-5" />, color: 'bg-green-500/10 text-green-500' },
    { title: 'Database connection', value: health.database, desc: 'MySQL connection active', icon: <Database className="h-5 w-5" />, color: 'bg-green-500/10 text-green-500' },
    { title: 'Email Service', value: health.email_api, desc: 'Brevo API operational', icon: <Mail className="h-5 w-5" />, color: 'bg-green-500/10 text-green-500' },
    { title: 'Server Uptime', value: health.uptime, desc: 'Since last start process', icon: <Activity className="h-5 w-5" />, color: 'bg-blue-500/10 text-blue-500' }
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-border-custom dark:border-slate-800 pb-4">
        <h2 className="font-poppins text-lg font-bold text-heading dark:text-white flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary-green" /> System Health & Performance
        </h2>
        <p className="text-xs text-slate-400 mt-1">Live metrics representing backend process parameters, host details, and system uptime.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <Card key={idx} className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-text-body dark:text-slate-400 font-poppins">{m.title}</p>
              <h3 className="text-xl font-black text-heading dark:text-white font-poppins">{m.value}</h3>
              <p className="text-[10px] text-text-body/70 dark:text-slate-500">{m.desc}</p>
            </div>
            <div className={`p-3 rounded-xl ${m.color}`}>
              {m.icon}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Memory allocation details */}
        <Card className="p-6 space-y-6">
          <h3 className="font-poppins font-bold text-md text-heading dark:text-white border-b border-border-custom dark:border-slate-800 pb-3 flex items-center gap-2">
            <HardDrive className="h-4.5 w-4.5 text-primary-blue" /> Memory Statistics
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total System Memory</span>
              <span className="font-bold text-heading dark:text-white">{health.memory_usage?.total}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Allocated Memory</span>
              <span className="font-bold text-heading dark:text-white">{health.memory_usage?.used}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Available Memory</span>
              <span className="font-bold text-heading dark:text-white">{health.memory_usage?.free}</span>
            </div>
          </div>
        </Card>

        {/* Node environments */}
        <Card className="p-6 space-y-6">
          <h3 className="font-poppins font-bold text-md text-heading dark:text-white border-b border-border-custom dark:border-slate-800 pb-3 flex items-center gap-2">
            <Server className="h-4.5 w-4.5 text-primary-blue" /> Environment Parameters
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Node Engine Version</span>
              <span className="font-bold font-mono text-heading dark:text-white">{health.node_version}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Target Host Platform</span>
              <span className="font-bold text-heading dark:text-white">{health.platform}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Application Status</span>
              <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[9px] font-bold text-green-600 border border-green-500/20">
                Active
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
