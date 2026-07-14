import express from 'express';
import {
  register,
  getProfileByMemberId,
  updateProfile,
  getMemberCount,
  downloadCardPdf,
  downloadCardQr,
  applyVolunteer,
  applyMentor,
  getPublicMembers,
  getPublicVolunteers,
  getPublicMentors,
  getPublicLeadership
} from '../controllers/memberController.js';
import { getSettings, getLinks } from '../controllers/adminController.js';
import { uploadAvatar } from '../middleware/upload.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerMemberSchema, updateProfileSchema } from '../validators/memberValidator.js';

const router = express.Router();

// Public Routes
router.post('/register', uploadAvatar.single('profile_photo'), validateRequest(registerMemberSchema), register);
router.get('/public/settings', getSettings);
router.get('/public/links', getLinks);
router.get('/public/count', getMemberCount);
router.get('/public/directory', getPublicMembers);
router.get('/public/volunteers', getPublicVolunteers);
router.get('/public/mentors', getPublicMentors);
router.get('/public/leadership', getPublicLeadership);

// Specific Profile Operations
router.get('/:memberId', getProfileByMemberId);
router.put('/:memberId', validateRequest(updateProfileSchema), updateProfile);
router.post('/:memberId/volunteer', applyVolunteer);
router.post('/:memberId/mentor', applyMentor);
router.get('/:memberId/card/pdf', downloadCardPdf);
router.get('/:memberId/card/qr', downloadCardQr);

export default router;
