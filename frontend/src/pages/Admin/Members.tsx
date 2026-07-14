import React, { useEffect, useState } from 'react';
import { memberService } from '../../services/memberService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Search, ShieldCheck, UserX, UserCheck, 
  Trash2, FileSpreadsheet, Eye, Filter 
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Members: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState(initialFilter === 'unverified' ? 'Pending' : 'All');
  const [roles, setRoles] = useState<any[]>([]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await memberService.getAdminMembers();
      setMembers(data || []);
      setFilteredMembers(data || []);
      
      const dbRoles = await memberService.getRoles();
      setRoles(dbRoles || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to load members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Run filters whenever dependencies change
  useEffect(() => {
    let result = [...members];

    // 1. Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.full_name?.toLowerCase().includes(term) ||
        m.father_name?.toLowerCase().includes(term) ||
        m.member_id?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term) ||
        m.whatsapp?.toLowerCase().includes(term) ||
        m.occupation?.toLowerCase().includes(term)
      );
    }

    // 2. District filter
    if (districtFilter !== 'All') {
      result = result.filter(m => m.district === districtFilter);
    }

    // 3. Status filter
    if (statusFilter === 'Verified') {
      result = result.filter(m => m.is_verified === true);
    } else if (statusFilter === 'Pending') {
      result = result.filter(m => m.is_verified === false);
    } else if (statusFilter === 'Suspended') {
      result = result.filter(m => m.is_active === false);
    }

    setFilteredMembers(result);
  }, [searchTerm, districtFilter, statusFilter, members]);

  const toggleVerification = async (id: string, currentStatus: boolean) => {
    try {
      await memberService.toggleVerifyMember(id);
      toast.success(`Member card ${!currentStatus ? 'verified' : 'unverified'} successfully!`);
      setMembers((prev: any[]) => prev.map((m: any) => m.id === id ? { ...m, is_verified: !currentStatus } : m));
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update status.');
    }
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      await memberService.toggleSuspendMember(id);
      toast.success(`Member profile ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      setMembers((prev: any[]) => prev.map((m: any) => m.id === id ? { ...m, is_active: !currentStatus } : m));
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update status.');
    }
  };

  const deleteMember = async (id: string) => {
    const confirmDelete = window.confirm('Are you absolutely sure you want to delete this user profile? This action is irreversible.');
    if (!confirmDelete) return;

    try {
      await memberService.deleteMember(id);
      toast.success('Member profile deleted successfully.');
      setMembers((prev: any[]) => prev.filter((m: any) => m.id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete member.');
    }
  };

  const exportToCSV = () => {
    const headers = ['Member ID', 'Full Name', 'Father Name', 'Email', 'WhatsApp', 'District', 'Education', 'Occupation', 'Joined At', 'Verified', 'Active'];
    const rows = filteredMembers.map((m: any) => [
      m.member_id || '',
      m.full_name || '',
      m.father_name || '',
      m.email || '',
      m.whatsapp || '',
      m.district || '',
      m.education || '',
      m.occupation || '',
      m.joined_at || '',
      m.is_verified ? 'YES' : 'NO',
      m.is_active ? 'YES' : 'NO'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r: any) => r.map((val: any) => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EJ_Members_${Date.now()}.csv`);
    link.click();
    toast.success('Database exported successfully to CSV.');
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
      {/* Controls Card */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by name, ID, email, occupation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="mb-0"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* District Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-body dark:text-slate-400 font-medium flex items-center gap-1">
                <Filter className="h-3 w-3" /> Tehsil:
              </span>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="rounded-xl border border-border-custom bg-white px-3 py-2 text-xs text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="All">All Districts</option>
                <option value="Jhang">Jhang</option>
                <option value="Shorkot">Shorkot</option>
                <option value="18 Hazari">18 Hazari</option>
                <option value="Ahmadpur Sial">Ahmadpur Sial</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-body dark:text-slate-400 font-medium flex items-center gap-1">
                <Filter className="h-3 w-3" /> Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-border-custom bg-white px-3 py-2 text-xs text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Verified">Verified Only</option>
                <option value="Pending">Pending Approvals</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              leftIcon={<FileSpreadsheet className="h-4 w-4" />}
            >
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Members List Table Card */}
      <Card className="p-6 overflow-hidden">
        <div className="overflow-x-auto">
          {filteredMembers.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-custom dark:border-slate-800 text-slate-400 uppercase font-poppins">
                  <th className="pb-3 font-semibold">Member</th>
                  <th className="pb-3 font-semibold">Tehsil</th>
                  <th className="pb-3 font-semibold">WhatsApp</th>
                  <th className="pb-3 font-semibold">Occupation</th>
                  <th className="pb-3 font-semibold">Community Role</th>
                  <th className="pb-3 font-semibold text-center">Verified</th>
                  <th className="pb-3 font-semibold text-center">Active</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/50 dark:divide-slate-800/50">
                {filteredMembers.map((member: any) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 uppercase">
                          {member.profile_photo ? (
                            <img src={member.profile_photo} alt={member.full_name} className="h-full w-full rounded-full object-cover" />
                          ) : (
                            member.full_name?.[0]
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-heading dark:text-slate-200">{member.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{member.member_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-text-body dark:text-slate-400">{member.district}</td>
                    <td className="py-4 font-mono text-text-body dark:text-slate-400">{member.whatsapp}</td>
                    <td className="py-4 text-text-body dark:text-slate-400">{member.occupation}</td>
                    <td className="py-4">
                      <select
                        value={member.roleId || ''}
                        onChange={async (e) => {
                          const newRoleId = e.target.value;
                          if (!newRoleId) return;
                          try {
                            await memberService.assignRole(member.id, newRoleId);
                            toast.success('Role updated successfully.');
                            setMembers((prev: any[]) => prev.map((m: any) => m.id === member.id ? { ...m, roleId: newRoleId } : m));
                          } catch (err) {
                            toast.error('Failed to assign role.');
                          }
                        }}
                        className="rounded-xl border border-border-custom bg-white px-2 py-1 text-[11px] text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:outline-none max-w-[140px] font-poppins"
                      >
                        <option value="" disabled>Select Role</option>
                        {roles.map((r: any) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => toggleVerification(member.id, member.is_verified)}
                        className={`rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                          member.is_verified 
                            ? 'text-green-500 hover:text-green-600 bg-green-50 dark:bg-green-950/20' 
                            : 'text-slate-350 hover:text-slate-450 bg-slate-50 dark:bg-slate-900'
                        }`}
                        title={member.is_verified ? 'Click to Unverify' : 'Click to Verify'}
                      >
                        <ShieldCheck className="h-5 w-5" />
                      </button>
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => toggleActiveStatus(member.id, member.is_active)}
                        className={`rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                          member.is_active
                            ? 'text-green-500 hover:text-green-600 bg-green-50 dark:bg-green-950/20'
                            : 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/20'
                        }`}
                        title={member.is_active ? 'Click to Suspend' : 'Click to Activate'}
                      >
                        {member.is_active ? <UserCheck className="h-5 w-5" /> : <UserX className="h-5 w-5" />}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/member/${member.member_id}`}>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Eye className="h-4.5 w-4.5" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20" 
                          onClick={() => deleteMember(member.id)}
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-450 dark:text-slate-550">
              No members found matching the search filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
