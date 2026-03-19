"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  User,
  Check,
  X,
  Clock,
  BookOpen,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useSession } from "@/context/SessionContext";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
const AttendancePage = ({ params }) => {
  const { id } = React.use(params);
  const searchParams = useSearchParams();
const moduleId = searchParams.get('moduleId') || null;
  const router = useRouter();
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [moduleName, setModuleName] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({
    date: new Date().toISOString().split("T")[0],
    students: [],
    topicName: "",
  });


  console.log(moduleId);
  
   useEffect(() => {
    const fetchModuleName = async () => {
      if (!moduleId) return;
      
      try {
        const res = await fetch(`/api/courses/course-plan/${id}?moduleId=${moduleId}`);
        if (!res.ok) throw new Error("Failed to fetch module data");
        const data = await res.json();
        
        console.log(data);
        
        const moduleName = data.modules.filter((module) => module._id === moduleId)
        console.log(moduleName[0]);
        
        if (moduleName[0].title) {
          setModuleName(moduleName[0].title);
          setAttendance(prev => ({
            ...prev,
            topicName: moduleName[0].title 
          }));
        }
      } catch (error) {
        console.error("Error fetching module name:", error);
      }
    };

    fetchModuleName();
  }, [moduleId]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/subject/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course data");
        const data = await res.json();

        const AllCourseData = data.subject;

        console.log(AllCourseData);
        
        setCourseData(AllCourseData);
        setAttendance((prev) => ({
          ...prev,
          subject: AllCourseData.name,
          year: AllCourseData.year,
          division: AllCourseData.division,
          department: AllCourseData.department,
        }));

        await fetchStudents(AllCourseData.year);
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const fetchStudents = async (year) => {
    console.log(year);

    try {
      const res = await fetch(`/api/teachers/${user.id}/students`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      console.log("Data = ",data)
      const studentsData = data.students.filter(
        (student) => student.year === year
      );

      setStudents(studentsData);
      setAttendance((prev) => ({
        ...prev,
        students: studentsData.map((student) => ({
          studentId: student.id,
          isPresent: true,
        })),
      }));
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load student data");
    }
  };
  console.log("STds = ",students)
  const toggleAttendance = (studentId) => {
    setAttendance((prev) => {
      const updatedStudents = prev.students.map((student) =>
        student.studentId === studentId
          ? { ...student, isPresent: !student.isPresent }
          : student
      );

      return {
        ...prev,
        students: updatedStudents,
      };
    });
  };

  const toggleAllAttendance = (markAsPresent) => {
    setAttendance((prev) => ({
      ...prev,
      students: prev.students.map((student) => ({
        ...student,
        isPresent: markAsPresent,
      })),
    }));
    toast.error(`Marked all students as ${markAsPresent ? "Present" : "Absent"}`);
  };

  const handleSubmit = async () => {
    if (!attendance.topicName) {
      toast.error("Please enter a topic name");
      return;
    }
    try {
      setSaving(true);

      const payload = {
        courseId: id,
        date: attendance.date,
        topic: attendance.topicName,
        attendanceRecords: attendance.students.map((student) => ({
          studentId: student.studentId,
          isPresent: student.isPresent,
        })),
        teacherId: user.id,
        subject: courseData.name,
        year: courseData.year,
        division: courseData.division,
        department: courseData.department,
      };

      console.log("Sending payload:", payload);
      
      const response = await fetch(`/api/teachers/${user.id}/dashboard/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save attendance");
      }

      toast.success("Attendance saved successfully!");
      router.push(`/teacher/course-plan/execute/${id}`);
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500 text-lg font-medium mb-4">
            Course not found
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const presentCount = attendance.students.filter((s) => s.isPresent).length;
  const absentCount = attendance.students.length - presentCount;


  console.log(attendance)
  

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Toaster/>
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-medium">
              {presentCount} Present
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-red-600 font-medium">
              {absentCount} Absent
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">
            {courseData.name}-{courseData.code}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>Faculty: {user?.fullName || "Not specified"}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>Branch: {courseData.department}</span>
            </div>
            <div className="flex items-center">
              <span>Year: {courseData.year}</span>
            </div>
            <div className="flex items-center">
              <span>Division: {courseData.division}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={attendance.date}
                  onChange={(e) =>
                    setAttendance({ ...attendance, date: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                 Module Name
                </label>
                <input
                  type="text"
                  value={attendance.topicName}
                  onChange={(e) =>
                    setAttendance({ ...attendance, topicName: e.target.value })
                  }
                  disabled
                  placeholder="Enter today's topic"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => toggleAllAttendance(true)}
                className="flex items-center px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-md hover:bg-green-100"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark All Present
              </button>
              <button
                onClick={() => toggleAllAttendance(false)}
                className="flex items-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100"
              >
                <X className="h-4 w-4 mr-2" />
                Mark All Absent
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Students Attendance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {students.map((student) => {
              const attendanceRecord = attendance.students.find(
                (s) => s.studentId === student.id
              );
              const isPresent = attendanceRecord?.isPresent ?? true;

              return (
                <div
                  key={student.id}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    isPresent
                      ? "border-green-100 bg-green-50 hover:bg-green-100"
                      : "border-red-100 bg-red-50 hover:bg-red-100"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          isPresent
                            ? "bg-green-100 hover:bg-green-200 text-green-600"
                            : "bg-red-100 hover:bg-red-200 text-red-600"
                        }`}
                      >
                        {isPresent ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                      <div>
                        <h3 className="font-medium">{student.fullName}</h3>
                        <p className="text-sm text-gray-500">
                          {student.studentId}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isPresent
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isPresent ? "Present" : "Absent"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Attendance"
          )}
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
