import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const register = async (req, res) => {
    const { name, email, password, role, course } = req.body;
    
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const verificationToken = crypto.randomBytes(20).toString('hex');

        const user = await User.create({ 
            name, 
            email, 
            password, 
            role: role || 'Student', 
            course: course || 'MERN Bootcamp',
            verificationToken,
            isVerified: false 
        });

        const verifyUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
        const message = `
            <h1>Verify your Email</h1>
            <p>Thank you for registering. Please click the link below to verify your account:</p>
            <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification',
                message
            });
            res.status(201).json({ message: 'Registration successful! Please check your email to verify.' });
        } catch (emailError) {
            console.error("Email failed to send:", emailError);
            res.status(201).json({ message: 'User created, but verification email failed to send.' });
        }

    } catch (error) {
        console.error("Registration Logic Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).populate('enrolledCourses.courseId');
        
        if (user && (await user.comparePassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email first' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                course: user.course,
                enrolledCourses: user.enrolledCourses,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ message: 'Email Verified Successfully! You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `<h1>Password Reset</h1><p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;

    try {
        await sendEmail({ email: user.email, subject: 'Password Reset Request', message });
        res.json({ message: "Reset link sent to email" });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(500).json({ message: "Email could not be sent" });
    }
};

export const resetPassword = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
};