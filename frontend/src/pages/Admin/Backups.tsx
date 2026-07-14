import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Database, FolderDown, RotateCcw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const Backups: React.FC = () => {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getBackups();
      setBackups(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load backup history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      await settingsService.createBackup();
      toast.success('Database backup created successfully!');
      fetchBackups();
    } catch (err) {
      toast.error('Failed to generate database backup.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border-custom dark:border-slate-800 pb-4">
        <div>
          <h2 className="font-poppins text-lg font-bold text-heading dark:text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-primary-green" /> Database Backups
          </h2>
          <p className="text-xs text-slate-400 mt-1">Generate system state snapshots, download database files, and track version history.</p>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          className="bg-primary-blue hover:bg-primary-blue/95 border-none"
          onClick={handleCreateBackup} 
          isLoading={creating}
          leftIcon={<RotateCcw className="h-4 w-4" />}
        >
          Create Backup
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Backups List */}
        <Card className="lg:col-span-2 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-custom dark:border-slate-800 text-slate-400 uppercase font-poppins">
                <th className="p-4 font-semibold">Backup File</th>
                <th className="p-4 font-semibold">Size</th>
                <th className="p-4 font-semibold">Generated At</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom/50 dark:divide-slate-800/50 font-mono text-[10px]">
              {backups.length > 0 ? (
                backups.map((b) => (
                  <tr key={b.file_name} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="p-4 text-heading dark:text-slate-300 font-semibold">{b.file_name}</td>
                    <td className="p-4 text-text-body dark:text-slate-400">{b.file_size}</td>
                    <td className="p-4 text-text-body dark:text-slate-400">
                      {new Date(b.created_at).toLocaleString()}
                    </td>
                    <td className="p-4 text-right print:hidden">
                      <a 
                        href={`/uploads/backups/${b.file_name}`} 
                        download 
                        className="inline-flex items-center gap-1 text-primary-blue dark:text-blue-400 font-bold hover:underline"
                      >
                        <FolderDown className="h-3.5 w-3.5" /> Download
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 font-poppins text-xs">
                    No database backup records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* Backups info */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-custom dark:border-slate-800 pb-3">
            <AlertCircle className="h-5 w-5 text-primary-green" />
            <h3 className="font-poppins font-bold text-sm text-heading dark:text-white">Backup Notes</h3>
          </div>
          <p className="text-xs text-text-body dark:text-slate-400 leading-relaxed font-poppins">
            Backups are generated locally and written to the secure uploads subdirectory on Hostinger. Daily cron jobs are configured to sync files to disaster recovery storages.
          </p>
        </Card>
      </div>
    </div>
  );
};
