"use client";

import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Loader2,
} from "lucide-react";
import ExportButton from "@/components/ExportButton";
import toast, { Toaster } from "react-hot-toast";
export default function CourseManagementPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/department");
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseStatus = async (id) => {
    if (loadingStates[id]) return; // Prevent multiple toggles

    console.log(id);

    console.log(courses);


    try {
      setLoadingStates((prev) => ({ ...prev, [id]: true }));
      setError(null);

      // Find the current course
      const courseToUpdate = courses.departments?.find(
        (course) => course._id === id
      );

      if (!courseToUpdate) {
        console.log(courseToUpdate);

        throw new Error("Course not found in local state");
      }

      // Calculate new status
      const newStatus = !courseToUpdate.isActive;

      // Optimistic UI update
      setCourses((prev) => ({
        ...prev,
        departments: prev.departments.map((course) =>
          course.id === id ? { ...course, isActive: newStatus } : course
        ),
      }));

      // API call - only send isActive status
      const response = await fetch(`/api/department/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: newStatus }),
      });


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to update status (HTTP ${response.status})`
        );
      }

      toast.success(
        `Department ${newStatus ? "activated" : "deactivated"} successfully`
      );

      // Optional: refresh data if needed
      await fetchCourses();
    } catch (err) {
      console.error("Toggle error:", err);
      setError(err.message);
      // Revert optimistic update
      setCourses((prev) => ({
        ...prev,
        departments: prev.departments.map((course) =>
          course.id === id ? { ...course, isActive: !newStatus } : course
        ),
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredCourses = courses.departments?.filter((course) => {
    const matchesSearch = course.department
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (filter === "active") return matchesSearch && course.isActive;
    if (filter === "inactive") return matchesSearch && !course.isActive;
    return matchesSearch;
  });

  console.log(filteredCourses);
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-indigo-800">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error: </strong> {error}
          <button
            onClick={fetchCourses}
            className="ml-4 text-indigo-600 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">
              Course Management
            </h1>
            <p className="text-indigo-700 mt-2">
              Manage your courses and their active status
            </p>
          </div>
          <ExportButton
            data={filteredCourses.map(c => ({
              "Course": c.department,
              "Program": c.programType,
              "HOD": c.hod?.fullName || "N/A",
              "Status": c.isActive ? "Active" : "Inactive"
            }))}
            filename="Courses_List"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search courses"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg border ${filter === "all"
                  ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                  : "border-gray-300 text-gray-700"
                  }`}
                aria-pressed={filter === "all"}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-4 py-2 rounded-lg border ${filter === "active"
                  ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                  : "border-gray-300 text-gray-700"
                  }`}
                aria-pressed={filter === "active"}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("inactive")}
                className={`px-4 py-2 rounded-lg border ${filter === "inactive"
                  ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                  : "border-gray-300 text-gray-700"
                  }`}
                aria-pressed={filter === "inactive"}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider"
                  >
                    Course Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider"
                  >
                    Program Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider"
                  >
                    HOD
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr key={course?._id} className="hover:bg-indigo-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {course?.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {course?.programType}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {course?.hod?.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {course?.isActive ? (
                          <span className="bg-green-200 text-green-600 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="bg-red-200 text-red-600 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                            In Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {course.isActive ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-1" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mr-1" />
                          )}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={course.isActive ?? false}
                              onChange={() => {
                                toggleCourseStatus(course?._id);
                              }}
                              disabled={loadingStates[course?._id]}
                            />
                            <div
                              className={`
                                    w-11 h-6 rounded-full peer
                                    ${course.isActive
                                  ? "bg-indigo-600"
                                  : "bg-gray-200"
                                }
                                    ${loadingStates[course.id]
                                  ? "opacity-50"
                                  : ""
                                }
                                    peer-checked:after:translate-x-full
                                    peer-checked:after:border-white
                                    after:content-['']
                                    after:absolute
                                    after:top-0.5
                                    after:left-[2px]
                                    after:bg-white
                                    after:border-gray-300
                                    after:border
                                    after:rounded-full
                                    after:h-5
                                    after:w-5
                                    after:transition-all
                                  `}
                            ></div>
                            {loadingStates[course.id] && (
                              <Loader2 className="ml-2 h-4 w-4 text-indigo-600 animate-spin" />
                            )}
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No courses found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
