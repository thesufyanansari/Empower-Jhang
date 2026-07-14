import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldAlert, Plus, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const Admins: React.FC = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);

  // New admin form fields
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'Editor'
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getAdmins();
      setAdmins(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load administrators.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await settingsService.createAdmin(formData);
      toast.success('Administrator account created successfully!');
      setShowAddModal(false);
      setFormData({ full_name: '', email: '', password: '', role: 'Editor' });
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create administrator account.');
    } finally {
      setAdding(false);
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
            <Shield className="h-5 w-5 text-primary-green" /> Platform Administrators
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage team roles, access permissions, and reset user sessions.</p>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          className="bg-primary-blue hover:bg-primary-blue/95 border-none"
          onClick={() => setShowAddModal(true)} 
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Administrator
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-custom dark:border-slate-800 text-slate-400 uppercase font-poppins">
              <th className="p-4 font-semibold">Administrator Name</th>
              <th className="p-4 font-semibold">Email Address</th>
              <th className="p-4 font-semibold">System Role</th>
              <th className="p-4 font-semibold">Last Login</th>
              <th className="p-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-custom/50 dark:divide-slate-800/50">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                <td className="p-4 font-semibold text-heading dark:text-slate-200">{admin.full_name}</td>
                <td className="p-4 text-text-body dark:text-slate-400">{admin.email}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                    admin.role === 'Administrator' 
                      ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      : 'bg-slate-500/10 text-slate-600 border-slate-500/20'
                  }`}>
                    {admin.role}
                  </span>
                </td>
                <td className="p-4 text-text-body dark:text-slate-400">
                  {admin.last_login ? new Date(admin.last_login).toLocaleString() : 'Never logged in'}
                </td>
                <td className="p-4 text-right">
                  <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-bold text-green-600 border border-green-500/20">
                    {admin.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4 shadow-2xl relative animate-scale-in">
            <h3 className="font-poppins text-md font-bold text-heading dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary-green" /> Add New Administrator
            </h3>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <Input 
                label="Full Name" 
                name="full_name"
                value={formData.full_name} 
                onChange={handleInputChange} 
                placeholder="e.g. Ali Raza"
                required
              />
              <Input 
                label="Email Address" 
                name="email"
                type="email"
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="e.g. ali@empowerjhang.org"
                required
              />
              <Input 
                label="Temporary Password" 
                name="password"
                type="password"
                value={formData.password} 
                onChange={handleInputChange} 
                placeholder="Minimum 6 characters"
                required
              />
              <div>
                <label className="block text-xs font-semibold text-text-body dark:text-slate-400 uppercase tracking-wider mb-2 font-poppins">
                  System Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-poppins"
                >
                  <option value="Administrator">Administrator (Full Access)</option>
                  <option value="Editor">Editor (Announcements & Links)</option>
                  <option value="Viewer">Viewer (Read-Only)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" size="sm" className="bg-primary-green hover:bg-primary-green/95 border-none" isLoading={adding}>
                  Create Admin Account
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
