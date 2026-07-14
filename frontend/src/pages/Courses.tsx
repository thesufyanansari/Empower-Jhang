import React, { useEffect, useState } from 'react';
import { learningService } from '../services/learningService';
import type { Course } from '../services/learningService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Search, BookOpen, Clock, ExternalLink, 
  FileText, Download, PlayCircle, X 
} from 'lucide-react';

export const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

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

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;

      const data = await learningService.getCourses(params);
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedDifficulty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  // Helper to extract YouTube video ID
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      videoId = url; // fallback if only ID was stored
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="relative min-h-screen bg-bg-section dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary-blue/5 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-blue/10 dark:bg-blue-500/10 text-primary-blue dark:text-blue-400 text-xs font-bold font-poppins">
            <BookOpen className="h-3.5 w-3.5" /> Learning Center
          </div>
          <h1 className="font-poppins text-4xl font-extrabold tracking-tight text-heading dark:text-white sm:text-5xl">
            Free Video Courses
          </h1>
          <p className="text-sm text-text-body dark:text-slate-400">
            Upskill at your own pace with our step-by-step masterclasses, guides, and practical tasks.
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="p-6 max-w-4xl mx-auto glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-xl border border-border-custom bg-white pl-10 pr-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
              <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
            </div>

            {/* Category Filter */}
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

            {/* Difficulty Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="block w-full rounded-xl border border-border-custom bg-white px-4 py-3 text-sm text-heading transition-all focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </form>
        </Card>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse space-y-4 h-80 bg-white dark:bg-slate-900" />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <Card
                key={course.id}
                hoverLift
                onClick={() => setActiveCourse(course)}
                className="overflow-hidden flex flex-col justify-between glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800/80 cursor-pointer group"
              >
                <div>
                  {/* Thumbnail / Header */}
                  <div className="relative aspect-video bg-slate-900">
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-950/60 text-slate-500">
                        <PlayCircle className="h-12 w-12 text-primary-blue" />
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-semibold text-white">
                      {course.duration}
                    </span>
                    <span className="absolute top-2 left-2 bg-primary-blue px-2.5 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider font-poppins">
                      {course.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                      <span>Instructor: {course.instructor}</span>
                      <span className="uppercase text-primary-green">{course.difficulty}</span>
                    </div>
                    <h3 className="font-poppins font-bold text-heading dark:text-white leading-snug group-hover:text-primary-blue dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-text-body/80 dark:text-slate-400 line-clamp-3 leading-normal">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Button variant="secondary" className="w-full text-xs font-bold flex items-center justify-center gap-1.5 py-2">
                    Start Learning <PlayCircle className="h-4 w-4" />
                  </Button>
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
              <h3 className="font-poppins font-bold text-heading dark:text-white">No courses found</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No courses matched your current filter selection. Try removing filters.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Course Detail Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl p-0 overflow-hidden relative glass-morphism dark:glass-morphism-dark border-border-custom dark:border-slate-800 flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Close button */}
            <button
              onClick={() => setActiveCourse(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-slate-950/80 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left: Video & Details */}
            <div className="w-full md:w-3/5 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border-custom dark:border-slate-800">
              <div className="space-y-4">
                <div className="aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-lg border border-white/5">
                  <iframe
                    src={getYoutubeEmbedUrl(activeCourse.youtube_video)}
                    title={activeCourse.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-primary-blue/15 px-2.5 py-0.5 rounded-lg text-[9px] font-bold text-primary-blue dark:text-blue-400 uppercase tracking-wider font-poppins">
                      {activeCourse.category}
                    </span>
                    <span className="bg-green-500/10 px-2.5 py-0.5 rounded-lg text-[9px] font-bold text-primary-green uppercase tracking-wider font-poppins">
                      {activeCourse.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary-green" /> {activeCourse.duration}
                    </span>
                  </div>
                  <h2 className="font-poppins font-bold text-lg md:text-xl text-heading dark:text-white leading-tight">
                    {activeCourse.title}
                  </h2>
                  <p className="text-xs text-text-body/80 dark:text-slate-400 leading-relaxed max-h-[120px] overflow-y-auto">
                    {activeCourse.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border-custom/50 dark:border-slate-800/50 mt-4">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-primary-blue dark:text-white">
                  {activeCourse.instructor?.[0]}
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 leading-none">Instructor</p>
                  <p className="text-xs font-bold text-heading dark:text-white mt-0.5">{activeCourse.instructor}</p>
                </div>
              </div>
            </div>

            {/* Right: Notes & Resources */}
            <div className="w-full md:w-2/5 p-6 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-900/10 overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
              <div className="space-y-6">
                {/* Notes */}
                {activeCourse.notes && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-heading dark:text-white uppercase tracking-wider font-poppins flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-primary-green" /> Course Notes
                    </h4>
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-border-custom dark:border-slate-800 text-[11px] text-text-body/90 dark:text-slate-400 leading-relaxed max-h-[160px] overflow-y-auto whitespace-pre-line">
                      {activeCourse.notes}
                    </div>
                  </div>
                )}

                {/* Downloads */}
                {activeCourse.downloads && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-heading dark:text-white uppercase tracking-wider font-poppins flex items-center gap-1.5">
                      <Download className="h-4 w-4 text-primary-blue" /> Download Resources
                    </h4>
                    <div className="space-y-1.5">
                      {activeCourse.downloads.split('\n').filter(line => line.trim().length > 0).map((line, index) => {
                        const parts = line.split(':');
                        const label = parts[0]?.trim() || 'Resource Link';
                        const url = parts.slice(1).join(':')?.trim() || '#';
                        return (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 p-3 border border-border-custom dark:border-slate-800 text-xs font-semibold text-text-body hover:text-primary-blue dark:text-slate-300 dark:hover:text-white transition-all shadow-xs group"
                          >
                            <span className="truncate max-w-[200px]">{label}</span>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary-blue transition-colors" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-border-custom/50 dark:border-slate-800/50 mt-6">
                <Button variant="ghost" onClick={() => setActiveCourse(null)} className="w-full text-xs py-2">
                  Back to Course Grid
                </Button>
              </div>
            </div>

          </Card>
        </div>
      )}

    </div>
  );
};
