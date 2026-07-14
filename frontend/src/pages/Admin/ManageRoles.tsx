import React, { useEffect, useState } from 'react';
import { memberService } from '../../services/memberService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Shield, ArrowUp, ArrowDown, Trash2, Edit2, X, 
  Crown, Award, Users, ShieldCheck, Code, Palette, Megaphone, 
  TrendingUp, GraduationCap, HeartHandshake, Calendar, UserCheck, 
  School, Briefcase, Heart, Globe, User, Layers, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// Available Lucide Icons for selection
const ICON_OPTIONS = {
  Crown, Award, Users, Shield, ShieldCheck, Code, Palette, 
  Megaphone, TrendingUp, GraduationCap, HeartHandshake, Calendar, 
  UserCheck, School, Briefcase, Heart, Globe, User, Layers, Sparkles
};

export const ManageRoles: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Community Roles',
    icon_name: 'User',
    badge_name: '',
    gradient_css: 'from-slate-900 via-blue-900 to-slate-900',
    accent_color: '#3b82f6',
    border_style: 'border-slate-800',
    bg_pattern: 'none',
    design_template: 'standard',
    badge_style: 'standard'
  });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await memberService.getRoles();
      setRoles(data || []);
    } catch (err) {
      console.error('Failed to load roles:', err);
      toast.error('Failed to load community roles database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Community Roles',
      icon_name: 'User',
      badge_name: '',
      gradient_css: 'from-slate-900 via-blue-900 to-slate-900',
      accent_color: '#3b82f6',
      border_style: 'border-slate-800',
      bg_pattern: 'none',
      design_template: 'standard',
      badge_style: 'standard'
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEditClick = (role: any) => {
    setIsEditing(true);
    setEditingId(role.id);
    setFormData({
      name: role.name,
      category: role.category,
      icon_name: role.badge?.icon_name || 'User',
      badge_name: role.badge?.badge_name || '',
      gradient_css: role.theme?.gradient_css || 'from-slate-900 via-blue-900 to-slate-900',
      accent_color: role.theme?.accent_color || '#3b82f6',
      border_style: role.theme?.border_style || 'border-slate-800',
      bg_pattern: role.theme?.bg_pattern || 'none',
      design_template: role.card?.design_template || 'standard',
      badge_style: role.card?.badge_style || 'standard'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Role name is required.');
      return;
    }

    try {
      if (isEditing && editingId) {
        await memberService.updateRole(editingId, formData);
        toast.success('Role updated successfully.');
      } else {
        await memberService.createRole({
          ...formData,
          display_order: roles.length
        });
        toast.success('Role created successfully.');
      }
      resetForm();
      fetchRoles();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this role? Members assigned to this role will default to unassigned.')) {
      return;
    }

    try {
      await memberService.deleteRole(id);
      toast.success('Role deleted successfully.');
      fetchRoles();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to delete role.');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === roles.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newRoles = [...roles];
    
    // Swap items
    const temp = newRoles[index];
    newRoles[index] = newRoles[targetIndex];
    newRoles[targetIndex] = temp;

    // Build orders list
    const orders = newRoles.map((role, idx) => ({
      id: role.id,
      display_order: idx
    }));

    // Update locally immediately for responsiveness
    setRoles(newRoles);

    try {
      await memberService.reorderRoles(orders);
      toast.success('Display hierarchy updated successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to persist display priority reordering.');
      fetchRoles(); // Revert back
    }
  };

  const SelectedIcon = (ICON_OPTIONS as any)[formData.icon_name] || User;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-border-custom dark:border-slate-800 pb-4">
        <div>
          <h1 className="font-poppins text-2xl font-black text-heading dark:text-white tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary-blue dark:text-blue-400" /> Manage Community Roles
          </h1>
          <p className="text-xs text-text-body dark:text-slate-400 mt-1">
            Configure dynamic hierarchy organization structure, printable layout templates, themes, and badges.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Panel */}
        <Card className="lg:col-span-5 p-6 space-y-6 glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800">
          <h2 className="font-poppins text-sm font-bold text-heading dark:text-white border-b border-border-custom dark:border-slate-800 pb-3">
            {isEditing ? 'Modify Selected Role' : 'Create Custom Role'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Role Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Creative Lead, Core Committee"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heading dark:text-slate-200 mb-1.5 font-poppins uppercase tracking-wider">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-xs text-heading transition-all focus:border-primary-blue focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-poppins"
                >
                  <option value="Leadership">Leadership Team</option>
                  <option value="Department Leads">Department Leads</option>
                  <option value="Community Roles">Community Roles</option>
                  <option value="Members">Members</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-heading dark:text-slate-200 mb-1.5 font-poppins uppercase tracking-wider">
                  Lucide Icon
                </label>
                <select
                  name="icon_name"
                  value={formData.icon_name}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-xs text-heading transition-all focus:border-primary-blue focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-poppins"
                >
                  {Object.keys(ICON_OPTIONS).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Badge Description Name (Optional)"
              name="badge_name"
              type="text"
              value={formData.badge_name}
              onChange={handleInputChange}
              placeholder="e.g. OFFICIAL LEADER, SENIOR TEAM"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Accent Theme Color (Hex)"
                name="accent_color"
                type="color"
                value={formData.accent_color}
                onChange={handleInputChange}
              />

              <div>
                <label className="block text-xs font-bold text-heading dark:text-slate-200 mb-1.5 font-poppins uppercase tracking-wider">
                  PVC Card Design Template
                </label>
                <select
                  name="design_template"
                  value={formData.design_template}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-xs text-heading transition-all focus:border-primary-blue focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-poppins"
                >
                  <option value="standard">Standard Member (Blue/Green)</option>
                  <option value="volunteer">Volunteer Coordinator (Teal)</option>
                  <option value="mentor">Expert Mentor (Premium Gold)</option>
                  <option value="leadership">Executive Officer (Royal Navy/Gold)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-heading dark:text-slate-200 mb-1.5 font-poppins uppercase tracking-wider">
                Tailwind Gradient Header Banner
              </label>
              <input
                type="text"
                name="gradient_css"
                value={formData.gradient_css}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-xs text-heading transition-all focus:border-primary-blue focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-poppins"
                placeholder="from-slate-900 via-indigo-900 to-slate-900"
              />
            </div>

            {/* Live Preview block inside form */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-border-custom dark:border-slate-800 space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Live Visual Preview</span>
              <div className="flex items-center gap-3">
                <div 
                  className="p-2.5 rounded-xl text-white flex items-center justify-center shadow-md"
                  style={{ backgroundColor: formData.accent_color }}
                >
                  <SelectedIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[8px] font-bold uppercase tracking-wider block" style={{ color: formData.accent_color }}>
                    {formData.category}
                  </span>
                  <h4 className="text-xs font-black text-heading dark:text-white leading-tight font-poppins mt-0.5">
                    {formData.name || 'Untitled Role'} Badge
                  </h4>
                </div>
              </div>
            </div>

            {/* Actions button */}
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" className="flex-1">
                {isEditing ? 'Save Changes' : 'Create Role'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm} className="px-3">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Right List Panel */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-poppins text-sm font-bold text-heading dark:text-white pb-1">
            Existing Roles & Display Priorities ({roles.length})
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse bg-white dark:bg-slate-900 rounded-2xl border border-border-custom dark:border-slate-800" />
              ))}
            </div>
          ) : roles.length === 0 ? (
            <Card className="p-8 text-center text-slate-400 dark:bg-slate-900 border-dashed border-border-custom dark:border-slate-800">
              No community roles mapped. Build one using the form on the left.
            </Card>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {roles.map((role, index) => {
                const IconComponent = (ICON_OPTIONS as any)[role.badge?.icon_name] || User;
                
                return (
                  <Card 
                    key={role.id}
                    className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-slate-900 border-border-custom dark:border-slate-800/80 hover:border-primary-blue dark:hover:border-blue-500/30 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {/* Priority Controls */}
                      <div className="flex flex-col gap-1 print:hidden">
                        <button 
                          disabled={index === 0}
                          onClick={() => handleMoveOrder(index, 'up')}
                          className="p-0.5 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          disabled={index === roles.length - 1}
                          onClick={() => handleMoveOrder(index, 'down')}
                          className="p-0.5 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Visual design representation badge */}
                      <div 
                        className="p-2.5 rounded-xl text-white flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: role.theme?.accent_color || '#3b82f6' }}
                      >
                        <IconComponent className="h-4.5 w-4.5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-poppins text-xs font-bold text-heading dark:text-white leading-tight">
                            {role.name}
                          </h4>
                          <span className="text-[8px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                            {role.category}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1 uppercase font-poppins tracking-wider font-semibold">
                          Card Design: {role.card?.design_template || 'Standard'} • Priority: #{role.display_order}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditClick(role)}
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-blue transition-all"
                        title="Edit Details"
                      >
                        <Edit2 className="h-4.5 w-4.5" />
                      </button>
                      {role.key !== 'member' && role.key !== 'volunteer' && role.key !== 'mentor' && (
                        <button 
                          onClick={() => handleDelete(role.id)}
                          className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 transition-all"
                          title="Delete Role"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
