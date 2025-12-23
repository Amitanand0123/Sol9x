import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    duration: { type: String, required: true },
    thumbnail: { type: String, default: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085' },
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);