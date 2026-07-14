import React, { useEffect, useState } from 'react';
import { learningService } from '../services/learningService';
import type { Resource } from '../services/learningService';
import { Card } from '../components/ui/Card';
import { 
  Search, Compass, Download, ExternalLink, 
  FileText, Globe, Terminal, Hammer, RefreshCw, BookOpen
} from 'lucide-react';

export const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const categories = [
    'All',
    'AI & Automation',
    'AI Development',
    'Automation',
    'Content Creation',
    'Monetization',
    'Digital Marketing',
    'Business',
    'Creator Economy'
  ];

  const types = [
    'All',
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

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedType !== 'All') params.type = selectedType;

      const data = await learningService.getResources(params);
      setResources(data);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResources();
  };

  const handleReset = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedType('All');
  };

  // Helper to map resource type to Lucide icons
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Book':
      case 'PDF':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'Template':
      case 'Prompt Pack':
        return <Terminal className="h-5 w-5 text-purple-500" />;
      case 'AI Tool':
      case 'Software':
        return <Hammer className="h-5 w-5 text-blue-500" />;
      default:
        return <Globe className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-section dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary-green/5 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold font-poppins border border-green-500/10">
            <Compass className="h-3.5 w-3.5" /> Resource Vault
          </div>
          <h1 className="font-poppins text-4xl font-extrabold tracking-tight text-heading dark:text-white sm:text-5xl">
            Community Resources
          </h1>
          <p className="text-sm text-text-body dark:text-slate-400">
            Handpicked templates, prompts, extensions, software links, and books compiled to support your growth.
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="p-6 max-w-4xl mx-auto glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search input */}
              <div className="md:col-span-5 relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full rounded-xl border border-border-custom bg-white pl-10 pr-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
                <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>

              {/* Category selector */}
              <div className="md:col-span-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                  ))}
                </select>
              </div>

              {/* Type selector */}
              <div className="md:col-span-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                >
                  {types.map(t => (
                    <option key={t} value={t}>{t === 'All' ? 'All Formats' : t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-body/70 hover:text-primary-blue dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset Filters
              </button>
            </div>
          </form>
        </Card>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse space-y-4 h-48 bg-white dark:bg-slate-900" />
            ))}
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => (
              <Card
                key={resource.id}
                hoverLift
                className="p-5 flex flex-col justify-between glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800/80 group transition-all duration-300"
              >
                <div className="space-y-3.5">
                  {/* Top line Type & Category */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {getTypeIcon(resource.type)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        {resource.type}
                      </span>
                    </div>
                    <span className="rounded-full bg-slate-100 dark:bg-slate-850 px-2 py-0.5 text-[8px] font-bold text-text-body/80 dark:text-slate-400 border border-border-custom dark:border-slate-800">
                      {resource.category}
                    </span>
                  </div>

                  {/* Title & description */}
                  <div className="space-y-1">
                    <h3 className="font-poppins font-bold text-sm text-heading dark:text-white leading-tight group-hover:text-primary-blue dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-text-body/80 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                </div>

                {/* External link / Download path */}
                <div className="pt-4 border-t border-border-custom/50 dark:border-slate-800/50 mt-4">
                  {resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary-blue hover:text-primary-green dark:text-blue-400 dark:hover:text-green-400 transition-colors"
                    >
                      Access Resource <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : resource.download_path ? (
                    <a
                      href={resource.download_path}
                      download
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary-green hover:text-primary-blue transition-colors"
                    >
                      Download File <Download className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Resource links not set</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center max-w-lg mx-auto space-y-4 border-dashed border-border-custom dark:border-slate-800">
            <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-poppins font-bold text-heading dark:text-white">No resources found</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No matching resources were found for your current filter parameters.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
