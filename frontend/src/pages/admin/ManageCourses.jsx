import { useEffect, useState, useCallback } from 'react';
import api from '../../lib/axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, BookOpen, Loader2, GraduationCap } from 'lucide-react';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', instructor: '', duration: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCourses = useCallback(async () => {
        try {
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (error) {
            toast.error("Failed to fetch courses");
            console.error(error);
        }
    }, []);

    useEffect(() => { 
        fetchCourses(); 
    }, [fetchCourses]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/courses', formData);
            toast.success("Course created successfully!");
            setIsModalOpen(false);
            setFormData({ title: '', description: '', instructor: '', duration: '' });
            fetchCourses();
        } catch (error) { 
            toast.error("Error creating course"); 
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-blue-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                        </div>
                        <p className="text-gray-500">Create and manage course offerings</p>
                    </div>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 h-10 shadow-lg shadow-blue-600/25">
                                <Plus className="mr-2 h-4 w-4"/> New Course
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Add New Course</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-medium">Course Title</Label>
                                    <Input 
                                        id="title" 
                                        value={formData.title} 
                                        onChange={e => setFormData({...formData, title: e.target.value})} 
                                        required
                                        className="h-10"
                                        placeholder="e.g., Full Stack Development"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instructor" className="text-sm font-medium">Instructor Name</Label>
                                    <Input 
                                        id="instructor" 
                                        value={formData.instructor} 
                                        onChange={e => setFormData({...formData, instructor: e.target.value})} 
                                        required
                                        className="h-10"
                                        placeholder="e.g., John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration" className="text-sm font-medium">Duration</Label>
                                    <Input 
                                        id="duration" 
                                        value={formData.duration} 
                                        onChange={e => setFormData({...formData, duration: e.target.value})} 
                                        required
                                        placeholder="e.g., 8 Weeks"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                    <Textarea 
                                        id="description" 
                                        value={formData.description} 
                                        onChange={e => setFormData({...formData, description: e.target.value})} 
                                        required
                                        className="min-h-[100px] resize-none"
                                        placeholder="Course overview and learning outcomes..."
                                    />
                                </div>
                                <Button 
                                    onClick={handleCreate} 
                                    className="w-full h-10 bg-blue-600 hover:bg-blue-700" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Course"
                                    )}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                
                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.length > 0 ? (
                        courses.map(c => (
                            <Card key={c._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-base font-bold text-gray-900 leading-tight">
                                            {c.title}
                                        </CardTitle>
                                        <div className="p-1.5 bg-blue-100 rounded-lg shrink-0">
                                            <BookOpen className="h-4 w-4 text-blue-600" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 font-medium">Instructor</p>
                                        <p className="text-sm font-semibold text-blue-600">{c.instructor}</p>
                                    </div>
                                    {c.duration && (
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500 font-medium">Duration</p>
                                            <p className="text-sm font-semibold text-gray-700">{c.duration}</p>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 pt-2 border-t border-gray-100">
                                        {c.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <Card className="border-2 border-dashed border-gray-200">
                                <CardContent className="py-16 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                        <BookOpen className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 mb-2">No courses created yet</p>
                                    <p className="text-sm text-gray-400">Click "New Course" to get started</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageCourses;