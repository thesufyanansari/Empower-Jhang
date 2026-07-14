import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { memberService } from '../../services/memberService';
import { Award, Heart, Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Volunteer: React.FC = () => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    role: 'Volunteer',
    department: 'Event Coordination & Logistics',
    experience: '',
    availability: 'Weekends',
    motivation: '',
    leadership: '',
    emergency_contact: '',
    interests: '',
    previous_work: '',
    time_weekly: '5-10 hours',
    value_bring: '',
    references: '',
    
    // Social Links
    facebook: '',
    linkedin: '',
    website: '',
    portfolio: '',
    github: '',
    behance: '',
    dribbble: '',
    instagram: '',
    youtube: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast.error('You must join the community first.');
      return;
    }

    if (!formData.experience || !formData.motivation || !formData.emergency_contact) {
      toast.error('Please fill in experience, motivation, and emergency contact.');
      return;
    }

    setLoading(true);
    try {
      await memberService.applyVolunteer(profile.member_id, formData);
      toast.success('Volunteer application submitted successfully for core team review!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const volunteerPositions = [
    'Volunteer',
    'Senior Volunteer',
    'Community Ambassador',
    'Technical Lead',
    'Marketing Lead',
    'Creative Lead',
    'Media Manager',
    'Volunteer Coordinator',
    'Operations Manager',
    'Program Director',
    'Community Director',
    'Treasurer',
    'Joint Secretary',
    'General Secretary',
    'Vice President',
    'President'
  ];

  const volunteerDepartments = [
    'Event Coordination & Logistics',
    'Graphic Design & Branding',
    'Social Media Management',
    'Moderation & Technical Support',
    'Academic Curriculum Support',
    'Corporate Relations & Placements'
  ];

  // If user is not logged in / doesn't have a profile, prompt them to register
  if (!profile) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] bg-bg-section dark:bg-slate-950 py-16 px-4 flex items-center justify-center transition-colors duration-300">
        <Card className="max-w-md w-full p-8 text-center space-y-6 glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800">
          <div className="mx-auto h-14 w-14 rounded-full bg-green-500/10 text-primary-green flex items-center justify-center">
            <Heart className="h-7 w-7 text-primary-green fill-primary-green/10" />
          </div>
          <div className="space-y-2">
            <h2 className="font-poppins text-xl font-bold text-heading dark:text-white">Join the Community First</h2>
            <p className="text-xs text-text-body/80 dark:text-slate-400 leading-relaxed">
              To apply for our Volunteer Program, you must first register as a community member to generate your official Member ID.
            </p>
          </div>
          <Link to="/auth" className="block">
            <Button variant="primary" className="w-full flex items-center justify-center gap-2">
              Join Community Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-bg-section dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-primary-green text-xs font-bold font-poppins">
            <Heart className="h-4 w-4 text-primary-green fill-primary-green/10" /> Apply to Volunteer
          </div>
          <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-heading dark:text-white tracking-tight">
            Volunteer Application
          </h1>
          <p className="text-sm text-text-body dark:text-slate-400 max-w-lg mx-auto">
            Give back to your local community. Help us host bootcamps and expand digital networks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Side Banner */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 space-y-4 border-border-custom dark:border-slate-800">
              <h3 className="font-poppins font-bold text-heading dark:text-white text-md border-b border-border-custom dark:border-slate-800 pb-3">
                Volunteer Badges
              </h3>
              
              <div className="space-y-4 pt-2">
                <div className="flex gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2 text-primary-green h-9 w-9 flex items-center justify-center">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Impact Lives</h4>
                    <p className="text-[11px] text-text-body dark:text-slate-400 mt-1 leading-normal">
                      Guide study circles and collaborate on free educational campaigns.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2 text-primary-blue dark:text-blue-400 h-9 w-9 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Network with Leaders</h4>
                    <p className="text-[11px] text-text-body dark:text-slate-400 mt-1 leading-normal">
                      Work side-by-side with senior mentors, developers, and directors.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-600 h-9 w-9 flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Official Badges</h4>
                    <p className="text-[11px] text-text-body dark:text-slate-400 mt-1 leading-normal">
                      Get featured in the public directories with a Volunteer Card identity.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {(profile as any).volunteer_status === 'Pending' && (
              <Card className="p-6 border-amber-500/25 bg-amber-500/5 text-amber-600 dark:text-amber-400 flex gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-poppins uppercase">Application Pending</h4>
                  <p className="text-[10px] leading-relaxed">
                    You have already submitted a volunteer application. Our board of directors is currently reviewing it.
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Detailed Form */}
          <Card className="lg:col-span-8 p-8 border-border-custom dark:border-slate-800">
            <h3 className="font-poppins font-bold text-heading dark:text-white text-md border-b border-border-custom dark:border-slate-800 pb-3 mb-6">
              Application Questionnaire
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    Desired Position
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {volunteerPositions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    Department of Interest
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {volunteerDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
              </div>

              {/* Textareas */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    Experience Details *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Briefly explain your skill sets and experience..."
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Availability Details *"
                    type="text"
                    placeholder="e.g. Weekends, Weekdays evenings"
                    required
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  />

                  <Input
                    label="Weekly Contribution Capacity *"
                    type="text"
                    placeholder="e.g. 5-10 hours, 15 hours"
                    required
                    value={formData.time_weekly}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_weekly: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    Motivation: Why do you want to volunteer? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explain your motivation to serve Jhang's digital community..."
                    value={formData.motivation}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    What specific value will you bring to the community? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="How will your skills help us grow?"
                    value={formData.value_bring}
                    onChange={(e) => setFormData(prev => ({ ...prev, value_bring: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Leadership / Teamwork Experience"
                    type="text"
                    placeholder="Brief details of previous roles"
                    value={formData.leadership}
                    onChange={(e) => setFormData(prev => ({ ...prev, leadership: e.target.value }))}
                  />

                  <Input
                    label="Emergency Contact Number *"
                    type="tel"
                    placeholder="Emergency phone number"
                    required
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    Previous Community Work description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Detail any other social or technical groups you served..."
                    value={formData.previous_work}
                    onChange={(e) => setFormData(prev => ({ ...prev, previous_work: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="References (Names & Contacts) *"
                    type="text"
                    placeholder="Person who can verify your background"
                    required
                    value={formData.references}
                    onChange={(e) => setFormData(prev => ({ ...prev, references: e.target.value }))}
                  />

                  <Input
                    label="Volunteer Interests (Specific tasks)"
                    type="text"
                    placeholder="e.g. Photoshop design, speaker coordination"
                    value={formData.interests}
                    onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-heading dark:text-white uppercase tracking-wider font-poppins border-b border-border-custom dark:border-slate-800 pb-2">
                  Verify Social Media Channels (Optional)
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="LinkedIn Profile"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                  />
                  <Input
                    label="GitHub Profile"
                    type="url"
                    placeholder="https://github.com/username"
                    value={formData.github}
                    onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                  />
                  <Input
                    label="Facebook Profile"
                    type="url"
                    placeholder="https://facebook.com/profile"
                    value={formData.facebook}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                  />
                  <Input
                    label="Instagram URL"
                    type="url"
                    placeholder="https://instagram.com/username"
                    value={formData.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                  />
                  <Input
                    label="Personal Website"
                    type="url"
                    placeholder="https://yourdomain.com"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  />
                  <Input
                    label="Portfolio Link"
                    type="url"
                    placeholder="https://behance.net/portfolio"
                    value={formData.portfolio}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
                isLoading={loading}
              >
                Submit Volunteer Application
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
