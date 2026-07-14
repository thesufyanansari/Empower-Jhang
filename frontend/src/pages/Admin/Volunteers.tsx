import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldAlert, Award, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';

export const Volunteers: React.FC = () => {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [assignId, setAssignId] = useState<string | null>(null);
  const [dept, setDept] = useState('');
  const [role, setRole] = useState('');

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getVolunteers();
      setVolunteers(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load volunteers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleReview = async (status: 'Approved' | 'Rejected') => {
    if (!reviewId) return;
    try {
      await settingsService.reviewVolunteer(reviewId, status, reviewNotes);
      toast.success(`Volunteer status updated to ${status}.`);
      setReviewId(null);
      setReviewNotes('');
      fetchVolunteers();
    } catch (err) {
      toast.error('Failed to update volunteer review.');
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignId) return;
    try {
      await settingsService.assignVolunteer(assignId, dept, role);
      toast.success('Volunteer department and role assigned successfully.');
      setAssignId(null);
      setDept('');
      setRole('');
      fetchVolunteers();
    } catch (err) {
      toast.error('Failed to assign volunteer roles.');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'WhatsApp', 'District', 'Department', 'Role', 'Status'];
    const rows = volunteers.map(v => [
      v.full_name,
      v.email,
      v.whatsapp,
      v.district,
      v.volunteer_department || 'N/A',
      v.volunteer_role || 'N/A',
      v.volunteer_status || 'Pending'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `empower_jhang_volunteers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <h2 className="font-poppins text-lg font-bold text-heading dark:text-white">Volunteer Force Management</h2>
          <p className="text-xs text-slate-400 mt-1">Approve roles, assign departments, and export statistics.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV} leftIcon={<FileDown className="h-4 w-4" />}>
          Export CSV
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-custom dark:border-slate-800 text-slate-400 uppercase font-poppins">
              <th className="p-4 font-semibold">Candidate Name</th>
              <th className="p-4 font-semibold">Tehsil</th>
              <th className="p-4 font-semibold">Current Department</th>
              <th className="p-4 font-semibold">Assigned Role</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-custom/50 dark:divide-slate-800/50">
            {volunteers.length > 0 ? (
              volunteers.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <td className="p-4 font-semibold text-heading dark:text-slate-200">{v.full_name}</td>
                  <td className="p-4 text-text-body dark:text-slate-400">{v.district}</td>
                  <td className="p-4 text-text-body dark:text-slate-400 font-medium">{v.volunteer_department || 'Unassigned'}</td>
                  <td className="p-4 text-text-body dark:text-slate-400 font-medium">{v.volunteer_role || 'Unassigned'}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      v.volunteer_status === 'Approved' 
                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : v.volunteer_status === 'Rejected'
                        ? 'bg-red-500/10 text-red-600 border-red-500/20'
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {v.volunteer_status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1.5 print:hidden">
                    {v.volunteer_status !== 'Approved' && (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-600/90 border-none text-[10px] py-1 px-2.5"
                        onClick={() => setReviewId(v.id)}
                      >
                        Review
                      </Button>
                    )}
                    {v.volunteer_status === 'Approved' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-[10px] py-1 px-2.5"
                        onClick={() => {
                          setAssignId(v.id);
                          setDept(v.volunteer_department || '');
                          setRole(v.volunteer_role || '');
                        }}
                      >
                        Assign
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400 font-poppins">
                  No volunteer records or candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Review Modal */}
      {reviewId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4 shadow-2xl relative animate-scale-in">
            <h3 className="font-poppins text-md font-bold text-heading dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" /> Review Volunteer Candidate
            </h3>
            <Input 
              label="Decision Notes (Optional)" 
              value={reviewNotes} 
              onChange={(e) => setReviewNotes(e.target.value)} 
              placeholder="e.g. Approved based on credentials check." 
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setReviewId(null)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="bg-red-600 hover:bg-red-600/95 border-none"
                onClick={() => handleReview('Rejected')}
              >
                Reject
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="bg-green-600 hover:bg-green-600/95 border-none"
                onClick={() => handleReview('Approved')}
              >
                Approve
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Assign Modal */}
      {assignId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4 shadow-2xl relative animate-scale-in">
            <h3 className="font-poppins text-md font-bold text-heading dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-primary-blue" /> Assign Volunteer Role
            </h3>
            <form onSubmit={handleAssign} className="space-y-4">
              <Input 
                label="Department" 
                value={dept} 
                onChange={(e) => setDept(e.target.value)} 
                placeholder="e.g. Operations, IT, Media"
                required
              />
              <Input 
                label="Assigned Role" 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                placeholder="e.g. Team Lead, Technical Specialist"
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setAssignId(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" size="sm" className="bg-primary-green hover:bg-primary-green/95 border-none">
                  Save Assignments
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
