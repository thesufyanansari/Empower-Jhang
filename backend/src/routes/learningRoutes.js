import express from 'express';
import {
  getCourses,
  getCourseById,
  getAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getResources,
  getAdminResources,
  createResource,
  updateResource,
  deleteResource
} from '../controllers/learningController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
router.get('/resources', getResources);

// Admin-only routes
router.use(adminAuth);
router.get('/admin/courses', getAdminCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

router.get('/admin/resources', getAdminResources);
router.post('/resources', createResource);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);

export default router;
