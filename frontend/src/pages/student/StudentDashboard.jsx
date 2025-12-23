import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, updateUserProfile } from '../../store/authSlice';
import api from '../../lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, BookOpen, Trash2, User, Mail, Calendar, Pencil, GraduationCap } from 'lucide-react';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import ForgotPasswordTrigger from '../../components/ForgotPasswordTrigger';

const StudentDashboard = () => {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        course: user?.course || ''
    });

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.put('/student/profile', editForm);
            dispatch(updateUserProfile(data));
            toast.success("Profile updated successfully!");
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisenroll = async (courseId) => {
        if (!confirm("Are you sure you want to disenroll from this course?")) return;
        setIsLoading(true);
        try {
            const { data } = await api.post('/courses/disenroll', { courseId });
            dispatch(updateUserProfile(data));
            toast.success("Successfully disenrolled.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to disenroll.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">My Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user?.name}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <ForgotPasswordTrigger email={user?.email} />
                        <ChangePasswordModal />
                        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-10 gap-2 border-gray-300">
                                    <Pencil className="h-4 w-4" /> Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[480px]">
                                <DialogHeader>
                                    <DialogTitle className="text-xl">Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Update your personal information
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name" className="text-sm font-medium">Full Name</Label>
                                        <Input 
                                            id="edit-name" 
                                            value={editForm.name} 
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                                            required 
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-email" className="text-sm font-medium">Email Address</Label>
                                        <Input 
                                            id="edit-email" 
                                            type="email" 
                                            value={editForm.email} 
                                            onChange={(e) => setEditForm({...editForm, email: e.target.value})} 
                                            required 
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-course" className="text-sm font-medium">Primary Course</Label>
                                        <Input 
                                            id="edit-course" 
                                            value={editForm.course} 
                                            onChange={(e) => setEditForm({...editForm, course: e.target.value})} 
                                            required 
                                            className="h-10"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="mt-6">
                                    <Button 
                                        onClick={handleUpdateProfile} 
                                        className="w-full h-10 bg-blue-600 hover:bg-blue-700" 
                                        disabled={isLoading}
                                    >
                                        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                        Save Changes
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <Card className="lg:col-span-1 border-gray-200 shadow-sm">
                        <CardHeader className="text-center pb-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-xl">
                            <div className="flex justify-center mb-4 pt-4">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30">
                                    <User className="h-10 w-10 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-xl text-gray-900">{user?.name}</CardTitle>
                            <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mt-2">
                                {user?.role}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Mail className="h-4 w-4 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                                    <p className="font-medium text-gray-900 truncate">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <BookOpen className="h-4 w-4 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-0.5">Current Course</p>
                                    <p className="font-medium text-gray-900">{user?.course || "Not Assigned"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Calendar className="h-4 w-4 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-0.5">Enrolled Since</p>
                                    <p className="font-medium text-gray-900">{formatDate(user?.createdAt)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Enrolled Courses Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <GraduationCap className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Enrolled Courses</h2>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => navigate('/courses')}
                                className="h-9 border-gray-300"
                            >
                                Browse Courses
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user?.enrolledCourses?.length > 0 ? (
                                user.enrolledCourses.map((item) => (
                                    <Card key={item.courseId?._id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base text-gray-900">
                                                {item.courseId?.title}
                                            </CardTitle>
                                            <p className="text-sm text-gray-500">
                                                by {item.courseId?.instructor}
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full h-9 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                                onClick={() => handleDisenroll(item.courseId?._id)}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                )}
                                                Disenroll
                                            </Button>
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
                                            <p className="text-gray-500 mb-4">No courses enrolled yet</p>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => navigate('/courses')}
                                                className="h-10"
                                            >
                                                Explore Courses
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;