import React, { useEffect, useState } from 'react';
import { memberService } from '../../services/memberService';
import { settingsService } from '../../services/settingsService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Check, X, User, Heart, GraduationCap, 
  ChevronDown, ChevronUp 
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageApplications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'volunteers' | 'mentors'>('members');
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [pendingVolunteers, setPendingVolunteers] = useState<any[]>([]);
  const [pendingMentors, setPendingMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Expansion toggle states
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Verification Notes
  const [notes, setNotes] = useState('');
  const [mentorSpecs, setMentorSpecs] = useState('');
  const [assignedRole, setAssignedRole] = useState('Volunteer');
  const [assignedDept, setAssignedDept] = useState('Event Coordination & Logistics');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      if (activeTab === 'members') {
        const data = await memberService.getAdminMembers({ status: 'Pending' });
        setPendingMembers(data);
      } else if (activeTab === 'volunteers') {
        const data = await settingsService.getVolunteers();
        setPendingVolunteers(data.filter(v => v.volunteer_status === 'Pending'));
      } else if (activeTab === 'mentors') {
        const data = await memberService.getAdminMentors();
        setPendingMentors(data.filter(m => m.mentor_status === 'Pending'));
      }
    } catch (err) {
      toast.error('Failed to load pending applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    setExpandedId(null);
    setNotes('');
  }, [activeTab]);

  // APPROVE MEMBER
  const handleApproveMember = async (id: string, approve: boolean) => {
    try {
      const status = approve ? 'Approved' : 'Rejected';
      await memberService.approveMember(id, status);
      toast.success(`Member registration has been ${status.toLowerCase()}!`);
      fetchApplications();
    } catch (err) {
      toast.error('Approval failed.');
    }
  };

  // APPROVE VOLUNTEER
  const handleApproveVolunteer = async (id: string, approve: boolean) => {
    try {
      const status = approve ? 'Approved' : 'Rejected';
      // First review status
      await settingsService.reviewVolunteer(id, status, notes);
      
      // If approved, assign role/department
      if (approve) {
        await settingsService.assignVolunteer(id, assignedDept, assignedRole);
      }

      toast.success(`Volunteer status set to ${status}.`);
      fetchApplications();
    } catch (err) {
      toast.error('Failed to review volunteer application.');
    }
  };

  // APPROVE MENTOR
  const handleApproveMentor = async (id: string, approve: boolean) => {
    try {
      const status = approve ? 'Approved' : 'Rejected';
      await memberService.reviewMentor(id, status, mentorSpecs, notes);
      toast.success(`Mentor status updated to ${status}.`);
      fetchApplications();
    } catch (err) {
      toast.error('Failed to review mentor application.');
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

  return (
    <div className="space-y-8 p-6">
      
      {/* Header */}
      <div>
        <h1 className="font-poppins text-2xl font-black text-slate-800 dark:text-white">
          Onboarding Applications Review
        </h1>
        <p className="text-xs text-slate-400">
          Verify identities, read detailed motivations, assign roles, and activate community profile credentials.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-custom dark:border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2.5 font-poppins font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'members'
              ? 'border-primary-blue text-primary-blue dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white'
          }`}
        >
          <User className="h-4 w-4" /> Member Registrations ({pendingMembers.length})
        </button>
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`px-4 py-2.5 font-poppins font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'volunteers'
              ? 'border-primary-blue text-primary-blue dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white'
          }`}
        >
          <Heart className="h-4 w-4" /> Volunteers ({pendingVolunteers.length})
        </button>
        <button
          onClick={() => setActiveTab('mentors')}
          className={`px-4 py-2.5 font-poppins font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'mentors'
              ? 'border-primary-blue text-primary-blue dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="h-4 w-4" /> Mentors ({pendingMentors.length})
        </button>
      </div>

      {/* Applications List */}
      <Card className="p-6">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-8">Fetching applications...</p>
        ) : activeTab === 'members' ? (
          <div className="space-y-4">
            {pendingMembers.map(member => (
              <div key={member.id} className="border border-border-custom dark:border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                      {member.full_name?.[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{member.full_name}</h4>
                      <p className="text-[10px] text-slate-400">{member.profession} • {member.district}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="px-3 py-1 flex items-center gap-1"
                      onClick={() => handleApproveMember(member.id, true)}
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-3 py-1 text-red-500 hover:bg-red-500/5 flex items-center gap-1"
                      onClick={() => handleApproveMember(member.id, false)}
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {pendingMembers.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No pending member registrations.</p>
            )}
          </div>
        ) : activeTab === 'volunteers' ? (
          <div className="space-y-4">
            {pendingVolunteers.map(vol => {
              const isExpanded = expandedId === vol.id;
              return (
                <div key={vol.id} className="border border-border-custom dark:border-slate-800 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                        {vol.full_name?.[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{vol.full_name}</h4>
                        <p className="text-[10px] text-slate-400">Prefers: {vol.volunteer_role} ({vol.volunteer_department})</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : vol.id)}
                      className="inline-flex items-center gap-1 text-xs text-primary-blue"
                    >
                      {isExpanded ? <>Collapse <ChevronUp className="h-4 w-4" /></> : <>Expand Details <ChevronDown className="h-4 w-4" /></>}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border-custom dark:border-slate-800 pt-4 space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <p><strong>Weekly Hours Capability:</strong> {vol.volunteer_time_weekly}</p>
                        <p><strong>Availability Days:</strong> {vol.volunteer_availability}</p>
                        <p><strong>Emergency Contact:</strong> {vol.volunteer_emergency_contact}</p>
                        <p><strong>References:</strong> {vol.volunteer_references}</p>
                      </div>

                      <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                        <p className="font-bold text-slate-500">Motivation Question:</p>
                        <p className="italic">"{vol.volunteer_motivation}"</p>
                      </div>

                      <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                        <p className="font-bold text-slate-500">Value to Bring:</p>
                        <p className="italic">"{vol.volunteer_value_bring}"</p>
                      </div>

                      {/* Review & Assign Section */}
                      <div className="border-t border-border-custom dark:border-slate-800 pt-4 space-y-4">
                        <h4 className="font-bold text-slate-600 dark:text-slate-350">Board Review Action</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Assign Position</label>
                            <select
                              value={assignedRole}
                              onChange={(e) => setAssignedRole(e.target.value)}
                              className="block w-full rounded-xl border border-border-custom bg-white px-3 py-2 text-xs text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                            >
                              {volunteerPositions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Assign Department</label>
                            <select
                              value={assignedDept}
                              onChange={(e) => setAssignedDept(e.target.value)}
                              className="block w-full rounded-xl border border-border-custom bg-white px-3 py-2 text-xs text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                            >
                              <option value="Event Coordination & Logistics">Event Coordination & Logistics</option>
                              <option value="Graphic Design & Branding">Graphic Design & Branding</option>
                              <option value="Social Media Management">Social Media Management</option>
                              <option value="Moderation & Technical Support">Moderation & Technical Support</option>
                              <option value="Academic Curriculum Support">Academic Curriculum Support</option>
                            </select>
                          </div>
                        </div>

                        <Input
                          label="Board Notes (Will save to database)"
                          placeholder="e.g. Cleared background, accepted as Senior Ambassador."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />

                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="primary"
                            size="sm"
                            className="px-4"
                            onClick={() => handleApproveVolunteer(vol.id, true)}
                          >
                            Approve Volunteer
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 px-4"
                            onClick={() => handleApproveVolunteer(vol.id, false)}
                          >
                            Reject Application
                          </Button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
            {pendingVolunteers.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No pending volunteer applications.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {pendingMentors.map(men => {
              const isExpanded = expandedId === men.id;
              return (
                <div key={men.id} className="border border-border-custom dark:border-slate-800 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                        {men.full_name?.[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{men.full_name}</h4>
                        <p className="text-[10px] text-slate-400">{men.mentor_industry} • {men.mentor_experience_years} Years Exp</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : men.id)}
                      className="inline-flex items-center gap-1 text-xs text-primary-blue"
                    >
                      {isExpanded ? <>Collapse <ChevronUp className="h-4 w-4" /></> : <>Expand Details <ChevronDown className="h-4 w-4" /></>}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border-custom dark:border-slate-800 pt-4 space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <p><strong>Specializations tags:</strong> {men.mentor_specializations}</p>
                        <p><strong>Availability Hours:</strong> {men.mentor_availability}</p>
                        <p><strong>Languages Spoken:</strong> {men.mentor_languages}</p>
                        <p><strong>Certifications:</strong> {men.mentor_certifications}</p>
                      </div>

                      <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                        <p className="font-bold text-slate-500">Mentorship Style:</p>
                        <p className="italic">"{men.mentor_style}"</p>
                      </div>

                      <div className="space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                        <p className="font-bold text-slate-500">Motivation to Mentor Jhang's Youth:</p>
                        <p className="italic">"{men.mentor_motivation}"</p>
                      </div>

                      {/* Mentor Review Section */}
                      <div className="border-t border-border-custom dark:border-slate-800 pt-4 space-y-4">
                        <h4 className="font-bold text-slate-600 dark:text-slate-350">Board Review Action</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Define / Confirm Specializations tags"
                            placeholder="e.g. Next.js, Figma, SEO"
                            value={mentorSpecs || men.mentor_specializations || ''}
                            onChange={(e) => setMentorSpecs(e.target.value)}
                          />
                          <Input
                            label="Board Notes (For internal reference)"
                            placeholder="e.g. Expert designer verified via Upwork profile."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="primary"
                            size="sm"
                            className="px-4"
                            onClick={() => handleApproveMentor(men.id, true)}
                          >
                            Approve Mentor
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 px-4"
                            onClick={() => handleApproveMentor(men.id, false)}
                          >
                            Reject Application
                          </Button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
            {pendingMentors.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No pending mentor applications.</p>
            )}
          </div>
        )}
      </Card>

    </div>
  );
};
