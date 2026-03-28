"use client";
import React, { use, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  User,
  GraduationCap,
  Calendar,
  XCircle,
  CheckCircle,
  Star,
  Mail,
  Phone,
  MessageSquare,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  Tag,
  Users,
  TrendingUp,
  Activity,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Zap,
  Target,
  Award,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import LoadingComponent from "@/components/Loading";
import toast, { Toaster } from "react-hot-toast";
import ExportButton from "@/components/ExportButton";

const EnquiryDetailsModal = ({ enquiryId, enquiries, onClose }) => {
  const [enquiry, setEnquiry] = useState(null);
  const [counselor, setCounselor] = useState("");

  useEffect(() => {
    if (enquiryId && enquiries) {
      const foundEnquiry = enquiries.find((e) => e._id === enquiryId);
      setEnquiry(foundEnquiry || null);
      // Fetch counselor details if enquiry has a counselorId
      if (foundEnquiry?.counsellorId) {
        fetchCounselor(foundEnquiry.counsellorId);
      }
    }
  }, [enquiryId, enquiries]);

  const fetchCounselor = async (counselorId) => {
    try {
      const res = await fetch(`/api/userData?id=${counselorId}`);
      if (!res.ok) throw new Error("Failed to fetch counselor");
      const data = await res.json();
      const assignCounselor = data.users;

      assignCounselor.map((user) => {
        if (user._id === counselorId) {
          setCounselor(user.fullName);
        }
      });
    } catch (error) {
      console.error("Error fetching counselor:", error);
    }
  };

  if (!enquiry) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative border border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <XCircle className="w-5 h-5" />
          </button>
          <div className="text-center py-16 text-gray-500">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No enquiry found</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <Zap className="w-4 h-4" />;
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "Contacted":
        return <Phone className="w-4 h-4" />;
      case "Converted":
        return <Target className="w-4 h-4" />;
      case "Lost":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Contacted":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Converted":
        return "bg-green-50 text-green-700 border-green-200";
      case "Lost":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Enquiry Details
              </h2>
              <p className="text-sm text-gray-600">
                Complete information overview
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-full"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Status Banner */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border mb-6 ${getStatusColor(
              enquiry.status
            )}`}
          >
            {getStatusIcon(enquiry.status)}
            <div>
              <p className="font-semibold">
                Status: {enquiry.status || "Unknown"}
              </p>
              <p className="text-sm opacity-80">
                Last updated:{" "}
                {enquiry.createdAt
                  ? new Date(enquiry.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Main Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <DetailCard
              icon={<User className="w-5 h-5" />}
              label="Full Name"
              value={
                <span className="group relative inline-block">
                  {`${enquiry.first || ""} ${enquiry.middle || ""} ${enquiry.last || ""
                    }`
                    .trim()
                    .substring(0, 25) || "N/A"}
                  {`${enquiry.first || ""} ${enquiry.middle || ""} ${enquiry.last || ""
                    }`.trim().length > 25 && (
                      <>
                        <span>...</span>
                        <span className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2">
                          {`${enquiry.first || ""} ${enquiry.middle || ""} ${enquiry.last || ""
                            }`.trim()}
                        </span>
                      </>
                    )}
                </span>
              }
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <DetailCard
              icon={<Mail className="w-5 h-5" />}
              label="Email Address"
              value={enquiry.email || "N/A"}
              bgColor="bg-green-50"
              iconColor="text-green-600"
            />
            <DetailCard
              icon={<Phone className="w-5 h-5" />}
              label="Phone Number"
              value={enquiry.phone || "N/A"}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <DetailCard
              icon={<GraduationCap className="w-5 h-5" />}
              label="Course Interested"
              value={enquiry.courseInterested || "N/A"}
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
            />
            <DetailCard
              icon={<GraduationCap className="w-5 h-5" />}
              label="Program Type"
              value={enquiry.programType || "N/A"}
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
            />
            <DetailCard
              icon={<Calendar className="w-5 h-5" />}
              label="Enquiry Date"
              value={
                enquiry.createdAt
                  ? new Date(enquiry.createdAt).toLocaleDateString()
                  : "N/A"
              }
              bgColor="bg-teal-50"
              iconColor="text-teal-600"
            />
            <DetailCard
              icon={<MessageSquare className="w-5 h-5" />}
              label="Source"
              value={enquiry.source || "N/A"}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />
            <DetailCard
              icon={<MessageSquare className="w-5 h-5" />}
              label="Enquiry Note"
              value={enquiry.notes || "N/A"}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />
            <DetailCard
              icon={<MessageSquare className="w-5 h-5" />}
              label="Assigned Counsellor"
              value={counselor || "Not Yet Assigned"}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />
          </div>

          {/* Follow-ups Section */}
          {enquiry?.followUps?.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Follow-up History
                </h3>
              </div>
              <div className="space-y-3">
                {enquiry.followUps.map((fup, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {fup.date
                              ? new Date(fup.date).toLocaleDateString()
                              : "N/A"}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Follow-up #{index + 1}
                          </span>
                        </div>
                        <p className="text-gray-700">
                          {fup?.note || "No notes available"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value, bgColor, iconColor }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
    <div className="flex items-start gap-3">
      <div className={`${bgColor} p-3 rounded-lg ${iconColor}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-base font-semibold text-gray-900 break-words">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const AssignCounselorModal = ({ onClose, onSubmit, enquiryId }) => {
  const [counselors, setCounselors] = useState([]);
  const [loadingCounselors, setLoadingCounselors] = useState(true);
  const [counselorError, setCounselorError] = useState(null);
  const [formData, setFormData] = useState({
    assignCounselor: "",
    followUpDate: "",
    followUpNote: "",
  });

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await fetch("/api/userData");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const staffUser = data.users;

        if (!Array.isArray(staffUser)) {
          throw new Error("Expected array data but got something else");
        }

        const staffUsers = staffUser.filter((user) => user.role === "staff");
        setCounselors(staffUsers);
        setCounselorError(null);
      } catch (error) {
        console.error("Failed to fetch counselors:", error);
        setCounselorError(error.message);
        setCounselors([]);
      } finally {
        setLoadingCounselors(false);
      }
    };

    fetchCounselors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(
        formData.assignCounselor,
        enquiryId,
        formData.followUpDate,
        formData.followUpNote
      );
      onClose();
      toast.success("Assign Counselor Successfully..!!");
    } catch (error) {
      toast.error(`Failed to assign counselor: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative border border-gray-100">
        <div className="flex items-center justify-between rounded-2xl p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Assign Counselor
              </h2>
              <p className="text-sm text-gray-600">
                Set up follow-up and assignment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-full"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Counselor *
            </label>
            <div className="relative">
              <select
                value={formData.assignCounselor}
                onChange={(e) =>
                  setFormData({ ...formData, assignCounselor: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 font-medium"
                required
              >
                <option value="">Choose a counselor...</option>
                {counselors.map((counselor) => (
                  <option key={counselor._id} value={counselor._id}>
                    {counselor?.fullName || "Unknown Counselor"}
                  </option>
                ))}
              </select>
              {/* <Briefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /> */}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Follow-Up Date *
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  const today = new Date().toISOString().split("T")[0];
                  if (selectedDate >= today) {
                    setFormData({ ...formData, followUpDate: selectedDate });
                  }
                }}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 font-medium"
                required
              />
              {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /> */}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Follow-Up Note *
            </label>
            <div className="relative">
              <textarea
                value={formData.followUpNote}
                onChange={(e) =>
                  setFormData({ ...formData, followUpNote: e.target.value })
                }
                rows="3"
                maxLength={50}
                placeholder="Add a note about this follow-up..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 resize-none"
                required
              />
              <MessageSquare className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg shadow-blue-500/25"
            >
              Assign Counselor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EnquiriesLeads = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignCounselorModal, setShowAssignCounselorModal] =
    useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const totalEnquiries = enquiries.length;
  const newLeads = enquiries.filter((e) => e.status === "New").length;
  const converted = enquiries.filter((e) => e.status === "Converted").length;
  const inProgress = enquiries.filter((e) => e.status === "In Progress").length;
  const conversionRate = totalEnquiries
    ? Math.round((converted / totalEnquiries) * 100)
    : 0;

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      (enquiry.first?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (enquiry.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (enquiry.courseInterested?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );

    if (activeTab === "All") return matchesSearch;
    return matchesSearch && enquiry.status === activeTab;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnquiries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [enquiriesRes, admissionsRes] = await Promise.all([
          fetch("/api/enquiry"),
          fetch("/api/admission")
        ]);

        if (!enquiriesRes.ok || !admissionsRes.ok) throw new Error("Failed to fetch data");

        const [enquiriesData, admissionsData] = await Promise.all([
          enquiriesRes.json(),
          admissionsRes.json()
        ]);

        setEnquiries(enquiriesData);
        setAdmissions(admissionsData.data || []);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Contacted":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Converted":
        return "bg-green-50 text-green-700 border-green-200";
      case "Lost":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <Zap className="w-3 h-3" />;
      case "In Progress":
        return <Clock className="w-3 h-3" />;
      case "Contacted":
        return <Phone className="w-3 h-3" />;
      case "Converted":
        return <Target className="w-3 h-3" />;
      case "Lost":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  const handleAssignCounselor = async (
    counselorId,
    enquiryId,
    followUpDate,
    followUpNote
  ) => {
    try {
      const response = await fetch(`/api/enquiry/${enquiryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          counsellorId: counselorId,
          status: "In Progress",
          followUps: [
            {
              date: new Date(followUpDate).toISOString(),
              note: followUpNote || "Assigned Counselor",
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign counselor");
      }

      const updatedEnquiry = await response.json();

      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enquiry) =>
          enquiry._id === enquiryId
            ? {
              ...enquiry,
              counsellorId: counselorId,
              status: "In Progress",
              followUps: [
                ...(enquiry.followUps || []),
                {
                  date: new Date(followUpDate).toISOString(),
                  note: followUpNote || "Assigned Counselor",
                },
              ],
            }
            : enquiry
        )
      );

      return updatedEnquiry;
    } catch (error) {
      console.error("Error assigning counselor:", error);
      throw error;
    }
  };

  const handleUpdateAdmissionStatus = async (admissionId, newStatus) => {
    try {
      const res = await fetch(`/api/admission/${admissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      const result = await res.json();
      
      // Update local state
      setAdmissions(prev => prev.map(a => a._id === admissionId ? result.data : a));
      toast.success(`Application ${newStatus} successfully!`);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const openDetailsModal = (enquiryId) => {
    setSelectedEnquiryId(enquiryId);
    setShowDetailsModal(true);
  };

  const openAssignModal = (enquiryId) => {
    setSelectedEnquiryId(enquiryId);
    setShowAssignCounselorModal(true);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <div className="p-6">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Enquiries
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalEnquiries}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className=" bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">New Leads</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {newLeads}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Converted</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {converted}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {conversionRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "All", label: "All Enquiries", count: totalEnquiries },
                { key: "New", label: "New", count: newLeads },
                { key: "In Progress", label: "In Progress", count: inProgress },
                {
                  key: "Contacted",
                  label: "Contacted",
                  count: enquiries.filter((e) => e.status === "Contacted")
                    .length,
                },
                { key: "Converted", label: "Converted", count: converted },
                {
                  key: "Lost",
                  label: "Lost",
                  count: enquiries.filter((e) => e.status === "Lost").length,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {tab.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-white text-gray-600"
                      }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search enquiries..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Enquiries Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeTab} Enquiries
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {currentItems.length} of {filteredEnquiries.length}{" "}
                  results
                </p>
              </div>
              <ExportButton
                data={filteredEnquiries.map(e => ({
                  "Full Name": `${e.first || ''} ${e.last || ''}`,
                  "Email": e.email,
                  "Phone": e.phone,
                  "Course": e.courseInterested,
                  "Status": e.status,
                  "Date": new Date(e.createdAt).toLocaleDateString()
                }))}
                filename={`Enquiries_${activeTab}`}
              />
            </div>
          </div>

          {currentItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No enquiries found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : `No ${activeTab.toLowerCase()} enquiries available`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Course & Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((enquiry) => {
                    const admission = admissions.find(a => a.enquiryId === enquiry._id || a.email === enquiry.email);
                    return (
                      <tr
                        key={enquiry._id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {(
                                  enquiry.first?.[0] ||
                                  enquiry.email?.[0] ||
                                  "?"
                                ).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <span className="group relative inline-block">
                                {`${enquiry.first || ""} ${enquiry.middle || ""
                                  } ${enquiry.last || ""}`
                                  .trim()
                                  .substring(0, 25) || "N/A"}
                                {`${enquiry.first || ""} ${enquiry.middle || ""
                                  } ${enquiry.last || ""}`.trim().length > 25 && (
                                    <>
                                      <span>...</span>
                                      <span className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2">
                                        {`${enquiry.first || ""} ${enquiry.middle || ""
                                          } ${enquiry.last || ""}`.trim()}
                                      </span>
                                    </>
                                  )}
                              </span>
                              <p className="text-sm text-gray-600">
                                {enquiry.email || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 mb-1">
                              {enquiry.courseInterested || "N/A"}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              {enquiry.phone || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                                enquiry.status
                              )}`}
                            >
                              {getStatusIcon(enquiry.status)}
                              {enquiry.status || "Unknown"}
                            </span>
                            {admission && (
                              <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md w-fit ${admission.status === 'inProcess' ? 'bg-amber-100 text-amber-700' :
                                admission.status === 'verified' ? 'bg-green-100 text-green-700' :
                                  admission.status === 'selected' ? 'bg-blue-100 text-blue-700' :
                                    admission.status === 'enrolled' ? 'bg-indigo-100 text-indigo-700' :
                                      'bg-gray-100 text-gray-600'
                                }`}>
                                Profile: {admission.status}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-gray-900 font-medium">
                              {enquiry.createdAt
                                ? new Date(enquiry.createdAt).toLocaleDateString()
                                : "N/A"}
                            </p>
                            <p className="text-gray-600">
                              {enquiry.createdAt
                                ? new Date(enquiry.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )
                                : ""}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center gap-2">
                            {admission && admission.status === 'inProcess' ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleUpdateAdmissionStatus(admission._id, 'verified')}
                                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-all shadow-sm flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" /> Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateAdmissionStatus(admission._id, 'rejected')}
                                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all shadow-sm flex items-center gap-1"
                                >
                                  <XCircle className="w-3 h-3" /> Reject
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => openDetailsModal(enquiry._id)}
                                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {enquiry.status === "New" && (
                                  <button
                                    onClick={() => openAssignModal(enquiry._id)}
                                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Assign Counselor"
                                  >
                                    <UserPlus className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredEnquiries.length)} of{" "}
                  {filteredEnquiries.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-2 text-sm rounded-lg transition-colors ${currentPage === pageNumber
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                              }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && (
        <EnquiryDetailsModal
          enquiryId={selectedEnquiryId}
          enquiries={enquiries}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEnquiryId(null);
          }}
        />
      )}

      {showAssignCounselorModal && (
        <AssignCounselorModal
          enquiryId={selectedEnquiryId}
          onClose={() => {
            setShowAssignCounselorModal(false);
            setSelectedEnquiryId(null);
          }}
          onSubmit={handleAssignCounselor}
        />
      )}
    </div>
  );
};

export default EnquiriesLeads;
