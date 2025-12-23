import Course from '../models/Course.js';
import User from '../models/User.js';

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCourse = async (req, res) => {
    try {
        const { title, description, instructor, duration, thumbnail } = req.body;
        const course = await Course.create({ title, description, instructor, duration, thumbnail });
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = await User.findById(req.user._id);

        const isAlreadyEnrolled = user.enrolledCourses.some(
            (c) => c.courseId.toString() === courseId
        );

        if (isAlreadyEnrolled) {
            return res.status(400).json({ message: "You are already enrolled in this course" });
        }

        user.enrolledCourses.push({ courseId, enrolledAt: new Date() });
        await user.save();

        const updatedUser = await User.findById(req.user._id).populate('enrolledCourses.courseId');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const disenrollFromCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = await User.findById(req.user._id);

        user.enrolledCourses = user.enrolledCourses.filter(
            (c) => c.courseId.toString() !== courseId
        );
        
        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('enrolledCourses.courseId');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};