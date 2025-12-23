import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Eye, Plus, EyeOff, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import ForgotPasswordTrigger from '../../components/ForgotPasswordTrigger';

const AdminDashboard = () => {
    const currentAdmin = useSelector(selectCurrentUser);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        course: ''
    });

    const fetchStudents = async (pageNum) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/admin/students?page=${pageNum}&limit=5`);
            setStudents(data.students);
            setTotalPages(data.pages);
        } catch (error) {
            toast.error("Failed to fetch students");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents(page);
    }, [page]);

    const handleOpenModal = (student = null) => {
        if (student) {
            setIsEditMode(true);
            setSelectedStudent(student);
            setFormData({ name: student.name, email: student.email, course: student.course, password: '' });
        } else {
            setIsEditMode(false);
            setSelectedStudent(null);
            setFormData({ name: '', email: '', password: '', course: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            if (isEditMode) {
                await api.put(`/admin/student/${selectedStudent._id}`, formData);
                toast.success("Student updated successfully");
            } else {
                await api.post('/admin/student', formData);
                toast.success("New student added successfully");
            }
            setIsModalOpen(false);
            fetchStudents(page);
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (id === currentAdmin._id) return toast.error("You cannot delete yourself.");
        if (!confirm("Are you sure you want to delete this student?")) return;
        try {
            await api.delete(`/admin/student/${id}`);
            toast.success("Student deleted successfully");
            fetchStudents(page);
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
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
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                        </div>
                        <p className="text-gray-500">Manage student enrollment and records</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <ForgotPasswordTrigger email={currentAdmin?.email} />
                        <ChangePasswordModal />
                        <Button 
                            onClick={() => handleOpenModal()} 
                            className="bg-blue-600 hover:bg-blue-700 h-10 shadow-lg shadow-blue-600/25"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Student
                        </Button>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 border-b border-gray-200">
                                    <TableHead className="font-semibold text-gray-700">Name</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Course</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12">
                                            <Loader2 className="animate-spin mx-auto text-blue-600 h-8 w-8"/>
                                        </TableCell>
                                    </TableRow>
                                ) : students.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                                            No students found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    students.map((s) => (
                                        <TableRow key={s._id} className="hover:bg-gray-50 transition-colors">
                                            <TableCell className="font-medium text-gray-900">{s.name}</TableCell>
                                            <TableCell className="text-gray-600">{s.email}</TableCell>
                                            <TableCell className="text-gray-600">{s.course || 'Not assigned'}</TableCell>
                                            <TableCell>
                                                {s.isVerified ? (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>
                                                ) : (
                                                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => navigate(`/student-detail/${s._id}`)}
                                                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Eye className="h-4 w-4"/>
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => handleOpenModal(s)}
                                                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Pencil className="h-4 w-4"/>
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => handleDelete(s._id)}
                                                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {!loading && students.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-600">
                                Page {page} of {totalPages || 1}
                            </p>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setPage(p => p - 1)} 
                                    disabled={page === 1}
                                    className="h-9"
                                >
                                    Previous
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setPage(p => p + 1)} 
                                    disabled={page === totalPages}
                                    className="h-9"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add/Edit Student Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                {isEditMode ? 'Edit Student' : 'Add New Student'}
                            </DialogTitle>
                            <DialogDescription>
                                {isEditMode ? 'Update student information below' : 'Fill in the student details below'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                <Input 
                                    id="name" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    required 
                                    className="h-10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})} 
                                    required 
                                    disabled={isEditMode}
                                    className="h-10"
                                />
                            </div>
                            {!isEditMode && (
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                    <div className="relative">
                                        <Input 
                                            id="password" 
                                            type={showPassword ? "text" : "password"} 
                                            value={formData.password} 
                                            onChange={e => setFormData({...formData, password: e.target.value})} 
                                            required 
                                            className="h-10 pr-10"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPassword(!showPassword)} 
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="course" className="text-sm font-medium">Primary Course</Label>
                                <Input 
                                    id="course" 
                                    value={formData.course} 
                                    onChange={e => setFormData({...formData, course: e.target.value})} 
                                    placeholder="e.g. MERN Bootcamp"
                                    className="h-10"
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button 
                                onClick={handleSubmit} 
                                className="w-full h-10 bg-blue-600 hover:bg-blue-700" 
                                disabled={actionLoading}
                            >
                                {actionLoading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
                                {isEditMode ? 'Update Student' : 'Create Student'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default AdminDashboard;