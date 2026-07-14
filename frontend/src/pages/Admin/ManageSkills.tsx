import React, { useEffect, useState } from 'react';
import { skillsService } from '../../services/skillsService';
import type { SkillCategory, SkillItem } from '../../services/skillsService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Edit, Trash2, CheckCircle, XCircle, FolderPlus, Award, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageSkills: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create Category States
  const [catName, setCatName] = useState('');
  const [catOrder, setCatOrder] = useState('1');
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  
  // Edit / Create Skill States
  const [skillName, setSkillName] = useState('');
  const [skillOrder, setSkillOrder] = useState('1');
  const [selectedCatId, setSelectedCatId] = useState('');
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await skillsService.getAdminSkills();
      setCategories(data);
      if (data.length > 0 && !selectedCatId) {
        setSelectedCatId(data[0].id);
      }
    } catch (err) {
      toast.error('Failed to load skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // CATEGORY OPERATIONS
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      if (editingCategory) {
        await skillsService.updateCategory(editingCategory.id, {
          name: catName,
          display_order: parseInt(catOrder) || 1
        });
        toast.success('Category updated successfully.');
      } else {
        await skillsService.createCategory({
          name: catName,
          display_order: parseInt(catOrder) || 1
        });
        toast.success('Category created successfully.');
      }
      setCatName('');
      setCatOrder('1');
      setEditingCategory(null);
      fetchSkills();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save category.');
    }
  };

  const handleToggleCategoryStatus = async (cat: SkillCategory) => {
    try {
      const nextStatus = cat.status === 'Active' ? 'Disabled' : 'Active';
      await skillsService.updateCategory(cat.id, { status: nextStatus });
      toast.success(`Category set to ${nextStatus}`);
      fetchSkills();
    } catch (err) {
      toast.error('Failed to toggle status.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? All sub-skills will be unlinked.')) return;
    try {
      await skillsService.deleteCategory(id);
      toast.success('Category deleted.');
      fetchSkills();
    } catch (err) {
      toast.error('Failed to delete category.');
    }
  };

  // SKILL OPERATIONS
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim() || !selectedCatId) return;

    try {
      if (editingSkill) {
        await skillsService.updateSkill(editingSkill.id, {
          name: skillName,
          categoryId: selectedCatId,
          display_order: parseInt(skillOrder) || 1
        });
        toast.success('Skill updated.');
      } else {
        await skillsService.createSkill({
          name: skillName,
          categoryId: selectedCatId,
          display_order: parseInt(skillOrder) || 1
        });
        toast.success('Skill created.');
      }
      setSkillName('');
      setSkillOrder('1');
      setEditingSkill(null);
      fetchSkills();
    } catch (err) {
      toast.error('Failed to save skill.');
    }
  };

  const handleToggleSkillStatus = async (skill: SkillItem) => {
    try {
      const nextStatus = skill.status === 'Active' ? 'Disabled' : 'Active';
      await skillsService.updateSkill(skill.id, { status: nextStatus });
      toast.success(`Skill set to ${nextStatus}`);
      fetchSkills();
    } catch (err) {
      toast.error('Failed to toggle status.');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await skillsService.deleteSkill(id);
      toast.success('Skill deleted.');
      fetchSkills();
    } catch (err) {
      toast.error('Failed to delete skill.');
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl font-black text-slate-800 dark:text-white">
            Manage Skills Database
          </h1>
          <p className="text-xs text-slate-400">
            Define categories, reorder skills, and manage tags that members select for profile filters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Category Form & List */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6">
            <h3 className="font-poppins font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-4">
              <FolderPlus className="h-4.5 w-4.5 text-primary-green" />
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>
            
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Category Name"
                    placeholder="e.g. AI & Automation"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="Order"
                    type="number"
                    value={catOrder}
                    onChange={(e) => setCatOrder(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {editingCategory && (
                  <Button variant="ghost" size="sm" type="button" onClick={() => {
                    setEditingCategory(null);
                    setCatName('');
                    setCatOrder('1');
                  }}>
                    Cancel
                  </Button>
                )}
                <Button variant="primary" size="sm" type="submit">
                  <Save className="h-4 w-4 mr-1.5" />
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-poppins font-bold text-sm text-slate-700 dark:text-slate-200">
              Active Categories List
            </h3>

            {loading ? (
              <div className="space-y-2 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded" />)}
              </div>
            ) : categories.length > 0 ? (
              <div className="divide-y divide-border-custom dark:divide-slate-800">
                {categories.map(cat => (
                  <div key={cat.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{cat.name}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                          Order: {cat.display_order}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">Contains {cat.skills?.length || 0} sub-skills</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleCategoryStatus(cat)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          cat.status === 'Active' 
                            ? 'border-green-500/20 bg-green-500/5 text-green-500 hover:bg-green-500/10'
                            : 'border-slate-500/20 bg-slate-500/5 text-slate-400 hover:bg-slate-500/10'
                        }`}
                        title="Toggle status"
                      >
                        {cat.status === 'Active' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setCatName(cat.name);
                          setCatOrder(cat.display_order.toString());
                        }}
                        className="p-1.5 rounded-lg border border-border-custom bg-white hover:bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors"
                        title="Edit name/order"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No categories created yet.</p>
            )}
          </Card>
        </div>

        {/* Right: Skills Form & Grid */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6">
            <h3 className="font-poppins font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-4">
              <Award className="h-4.5 w-4.5 text-primary-blue dark:text-blue-400" />
              {editingSkill ? 'Edit Skill Tag' : 'Create Skill Tag'}
            </h3>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Select Category
                </label>
                <select
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                >
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Skill Tag Name"
                    placeholder="e.g. Next.js, OpenAI API"
                    required
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="Order"
                    type="number"
                    value={skillOrder}
                    onChange={(e) => setSkillOrder(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {editingSkill && (
                  <Button variant="ghost" size="sm" type="button" onClick={() => {
                    setEditingSkill(null);
                    setSkillName('');
                    setSkillOrder('1');
                  }}>
                    Cancel
                  </Button>
                )}
                <Button variant="primary" size="sm" type="submit">
                  <Save className="h-4 w-4 mr-1.5" />
                  {editingSkill ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Card>

          {/* List of Skills inside selected category */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4 border-b border-border-custom dark:border-slate-800 pb-3">
              <h3 className="font-poppins font-bold text-sm text-slate-700 dark:text-slate-200">
                Skills Catalog Listing
              </h3>
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="rounded-lg border border-border-custom bg-white px-2 py-1 text-xs text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>

            {!selectedCatId ? (
              <p className="text-xs text-slate-400 text-center py-4">Create a category first.</p>
            ) : (
              <div className="divide-y divide-border-custom dark:divide-slate-800">
                {(categories.find(c => c.id === selectedCatId)?.skills || []).map(skill => (
                  <div key={skill.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-700 dark:text-slate-200">{skill.name}</span>
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-850 px-1 py-0.5 rounded text-slate-400">
                        Order: {skill.display_order}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleSkillStatus(skill)}
                        className={`p-1 rounded-lg border transition-colors ${
                          skill.status === 'Active' 
                            ? 'border-green-500/20 bg-green-500/5 text-green-500 hover:bg-green-500/10'
                            : 'border-slate-500/20 bg-slate-500/5 text-slate-400 hover:bg-slate-500/10'
                        }`}
                      >
                        {skill.status === 'Active' ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingSkill(skill);
                          setSkillName(skill.name);
                          setSkillOrder(skill.display_order.toString());
                        }}
                        className="p-1 rounded-lg border border-border-custom bg-white hover:bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-1 rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {(categories.find(c => c.id === selectedCatId)?.skills || []).length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No skill tags under this category yet.</p>
                )}
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};
