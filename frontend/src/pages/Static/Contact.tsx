import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success('Your message has been sent successfully. We will get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-bg-section dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-heading dark:text-white tracking-tight">
            Contact Support
          </h1>
          <p className="text-sm text-text-body dark:text-slate-400 max-w-md mx-auto">
            Have questions or need assistance? Reach out to the Empower Jhang core committee.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Details */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-6">
              <h3 className="font-poppins font-bold text-heading dark:text-white text-md border-b border-border-custom dark:border-slate-800 pb-3">
                Official Directory
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2 text-primary-green">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Support Email</h4>
                    <p className="text-sm font-semibold text-heading dark:text-slate-200 mt-1">info@empowerjhang.org</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2 text-primary-green">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">WhatsApp Helpline</h4>
                    <p className="text-sm font-semibold text-heading dark:text-slate-200 mt-1">+92 300 1234567</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2 text-primary-green">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Headquarters</h4>
                    <p className="text-sm font-semibold text-heading dark:text-slate-200 mt-1">Jhang Sadar, Punjab, Pakistan</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-3 bg-primary-blue/5 border-primary-blue/10">
              <div className="flex items-center gap-2 text-primary-blue dark:text-blue-400">
                <HelpCircle className="h-5 w-5" />
                <h4 className="font-poppins font-bold text-sm">Need Faster Response?</h4>
              </div>
              <p className="text-xs text-text-body dark:text-slate-400 leading-relaxed">
                Registered members can post questions directly in the community WhatsApp groups to get assistance from peers and tech mentors.
              </p>
            </Card>
          </div>

          {/* Form */}
          <Card className="lg:col-span-7 p-8">
            <h3 className="font-poppins font-bold text-heading dark:text-white text-md border-b border-border-custom dark:border-slate-800 pb-3 mb-6">
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name *"
                  type="text"
                  placeholder="e.g. Ali Raza"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="e.g. ali@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <Input
                label="Subject"
                type="text"
                placeholder="How can we help you?"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              />

              <div>
                <label className="block text-sm font-medium text-heading dark:text-slate-200 mb-1.5 font-poppins">
                  Message Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your query in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                className="w-full sm:w-auto"
                isLoading={loading}
                leftIcon={<Send className="h-4 w-4" />}
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
