import express from 'express';
import { 
    getStudents, 
    updateStudent, 
    deleteStudent,
    createStudent,
    getStudentById
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

router.get('/students', getStudents);
router.post('/student', createStudent);
router.get('/student/:id', getStudentById);
router.put('/student/:id', updateStudent);
router.delete('/student/:id', deleteStudent);

export default router;