import React, { useEffect, useState } from 'react';
import { learningService } from '../../services/learningService';
import type { Course, Resource } from '../../services/learningService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageLearning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'resources'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms management
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: 'AI & Automation',
    instructor: '',
    duration: '',
    difficulty: 'Beginner' as Course['difficulty'],
    youtube_video: '',
    notes: '',
    downloads: '',
    status: 'Active' as Course['status'],
    thumbnail: ''
  });

  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resourceData, setResourceData] = useState({
    title: '',
    description: '',
    type: 'PDF',
    category: 'AI & Automation',
    url: '',
    download_path: '',
    status: 'Active' as Resource['status']
  });

  const categories = [
    'AI & Automation',
    'AI Development',
    'Automation',
    'Content Creation',
    'Monetization',
    'Digital Marketing',
    'Business',
    'Creator Economy'
  ];

  const resourceTypes = [
    'Book',
    'PDF',
    'Template',
    'Prompt Pack',
    'AI Tool',
    'Software',
    'Extension',
    'Website',
    'Useful Link',
    'Download'
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'courses') {
        const data = await learningService.getAdminCourses();
        setCourses(data);
      } else {
        const data = await learningService.getAdminResources();
        setResources(data);
      }
    } catch (err) {
      toast.error('Failed to load learning assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // COURSE METHODS
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await learningService.updateCourse(editingCourse.id, courseData);
        toast.success('Course updated.');
      } else {
        await learningService.createCourse(courseData);
        toast.success('Course created.');
      }
      setShowCourseForm(false);
      setEditingCourse(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to save course.');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await learningService.deleteCourse(id);
      toast.success('Course deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete course.');
    }
  };

  // RESOURCE METHODS
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await learningService.updateResource(editingResource.id, resourceData);
        toast.success('Resource updated.');
      } else {
        await learningService.createResource(resourceData);
        toast.success('Resource created.');
      }
      setShowResourceForm(false);
      setEditingResource(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to save resource.');
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await learningService.deleteResource(id);
      toast.success('Resource deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete resource.');
    }
  };

  return (
    <div className="space-y-8 p-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl font-black text-slate-800 dark:text-white">
            Manage Learning Center
          </h1>
          <p className="text-xs text-slate-400">
            Publish video masterclasses, prompt packs, books, templates, and utilities for community use.
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === 'courses' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingCourse(null);
                setCourseData({
                  title: '',
                  description: '',
                  category: 'AI & Automation',
                  instructor: '',
                  duration: '',
                  difficulty: 'Beginner',
                  youtube_video: '',
                  notes: '',
                  downloads: '',
                  status: 'Active',
                  thumbnail: ''
                });
                setShowCourseForm(true);
              }}
            >
              <Plus className="h-4.5 w-4.5 mr-1" /> Add Video Course
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingResource(null);
                setResourceData({
                  title: '',
                  description: '',
                  type: 'PDF',
                  category: 'AI & Automation',
                  url: '',
                  download_path: '',
                  status: 'Active'
                });
                setShowResourceForm(true);
              }}
            >
              <Plus className="h-4.5 w-4.5 mr-1" /> Add Resource Vault Link
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-custom dark:border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 font-poppins font-bold text-sm border-b-2 transition-all ${
            activeTab === 'courses'
              ? 'border-primary-blue text-primary-blue dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white'
          }`}
        >
          Courses Catalog
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2.5 font-poppins font-bold text-sm border-b-2 transition-all ${
            activeTab === 'resources'
              ? 'border-primary-blue text-primary-blue dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white'
          }`}
        >
          Resources Vault
        </button>
      </div>

      {/* COURSE FORM MODAL */}
      {showCourseForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-poppins font-bold text-md text-slate-700 dark:text-slate-200 mb-6">
              {editingCourse ? 'Edit Video Course' : 'Create Video Course'}
            </h3>
            
            <form onSubmit={handleSaveCourse} className="space-y-4">
              <Input
                label="Course Title"
                placeholder="e.g. ChatGPT Prompt Engineering Mastery"
                required
                value={courseData.title}
                onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={courseData.category}
                    onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Difficulty</label>
                  <select
                    value={courseData.difficulty}
                    onChange={(e) => setCourseData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All">All Levels</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Instructor Name"
                    placeholder="e.g. M. Haseeb"
                    required
                    value={courseData.instructor}
                    onChange={(e) => setCourseData(prev => ({ ...prev, instructor: e.target.value }))}
                  />
                </div>
                <Input
                  label="Duration (e.g. 2h 15m)"
                  placeholder="2h 15m"
                  required
                  value={courseData.duration}
                  onChange={(e) => setCourseData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>

              <Input
                label="YouTube Video Link / ID *"
                placeholder="https://www.youtube.com/watch?v=..."
                required
                value={courseData.youtube_video}
                onChange={(e) => setCourseData(prev => ({ ...prev, youtube_video: e.target.value }))}
              />

              <Input
                label="Thumbnail Image URL (Optional)"
                placeholder="e.g. /assets/course1.jpg"
                value={courseData.thumbnail}
                onChange={(e) => setCourseData(prev => ({ ...prev, thumbnail: e.target.value }))}
              />

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline the course syllabus and lesson details..."
                  value={courseData.description}
                  onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Course Notes (Key Steps)</label>
                <textarea
                  rows={4}
                  placeholder="Paste study notes or code snippets..."
                  value={courseData.notes}
                  onChange={(e) => setCourseData(prev => ({ ...prev, notes: e.target.value }))}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Downloads Resource URLs (One entry per line, Format: Label:URL)</label>
                <textarea
                  rows={2}
                  placeholder="PDF Handout:https://example.com/slide.pdf"
                  value={courseData.downloads}
                  onChange={(e) => setCourseData(prev => ({ ...prev, downloads: e.target.value }))}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Catalog Visibility Status</label>
                <select
                  value={courseData.status}
                  onChange={(e) => setCourseData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="Active">Active (Publicly Visible)</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setShowCourseForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  <Save className="h-4.5 w-4.5 mr-1" /> Save Course
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* RESOURCE FORM MODAL */}
      {showResourceForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-poppins font-bold text-md text-slate-700 dark:text-slate-200 mb-6">
              {editingResource ? 'Edit Resource Vault Entry' : 'Create Resource Vault Entry'}
            </h3>
            
            <form onSubmit={handleSaveResource} className="space-y-4">
              <Input
                label="Resource Title"
                placeholder="e.g. 100+ Advanced Midjourney Prompts"
                required
                value={resourceData.title}
                onChange={(e) => setResourceData(prev => ({ ...prev, title: e.target.value }))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Resource Type</label>
                  <select
                    value={resourceData.type}
                    onChange={(e) => setResourceData(prev => ({ ...prev, type: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {resourceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={resourceData.category}
                    onChange={(e) => setResourceData(prev => ({ ...prev, category: e.target.value }))}
                    className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <Input
                label="Public Access URL (Optional)"
                placeholder="https://example.com/resource"
                value={resourceData.url}
                onChange={(e) => setResourceData(prev => ({ ...prev, url: e.target.value }))}
              />

              <Input
                label="Download Path / Local Asset Path (Optional)"
                placeholder="/uploads/resources/file.pdf"
                value={resourceData.download_path}
                onChange={(e) => setResourceData(prev => ({ ...prev, download_path: e.target.value }))}
              />

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline what this asset contains and how members should use it..."
                  value={resourceData.description}
                  onChange={(e) => setResourceData(prev => ({ ...prev, description: e.target.value }))}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Catalog Visibility Status</label>
                <select
                  value={resourceData.status}
                  onChange={(e) => setResourceData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="Active">Active (Publicly Visible)</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setShowResourceForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  <Save className="h-4.5 w-4.5 mr-1" /> Save Resource
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* LISTINGS DISPLAY */}
      <Card className="p-6">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-8">Loading learning assets...</p>
        ) : activeTab === 'courses' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-border-custom dark:divide-slate-800">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom dark:divide-slate-800 font-medium">
                {courses.map(course => (
                  <tr key={course.id} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-bold">{course.title}</td>
                    <td className="py-3 px-4">{course.instructor}</td>
                    <td className="py-3 px-4">{course.category}</td>
                    <td className="py-3 px-4">{course.duration}</td>
                    <td className="py-3 px-4">{course.difficulty}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        course.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setCourseData({
                            title: course.title,
                            description: course.description,
                            category: course.category,
                            instructor: course.instructor,
                            duration: course.duration,
                            difficulty: course.difficulty,
                            youtube_video: course.youtube_video,
                            notes: course.notes || '',
                            downloads: course.downloads || '',
                            status: course.status,
                            thumbnail: course.thumbnail || ''
                          });
                          setShowCourseForm(true);
                        }}
                        className="p-1 text-primary-blue hover:bg-primary-blue/5 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-1 text-red-500 hover:bg-red-500/5 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">No video courses cataloged.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-border-custom dark:divide-slate-800">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">URL / Path</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom dark:divide-slate-800 font-medium">
                {resources.map(res => (
                  <tr key={res.id} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-bold">{res.title}</td>
                    <td className="py-3 px-4">{res.type}</td>
                    <td className="py-3 px-4">{res.category}</td>
                    <td className="py-3 px-4 truncate max-w-[200px]">{res.url || res.download_path}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        res.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingResource(res);
                          setResourceData({
                            title: res.title,
                            description: res.description,
                            type: res.type,
                            category: res.category,
                            url: res.url || '',
                            download_path: res.download_path || '',
                            status: res.status
                          });
                          setShowResourceForm(true);
                        }}
                        className="p-1 text-primary-blue hover:bg-primary-blue/5 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="p-1 text-red-500 hover:bg-red-500/5 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {resources.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">No resources cataloged.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  );
};
