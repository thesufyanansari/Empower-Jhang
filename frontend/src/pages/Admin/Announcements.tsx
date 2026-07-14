import React, { useEffect, useState } from 'react';
import { announcementService } from '../../services/announcementService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Megaphone, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await announcementService.getAnnouncements();
      if (data) setAnnouncements(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please enter a title and description.');
      return;
    }

    setCreating(true);
    try {
      const data = await announcementService.createAnnouncement({ title, description });
      toast.success('Announcement posted successfully!');
      setTitle('');
      setDescription('');
      if (data && data.announcement) {
        setAnnouncements(prev => [data.announcement, ...prev]);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to post announcement.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Delete this announcement?');
    if (!confirmDelete) return;

    try {
      await announcementService.deleteAnnouncement(id);
      toast.success('Announcement deleted.');
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent font-poppins"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Create form */}
      <Card className="lg:col-span-5 p-8 shadow-lg dark:bg-slate-900/50">
        <div className="flex items-center gap-2 border-b border-border-custom dark:border-slate-800 pb-3 mb-6">
          <Megaphone className="h-5 w-5 text-primary-green" />
          <h2 className="font-poppins text-lg font-bold text-heading dark:text-white">Post Announcement</h2>
        </div>

        <form onSubmit={handlePost} className="space-y-4">
          <Input
            label="Announcement Title"
            type="text"
            placeholder="e.g. Graphic Design Workshop starting Saturday"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-heading dark:text-slate-200 mb-1.5 font-poppins">
              Announcement Description
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide event details, links to join, or community updates..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            isLoading={creating}
            leftIcon={<Check className="h-4 w-4" />}
          >
            Post Alert
          </Button>
        </form>
      </Card>

      {/* List */}
      <Card className="lg:col-span-7 p-6 space-y-6">
        <div className="border-b border-border-custom dark:border-slate-800 pb-3">
          <h3 className="font-poppins font-bold text-md text-heading dark:text-white">Published Announcements</h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage existing platform announcements.</p>
        </div>

        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((ann) => (
              <div 
                key={ann.id} 
                className="p-5 rounded-2xl border border-border-custom dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/10"
              >
                <div className="space-y-1">
                  <h4 className="font-poppins font-bold text-sm text-heading dark:text-white">{ann.title}</h4>
                  <p className="text-xs text-text-body dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{ann.description}</p>
                  <p className="text-[10px] text-slate-400 pt-1">
                    {new Date(ann.created_at).toLocaleString()}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-2" 
                  onClick={() => handleDelete(ann.id)}
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400">
              No announcements published yet.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
