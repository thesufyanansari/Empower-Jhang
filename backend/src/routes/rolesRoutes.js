import express from 'express';
import { 
  getRoles, createRole, updateRole, deleteRole, reorderRoles 
} from '../controllers/rolesController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Public route to fetch all active roles
router.get('/', getRoles);

// Admin-only protected CRUD routes
router.post('/', adminAuth, createRole);
router.put('/reorder', adminAuth, reorderRoles);
router.put('/:id', adminAuth, updateRole);
router.delete('/:id', adminAuth, deleteRole);

export default router;
