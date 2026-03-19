"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  User,
  GraduationCap,
  Clock,
  XCircle,
  Users,
  UserPlus,
  MessageSquare,
  Zap,
  Target,
  Activity,
  TrendingUp,
} from "lucide-react";
import { useSession } from "@/context/SessionContext";
import LoadingComponent from "@/components/Loading";
import toast, { Toaster } from "react-hot-toast";

const EnquiryDetailsModal = ({ enquiryId, enquiries, onClose }) => {
  const [enquiry, setEnquiry] = useState(null);

  useEffect(() => {
    if (enquiryId && enquiries) {
      const foundEnquiry = enquiries.find((e) => e._id === enquiryId);
      setEnquiry(foundEnquiry || null);
    }
  }, [enquiryId, enquiries]);

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
                  {`${enquiry.first || ""} ${enquiry.middle || ""} ${
                    enquiry.last || ""
                  }`
                    .trim()
                    .substring(0, 25) || "N/A"}
                  {`${enquiry.first || ""} ${enquiry.middle || ""} ${
                    enquiry.last || ""
                  }`.trim().length > 25 && (
                    <>
                      <span>...</span>
                      <span className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2">
                        {`${enquiry.first || ""} ${enquiry.middle || ""} ${
                          enquiry.last || ""
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
              label="Notes"
              value={enquiry.notes || "N/A"}
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
const StatusChangeModal = ({ onClose, onSubmit, enquiryId, currentStatus }) => {
  const [counselors, setCounselors] = useState([]);
  const [loadingCounselors, setLoadingCounselors] = useState(true);
  const [counselorError, setCounselorError] = useState(null);
  const [formData, setFormData] = useState({
    assignCounselor: "",
    followUpDate: "",
    followUpNote: "",
    status: currentStatus === "In Progress" ? "Contacted" : currentStatus,
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
    if (!formData.followUpDate) {
      toast("Follow-up date is required");
      return;
    }
    try {
      await onSubmit(
        enquiryId,
        formData.followUpDate,
        formData.followUpNote,
        formData.status
      );
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(`Failed to update status: ${error.message}`);
    }
  };
  const handleStatusChange = (status) => {
    if (currentStatus === "Contacted" && status === "Contacted") {
      return;
    }

    if (currentStatus === "In Progress" && status !== "Contacted") {
      return;
    }

    setFormData({ ...formData, status });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Toaster/>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative border border-gray-100">
        <div className="flex items-center rounded-2xl justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentStatus === "In Progress"
                  ? "Follow Up with Student"
                  : "Update Status"}
              </h2>
              <p className="text-sm text-gray-600">Set up follow-up details</p>
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Change Status *
            </label>
            <div className="flex justify-around">
              <div className="relative flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  id="contacted"
                  checked={formData.status === "Contacted"}
                  onChange={() => handleStatusChange("Contacted")}
                  disabled={currentStatus === "Contacted"}
                />
                <label
                  className={`block text-sm font-semibold ${
                    currentStatus === "Contacted"
                      ? "text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  Contacted
                </label>
              </div>
              <div className="relative flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  id="converted"
                  checked={formData.status === "Converted"}
                  onChange={() => handleStatusChange("Converted")}
                  disabled={currentStatus === "In Progress"}
                />
                <label
                  className={`block text-sm font-semibold ${
                    currentStatus === "In Progress"
                      ? "text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  Converted
                </label>
              </div>
              <div className="relative flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  id="lost"
                  checked={formData.status === "Lost"}
                  onChange={() => handleStatusChange("Lost")}
                  disabled={currentStatus === "In Progress"}
                />
                <label
                  className={`block text-sm font-semibold ${
                    currentStatus === "In Progress"
                      ? "text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  Lost
                </label>
              </div>
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
              {currentStatus === "In Progress"
                ? "Mark as Contacted"
                : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EnquiriesLeads = () => {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterSource, setFilterSource] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [selectedEnquiryStatus, setSelectedEnquiryStatus] = useState(null);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enquiry");
      if (!res.ok) throw new Error("Failed to fetch enquiries");
      const enquiriesData = await res.json();
      const counselorEnquiries = enquiriesData.filter(
        (enquiry) => enquiry.counsellorId === user.id
      );

      setEnquiries(counselorEnquiries);
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch enquiries:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEnquiries();
  }, []);

  const totalEnquiries = enquiries.length;
  const inProgress = enquiries.filter((e) => e.status === "In Progress").length;
  const converted = enquiries.filter((e) => e.status === "Converted").length;
  const conversionRate = totalEnquiries
    ? Math.round((converted / totalEnquiries) * 100)
    : 0;

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      (enquiry.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (enquiry.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (enquiry.course?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    if (activeTab === "All") return matchesSearch;
    return matchesSearch && enquiry.status === activeTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-indigo-100 text-indigo-800";
      case "Contacted":
        return "bg-yellow-50 text-yellow-700";
      case "Converted":
        return "bg-green-50 text-green-700";
      case "Lost":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const openDetailsModal = (enquiryId) => {
    setSelectedEnquiryId(enquiryId);
    setShowDetailsModal(true);
  };

  const handleChangeStatus = async (
    enquiryId,
    followUpDate,
    followUpNote,
    newStatus
  ) => {
    try {
      // Validate inputs
      if (!followUpDate) {
        throw new Error("Follow-up date is required");
      }

      const followUpDateObj = new Date(followUpDate);
      if (isNaN(followUpDateObj.getTime())) {
        throw new Error("Invalid follow-up date format");
      }

      // 1. Update enquiry status
      const updateResponse = await fetch(`/api/enquiry/${enquiryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          counsellorId: user.id,
          status: newStatus,
          followUps: [
            {
              date: followUpDateObj.toISOString(),
              note: followUpNote || `Status changed to ${newStatus}`,
            },
          ],
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || "Failed to update enquiry");
      }

      const updatedEnquiry = await updateResponse.json();

      // 2. Create admission if converted
      if (newStatus === "Converted") {
        const requiredFields = [
          "email",
          "phone",
          "courseInterested",
          "first",
          "last",
        ];

        const missingFields = requiredFields.filter(
          (field) => !updatedEnquiry[field]
        );

        if (missingFields.length > 0) {
          throw new Error(
            `Cannot convert: Missing ${missingFields.join(", ")} in enquiry`
          );
        }

        // Prepare admission data according to the new schema
        const admissionData = {
          enquiryId: updatedEnquiry._id,
          counsellorId: user?.id,
          email: updatedEnquiry.email,
          fullName: `${updatedEnquiry.first} ${updatedEnquiry.middle || ""} ${
            updatedEnquiry.last
          }`.trim(),
          nameAsPerAadhar: `${updatedEnquiry.first} ${
            updatedEnquiry.middle || ""
          } ${updatedEnquiry.last}`.trim(),
          firstName: updatedEnquiry.first,
          middleName: updatedEnquiry.middle || "",
          lastName: updatedEnquiry.last,
          gender: updatedEnquiry.gender || "Other",
          studentWhatsappNumber: updatedEnquiry.phone,
          branch: updatedEnquiry.courseInterested,
          programType: updatedEnquiry.programType || "",
          nationality: updatedEnquiry.nationality || "Indian",
          address: [
            {
              addressLine: updatedEnquiry.address || "Not specified",
              city: updatedEnquiry.city || "Not specified",
              state: updatedEnquiry.state || "Not specified",
              pincode: updatedEnquiry.pincode || "000000",
              country: updatedEnquiry.country || "India",
            },
          ],
          motherName: updatedEnquiry.motherName || "Not specified",
          dateOfBirth: updatedEnquiry.dateOfBirth || new Date("2000-01-01"),
          status: "inProcess",
        };

        const admissionResponse = await fetch("/api/admission", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(admissionData),
        });

        if (!admissionResponse.ok) {
          const error = await admissionResponse.json();
          throw new Error(`Admission creation failed: ${error.message}`);
        }

        // Refresh the enquiries list
        await fetchEnquiries();
        return await admissionResponse.json();
      }

      // Update local state
      setEnquiries((prev) =>
        prev.map((e) => (e._id === enquiryId ? updatedEnquiry : e))
      );

      return updatedEnquiry;
    } catch (error) {
      console.error("Status update error:", error);
      throw error;
    }
  };

  const totalPages = Math.ceil(filteredEnquiries.length / 10);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const sources = [
    "Website",
    "Social Media",
    "Referral",
    "Advertisement",
    "Walk-in",
  ];

  if (loading) return <LoadingComponent />;

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-red-600">Error: {error}</div>
      </div>
    );

  const openAssignModal = (enquiryId, currentStatus) => {
    setSelectedEnquiryId(enquiryId);
    setSelectedEnquiryStatus(currentStatus);
    setShowStatusChangeModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Stats Grid */}
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
                <p className="text-sm text-gray-600 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {inProgress}
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

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search enquiries..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {paginatedEnquiries.length} of {filteredEnquiries.length}{" "}
              enquiries
            </div>
          </div>

          {/* Status Tabs */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 mb-4">
              {["All", "In Progress", "Contacted", "Converted", "Lost"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                  >
                    <option value="all">All Sources</option>
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterSource("all");
                      setSearchTerm("");
                      setActiveTab("All");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow-up
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <span className="group relative inline-block">
                            {`${enquiry.first || ""} ${enquiry.middle || ""} ${
                              enquiry.last || ""
                            }`
                              .trim()
                              .substring(0, 25) || "N/A"}
                            {`${enquiry.first || ""} ${enquiry.middle || ""} ${
                              enquiry.last || ""
                            }`.trim().length > 25 && (
                              <>
                                <span>...</span>
                                <span className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2">
                                  {`${enquiry.first || ""} ${
                                    enquiry.middle || ""
                                  } ${enquiry.last || ""}`.trim()}
                                </span>
                              </>
                            )}
                          </span>
                          <div className="text-xs text-gray-500">
                            ID: {enquiry._id?.slice(-6) || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {enquiry.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {enquiry.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-900">
                          {enquiry.courseInterested}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                          enquiry.status
                        )}`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {enquiry.source}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {(() => {
                          const dateToShow =
                            enquiry.status === "New"
                              ? new Date(enquiry.createdAt)
                              : enquiry.followUps?.length > 0
                              ? new Date(enquiry.followUps[0].date)
                              : new Date(enquiry.createdAt);

                          const formattedDate = `${dateToShow
                            .getDate()
                            .toString()
                            .padStart(2, "0")}/${(dateToShow.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")}/${dateToShow.getFullYear()}`;

                          return <span>{formattedDate}</span>;
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          onClick={() => openDetailsModal(enquiry._id)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {(enquiry.status === "In Progress" ||
                          enquiry.status === "Contacted") && (
                          <button
                            onClick={() =>
                              openAssignModal(enquiry._id, enquiry.status)
                            }
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title={
                              enquiry.status === "In Progress"
                                ? "Mark as Contacted"
                                : "Update Status"
                            }
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page{" "}
                    <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                          currentPage === i + 1
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                        } ${i === 0 ? "rounded-l-lg" : ""} ${
                          i === totalPages - 1 ? "rounded-r-lg" : ""
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showStatusChangeModal && (
        <StatusChangeModal
          enquiryId={selectedEnquiryId}
          currentStatus={selectedEnquiryStatus}
          onClose={() => {
            setShowStatusChangeModal(false);
            setSelectedEnquiryId(null);
            setSelectedEnquiryStatus(null);
          }}
          onSubmit={handleChangeStatus}
        />
      )}
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
    </div>
  );
};

export default EnquiriesLeads;