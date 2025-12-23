import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Loader2,
  ArrowLeft,
  Mail,
  Calendar,
  BookOpen,
  User,
} from "lucide-react";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        const { data } = await api.get(`/admin/student/${id}`);
        setStudent(data);
      } catch (error) {
        console.error("Failed to fetch student:", error);
        toast.error("Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Student not found</p>
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="mt-4"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="mb-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <Card className="md:col-span-1 border-gray-200 shadow-sm">
            <CardHeader className="text-center pb-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-xl">
              <div className="flex justify-center mb-4 pt-4">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <User className="h-10 w-10 text-white" />
                </div>
              </div>

              <CardTitle className="text-xl text-gray-900">
                {student.name}
              </CardTitle>

              <Badge
                className={`mt-3 ${
                  student.isVerified
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                }`}
              >
                {student.isVerified ? "Verified" : "Pending Verification"}
              </Badge>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                  <Mail className="h-3 w-3" />
                  Email Address
                </div>
                <p className="text-sm font-medium text-gray-900 break-all">
                  {student.email}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                  <Calendar className="h-3 w-3" />
                  Registration Date
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(student.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Data */}
          <Card className="md:col-span-2 border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <CardTitle className="text-lg text-gray-900">
                  Course Enrollments
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Active course registrations
                </p>
              </div>

              <Badge className="bg-blue-600 hover:bg-blue-600">
                {student.enrolledCourses?.length || 0} Total
              </Badge>
            </CardHeader>

            <CardContent className="pt-6">
              {student.enrolledCourses?.length > 0 ? (
                <div className="space-y-3">
                  {student.enrolledCourses.map((enrollment) => (
                    <div
                      key={enrollment._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-100">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {enrollment.courseId?.title || "Unknown Course"}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Instructor:{" "}
                            {enrollment.courseId?.instructor || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Enrolled
                        </p>
                        <p className="text-xs font-semibold text-gray-700 mt-0.5">
                          {formatDate(enrollment.enrolledAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    No active enrollments
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
