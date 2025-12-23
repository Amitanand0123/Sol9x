import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../store/authSlice';
import { Loader2, BookOpen, CheckCircle2, Clock } from 'lucide-react';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get('/courses');
                setCourses(data);
            } catch (error) {
                toast.error("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleEnroll = async (courseId) => {
        try {
            const { data } = await api.post('/courses/enroll', { courseId });
            dispatch(updateUserProfile(data));
            toast.success("Successfully enrolled!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Enrollment failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
                    </div>
                    <p className="text-gray-500">Discover and enroll in available courses</p>
                </div>

                {/* Courses Grid */}
                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => {
                            const isEnrolled = user?.enrolledCourses?.some(c => c.courseId?._id === course._id);
                            return (
                                <Card key={course._id} className="border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                                    {course.thumbnail && (
                                        <div className="h-48 w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                                            <img 
                                                src={course.thumbnail} 
                                                className="h-full w-full object-cover" 
                                                alt={course.title}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg text-gray-900 leading-tight">
                                            {course.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">by</span> {course.instructor}
                                            </p>
                                            {course.duration && (
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Clock className="h-3 w-3" />
                                                    {course.duration}
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="grow pb-4">
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                            {course.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Button 
                                            className={`w-full h-10 transition-all ${
                                                isEnrolled 
                                                    ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25' 
                                                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25'
                                            }`}
                                            disabled={isEnrolled}
                                            onClick={() => handleEnroll(course._id)}
                                        >
                                            {isEnrolled ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                    Enrolled
                                                </>
                                            ) : (
                                                "Enroll Now"
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="border-2 border-dashed border-gray-200">
                        <CardContent className="py-16 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                <BookOpen className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg mb-2">No courses available</p>
                            <p className="text-sm text-gray-400">Check back later for new courses</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Courses;