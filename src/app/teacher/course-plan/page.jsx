"use client";
import {
  Plus,
  BookOpen,
  Calendar,
  Play,
  FileText,
  File,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  Eye,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";

export default function CoursePlanList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    year: "",
    department: "",
    loadType: "",
  });
  const { user } = useSession();
  const [sortConfig, setSortConfig] = useState({
    key: "code",
    direction: "ascending",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/courses/subject");
        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await res.json();
        const subjectsData = data.subjects || [];

        const filteredSubjects = subjectsData.filter(
          (subject) =>
            subject.department === user.department &&
            subject.teacher === user.id
        );

        setCourses(filteredSubjects);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.department) {
      fetchCourses();
    }
  }, [user]);

  console.log(courses);
  
  // Apply sorting, filtering and searching
  const processedCourses = courses
    .filter((course) => {
      // Safely get properties with fallback to empty string if undefined
      const code = course.code?.toLowerCase() || "";
      const name = course.name?.toLowerCase() || "";
      const department = course.department?.toLowerCase() || "";
      const year = course.year?.toString() || "";
      const loadType = course.loadType?.toLowerCase() || "";

      const matchesSearch =
        code.includes(searchTerm.toLowerCase()) ||
        name.includes(searchTerm.toLowerCase()) ||
        department.includes(searchTerm.toLowerCase());

      const matchesFilters =
        (filters.year === "" || year === filters.year) &&
        (filters.department === "" ||
          department === filters.department.toLowerCase()) &&
        (filters.loadType === "" ||
          loadType === filters.loadType.toLowerCase());

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      // Safe sorting with fallback values
      const aValue = a[sortConfig.key]?.toString() || "";
      const bValue = b[sortConfig.key]?.toString() || "";

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get unique values for filters
  const uniqueYears = [...new Set(courses.map((course) => course.year))].sort();
  const uniqueDepartments = [
    ...new Set(courses.map((course) => course.department)),
  ].sort();
  const uniqueLoadTypes = [
    ...new Set(courses.map((course) => course.loadType)),
  ].sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Courses
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-indigo-900">
            Course Plan List
          </h1>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="dropdown relative">
              <div className="dropdown-menu absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 hidden">
                <div className="p-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={filters.year}
                      onChange={(e) =>
                        setFilters({ ...filters, year: e.target.value })
                      }
                    >
                      <option value="">All Years</option>
                      {uniqueYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={filters.department}
                      onChange={(e) =>
                        setFilters({ ...filters, department: e.target.value })
                      }
                    >
                      <option value="">All Departments</option>
                      {uniqueDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Load Type
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={filters.loadType}
                      onChange={(e) =>
                        setFilters({ ...filters, loadType: e.target.value })
                      }
                    >
                      <option value="">All Types</option>
                      {uniqueLoadTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {processedCourses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || Object.values(filters).some((f) => f !== "")
                ? "No courses match your search criteria"
                : "No courses available"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-indigo-900">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="p-3 font-semibold">#</th>
                    <th
                      className="p-3 font-semibold cursor-pointer hover:bg-indigo-200"
                      onClick={() => requestSort("code")}
                    >
                      <div className="flex items-center">
                        Subject
                        {sortConfig.key === "code" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortConfig.direction === "descending"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="p-3 font-semibold cursor-pointer hover:bg-indigo-200"
                      onClick={() => requestSort("department")}
                    >
                      <div className="flex items-center">
                        Branch
                        {sortConfig.key === "department" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortConfig.direction === "descending"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="p-3 font-semibold cursor-pointer hover:bg-indigo-200"
                      onClick={() => requestSort("year")}
                    >
                      <div className="flex items-center">
                        Year
                        {sortConfig.key === "year" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortConfig.direction === "descending"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="p-3 font-semibold">Division</th>
                    {/* <th className="p-3 font-semibold">Batch</th> */}
                    <th className="p-3 font-semibold">Load Type</th>
                    {/* <th className="p-3 font-semibold">Syllabus</th> */}
                    <th className="p-3 font-semibold">Course Plan</th>
                    <th className="p-3 font-semibold">Schedule</th>
                    <th className="p-3 font-semibold">Execute</th>
                    <th className="p-3 font-semibold">Report</th>
                    <th className="p-3 font-semibold">Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {processedCourses.map((course, index) => (
                    <tr
                      key={course._id}
                      className="border-b hover:bg-indigo-50"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
            
                          {`${course.code}: ${course.name}`}
                 
                      </td>
                      <td className="p-3">{course.department}</td>
                      <td className="p-3">{course.year}</td>
                      <td className="p-3">
                      <span
                      className={`px-6 py-1 rounded-full text-xs ${
                            course.division === "A"
                              ? "bg-green-100 text-green-800"
                              : course.division === "B"
                              ? "bg-yellow-100 text-yellow-800"
                              : course.division === "C"
                              ? "bg-indigo-100 text-indigo-800"
                              : course.division === "D"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                      >

                          {course.division || "-"}
                      </span>
                      </td>
                      {/* <td className="p-3">{course.batch || "-"}</td> */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            course.loadType === "Theory"
                              ? "bg-green-100 text-green-800"
                              : course.loadType === "Lab"
                              ? "bg-yellow-100 text-yellow-800"
                              : course.loadType === "Audit"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                            Theory
                          {/* {course.loadType} */}
                        </span>
                      </td>
                      {/* <td className="p-3">
                        <Link
                          href={`course-plan/syllabus/${course.id}`}
                          className="text-indigo-600 hover:text-indigo-800 inline-block"
                          title="View Syllabus"
                        >
                          <BookOpen size={18} />
                        </Link>
                      </td> */}
                      <td className="p-3">
                        <Link
                          href={`course-plan/${course.id}/course-view`}
                          className="text-indigo-600 hover:text-indigo-800 inline-block"
                          title="View Course Plan"
                        >
                         <Eye size={18}/>
                        </Link>
                      </td>
                      <td className="p-3">
                        <Link
                          href={`course-plan/schedules/${course.id}`}
                          className="text-indigo-600 hover:text-indigo-800 inline-block"
                          title="View Schedule"
                        >
                          <Calendar size={18} />
                        </Link>
                      </td>
                      <td className="p-3">
                        <Link
                          href={`course-plan/execute/${course.id}`}
                          className="text-indigo-600 hover:text-indigo-800 inline-block"
                          title="Execute Course"
                        >
                          <Play size={18} />
                        </Link>
                      </td>
                      <td className="p-3">
                        <Link
                          href={`/teacher/report/${course.id}`}
                          className="text-indigo-600 hover:text-indigo-800 inline-block"
                          title="View Report"
                        >
                          <FileText size={18} />
                        </Link>
                      </td>
                      <td className="p-3">
                        <Link
                          href={`/teacher/report/${course.id}/summary`}
                          className="text-indigo-600 hover:text-indigo-800 inline-block"
                          title="View Summary Report"
                        >
                          <File size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {processedCourses.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <div>
              Showing {processedCourses.length} of {courses.length} courses
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={true}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={true}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
