import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { changePassword, getStudentProfile, updateStudentProfile } from '../controllers/studentController.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);

router.put('/change-password', changePassword);

export default router;