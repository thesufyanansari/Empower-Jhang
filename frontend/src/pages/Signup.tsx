import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { memberService } from '../services/memberService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { 
  User, MapPin, Briefcase, FileImage, 
  ArrowRight, ArrowLeft, Check, Camera, Globe, CheckSquare, List 
} from 'lucide-react';
import { LinkedinIcon, FacebookIcon, GithubIcon } from '../components/ui/SocialIcons';
import toast from 'react-hot-toast';

export const Signup: React.FC = () => {
  const { saveLocalProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const verifiedEmail = location.state?.email;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    full_name: '',
    father_name: '',
    gender: 'Male',
    date_of_birth: '',
    whatsapp: '',
    district: 'Jhang',
    address: '',
    education: 'Bachelor',
    occupation: 'Student',
    skills: '',
    interests: [] as string[], // Multiple interested skills checked
    facebook: '',
    instagram: '',
    linkedin: '',
    github: '',
    portfolio: '',
    bio: '',
    agree: false
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Redirect to Auth if no verified email
  useEffect(() => {
    if (!verifiedEmail) {
      toast.error('Please verify your email address first.');
      navigate('/auth');
    }
  }, [verifiedEmail, navigate]);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('empower_jhang_signup_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (err) {
        // ignore invalid JSON
      }
    }
  }, []);

  // Autosave draft when formData changes
  useEffect(() => {
    const { agree, ...draftData } = formData; // don't autosave agreements
    localStorage.setItem('empower_jhang_signup_draft', JSON.stringify(draftData));
  }, [formData]);

  const districts = ['Jhang', 'Shorkot', '18 Hazari', 'Ahmadpur Sial'];
  const genders = ['Male', 'Female', 'Other'];
  
  const educationOptions = [
    'Primary School', 'Middle School', 'Matric', 'Intermediate', 
    'DAE', 'Bachelor', 'Master', 'MPhil', 'PhD', 'Other'
  ];

  const occupationOptions = [
    'Student', 'Freelancer', 'Job Holder', 'Business Owner', 
    'Teacher', 'Developer', 'Designer', 'Digital Marketer', 
    'Content Creator', 'Video Editor', 'Graphic Designer', 
    'Photographer', 'Entrepreneur', 'Unemployed', 'Other'
  ];

  const skillOptions = [
    'Graphic Design', 'Web Development', 'Programming', 'Artificial Intelligence',
    'Digital Marketing', 'Freelancing', 'Video Editing', 'Content Writing',
    'SEO', 'UI UX Design', 'WordPress', 'E-Commerce', 'Cyber Security',
    'Data Science', 'Mobile App Development', 'Microsoft Office',
    'Communication Skills', 'Public Speaking', 'Business Development', 'Entrepreneurship'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleInterestToggle = (skill: string) => {
    setFormData(prev => {
      const interests = prev.interests.includes(skill)
        ? prev.interests.filter(s => s !== skill)
        : [...prev.interests, skill];
      return { ...prev, interests };
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      
      if (!validTypes.includes(file.type)) {
        toast.error('Only JPG, PNG and WEBP image formats are supported.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Profile photo must be less than 5MB.');
        return;
      }
      
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.full_name || !formData.father_name || !formData.date_of_birth) {
        toast.error('Please enter all required personal details.');
        return;
      }
    } else if (step === 2) {
      if (!formData.whatsapp || !formData.address) {
        toast.error('Please enter WhatsApp number and home address.');
        return;
      }
      if (formData.whatsapp.length < 10) {
        toast.error('Please enter a valid WhatsApp mobile number.');
        return;
      }
    } else if (step === 3) {
      if (!formData.education || !formData.occupation) {
        toast.error('Please select your education and occupation.');
        return;
      }
    } else if (step === 4) {
      if (formData.interests.length === 0) {
        toast.error('Please select at least one interested skill.');
        return;
      }
    } else if (step === 5) {
      if (!photoFile) {
        toast.error('Please upload your profile photo to proceed.');
        return;
      }
    }
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) {
      toast.error('You must agree to the declaration check.');
      return;
    }
    if (!verifiedEmail) {
      toast.error('Verified email is missing. Please verify your email first.');
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('full_name', formData.full_name);
      submitData.append('father_name', formData.father_name);
      submitData.append('gender', formData.gender);
      submitData.append('date_of_birth', formData.date_of_birth);
      submitData.append('whatsapp', formData.whatsapp);
      submitData.append('email', verifiedEmail);
      submitData.append('district', formData.district);
      submitData.append('address', formData.address);
      submitData.append('education', formData.education);
      submitData.append('occupation', formData.occupation);
      submitData.append('skills', formData.skills || formData.interests.join(', '));
      submitData.append('interests', formData.interests.join(', '));
      submitData.append('facebook', formData.facebook);
      submitData.append('instagram', formData.instagram);
      submitData.append('linkedin', formData.linkedin);
      submitData.append('github', formData.github);
      submitData.append('portfolio', formData.portfolio);
      submitData.append('bio', formData.bio);
      
      if (photoFile) {
        submitData.append('profile_photo', photoFile);
      }

      const data = await memberService.registerMember(submitData);

      toast.success('Registration successful!');
      localStorage.removeItem('empower_jhang_signup_draft'); // clear draft
      
      if (data && data.member) {
        saveLocalProfile(data.member.id, data.member.member_id);
        navigate(`/welcome?id=${data.member.member_id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit registration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-bg-section dark:bg-slate-950 py-12 px-4 transition-colors duration-300">
      <div className="absolute top-10 left-10 h-72 w-72 bg-primary-green/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 h-72 w-72 bg-primary-blue/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between px-2">
          <h2 className="font-poppins text-lg font-bold text-heading dark:text-white">
            Community Onboarding
          </h2>
          <span className="text-xs font-semibold text-text-body/80 dark:text-slate-400">
            Step {step} of 6
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary-green h-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        <Card className="p-8 shadow-lg glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 border-b border-border-custom dark:border-slate-800 pb-3 mb-4">
                  <User className="h-5 w-5 text-primary-green" />
                  <h3 className="font-poppins font-bold text-heading dark:text-white">Personal Details</h3>
                </div>

                <Input
                  label="Full Name"
                  name="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Father's Name"
                  name="father_name"
                  type="text"
                  placeholder="Enter father's name"
                  value={formData.father_name}
                  onChange={handleInputChange}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-heading dark:text-slate-200 mb-1.5 font-poppins">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    >
                      {genders.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <Input
                    label="Date of Birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 border-b border-border-custom dark:border-slate-800 pb-3 mb-4">
                  <MapPin className="h-5 w-5 text-primary-green" />
                  <h3 className="font-poppins font-bold text-heading dark:text-white">Contact & Location</h3>
                </div>

                <Input
                  label="WhatsApp Number"
                  name="whatsapp"
                  type="tel"
                  placeholder="e.g. 03001234567"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  helperText="Format: 11 digit local mobile number."
                  required
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-heading dark:text-slate-200 mb-1.5 font-poppins">
                    District / Tehsil (Jhang only)
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <Input
                  label="Home Address"
                  name="address"
                  type="text"
                  placeholder="Enter street address, city, Jhang"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            {/* Step 3: Education & Occupation */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 border-b border-border-custom dark:border-slate-800 pb-3 mb-4">
                  <Briefcase className="h-5 w-5 text-primary-green" />
                  <h3 className="font-poppins font-bold text-heading dark:text-white">Education & Career</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-heading dark:text-slate-200 mb-1.5 font-poppins">
                      Education Level
                    </label>
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    >
                      {educationOptions.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-heading dark:text-slate-200 mb-1.5 font-poppins">
                      Current Profession
                    </label>
                    <select
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    >
                      {occupationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Skills & Interests */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 border-b border-border-custom dark:border-slate-800 pb-3 mb-4">
                  <List className="h-5 w-5 text-primary-green" />
                  <h3 className="font-poppins font-bold text-heading dark:text-white">Interested Skills</h3>
                </div>

                <p className="text-xs text-text-body dark:text-slate-400">
                  Select the digital skill sets you are interested in acquiring or advancing:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto border border-border-custom dark:border-slate-800 p-4 rounded-xl">
                  {skillOptions.map(skill => (
                    <label 
                      key={skill} 
                      className="flex items-center gap-2.5 text-xs text-heading dark:text-slate-200 cursor-pointer p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(skill)}
                        onChange={() => handleInterestToggle(skill)}
                        className="h-4 w-4 rounded-sm text-primary-green focus:ring-primary-green border-slate-300"
                      />
                      {skill}
                    </label>
                  ))}
                </div>

                <Input
                  label="Specific Skills / Tech Stack (Optional)"
                  name="skills"
                  type="text"
                  placeholder="e.g. React, Node.js, Photoshop (comma separated)"
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {/* Step 5: Profile Photo Upload */}
            {step === 5 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 border-b border-border-custom dark:border-slate-800 pb-3 mb-4">
                  <FileImage className="h-5 w-5 text-primary-green" />
                  <h3 className="font-poppins font-bold text-heading dark:text-white">Profile Picture</h3>
                </div>

                <div className="flex flex-col items-center gap-4 p-6 border border-dashed border-border-custom dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
                  <div className="relative h-32 w-32 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-primary-green shadow-inner">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="h-10 w-10 text-slate-400" />
                    )}
                  </div>
                  
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-2.5 text-xs font-semibold text-heading dark:text-white transition-colors duration-200">
                      Select Photo File
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-text-body/65 dark:text-slate-400 text-center">
                    Maximum size: 5MB. Acceptable file extensions: JPG, PNG, WEBP.
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Review & Guidelines Agreement */}
            {step === 6 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 border-b border-border-custom dark:border-slate-800 pb-3 mb-4">
                  <CheckSquare className="h-5 w-5 text-primary-green" />
                  <h3 className="font-poppins font-bold text-heading dark:text-white">Review & Declaration</h3>
                </div>

                <div className="space-y-3 text-xs border border-border-custom dark:border-slate-800 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
                  <p><strong>Email Address:</strong> {verifiedEmail}</p>
                  <p><strong>Full Name:</strong> {formData.full_name}</p>
                  <p><strong>WhatsApp:</strong> {formData.whatsapp}</p>
                  <p><strong>District:</strong> {formData.district}</p>
                  <p><strong>Education:</strong> {formData.education}</p>
                  <p><strong>Profession:</strong> {formData.occupation}</p>
                  <p><strong>Interested Skills:</strong> {formData.interests.join(', ')}</p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Short Professional Bio (Optional)"
                    name="bio"
                    type="text"
                    placeholder="Briefly describe your goals or background"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="LinkedIn Profile URL (Optional)"
                      name="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      leftIcon={<LinkedinIcon className="h-4.5 w-4.5" />}
                    />
                    <Input
                      label="GitHub Profile URL (Optional)"
                      name="github"
                      type="url"
                      placeholder="https://github.com/username"
                      value={formData.github}
                      onChange={handleInputChange}
                      leftIcon={<GithubIcon className="h-4.5 w-4.5" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Facebook URL (Optional)"
                      name="facebook"
                      type="url"
                      placeholder="https://facebook.com/username"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      leftIcon={<FacebookIcon className="h-4.5 w-4.5" />}
                    />
                    <Input
                      label="Portfolio Link (Optional)"
                      name="portfolio"
                      type="url"
                      placeholder="https://myportfolio.com"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      leftIcon={<Globe className="h-4.5 w-4.5" />}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-4">
                  <input
                    type="checkbox"
                    id="agree"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 rounded-sm border-slate-300 text-primary-green focus:ring-primary-green"
                  />
                  <label htmlFor="agree" className="text-xs text-text-body dark:text-slate-400 cursor-pointer">
                    I declare that all details provided are correct and accurate. I want to register as an official member of the Empower Jhang community platform.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex justify-between gap-4 pt-4 border-t border-border-custom dark:border-slate-800">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back
                </Button>
              )}

              {step < 6 ? (
                <Button
                  type="button"
                  variant="primary"
                  className="ml-auto bg-primary-green hover:bg-primary-green/95 border-none"
                  onClick={nextStep}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="secondary"
                  className="ml-auto bg-primary-blue hover:bg-primary-blue/95 border-none"
                  isLoading={loading}
                  rightIcon={<Check className="h-4 w-4" />}
                >
                  Submit Registration
                </Button>
              )}
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
};
