import express from 'express';
import {
  getCategoriesAndSkills,
  getAdminCategoriesAndSkills,
  createCategory,
  updateCategory,
  deleteCategory,
  createSkill,
  updateSkill,
  deleteSkill
} from '../controllers/skillsController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/', getCategoriesAndSkills);

// Admin-only routes
router.use(adminAuth);
router.get('/admin', getAdminCategoriesAndSkills);
router.post('/category', createCategory);
router.put('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);
router.post('/skill', createSkill);
router.put('/skill/:id', updateSkill);
router.delete('/skill/:id', deleteSkill);

export default router;
