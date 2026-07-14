import express from 'express';
import { 
  getStatistics, getMembers, toggleVerifyMember, 
  toggleSuspendMember, deleteMember, getSettings, 
  updateSettings, getLinks, updateLinks, 
  getAnnouncements, createAnnouncement, deleteAnnouncement,
  getVolunteers, reviewVolunteer, assignVolunteer,
  getActivityLogs, getSystemHealth, getBackups,
  createBackup, getAdmins, createAdmin,
  reviewMemberRegistration, getMentorsApplications, reviewMentorApplication,
  assignMemberRole
} from '../controllers/adminController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply admin authentication middleware to all admin routes
router.use(adminAuth);

router.get('/statistics', getStatistics);
router.get('/members', getMembers);
router.put('/members/:id/verify', toggleVerifyMember);
router.put('/members/:id/suspend', toggleSuspendMember);
router.put('/members/:id/role', assignMemberRole);
router.put('/members/:id/approve', reviewMemberRegistration);
router.delete('/members/:id', deleteMember);

router.get('/settings', getSettings);
router.post('/settings', updateSettings);

router.get('/links', getLinks);
router.post('/links', updateLinks);

router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

router.get('/volunteers', getVolunteers);
router.put('/volunteers/:id/review', reviewVolunteer);
router.put('/volunteers/:id/assign', assignVolunteer);

router.get('/mentors', getMentorsApplications);
router.put('/mentors/:id/review', reviewMentorApplication);

router.get('/activity-logs', getActivityLogs);
router.get('/system-health', getSystemHealth);

router.get('/backups', getBackups);
router.post('/backups', createBackup);

router.get('/admins', getAdmins);
router.post('/admins', createAdmin);

export default router;
