import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Check, Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const [formData, setFormData] = useState({
    website_name: '',
    tagline: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await settingsService.getSettings();
        if (data) {
          setFormData({
            website_name: data.website_name || '',
            tagline: data.tagline || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || ''
          });
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || 'Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await settingsService.updateSettings(formData);
      toast.success('Website configurations updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update settings.');
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
        <SettingsIcon className="h-5 w-5 text-primary-green" />
        <h2 className="font-poppins text-lg font-bold text-heading dark:text-white">Website Settings</h2>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <Input
          label="Website Brand Name"
          name="website_name"
          type="text"
          value={formData.website_name}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Website Tagline"
          name="tagline"
          type="text"
          value={formData.tagline}
          onChange={handleInputChange}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Helpline Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Helpline Phone / WhatsApp"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <Input
          label="Office Address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleInputChange}
          required
        />

        <div className="flex justify-end pt-4 border-t border-border-custom dark:border-slate-800">
          <Button
            type="submit"
            variant="secondary"
            isLoading={updating}
            leftIcon={<Check className="h-4 w-4" />}
          >
            Save Settings
          </Button>
        </div>
      </form>
    </Card>
  );
};
