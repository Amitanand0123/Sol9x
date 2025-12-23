import User from '../models/User.js';

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentProfile = async (req, res) => {
    res.json(req.user);
};

export const updateStudentProfile = async (req, res) => {
    try {
        const { name, email, course } = req.body;

        const fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (email) fieldsToUpdate.email = email;
        if (course) fieldsToUpdate.course = course;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, 
            { $set: fieldsToUpdate }, 
            { 
                new: true, 
                runValidators: true 
            }
        ).select('-password').populate('enrolledCourses.courseId');;
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already in use" });
        }
        res.status(500).json({ message: error.message });
    }
};