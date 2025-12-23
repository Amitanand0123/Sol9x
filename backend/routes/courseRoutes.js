import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
    getCourses, 
    createCourse, 
    enrollInCourse,
    disenrollFromCourse
} from '../controllers/courseController.js';

const router = express.Router();

router.get('/', getCourses);
router.post('/enroll', protect, enrollInCourse);
router.post('/disenroll', protect, disenrollFromCourse);

router.post('/', protect, authorize('Admin'), createCourse);
export default router;