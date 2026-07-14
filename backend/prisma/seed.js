import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database parameter settings...');

  // 1. Seed Website Settings
  const settingsCount = await prisma.websiteSetting.count();
  if (settingsCount === 0) {
    await prisma.websiteSetting.create({
      data: {
        site_name: 'Empower Jhang',
        tagline: 'Learn • Connect • Grow',
        contact_email: 'info@empowerjhang.org',
        contact_phone: '+92 300 1234567',
        address: 'Jhang, Punjab, Pakistan',
        footer_text: '© 2026 Empower Jhang. All rights reserved.',
        facebook: 'https://facebook.com/groups/empowerjhang',
        youtube: 'https://youtube.com/@empowerjhang',
        whatsapp: 'https://chat.whatsapp.com/empowerjhang'
      }
    });
    console.log('✔ Default website settings created.');
  }

  // 2. Seed Default Admin User
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    await prisma.admin.create({
      data: {
        full_name: 'Empower Jhang Admin',
        email: 'info@empowerjhang.org',
        password_hash: '$2b$10$eFytJDG1xnMcgWjPZ8hS2e71G322c3Y8zQ3k/L8u08B3J1RjFv4E5', // bcrypt hash of admin123
        role: 'Administrator',
        status: 'Active'
      }
    });
    console.log('✔ Default administrator account created.');
  }

  // 3. Seed Skill Categories and Skills
  const categoryCount = await prisma.skillCategory.count();
  if (categoryCount === 0) {
    console.log('Seeding skill categories and skills...');
    const skillsData = {
      'AI & Automation': [
        'AI Prompt Engineering', 'ChatGPT Mastery', 'AI Productivity Tools', 'OpenAI',
        'AI Agents', 'CrewAI', 'LangGraph', 'n8n AI', 'AI Workflow Design',
        'No-Code AI', 'AI Research', 'Deep Research', 'AI Business',
        'AI Content Creation', 'AI Image Generation', 'AI Video Generation', 'AI Voice Generation'
      ],
      'AI Development': [
        'Cursor', 'Bolt.new', 'Lovable', 'Replit AI', 'Windsurf IDE', 'GitHub Copilot',
        'Website Development', 'No-Code Development', 'SaaS MVP', 'Web Applications',
        'Mobile Apps', 'Automation Apps'
      ],
      'Automation': [
        'n8n', 'Make.com', 'Zapier', 'WhatsApp Automation', 'Email Automation',
        'CRM Automation', 'Business Automation', 'Workflow Automation', 'API Integration'
      ],
      'Content Creation': [
        'YouTube Automation', 'TikTok', 'Instagram', 'Facebook', 'Canva', 'CapCut',
        'AI Video Editing', 'Personal Branding', 'Content Strategy', 'Creator Economy'
      ],
      'Monetization': [
        'YouTube Monetization', 'Facebook Monetization', 'TikTok Monetization',
        'Instagram Monetization', 'Affiliate Marketing', 'Digital Products', 'UGC', 'Brand Deals'
      ],
      'Digital Marketing': [
        'SEO', 'AI SEO', 'Google Ads', 'Facebook Ads', 'Content Marketing',
        'Email Marketing', 'Funnels', 'Copywriting'
      ],
      'Business': [
        'AI Business', 'Online Business', 'Agency', 'Consulting',
        'Digital Entrepreneurship', 'SaaS Business', 'Selling Digital Products'
      ],
      'Creator Economy': [
        'Community Building', 'Membership Business', 'Podcast', 'Newsletter',
        'YouTube Channel', 'Content Systems'
      ]
    };

    let catOrder = 0;
    for (const [catName, skills] of Object.entries(skillsData)) {
      const category = await prisma.skillCategory.create({
        data: {
          name: catName,
          display_order: catOrder++,
          status: 'Active'
        }
      });

      let skillOrder = 0;
      for (const skillName of skills) {
        await prisma.skill.create({
          data: {
            name: skillName,
            categoryId: category.id,
            display_order: skillOrder++,
            status: 'Active'
          }
        });
      }
    }
    console.log('✔ Skill categories and skills loaded.');
  }

  // 4. Seed Dynamic Role Configuration Tables
  const roleCount = await prisma.role.count();
  const roleIdMap = {}; // Maps key -> role.id
  if (roleCount === 0) {
    console.log('Seeding dynamic community roles hierarchy...');
    const rolesConfig = [
      { name: 'Founder', key: 'founder', category: 'Leadership', order: 0, color: '#f59e0b', icon: 'Crown', gradient: 'from-slate-950 via-blue-950 to-slate-950', border: 'border-amber-500/50', pattern: 'grid', template: 'leadership', badgeStyle: 'premium', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18v2H3z"/></svg>' },
      { name: 'Co-Founder', key: 'co-founder', category: 'Leadership', order: 1, color: '#94a3b8', icon: 'Award', gradient: 'from-slate-900 to-indigo-950', border: 'border-slate-300/40', pattern: 'dots', template: 'leadership', badgeStyle: 'premium', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>' },
      { name: 'Core Committee', key: 'core-committee', category: 'Leadership', order: 2, color: '#3b82f6', icon: 'Users', gradient: 'from-blue-950 to-slate-950', border: 'border-blue-500/30', pattern: 'waves', template: 'leadership', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
      { name: 'President', key: 'president', category: 'Leadership', order: 3, color: '#1d4ed8', icon: 'Shield', gradient: 'from-blue-950 to-indigo-950', border: 'border-blue-400/50', pattern: 'grid', template: 'leadership', badgeStyle: 'premium', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
      { name: 'Vice President', key: 'vice-president', category: 'Leadership', order: 4, color: '#2563eb', icon: 'ShieldAlert', gradient: 'from-blue-900 to-slate-950', border: 'border-blue-500/30', pattern: 'dots', template: 'leadership', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="1"/></svg>' },
      { name: 'General Secretary', key: 'general-secretary', category: 'Leadership', order: 5, color: '#2563eb', icon: 'FileText', gradient: 'from-blue-950 to-indigo-950', border: 'border-blue-500/30', pattern: 'waves', template: 'leadership', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' },
      { name: 'Joint Secretary', key: 'joint-secretary', category: 'Leadership', order: 6, color: '#2563eb', icon: 'FileText', gradient: 'from-blue-950 to-indigo-950', border: 'border-blue-500/30', pattern: 'waves', template: 'leadership', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
      { name: 'Treasurer', key: 'treasurer', category: 'Leadership', order: 7, color: '#10b981', icon: 'Coins', gradient: 'from-emerald-950 to-slate-950', border: 'border-emerald-500/30', pattern: 'grid', template: 'leadership', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M15 9H9.5a2.5 2.5 0 0 0 0 5H15"/></svg>' },
      { name: 'Executive Committee', key: 'executive-committee', category: 'Leadership', order: 8, color: '#3b82f6', icon: 'Layers', gradient: 'from-blue-950 to-slate-950', border: 'border-blue-500/20', pattern: 'dots', template: 'leadership', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' },
      
      { name: 'Technical Lead', key: 'technical-lead', category: 'Department Leads', order: 9, color: '#06b6d4', icon: 'Code', gradient: 'from-cyan-950 to-blue-950', border: 'border-cyan-500/30', pattern: 'grid', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' },
      { name: 'Creative Lead', key: 'creative-lead', category: 'Department Leads', order: 10, color: '#ec4899', icon: 'Palette', gradient: 'from-pink-950 to-indigo-950', border: 'border-pink-500/30', pattern: 'dots', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="5.5" cy="11.5" r="2.5"/><circle cx="8.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="14.5" r="2.5"/></svg>' },
      { name: 'Media & PR Lead', key: 'media-pr-lead', category: 'Department Leads', order: 11, color: '#f43f5e', icon: 'Megaphone', gradient: 'from-rose-950 to-indigo-950', border: 'border-rose-500/30', pattern: 'waves', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M12 18h1.5a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3H12M3 9v6a1 1 0 0 0 1 1h4V8H4a1 1 0 0 0-1 1z"/></svg>' },
      { name: 'Marketing Lead', key: 'marketing-lead', category: 'Department Leads', order: 12, color: '#f59e0b', icon: 'TrendingUp', gradient: 'from-amber-950 to-slate-950', border: 'border-amber-500/30', pattern: 'grid', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>' },
      { name: 'Training Lead', key: 'training-lead', category: 'Department Leads', order: 13, color: '#8b5cf6', icon: 'GraduationCap', gradient: 'from-purple-950 to-blue-950', border: 'border-purple-500/30', pattern: 'dots', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>' },
      { name: 'Community Growth Lead', key: 'community-growth-lead', category: 'Department Leads', order: 14, color: '#14b8a6', icon: 'HeartHandshake', gradient: 'from-teal-950 to-indigo-950', border: 'border-teal-500/30', pattern: 'waves', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>' },
      { name: 'Events Lead', key: 'events-lead', category: 'Department Leads', order: 15, color: '#eab308', icon: 'Calendar', gradient: 'from-yellow-950 to-slate-950', border: 'border-yellow-500/30', pattern: 'grid', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
      { name: 'Volunteer Coordinator', key: 'volunteer-coordinator', category: 'Department Leads', order: 16, color: '#10b981', icon: 'UserCheck', gradient: 'from-emerald-950 to-slate-950', border: 'border-emerald-500/30', pattern: 'dots', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>' },
      { name: 'Campus Ambassador Lead', key: 'campus-ambassador-lead', category: 'Department Leads', order: 17, color: '#f97316', icon: 'School', gradient: 'from-orange-950 to-indigo-950', border: 'border-orange-500/30', pattern: 'waves', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/></svg>' },
      { name: 'Operations Lead', key: 'operations-lead', category: 'Department Leads', order: 18, color: '#3b82f6', icon: 'Briefcase', gradient: 'from-blue-950 to-slate-950', border: 'border-blue-500/30', pattern: 'grid', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
      
      { name: 'Mentor', key: 'mentor', category: 'Community Roles', order: 19, color: '#d4af37', icon: 'GraduationCap', gradient: 'from-slate-950 to-amber-950', border: 'border-amber-500/50', pattern: 'grid', template: 'mentor', badgeStyle: 'premium', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>' },
      { name: 'Senior Volunteer', key: 'senior-volunteer', category: 'Community Roles', order: 20, color: '#14b8a6', icon: 'Award', gradient: 'from-teal-950/40 to-slate-950', border: 'border-teal-500/40', pattern: 'dots', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>' },
      { name: 'Volunteer', key: 'volunteer', category: 'Community Roles', order: 21, color: '#10b981', icon: 'Heart', gradient: 'from-emerald-950/20 to-slate-950', border: 'border-emerald-500/30', pattern: 'waves', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>' },
      { name: 'Community Ambassador', key: 'community-ambassador', category: 'Community Roles', order: 22, color: '#3b82f6', icon: 'Globe', gradient: 'from-blue-950/20 to-slate-950', border: 'border-blue-500/30', pattern: 'grid', template: 'volunteer', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>' },
      { name: 'Member', key: 'member', category: 'Members', order: 23, color: '#2563eb', icon: 'User', gradient: 'from-blue-950/10 to-slate-950', border: 'border-slate-800', pattern: 'none', template: 'standard', badgeStyle: 'standard', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' }
    ];

    for (const r of rolesConfig) {
      const createdRole = await prisma.role.create({
        data: {
          name: r.name,
          key: r.key,
          category: r.category,
          display_order: r.order,
          status: 'Active',
          badge: {
            create: {
              badge_name: `${r.name} Badge`,
              icon_name: r.icon,
              svg_template: r.svg
            }
          },
          theme: {
            create: {
              gradient_css: r.gradient,
              accent_color: r.color,
              profile_header: `bg-gradient-to-r ${r.gradient}`,
              border_style: r.border,
              bg_pattern: r.pattern,
              verification_style: r.color === '#f59e0b' || r.color === '#d4af37' ? 'text-amber-500 fill-amber-500' : 'text-blue-500 fill-blue-500'
            }
          },
          card: {
            create: {
              design_template: r.template,
              badge_style: r.badgeStyle,
              accent_color: r.color
            }
          }
        }
      });
      roleIdMap[r.key] = createdRole.id;
    }
    console.log('✔ Hierarchy roles, badges, themes, and card layouts loaded.');
  } else {
    const activeRoles = await prisma.role.findMany();
    for (const r of activeRoles) {
      roleIdMap[r.key] = r.id;
    }
  }

  // 5. Seed Starter Members (Generate 80+ realistic Pakistani community profiles)
  const memberCount = await prisma.communityMember.count();
  if (memberCount === 0) {
    console.log('Generating 80+ realistic community profiles...');

    // Helper functions for Pakistani names and profiles generator
    const femaleFirst = ['Fatima', 'Zainab', 'Ayesha', 'Sana', 'Iqra', 'Khadija', 'Amna', 'Tayyaba', 'Nida', 'Mehak', 'Kinza', 'Rubab', 'Sidra', 'Aqsa', 'Amina', 'Sadia', 'Hina', 'Kiran', 'Bushra', 'Noreen'];
    const maleFirst = ['Ahmad', 'Muhammad', 'Ali', 'Hamza', 'Zain', 'Bilal', 'Usman', 'Hassan', 'Faisal', 'Zohaib', 'Haseeb', 'Waleed', 'Kamran', 'Qasim', 'Zeeshan', 'Sajid', 'Tariq', 'Haris', 'Asif', 'Nabeel', 'Adnan', 'Junaid', 'Saad', 'Omar', 'Babar', 'Farhan', 'Shahid', 'Talha', 'Imran', 'Arslan'];
    const lasts = ['Raza', 'Ahmad', 'Ali', 'Khan', 'Jafar', 'Hassan', 'Mehmood', 'Riaz', 'Iqbal', 'Shah', 'Shahid', 'Akram', 'Rehman', 'Anjum', 'Ghani', 'Malik', 'Hussain', 'Amin', 'Siddiqui', 'Lodhi', 'Abbasi', 'Butt', 'Dar', 'Gill', 'Cheema', 'Gujjar'];
    const districts = ['Jhang', 'Shorkot', 'EighteenHazari', 'AhmadpurSial'];
    
    const professions = [
      'Frontend Developer', 'UI/UX Designer', 'Mobile App Developer', 'Video Editor', 
      'Graphic Designer', 'SEO Specialist', 'WordPress Developer', 'Copywriter', 
      'n8n Automation Expert', 'Digital Marketer', 'Content Strategist', 'Full Stack Developer', 
      'Data Analyst', 'Shopify Developer', 'Python Programmer'
    ];

    const techSkills = {
      'Frontend Developer': 'React, Next.js, Tailwind CSS, TypeScript, JavaScript, HTML5/CSS3',
      'UI/UX Designer': 'Figma, Adobe XD, Design Systems, Prototyping, Wireframing',
      'Mobile App Developer': 'Flutter, React Native, Dart, REST APIs, Firebase',
      'Video Editor': 'Premiere Pro, After Effects, CapCut, Color Grading, Sound Design',
      'Graphic Designer': 'Photoshop, Illustrator, Canva, Branding, Logo Design',
      'SEO Specialist': 'Google Analytics, Search Console, Ahrefs, AI SEO, Link Building',
      'WordPress Developer': 'PHP, Elementor, WooCommerce, Speed Optimization, Custom Themes',
      'Copywriter': 'ChatGPT, Copywriting, Content Strategy, Storytelling, SEO Copywriting',
      'n8n Automation Expert': 'n8n, Make.com, Zapier, Webhooks, API Integration, JSON',
      'Digital Marketer': 'Facebook Ads, Google Ads, Meta Business, Email Campaigns, Funnels',
      'Content Strategist': 'YouTube Automation, Tiktok strategy, Creator economy, Canva',
      'Full Stack Developer': 'React, Node.js, Express, MySQL, Prisma, Next.js',
      'Data Analyst': 'Python, SQL, PowerBI, Excel, Tableau',
      'Shopify Developer': 'Shopify Liquid, Dropshipping, E-commerce, Theme Customization',
      'Python Programmer': 'Python, Django, FastAPI, Web Scraping, Pandas'
    };

    // A. Seed Leadership (10 profiles)
    const leadershipConfig = [
      { name: 'M. Haseeb Jafar', roleKey: 'founder', prof: 'Founder & Strategy Lead' },
      { name: 'Ayesha Khan', roleKey: 'co-founder', prof: 'Co-Founder & Creative Lead' },
      { name: 'Zeeshan Ali', roleKey: 'president', prof: 'President & Tech Advisor' },
      { name: 'Bilal Hassan', roleKey: 'vice-president', prof: 'Vice President & Operations' },
      { name: 'Dr. Sarah Jamil', roleKey: 'general-secretary', prof: 'General Secretary' },
      { name: 'Tayyaba Batool', roleKey: 'treasurer', prof: 'Treasurer' },
      { name: 'Waleed Raza', roleKey: 'technical-lead', prof: 'Lead Solutions Architect' },
      { name: 'Nida Fatima', roleKey: 'creative-lead', prof: 'Lead Brand Designer' },
      { name: 'Faisal Mehmood', roleKey: 'media-pr-lead', prof: 'PR Relations Officer' },
      { name: 'Usman Ghani', roleKey: 'community-growth-lead', prof: 'Growth & Outreach Manager' }
    ];

    let counterId = 1000;
    for (const lead of leadershipConfig) {
      counterId++;
      const isFemale = lead.name.includes('Ayesha') || lead.name.includes('Tayyaba') || lead.name.includes('Nida') || lead.name.includes('Sarah');
      const email = `${lead.name.toLowerCase().replace(/[^a-z]+/g, '')}@empowerjhang.org`;
      
      await prisma.communityMember.create({
        data: {
          member_id: `EMP-${counterId}`,
          full_name: lead.name,
          father_name: 'Parent Name',
          gender: isFemale ? 'Female' : 'Male',
          date_of_birth: '1995-05-12',
          whatsapp: `+92 300 123${counterId}`,
          email,
          district: 'Jhang',
          education: 'Bachelors Degree',
          profession: lead.prof,
          profile_photo: `https://images.unsplash.com/photo-${isFemale ? '1494790108377-be9c29b29330' : '1535713875002-d1d0cf377fde'}?auto=format&fit=crop&q=80&w=200&h=200`,
          bio: `Active ${lead.prof} managing core strategic programs and youth outreach setups at Empower Jhang.`,
          skills: 'Strategic planning, leadership, team coordination, project management',
          status: 'Active',
          email_verified: true,
          roleId: roleIdMap[lead.roleKey]
        }
      });
      // Create member card record mapping
      await prisma.memberCard.create({
        data: {
          member_id: `EMP-${counterId}`,
          card_number: `EMP-${counterId}`,
          pdf_path: `/api/member/EMP-${counterId}/card/pdf`,
          png_path: `/api/member/EMP-${counterId}/card/qr`
        }
      });
    }
    console.log('✔ Leadership members created.');

    // B. Seed Mentors (8 profiles)
    const mentorsSpec = [
      { name: 'Haris Rehman', ind: 'Software Development', spec: 'Next.js, Node.js, Lovable, Lovable AI', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200' },
      { name: 'Zainab Jamil', ind: 'UI/UX Design', spec: 'Figma, Adobe XD, Design Systems', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200' },
      { name: 'Usman Ali', ind: 'Artificial Intelligence', spec: 'OpenAI, Python, LangChain, AI Agents', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200' },
      { name: 'Maria Batool', ind: 'Video Editing', spec: 'Premiere Pro, After Effects, Color Grading', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200' },
      { name: 'Sajid Hussain', ind: 'SEO & Marketing', spec: 'Google Ads, Web Console, AI SEO, Funnels', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200' },
      { name: 'Fizza Shah', ind: 'E-Commerce', spec: 'Shopify Liquid, Dropshipping, Amazon FBA', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200' },
      { name: 'Taimoor Raza', ind: 'Freelancing', spec: 'Upwork Bidding, Proposal Writing, Agency Growth', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200' },
      { name: 'Sidra Amin', ind: 'Mobile App Development', spec: 'Flutter, React Native, iOS Dev', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200' }
    ];

    for (let i = 0; i < mentorsSpec.length; i++) {
      counterId++;
      const mSpec = mentorsSpec[i];
      const isFemale = i === 1 || i === 3 || i === 5 || i === 7;
      const email = `${mSpec.name.toLowerCase().replace(/[^a-z]+/g, '')}@empowerjhang.org`;

      await prisma.communityMember.create({
        data: {
          member_id: `EMP-${counterId}`,
          full_name: mSpec.name,
          father_name: 'Parent Name',
          gender: isFemale ? 'Female' : 'Male',
          date_of_birth: '1990-10-10',
          whatsapp: `+92 302 0000${counterId}`,
          email,
          district: districts[i % districts.length],
          education: 'BS CS / Equivalent Degree',
          profession: `Senior Mentor in ${mSpec.ind}`,
          profile_photo: mSpec.avatar,
          bio: `Experienced industry mentor specialized in ${mSpec.ind}. Helping local youth learn digital freelancing skills.`,
          skills: mSpec.spec,
          is_mentor: true,
          mentor_status: 'Approved',
          mentor_experience_years: '7',
          mentor_industry: mSpec.ind,
          mentor_teaching_exp: 'Conducted university bootcamps and online coding classes.',
          mentor_mentoring_exp: 'Mentored dozens of students guiding them to remote contracts on Upwork.',
          mentor_specializations: mSpec.spec,
          mentor_availability: 'Weekends 2-4 Hours',
          mentor_languages: 'Urdu, English, Punjabi',
          mentor_achievements: 'Generated $100k+ in remote freelancing and launched multiple digital systems.',
          mentor_certifications: 'Google UI/UX Certificate, AWS Developer Associate',
          mentor_motivation: 'To give back to Jhang community by training local youth in high-paying skills.',
          mentor_style: 'Interactive code reviews, project-oriented workflows, and direct advice.',
          status: 'Active',
          email_verified: true,
          roleId: roleIdMap['mentor']
        }
      });
      await prisma.memberCard.create({
        data: {
          member_id: `EMP-${counterId}`,
          card_number: `EMP-${counterId}`,
          pdf_path: `/api/member/EMP-${counterId}/card/pdf`,
          png_path: `/api/member/EMP-${counterId}/card/qr`
        }
      });
    }
    console.log('✔ Mentors created.');

    // C. Seed Volunteers (12 profiles)
    for (let i = 0; i < 12; i++) {
      counterId++;
      const isFemale = i % 2 === 1;
      const name = generateName(i, isFemale);
      const email = `${name.toLowerCase().replace(/[^a-z]+/g, '')}@empowerjhang.org`;
      const isSenior = i < 4;
      const isAmbassador = i >= 4 && i < 8;
      
      let volunteerRole = 'Volunteer';
      let roleKey = 'volunteer';
      if (isSenior) {
        volunteerRole = 'Senior Volunteer';
        roleKey = 'senior-volunteer';
      } else if (isAmbassador) {
        volunteerRole = 'Community Ambassador';
        roleKey = 'community-ambassador';
      }

      const volunteerDepts = [
        'Event Coordination & Logistics', 
        'Graphic Design & Branding', 
        'Social Media Management', 
        'Moderation & Technical Support',
        'Academic Curriculum Support'
      ];

      await prisma.communityMember.create({
        data: {
          member_id: `EMP-${counterId}`,
          full_name: name,
          father_name: 'Parent Father',
          gender: isFemale ? 'Female' : 'Male',
          date_of_birth: '1998-04-12',
          whatsapp: `+92 301 999${counterId}`,
          email,
          district: districts[i % districts.length],
          education: 'University Student',
          profession: volunteerRole,
          profile_photo: `https://images.unsplash.com/photo-${isFemale ? '1494790108377-be9c29b29330' : '1500648767791-00dcc994a43e'}?auto=format&fit=crop&q=80&w=200&h=200`,
          bio: `Enthusiastic ${volunteerRole} helping organize workshops and grow our local tech circle.`,
          skills: 'Teamwork, event execution, communication, digital graphics',
          is_volunteer: true,
          volunteer_status: 'Approved',
          volunteer_role: volunteerRole,
          volunteer_department: volunteerDepts[i % volunteerDepts.length],
          volunteer_experience: 'Participated in university clubs and student organizer committees.',
          volunteer_availability: 'Weekends & Evenings',
          volunteer_motivation: 'To connect with local tech leaders and contribute to the community.',
          volunteer_emergency_contact: '+92 300 0000000',
          volunteer_time_weekly: '8-10 Hours',
          volunteer_value_bring: 'Energy, dedication, and active student networking capabilities.',
          volunteer_references: 'GCU Jhang Advisor',
          status: 'Active',
          email_verified: true,
          roleId: roleIdMap[roleKey]
        }
      });
      await prisma.memberCard.create({
        data: {
          member_id: `EMP-${counterId}`,
          card_number: `EMP-${counterId}`,
          pdf_path: `/api/member/EMP-${counterId}/card/pdf`,
          png_path: `/api/member/EMP-${counterId}/card/qr`
        }
      });
    }
    console.log('✔ Volunteers created.');

    // D. Seed Members (60 profiles)
    for (let i = 0; i < 60; i++) {
      counterId++;
      const isFemale = i % 3 === 1;
      const name = generateName(i + 15, isFemale);
      const email = `${name.toLowerCase().replace(/[^a-z]+/g, '')}@empowerjhang.org`;
      
      const district = districts[i % districts.length];
      const profession = professions[i % professions.length];
      const skills = techSkills[profession];
      
      await prisma.communityMember.create({
        data: {
          member_id: `EMP-${counterId}`,
          full_name: name,
          father_name: 'Father Name',
          gender: isFemale ? 'Female' : 'Male',
          date_of_birth: '1999-08-20',
          whatsapp: `+92 305 000${counterId}`,
          email,
          district,
          education: 'BS Computer Science',
          profession,
          profile_photo: `https://images.unsplash.com/photo-${isFemale ? '1494790108377-be9c29b29330' : '1535713875002-d1d0cf377fde'}?auto=format&fit=crop&q=80&w=200&h=200`,
          bio: `${profession} focusing on freelancing and building local startup products in ${district}.`,
          skills,
          interests: 'Technology, Freelancing, Design, Code',
          status: 'Active',
          email_verified: true,
          roleId: roleIdMap['member'],
          registration_date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        }
      });
      await prisma.memberCard.create({
        data: {
          member_id: `EMP-${counterId}`,
          card_number: `EMP-${counterId}`,
          pdf_path: `/api/member/EMP-${counterId}/card/pdf`,
          png_path: `/api/member/EMP-${counterId}/card/qr`
        }
      });
    }
    console.log('✔ 60 Community Members created.');
  }

  // 6. Seed Starter Courses (Learning Center)
  const coursesCount = await prisma.course.count();
  if (coursesCount === 0) {
    console.log('Seeding starter video courses...');
    const coursesData = [
      {
        title: 'ChatGPT Prompt Engineering Masterclass',
        description: 'Learn the exact systems to construct advanced prompt structures, utilize zero-shot prompting, and automate business processes.',
        category: 'AI & Automation',
        instructor: 'M. Haseeb Jafar',
        duration: '1h 45m',
        difficulty: 'Beginner' as const,
        youtube_video: 'https://www.youtube.com/watch?v=mBYu5No4s2Y',
        notes: '1. Be specific and give clear roles (Act as a Senior Copywriter).\n2. Supply context and constraints.\n3. Iterate and refine prompts based on results.',
        downloads: 'Prompt Cheat Sheet:https://example.com/prompts.pdf\nSyllabus Outline:https://example.com/syllabus.pdf'
      },
      {
        title: 'Figma UI/UX Design Fundamentals',
        description: 'Move from canvas design to constructing complete interactive app prototypes. Master auto-layouts, components, and variables.',
        category: 'AI Development',
        instructor: 'Ayesha Khan',
        duration: '3h 12m',
        difficulty: 'Intermediate' as const,
        youtube_video: 'https://www.youtube.com/watch?v=c9Wg6Ob_Y3s',
        notes: '1. Focus on grid spacing constraints.\n2. Master Figma Auto-layout (Shift+A).\n3. Keep typography systems hierarchal.',
        downloads: 'Wireframe Starter Kit:https://example.com/figma-kit.fig'
      },
      {
        title: 'Vite React + Tailwind CSS Speed Run',
        description: 'Construct completely responsive landing page designs in minutes. Master components lifecycle, Tailwind utilities, and Vite builds.',
        category: 'AI Development',
        instructor: 'Zeeshan Ali',
        duration: '2h 10m',
        difficulty: 'Advanced' as const,
        youtube_video: 'https://www.youtube.com/watch?v=d56mG7gRbbk',
        notes: '1. Initialize Vite using npm create vite@latest.\n2. Configure tailwindcss elements.\n3. Make reusable card elements.',
        downloads: 'Repository Link:https://github.com/example/vite-react'
      }
    ];

    for (const c of coursesData) {
      await prisma.course.create({
        data: {
          title: c.title,
          description: c.description,
          category: c.category,
          instructor: c.instructor,
          duration: c.duration,
          difficulty: c.difficulty,
          youtube_video: c.youtube_video,
          notes: c.notes,
          downloads: c.downloads,
          status: 'Active'
        }
      });
    }
  }

  // 7. Seed Starter Resources (Learning Center)
  const resourcesCount = await prisma.resource.count();
  if (resourcesCount === 0) {
    console.log('Seeding starter resources vault...');
    const resourcesData = [
      { title: '100+ Advanced Midjourney Prompts PDF', description: 'List of prompt styles, lighting tags, and rendering options for cinematic AI visuals.', type: 'PDF', category: 'AI & Automation', url: 'https://example.com/prompts' },
      { title: 'Next.js Boilerplate Developer Template', description: 'Vercel optimized directory featuring Prisma, Tailwind, and Google authentication pre-configured.', type: 'Template', category: 'AI Development', url: 'https://example.com/boilerplate' },
      { title: 'Upwork Proposal Writing Handbook', description: 'Guide compiled of winning proposals, cover letter structures, and client intake strategies.', type: 'Book', category: 'Monetization', url: 'https://example.com/upwork-guide' }
    ];

    for (const r of resourcesData) {
      await prisma.resource.create({
        data: {
          title: r.title,
          description: r.description,
          type: r.type,
          category: r.category,
          url: r.url,
          status: 'Active'
        }
      });
    }
  }

  console.log('Database seeding completed successfully!');
}

function generateName(index, isFemale) {
  const femaleFirst = ['Fatima', 'Zainab', 'Ayesha', 'Sana', 'Iqra', 'Khadija', 'Amna', 'Tayyaba', 'Nida', 'Mehak', 'Kinza', 'Rubab', 'Sidra', 'Aqsa', 'Amina', 'Sadia', 'Hina', 'Kiran', 'Bushra', 'Noreen'];
  const maleFirst = ['Ahmad', 'Muhammad', 'Ali', 'Hamza', 'Zain', 'Bilal', 'Usman', 'Hassan', 'Faisal', 'Zohaib', 'Haseeb', 'Waleed', 'Kamran', 'Qasim', 'Zeeshan', 'Sajid', 'Tariq', 'Haris', 'Asif', 'Nabeel', 'Adnan', 'Junaid', 'Saad', 'Omar', 'Babar', 'Farhan', 'Shahid', 'Talha', 'Imran', 'Arslan'];
  const lasts = ['Raza', 'Ahmad', 'Ali', 'Khan', 'Hassan', 'Mehmood', 'Riaz', 'Iqbal', 'Shah', 'Shahid', 'Akram', 'Rehman', 'Anjum', 'Ghani', 'Malik', 'Hussain', 'Amin', 'Siddiqui', 'Lodhi', 'Abbasi', 'Butt', 'Dar', 'Gill', 'Cheema', 'Gujjar'];
  
  const firstList = isFemale ? femaleFirst : maleFirst;
  const first = firstList[index % firstList.length];
  const last = lasts[(index * 3) % lasts.length];
  return `${first} ${last}`;
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
