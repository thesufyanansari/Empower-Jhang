import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Check, Link as LinkIcon, MessageSquare, Terminal } from 'lucide-react';
import { FacebookIcon, YoutubeIcon } from '../../components/ui/SocialIcons';
import toast from 'react-hot-toast';

export const Links: React.FC = () => {
  const [formData, setFormData] = useState({
    facebook_group: '',
    whatsapp_community: '',
    whatsapp_channel: '',
    youtube: '',
    discord: '',
    telegram: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      try {
        const data = await settingsService.getLinks();
        if (data) {
          setFormData({
            facebook_group: data.facebook_group || '',
            whatsapp_community: data.whatsapp_community || '',
            whatsapp_channel: data.whatsapp_channel || '',
            youtube: data.youtube || '',
            discord: data.discord || '',
            telegram: data.telegram || ''
          });
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || 'Failed to load community links.');
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await settingsService.updateLinks(formData);
      toast.success('Community links updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update links.');
    } finally {
      setUpdating(false);
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
    <Card className="max-w-2xl p-8 shadow-lg dark:bg-slate-900/50">
      <div className="flex items-center gap-2 border-b border-border-custom dark:border-slate-800 pb-3 mb-6">
        <LinkIcon className="h-5 w-5 text-primary-green" />
        <h2 className="font-poppins text-lg font-bold text-heading dark:text-white">Community Channels Setup</h2>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <Input
          label="Official Facebook Group"
          name="facebook_group"
          type="url"
          value={formData.facebook_group}
          onChange={handleInputChange}
          leftIcon={<FacebookIcon className="h-4.5 w-4.5" />}
          required
        />

        <Input
          label="WhatsApp Community Join Link"
          name="whatsapp_community"
          type="url"
          value={formData.whatsapp_community}
          onChange={handleInputChange}
          leftIcon={<MessageSquare className="h-4.5 w-4.5" />}
          required
        />

        <Input
          label="WhatsApp Official Channel"
          name="whatsapp_channel"
          type="url"
          value={formData.whatsapp_channel}
          onChange={handleInputChange}
          leftIcon={<MessageSquare className="h-4.5 w-4.5" />}
          required
        />

        <Input
          label="Official YouTube Channel"
          name="youtube"
          type="url"
          value={formData.youtube}
          onChange={handleInputChange}
          leftIcon={<YoutubeIcon className="h-4.5 w-4.5" />}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Discord Server Link"
            name="discord"
            type="url"
            value={formData.discord}
            onChange={handleInputChange}
            leftIcon={<Terminal className="h-4.5 w-4.5" />}
          />
          <Input
            label="Telegram Channel Link"
            name="telegram"
            type="url"
            value={formData.telegram}
            onChange={handleInputChange}
            leftIcon={<Terminal className="h-4.5 w-4.5" />}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-border-custom dark:border-slate-800">
          <Button
            type="submit"
            variant="secondary"
            isLoading={updating}
            leftIcon={<Check className="h-4 w-4" />}
          >
            Save Channel Links
          </Button>
        </div>
      </form>
    </Card>
  );
};
