import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { memberService } from '../../services/memberService';
import { Award, GraduationCap, Users, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const BecomeMentor: React.FC = () => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    experience_years: '5',
    industry: 'Software Engineering & Programming',
    teaching_exp: '',
    mentoring_exp: '',
    specializations: '',
    availability: 'Weekends 2-4 Hours',
    languages: 'Urdu, Punjabi, English',
    achievements: '',
    certifications: '',
    motivation: '',
    style: 'Direct feedback, code reviews, and practical project builds.',
    
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

    if (!formData.specializations || !formData.motivation || !formData.teaching_exp) {
      toast.error('Please fill in teaching experience, specializations, and motivation.');
      return;
    }

    setLoading(true);
    try {
      await memberService.applyMentor(profile.member_id, formData);
      toast.success('Mentor application submitted successfully for review! We will contact you soon.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const industries = [
    'Software Engineering & Programming',
    'AI & Data Science',
    'UI/UX Product Design',
    'Video Editing & 3D Animation',
    'Digital Marketing & SEO',
    'E-Commerce & Amazon/Shopify',
    'Freelancing & Upwork Agency Growth',
    'Mobile App Development'
  ];

  // If user is not logged in / doesn't have a profile, prompt them to register
  if (!profile) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] bg-bg-section dark:bg-slate-950 py-16 px-4 flex items-center justify-center transition-colors duration-300">
        <Card className="max-w-md w-full p-8 text-center space-y-6 glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800">
          <div className="mx-auto h-14 w-14 rounded-full bg-yellow-500/10 text-yellow-600 flex items-center justify-center border border-yellow-500/20">
            <GraduationCap className="h-7 w-7 text-yellow-600" />
          </div>
          <div className="space-y-2">
            <h2 className="font-poppins text-xl font-bold text-heading dark:text-white">Register as Member First</h2>
            <p className="text-xs text-text-body/80 dark:text-slate-400 leading-relaxed">
              To apply for our Mentor Program, you must first register as a community member to generate your profile card.
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-bold font-poppins border border-yellow-500/20">
            <GraduationCap className="h-4 w-4" /> Professional Mentorship
          </div>
          <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-heading dark:text-white tracking-tight">
            Apply to Become a Mentor
          </h1>
          <p className="text-sm text-text-body dark:text-slate-400 max-w-lg mx-auto">
            Share your industry expertise and guide local youth in launching modern digital careers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Side Banner */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 space-y-4 border-border-custom dark:border-slate-800">
              <h3 className="font-poppins font-bold text-heading dark:text-white text-md border-b border-border-custom dark:border-slate-800 pb-3">
                Why Mentor?
              </h3>
              
              <div className="space-y-4 pt-2">
                <div className="flex gap-3">
                  <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-600 h-9 w-9 flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Give Back</h4>
                    <p className="text-[11px] text-text-body dark:text-slate-400 mt-1 leading-normal">
                      Provide local guidance that makes a direct financial impact on youth.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2 text-primary-blue dark:text-blue-400 h-9 w-9 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Curate Talents</h4>
                    <p className="text-[11px] text-text-body dark:text-slate-400 mt-1 leading-normal">
                      Hire directly from your trainees or build agency teams locally.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2 text-primary-green h-9 w-9 flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Gold Accented Card</h4>
                    <p className="text-[11px] text-text-body dark:text-slate-400 mt-1 leading-normal">
                      Receive an official Gold Mentor Card badge in the directories.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {(profile as any).mentor_status === 'Pending' && (
              <Card className="p-6 border-amber-500/25 bg-amber-500/5 text-amber-600 dark:text-amber-400 flex gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-poppins uppercase">Application Under Review</h4>
                  <p className="text-[10px] leading-relaxed">
                    You have submitted a mentor application. Our administration team is verifying your experience credentials.
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Form */}
          <Card className="lg:col-span-8 p-8 border-border-custom dark:border-slate-800">
            <h3 className="font-poppins font-bold text-heading dark:text-white text-md border-b border-border-custom dark:border-slate-800 pb-3 mb-6">
              Mentorship Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    Primary Industry Focus
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    Years of Professional Experience
                  </label>
                  <select
                    value={formData.experience_years}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience_years: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="1-2">1 to 2 Years</option>
                    <option value="3-4">3 to 4 Years</option>
                    <option value="5">5+ Years</option>
                    <option value="10">10+ Years</option>
                  </select>
                </div>
              </div>

              {/* Textareas */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    Specializations (Comma Separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js, Figma, Laravel, Copywriting"
                    value={formData.specializations}
                    onChange={(e) => setFormData(prev => ({ ...prev, specializations: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    Teaching / Professional Training Experience *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Briefly describe your experience teaching classes, hosting workshops, or training juniors..."
                    value={formData.teaching_exp}
                    onChange={(e) => setFormData(prev => ({ ...prev, teaching_exp: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    Mentoring Experience Details
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe any previous mentoring program you participated in..."
                    value={formData.mentoring_exp}
                    onChange={(e) => setFormData(prev => ({ ...prev, mentoring_exp: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Availability Details"
                    type="text"
                    placeholder="e.g. Weekends 2 hours"
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  />

                  <Input
                    label="Languages Spoken"
                    type="text"
                    placeholder="Urdu, Punjabi, English"
                    value={formData.languages}
                    onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    Motivation: Why do you want to become a mentor? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Why do you wish to support District Jhang's digital professionals?"
                    value={formData.motivation}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-poppins">
                    Mentorship Style Details
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What is your style of guiding student projects?"
                    value={formData.style}
                    onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Key Achievements / Projects"
                    type="text"
                    placeholder="Top career highlights"
                    value={formData.achievements}
                    onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                  />

                  <Input
                    label="Professional Certifications"
                    type="text"
                    placeholder="e.g. AWS Certified Architect, Google UX Design"
                    value={formData.certifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
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
                Submit Mentor Application
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
