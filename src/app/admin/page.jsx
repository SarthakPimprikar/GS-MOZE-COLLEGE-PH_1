"use client";
import { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  GraduationCap,
  Building,
  Award,
  BookOpen,
  FileText,
  Eye,
  TrendingUp,
  XCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import ExportButton from "@/components/ExportButton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admissionView, setAdmissionView] = useState("monthly"); // 'monthly' or 'yearly'
  const [admissionData, setAdmissionData] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const router = useRouter();
  // Fetch dashboard summary data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch admission analytics data
  useEffect(() => {
    const fetchAdmissionData = async () => {
      try {
        const response = await fetch(
          `/api/dashboard/analytics?view=${admissionView}&year=${currentYear}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch admission analytics");
        }
        const data = await response.json();
        setAdmissionData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionData();
  }, [admissionView, currentYear]);

  const processAdmissionData = () => {
    if (!admissionData?.data?.length) return { labels: [], datasets: [] };

    if (admissionView === "monthly") {
      const labels = admissionData.data.map(
        (item) => `${item.period} ${item.year}`
      );
      const totalData = admissionData.data.map((item) => item.total);
      const approvedData = admissionData.data.map((item) => item.approved);
      const inProcessData = admissionData.data.map((item) => item.inProcess);
      const rejectedData = admissionData.data.map((item) => item.rejected);

      return {
        labels,
        datasets: [
          {
            label: "Total Admissions",
            data: totalData,
            borderColor: "rgb(99, 102, 241)",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Approved",
            data: approvedData,
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderWidth: 2,
            tension: 0.4,
          },
          {
            label: "In Process",
            data: inProcessData,
            borderColor: "rgb(245, 158, 11)",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            borderWidth: 2,
            tension: 0.4,
          },
          {
            label: "Rejected",
            data: rejectedData,
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      };
    } else {
      const labels = admissionData.data.map((item) => item.period);
      const totalData = admissionData.data.map((item) => item.total);
      const approvedData = admissionData.data.map((item) => item.approved);
      const inProcessData = admissionData.data.map((item) => item.inProcess);
      const rejectedData = admissionData.data.map((item) => item.rejected);

      return {
        labels,
        datasets: [
          {
            label: "Total Admissions",
            data: totalData,
            backgroundColor: "rgba(99, 102, 241, 0.8)",
            borderColor: "rgb(99, 102, 241)",
            borderWidth: 2,
            borderRadius: 8,
          },
          {
            label: "Approved",
            data: approvedData,
            backgroundColor: "rgba(16, 185, 129, 0.8)",
            borderColor: "rgb(16, 185, 129)",
            borderWidth: 2,
            borderRadius: 8,
          },
          {
            label: "In Process",
            data: inProcessData,
            backgroundColor: "rgba(245, 158, 11, 0.8)",
            borderColor: "rgb(245, 158, 11)",
            borderWidth: 2,
            borderRadius: 8,
          },
          {
            label: "Rejected",
            data: rejectedData,
            backgroundColor: "rgba(239, 68, 68, 0.8)",
            borderColor: "rgb(239, 68, 68)",
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      };
    }
  };

  const AdmissionGraph = () => {
    const chartData = processAdmissionData();

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              size: 12,
              weight: "600",
            },
            color: "#4338ca",
            usePointStyle: true,
            padding: 20,
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          titleColor: "#312e81",
          bodyColor: "#4338ca",
          borderColor: "#c7d2fe",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          padding: 12,
          bodyFont: {
            weight: "600",
          },
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              label += context.parsed.y;
              return label;
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(99, 102, 241, 0.1)",
          },
          ticks: {
            color: "#6366f1",
            font: {
              size: 11,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#6366f1",
            font: {
              size: 11,
            },
            maxRotation: admissionView === "monthly" ? 45 : 0,
          },
        },
      },
      elements: {
        point: {
          radius: admissionView === "monthly" ? 4 : 0,
          hoverRadius: 6,
          backgroundColor: "white",
          borderWidth: 2,
        },
      },
    };

    const handleYearChange = (increment) => {
      if (admissionView === "monthly") {
        setCurrentYear((prev) => prev + increment);
      }
    };

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Admission Analytics
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {admissionView === "monthly" && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                <button
                  onClick={() => handleYearChange(-1)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                  aria-label="Previous year"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="font-medium text-gray-700 px-2">
                  {currentYear}
                </span>
                <button
                  onClick={() => handleYearChange(1)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                  aria-label="Next year"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex gap-1 bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => setAdmissionView("monthly")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${admissionView === "monthly"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAdmissionView("yearly")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${admissionView === "yearly"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        <div className="h-80">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-sm text-gray-500">
                  Loading admission data...
                </p>
              </div>
            </div>
          ) : admissionData?.data?.length > 0 ? (
            admissionView === "monthly" ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>No admission data available</p>
            </div>
          )}
        </div>

        {admissionData?.summary && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100 flex items-center gap-4">
              <div className="p-2 bg-indigo-100 rounded-full">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-900">
                  {admissionData.summary.total}
                </div>
                <div className="text-sm text-indigo-600">Total Admissions</div>
              </div>
            </div>
            <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-100 flex items-center gap-4">
              <div className="p-2 bg-emerald-100 rounded-full">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-900">
                  {admissionData.summary.average}
                </div>
                <div className="text-sm text-emerald-600">
                  Average per {admissionView === "monthly" ? "Month" : "Year"}
                </div>
              </div>
            </div>
            <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-100 flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">
                  {admissionData.summary.peak.count}
                </div>
                <div className="text-sm text-purple-600">
                  Peak {admissionView === "monthly" ? "Month" : "Year"} (
                  {admissionData.summary.peak.period})
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const stats = {
    students: {
      icon: Users,
      title: "Total Students",
      route: "/admin/student-profiles",
    },
    staff: {
      icon: UserCheck,
      title: "Total Staff",
      route: "/admin/manage-users",
    },
    teachers: {
      icon: GraduationCap,
      title: "Total Teachers",
      route: "/admin/teachers",
    },
    hr: {
      icon: Building,
      title: "HR Personnel",
      route: "/admin/hr",
    },
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-md border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <ExportButton
                data={[
                  { Metric: "Total Students", Value: dashboardData?.students || 0 },
                  { Metric: "Total Staff", Value: dashboardData?.staffs || 0 },
                  { Metric: "Total Teachers", Value: dashboardData?.teachers || 0 },
                  { Metric: "HR Personnel", Value: dashboardData?.hr || 0 },
                  { Metric: "Total HOD", Value: dashboardData?.hod || 0 },
                  { Metric: "Active Courses", Value: dashboardData?.activeCourse || 0 },
                  { Metric: "Pending Admissions", Value: dashboardData?.inProcessAdmissions || 0 },
                  { Metric: "New Enquiries", Value: dashboardData?.newEnquiries || 0 },
                ]}
                filename="admin_dashboard"
              />
            </div>
            <div className="text-sm text-gray-500">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div
            className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200"
            onClick={() => router.push(stats.students.route)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stats.students.title}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData?.students}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div
            className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200"
            onClick={() => router.push(stats.staff.route)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stats.staff.title}
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {dashboardData?.staffs}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div
            className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200"
            onClick={() => router.push(stats.teachers.route)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stats.teachers.title}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData?.teachers}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div
            className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200"
            onClick={() => router.push(stats.hr.route)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stats.hr.title}
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {dashboardData?.hr}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Admission Graph */}
        <AdmissionGraph />

        {/* Secondary Metrics */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total HOD</p>
                <p className="text-2xl font-bold text-teal-600">
                  {dashboardData?.hod || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Courses
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardData?.activeCourse || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Admissions
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {dashboardData?.inProcessAdmissions || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  New Enquiries
                </p>
                <p className="text-2xl font-bold text-fuchsia-600">
                  {dashboardData?.newEnquiries || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
