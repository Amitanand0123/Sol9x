import User from '../models/User.js';

export const getStudents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    try {
        const total = await User.countDocuments({ role: 'Student' });
        const students = await User.find({ role: 'Student' }).skip(skip).limit(limit);
        res.json({ students, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createStudent = async (req, res) => {
    const { name, email, password, course } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const student = await User.create({
            name,
            email,
            password,
            course: course || 'Not Assigned',
            role: 'Student',
            isVerified: true
        });

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentAdminId = req.user._id.toString();

        const userToDelete = await User.findById(targetUserId);
        if (!userToDelete) return res.status(404).json({ message: 'User not found' });

        if (targetUserId === currentAdminId) {
            return res.status(403).json({ message: 'You cannot delete your own account.' });
        }

        if (userToDelete.role === 'Admin') {
            return res.status(403).json({ message: 'Admin accounts cannot be deleted here.' });
        }

        await User.findByIdAndDelete(targetUserId);
        res.json({ message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const student = await User.findById(req.params.id)
            .populate('enrolledCourses.courseId')
            .select('-password');
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};