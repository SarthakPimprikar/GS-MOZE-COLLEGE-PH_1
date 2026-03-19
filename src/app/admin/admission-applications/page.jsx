"use client";

import React, { useEffect, useRef, useState } from "react";

import {

  Search,

  Eye,

  Edit2,

  Calendar,

  User,

  Mail,

  Phone,

  GraduationCap,

  FileText,

  CheckCircle,

  XCircle,

  Clock,

  Zap,

  Target,

  Activity,

  MessageSquare,

  File,

  FileText as FileTextIcon,

  ChevronLeft,

  ChevronRight,

  Download,

  Upload,

  MapPin,

  ShieldCheck,

  IndianRupee,

  Tent,

  ClipboardCheck,

  AlertCircle,

  FileSpreadsheet,

  BarChart2,

  PieChart,

  Columns,

  Printer,

  Users,

  UserCheck,

  TrendingUp,

  UploadIcon,

} from "lucide-react";

import Link from "next/link";

import LoadingComponent from "@/components/Loading";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

import toast, { Toaster } from "react-hot-toast";

import { useSession } from "@/context/SessionContext";

import { Bar, Pie } from "react-chartjs-2";

import {

  Chart as ChartJS,

  CategoryScale,

  LinearScale,

  BarElement,

  Title,

  Tooltip,

  Legend,

  ArcElement,

} from "chart.js";



import { useReactToPrint } from "react-to-print";



// Register ChartJS components

ChartJS.register(

  CategoryScale,

  LinearScale,

  BarElement,

  Title,

  Tooltip,

  Legend,

  ArcElement

);



const DetailCard = ({ icon, label, value, bgColor, iconColor }) => (

  <div className="flex items-start gap-3">

    <div className={`p-2 rounded-lg ${bgColor} ${iconColor}`}>{icon}</div>

    <div>

      <p className="text-sm font-medium text-gray-500">{label}</p>

      <p className="font-medium text-gray-900">{value || "N/A"}</p>

    </div>

  </div>

);



const DetailCardDocuments = ({

  icon,

  label,

  value,

  bgColor,

  iconColor,

  fileUrl,

  viewIcon,

}) => (

  <div className="flex items-start gap-3">

    <div className={`p-2 rounded-lg ${bgColor} ${iconColor}`}>{icon}</div>

    <div>

      <p className="text-sm font-medium text-gray-500">{label}</p>

      <div className="flex items-center gap-2">

        {viewIcon}

        <p className="font-medium text-gray-900">

          {fileUrl ? (

            <a href={fileUrl} target="_blank" rel="noopener noreferrer">

              {value || "N/A"}

            </a>

          ) : (

            value || "N/A"

          )}

        </p>

      </div>

    </div>

  </div>

);



const AdmissionDetailsModal = ({ admissionId, admission, onClose }) => {

  const [application, setApplication] = useState(null);



  useEffect(() => {

    if (admissionId && admission) {

      const foundEnquiry = admission.find((e) => e._id === admissionId);

      setApplication(foundEnquiry || null);

    }

  }, [admissionId, admission]);



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



  if (!application) {

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

            <p className="text-lg font-medium">No admission found</p>

          </div>

        </div>

      </div>

    );

  }



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

                Admission Details

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

              application?.status

            )}`}

          >

            {getStatusIcon(application?.status)}

            <div>

              <p className="font-semibold">

                Status: {application?.status || "Unknown"}

              </p>

              <p className="text-sm opacity-80">

                Last updated:{" "}

                {application.updatedAt

                  ? new Date(application.updatedAt).toLocaleDateString()

                  : "N/A"}

              </p>

            </div>

          </div>



          {/* Main Details Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 px-5">

            <DetailCard

              icon={<User className="w-5 h-5" />}

              label="Full Name"

              value={application.fullName}

              bgColor="bg-blue-50"

              iconColor="text-blue-600"

            />



            <DetailCard

              icon={<Mail className="w-5 h-5" />}

              label="Email Address"

              value={application.email}

              bgColor="bg-green-50"

              iconColor="text-green-600"

            />



            <DetailCard

              icon={<Phone className="w-5 h-5" />}

              label="Student WhatsApp"

              value={application.studentWhatsappNumber}

              bgColor="bg-purple-50"

              iconColor="text-purple-600"

            />



            <DetailCard

              icon={<GraduationCap className="w-5 h-5" />}

              label="Branch"

              value={application.branch}

              bgColor="bg-orange-50"

              iconColor="text-orange-600"

            />



            <DetailCard

              icon={<Calendar className="w-5 h-5" />}

              label="Date of Birth"

              value={application.dateOfBirth}

              bgColor="bg-teal-50"

              iconColor="text-teal-600"

            />



            <DetailCard

              icon={<MessageSquare className="w-5 h-5" />}

              label="Gender"

              value={application.gender}

              bgColor="bg-pink-50"

              iconColor="text-pink-600"

            />



            <DetailCard

              icon={<MessageSquare className="w-5 h-5" />}

              label="Mother Name"

              value={application.motherName}

              bgColor="bg-pink-50"

              iconColor="text-pink-600"

            />



            <DetailCard

              icon={<Phone className="w-5 h-5" />}

              label="Parent WhatsApp"

              value={application.fatherGuardianWhatsappNumber}

              bgColor="bg-purple-50"

              iconColor="text-purple-600"

            />



            <DetailCard

              icon={<GraduationCap className="w-5 h-5" />}

              label="Program Type"

              value={application.programType}

              bgColor="bg-orange-50"

              iconColor="text-orange-600"

            />



            <DetailCard

              icon={<GraduationCap className="w-5 h-5" />}

              label="Year"

              value={application.year}

              bgColor="bg-orange-50"

              iconColor="text-orange-600"

            />



            <DetailCard

              icon={<GraduationCap className="w-5 h-5" />}

              label="Admission Round"

              value={application.round}

              bgColor="bg-orange-50"

              iconColor="text-orange-600"

            />



            <DetailCard

              icon={<GraduationCap className="w-5 h-5" />}

              label="Seat Type"

              value={application.seatType}

              bgColor="bg-orange-50"

              iconColor="text-orange-600"

            />



            <DetailCard

              icon={<GraduationCap className="w-5 h-5" />}

              label="Admission Category"

              value={application.admissionCategoryDTE}

              bgColor="bg-orange-50"

              iconColor="text-orange-600"

            />



            <DetailCard

              icon={<MessageSquare className="w-5 h-5" />}

              label="Caste (as per LC)"

              value={application.casteAsPerLC}

              bgColor="bg-pink-50"

              iconColor="text-pink-600"

            />



            <DetailCard

              icon={<MessageSquare className="w-5 h-5" />}

              label="Domicile"

              value={application.domicile}

              bgColor="bg-pink-50"

              iconColor="text-pink-600"

            />



            <DetailCard

              icon={<Tent className="w-5 h-5" />}

              label="Nationality"

              value={application.nationality}

              bgColor="bg-pink-50"

              iconColor="text-pink-600"

            />



            <DetailCard

              icon={<IndianRupee className="w-5 h-5" />}

              label="Family Income"

              value={

                application.familyIncome

                  ? `₹${application.familyIncome}`

                  : "N/A"

              }

              bgColor="bg-pink-50"

              iconColor="text-pink-600"

            />



            <DetailCard

              icon={<GraduationCap className="w-5 h-5" />}

              label="Admission Year"

              value={application.admissionYear}

              bgColor="bg-pink-50"

              iconColor="text-pink-600"

            />



            <DetailCard

              icon={<ShieldCheck className="w-5 h-5" />}

              label="PRN"

              value={application.prn || "Not Generated"}

              bgColor="bg-pink-50"

              iconColor="text-pink-600"

            />

          </div>



          {/* Address Section */}

          {application.address && application.address.length > 0 && (

            <div className="bg-gray-50 rounded-xl p-6 mb-6">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">

                  <MapPin className="w-4 h-4 text-indigo-600" />

                </div>

                <h3 className="text-lg font-semibold text-gray-900">Address</h3>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {application.address.map((addr, index) => (

                  <React.Fragment key={index}>

                    <DetailCard

                      icon={<MapPin className="w-5 h-5" />}

                      label="Address Line"

                      value={addr.addressLine}

                      bgColor="bg-purple-50"

                      iconColor="text-purple-600"

                    />

                    <DetailCard

                      icon={<MapPin className="w-5 h-5" />}

                      label="City"

                      value={addr.city}

                      bgColor="bg-purple-50"

                      iconColor="text-purple-600"

                    />

                    <DetailCard

                      icon={<MapPin className="w-5 h-5" />}

                      label="State"

                      value={addr.state}

                      bgColor="bg-purple-50"

                      iconColor="text-purple-600"

                    />

                    <DetailCard

                      icon={<MapPin className="w-5 h-5" />}

                      label="Pincode"

                      value={addr.pincode}

                      bgColor="bg-purple-50"

                      iconColor="text-purple-600"

                    />

                    <DetailCard

                      icon={<MapPin className="w-5 h-5" />}

                      label="Country"

                      value={addr.country}

                      bgColor="bg-purple-50"

                      iconColor="text-purple-600"

                    />

                  </React.Fragment>

                ))}

              </div>

            </div>

          )}



          {/* Documents Section */}

          <div className="bg-gray-50 rounded-xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">

                <File className="w-4 h-4 text-indigo-600" />

              </div>

              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>

            </div>



            {application.documents && application.documents.length > 0 ? (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {application.documents.map((doc, index) => (

                  <DetailCardDocuments

                    key={index}

                    icon={<FileTextIcon className="w-5 h-5" />}

                    label={doc.type || `Document ${index + 1}`}

                    value={doc.fileName}

                    fileUrl={doc.fileUrl}

                    bgColor="bg-purple-50"

                    viewIcon={<Eye className="w-4 h-4" />}

                    iconColor="text-purple-600"

                  />

                ))}

              </div>

            ) : (

              <p className="text-gray-500">No documents uploaded</p>

            )}

          </div>

        </div>

      </div>

    </div>

  );

};

const AdmissionApplications = () => {

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [admission, setAdmission] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage] = useState(10);

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);

  const [editingApplicationId, setEditingApplicationId] = useState(null);

  const { user } = useSession();

  const [importLoading, setImportLoading] = useState(false);

  const [importProgress, setImportProgress] = useState(0);

  const [showImportModal, setShowImportModal] = useState(false);

  const fileInputRef = useRef(null);

  const [importErrors, setImportErrors] = useState([]);

  const [showCharts, setShowCharts] = useState(true);



  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState([

    "fullName",

    "email",

    "branch",

    "programType",

    "status",

    "createdAt",

  ]);

  const printRef = useRef();

  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const exportDropdownRef = useRef(null);



  const getProgramDistributionData = () => {

    const programCounts = {};

    admission.forEach((app) => {

      if (app.programType) {

        programCounts[app.programType] =

          (programCounts[app.programType] || 0) + 1;

      }

    });



    return {

      labels: Object.keys(programCounts),

      datasets: [

        {

          label: "Applications by Program",

          data: Object.values(programCounts),

          backgroundColor: [

            "rgba(59, 130, 246, 0.7)",

            "rgba(168, 85, 247, 0.7)",

            "rgba(16, 185, 129, 0.7)",

            "rgba(245, 158, 11, 0.7)",

            "rgba(239, 68, 68, 0.7)",

          ],

          borderColor: [

            "rgba(59, 130, 246, 1)",

            "rgba(168, 85, 247, 1)",

            "rgba(16, 185, 129, 1)",

            "rgba(245, 158, 11, 1)",

            "rgba(239, 68, 68, 1)",

          ],

          borderWidth: 1,

        },

      ],

    };

  };



  const getStatusDistributionData = () => {

    const statusCounts = {

      inProcess: admission.filter((a) => a.status === "inProcess").length,

      approved: admission.filter((a) => a.status === "approved").length,

      rejected: admission.filter((a) => a.status === "rejected").length,

    };



    return {

      labels: ["In Process", "Approved", "Rejected"],

      datasets: [

        {

          label: "Applications by Status",

          data: Object.values(statusCounts),

          backgroundColor: [

            "rgba(245, 158, 11, 0.7)",

            "rgba(16, 185, 129, 0.7)",

            "rgba(239, 68, 68, 0.7)",

          ],

          borderColor: [

            "rgba(245, 158, 11, 1)",

            "rgba(16, 185, 129, 1)",

            "rgba(239, 68, 68, 1)",

          ],

          borderWidth: 1,

        },

      ],

    };

  };



  const getMonthlyTrendData = () => {

    const monthlyCounts = {};

    const currentYear = new Date().getFullYear();



    admission.forEach((app) => {

      const date = new Date(app.createdAt);

      if (date.getFullYear() === currentYear) {

        const month = date.getMonth();

        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;

      }

    });



    // Fill in missing months with 0

    const months = [

      "Jan",

      "Feb",

      "Mar",

      "Apr",

      "May",

      "Jun",

      "Jul",

      "Aug",

      "Sep",

      "Oct",

      "Nov",

      "Dec",

    ];



    const data = months.map((_, index) => monthlyCounts[index] || 0);



    return {

      labels: months,

      datasets: [

        {

          label: "Monthly Applications",

          data: data,

          backgroundColor: "rgba(59, 130, 246, 0.7)",

          borderColor: "rgba(59, 130, 246, 1)",

          borderWidth: 1,

        },

      ],

    };

  };



  const calculateGrowth = () => {

    if (admission.length < 2) return 0;



    const currentMonthCount = admission.filter((app) => {

      const appDate = new Date(app.createdAt);

      const currentDate = new Date();

      return (

        appDate.getMonth() === currentDate.getMonth() &&

        appDate.getFullYear() === currentDate.getFullYear()

      );

    }).length;



    const prevMonthCount = admission.filter((app) => {

      const appDate = new Date(app.createdAt);

      const currentDate = new Date();

      return (

        appDate.getMonth() === currentDate.getMonth() - 1 &&

        appDate.getFullYear() === currentDate.getFullYear()

      );

    }).length;



    if (prevMonthCount === 0) return currentMonthCount > 0 ? 100 : 0;

    return ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;

  };



  const getAverageProcessingTime = () => {

    const processedApps = admission.filter(

      (app) => app.status === "approved" || app.status === "rejected"

    );



    if (processedApps.length === 0) return "N/A";



    const totalDays = processedApps.reduce((sum, app) => {

      const created = new Date(app.createdAt);

      const updated = new Date(app.updatedAt);

      return sum + Math.ceil((updated - created) / (1000 * 60 * 60 * 24));

    }, 0);



    return `${Math.round(totalDays / processedApps.length)} days`;

  };



  const getTopProgram = () => {

    const programCounts = {};

    admission.forEach((app) => {

      if (app.programType) {

        programCounts[app.programType] =

          (programCounts[app.programType] || 0) + 1;

      }

    });



    const topProgram = Object.entries(programCounts).sort(

      (a, b) => b[1] - a[1]

    )[0];

    return topProgram ? `${topProgram[0]} (${topProgram[1]})` : "N/A";

  };



  const getConversionRate = () => {

    const approvedCount = admission.filter(

      (app) => app.status === "approved"

    ).length;

    return admission.length > 0

      ? `${Math.round((approvedCount / admission.length) * 100)}%`

      : "N/A";

  };



  // Handle convert admission to student

  const handleConvertToStudent = async (admissionId, studentName) => {

    if (window.confirm(`Are you sure you want to convert ${studentName} to a student profile?`)) {

      try {

        const res = await fetch(`/api/admission/${admissionId}/convert`, {

          method: 'POST',

        });

        if (!res.ok) throw new Error("Failed to convert admission");

        const result = await res.json();

        // Refresh admissions list

        fetchAdmission();

        toast.success(`Successfully converted ${studentName} to student profile`);

        console.log("Conversion result:", result);

      } catch (err) {

        console.error("Convert error:", err);

        toast.error("Failed to convert admission to student");

      }

    }

  };



  // Handle status change

  const handleStatusChange = async (admissionId, newStatus, studentName) => {

    const confirmMessage = newStatus === 'approved' 

      ? `Are you sure you want to approve ${studentName}? This will automatically convert them to a student profile.`

      : `Are you sure you want to change the status of ${studentName} to ${newStatus}?`;

      

    if (window.confirm(confirmMessage)) {

      try {

        const res = await fetch(`/api/admission/${admissionId}`, {

          method: 'PUT',

          headers: {

            'Content-Type': 'application/json',

          },

          body: JSON.stringify({ status: newStatus }),

        });



        if (!res.ok) throw new Error("Failed to update status");



        const result = await res.json();

        

        // Refresh admissions list

        await fetchAdmission();

        

        toast.success(`Status changed to ${newStatus} for ${studentName}`);

        

        // If status changed to approved, show conversion result

        if (newStatus === 'approved' && result.conversionResult) {

          if (result.conversionResult.success) {

            toast.success(`Automatically converted ${studentName} to student profile. Student ID: ${result.conversionResult.studentId}, PRN: ${result.conversionResult.prn}`);

          } else {

            toast.error(`Failed to convert ${studentName}: ${result.conversionResult.error}`);

          }

        }

      } catch (err) {

        console.error("Status change error:", err);

        toast.error("Failed to update status");

      }

    }

  };



  const fetchAdmission = async () => {

    try {

      setLoading(true);

      const res = await fetch("/api/admission");

      if (!res.ok) throw new Error("Failed to fetch Admissions");

      const admissionData = await res.json();



      // Sort by createdAt date in descending order (newest first)

      const sortedAdmissions = admissionData.data.sort((a, b) => {

        return new Date(b.createdAt) - new Date(a.createdAt);

      });



      setAdmission(sortedAdmissions);

    } catch (error) {

      setError(error.message);

      console.error("Failed to fetch admissions:", error);

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchAdmission();

  }, []);



  const statusConfig = {

    inProcess: {

      color: "bg-yellow-100 text-yellow-800",

      icon: Clock,

      label: "In Process",

    },

    approved: {

      color: "bg-green-100 text-green-800",

      icon: CheckCircle,

      label: "Approved",

    },

    rejected: {

      color: "bg-red-100 text-red-800",

      icon: XCircle,

      label: "Rejected",

    },

  };



  const filteredApplications = admission?.filter((app) => {

    const matchesSearch =

      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||

      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||

      app._id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =

      selectedFilter === "all" || app.status === selectedFilter;

    return matchesSearch && matchesFilter;

  });



  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredApplications?.slice(

    indexOfFirstItem,

    indexOfLastItem

  );



  const totalPages =

    Math.ceil(filteredApplications?.length / itemsPerPage) || 1;



  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  const openDetailsModal = (admissionId) => {

    setSelectedAdmissionId(admissionId);

    setShowDetailsModal(true);

  };



  const handleFileUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;



    // First validate the file structure before uploading

    try {

      // Read the file to check structure

      const data = await file.arrayBuffer();

      const workbook = XLSX.read(data);

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });



      // Check if file has data

      if (jsonData.length < 2) {

        // 1 header row + at least 1 data row

        toast.error("File must contain at least one row of data");

        e.target.value = "";

        return;

      }



      // Define required columns (match your backend expectations)

      const requiredColumns = [

        "DTEApplicationNumber",

        "FirstName", 

        "LastName",

        "Gender", 

        "Email",

        "StudentWhatsappNo",

        "AdmissionYear",

        "ProgramType",

        "Year", 

        "Branch",

        "Round",

        "Quota",

        "SeatType",

        "AdmissionCategoryDTE",

        "CasteAsPerLC",

        "Domicile",

        "Nationality",

        "ReligionAsPerLC",

        "IsForeignNational",

        "DateOfBirth",

        "MotherName",

        "FamilyIncome",

        "FatherGuardianWhatsappNo",

        "MotherMobileNumber",

        "Address"

      ];



      // Get header row (first row)

      const headers = jsonData[0].map((h) => h.trim());



      // Check if all required columns exist

      const missingColumns = requiredColumns.filter(

        (col) => !headers.includes(col)

      );



      if (missingColumns.length > 0) {

        toast.error(`Missing required columns: ${missingColumns.join(", ")}`);

        e.target.value = "";

        return;

      }



      // Proceed with upload if validation passes

      startFileUpload(e, file);

    } catch (error) {

      console.error("Error validating file:", error);

      toast.error("Invalid file format. Please upload a valid Excel file.");

      e.target.value = "";

    }

  };



  const startFileUpload = (e, file) => {

    // Reset state for new upload

    setImportLoading(true);

    setImportProgress(0);

    setShowImportModal(true);

    setImportErrors([]);



    const formData = new FormData();

    formData.append("file", file);

    formData.append("counsellorId", user.id);



    const xhr = new XMLHttpRequest();



    // Configure progress tracking

    xhr.upload.addEventListener("progress", (event) => {

      if (event.lengthComputable) {

        const percent = Math.round((event.loaded / event.total) * 100);

        setImportProgress(percent);

      }

    });



    xhr.addEventListener("load", async () => {

      try {

        // Check if response is valid JSON

        let result;

        try {

          result = JSON.parse(xhr.response);

        } catch (parseError) {

          console.error("JSON parse error:", parseError);

          console.error("Response text:", xhr.response);



          // The response is not valid JSON (likely HTML error page)

          toast.error("Server returned an invalid response. Please check the console for details.");

          setImportErrors([

            {

              row: "Server Error",

              errors: [

                `Status: ${xhr.status}`,

                "The server returned an invalid response format.",

                "This usually indicates a server error. Check server logs for details."

              ],

            },

          ]);

          setImportLoading(false);

          return;

        }



        await fetchAdmission();



        if (xhr.status === 200) {

          handleSuccessResponse(result);

        } else if (xhr.status === 207) {

          handlePartialSuccessResponse(result);

        } else {

          handleErrorResponse(xhr.status, result);

        }

      } catch (error) {

        console.error("Error processing response:", error);

        toast.error("Failed to process server response");

        setImportErrors([

          {

            row: "Unknown",

            errors: ["Failed to process server response: " + error.message],

          },

        ]);

      } finally {

        setImportLoading(false);

      }

    });



    xhr.addEventListener("error", () => {

      toast.error("Network error occurred during import");

      setImportLoading(false);

      setShowImportModal(false);

    });



    xhr.open("POST", "/api/importData");

    xhr.send(formData);

    e.target.value = "";



    // Helper functions for response handling

    function handleSuccessResponse(result) {

      toast.success("Import completed successfully", {

        description: `${result.insertedCount || result.totalRecords || 0

          } records imported`,

        duration: 3000,

      });

    }



    function handlePartialSuccessResponse(result) {

      const importedCount = result.insertedCount || 0;

      const duplicateCount = result.duplicates?.length || 0;

      const errorCount = result.validationErrors?.length || 0;



      let description = "";

      if (importedCount > 0)

        description += `${importedCount} records imported. `;

      if (duplicateCount > 0)

        description += `${duplicateCount} duplicates found. `;

      if (errorCount > 0) description += `${errorCount} validation errors.`;



      toast.warning("Partial import completed", {

        description,

        duration: 5000,

      });



      const allErrors = [];

      if (result.duplicates) {

        allErrors.push(

          ...result.duplicates.map((dup) => ({

            row: dup.rowNumber || "Unknown",

            errors: [`Duplicate: ${dup.dteApplicationNumber}`],

            data: dup,

          }))

        );

      }

      if (result.validationErrors) {

        allErrors.push(

          ...result.validationErrors.map((err) => ({

            row: err.row,

            errors: Array.isArray(err.errors) ? err.errors : [err.errors],

            data: err.data || null,

          }))

        );

      }

      setImportErrors(allErrors);

    }



    function handleErrorResponse(status, errorResponse) {

      if (errorResponse?.error === "All records are duplicates") {

        toast.error("Import failed - All records are duplicates", {

          description: `${errorResponse.duplicates.length} duplicate records found`,

          duration: 5000,

        });

        setImportErrors(

          errorResponse.duplicates.map((dup) => ({

            row: dup.rowNumber || "Unknown",

            errors: ["Duplicate record"],

            data: dup,

          }))

        );

      } else if (errorResponse?.error === "Validation errors found") {

        toast.error("Import failed - Validation errors", {

          description: `${errorResponse.invalidRecords} records had errors`,

          duration: 5000,

        });

        setImportErrors(errorResponse.details || []);

      } else {

        const errorMessage =

          errorResponse?.error ||

          errorResponse?.message ||

          `Server responded with status ${status}`;

        toast.error(`Import failed: ${errorMessage}`, {

          duration: 5000,

        });

      }

    }

  };

  const handleExportToExcelSample = () => {

    // const exportData = [

    //   {

    //     DTEApplicationNumber: "",

    //     FirstName: "",

    //     LastName: "",

    //     DateofBirth: "",

    //     Gender: "",

    //     Email: "",

    //     StudentWhatsappNo: ""

    //   },

    // ];



    // Change your Excel template header

const exportData = [

  {

    DTEApplicationNumber: "",

    FirstName: "",

    LastName: "",

    Gender: "",

    Email: "",

    StudentWhatsappNo: ""

  },

];



    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Admissions");



    const excelBuffer = XLSX.write(workbook, {

      bookType: "xlsx",

      type: "array",

    });



    const data = new Blob([excelBuffer], {

      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    });



    saveAs(data, "admissionSample.xlsx");

  };



  // Close dropdown when clicking outside

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (

        exportDropdownRef.current &&

        !exportDropdownRef.current.contains(event.target)

      ) {

        setShowExportDropdown(false);

      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {

      document.removeEventListener("mousedown", handleClickOutside);

    };

  }, []);



  const allColumns = [

    { id: "dteApplicationNumber", label: "DTE App No" },

    { id: "fullName", label: "Full Name" },

    { id: "email", label: "Email" },

    { id: "studentWhatsappNumber", label: "WhatsApp" },

    { id: "branch", label: "Branch" },

    { id: "programType", label: "Program" },

    { id: "year", label: "Year" },

    { id: "round", label: "Round" },

    { id: "seatType", label: "Seat Type" },

    { id: "admissionCategoryDTE", label: "Admission Category" },

    { id: "gender", label: "Gender" },

    { id: "motherName", label: "Mother Name" },

    { id: "fatherGuardianWhatsappNumber", label: "Parent WhatsApp" },

    { id: "casteAsPerLC", label: "Caste" },

    { id: "domicile", label: "Domicile" },

    { id: "nationality", label: "Nationality" },

    { id: "familyIncome", label: "Family Income" },

    { id: "admissionYear", label: "Admission Year" },

    { id: "dateOfBirth", label: "DOB" },

    { id: "status", label: "Status" },

    { id: "createdAt", label: "Created At" },

    { id: "updatedAt", label: "Updated At" },

  ];



  // Handle print functionality

  const handlePrint = useReactToPrint({

    content: () => printRef.current,

    pageStyle: `

            @page { size: auto; margin: 5mm; }

            @media print {

              body { -webkit-print-color-adjust: exact; }

              table { width: 100%; border-collapse: collapse; }

              th { background-color: #f3f4f6 !important; }

              tr { page-break-inside: avoid; }

            }

          `,

  });



  // Toggle column selection

  const toggleColumn = (columnId) => {

    setSelectedColumns((prev) =>

      prev.includes(columnId)

        ? prev.filter((id) => id !== columnId)

        : [...prev, columnId]

    );

  };



  // Reorder columns

  const moveColumn = (fromIndex, toIndex) => {

    const newColumns = [...selectedColumns];

    const [removed] = newColumns.splice(fromIndex, 1);

    newColumns.splice(toIndex, 0, removed);

    setSelectedColumns(newColumns);

  };







  const handleExportToExcel = (type = "all") => {

    setShowExportDropdown(false); // Close dropdown after selection



    if (!admission || admission.length === 0) {

      toast.error("No data to export");

      return;

    }



    try {

      // Filter data based on export type

      let dataToExport;

      switch (type) {

        case "current":

          dataToExport = currentItems;

          break;

        case "filtered":

          dataToExport = filteredApplications;

          break;

        default:

          dataToExport = admission;

      }



      // For "all" type, we want all possible columns in the original order

      const columnsToExport =

        type === "all" ? allColumns.map((col) => col.id) : selectedColumns;



      // Create headers mapping (from field name to display name)

      const headersMap = {};

      allColumns.forEach((col) => {

        headersMap[col.id] = col.label;

      });



      // Map data with the correct columns and display names

      const exportData = dataToExport.map((app) => {

        const row = {};

        columnsToExport.forEach((col) => {

          switch (col) {

            case "createdAt":

            case "updatedAt":

              row[headersMap[col] || col] = app[col]

                ? new Date(app[col]).toLocaleString()

                : "N/A";

              break;

            case "familyIncome":

              row[headersMap[col] || col] = app[col] ? `₹${app[col]}` : "N/A";

              break;

            case "address":

              row[headersMap[col] || col] =

                app.address?.[0]?.addressLine || "N/A";

              break;

            default:

              row[headersMap[col] || col] = app[col] || "N/A";

          }

        });

        return row;

      });



      // Get the display headers in the correct order

      const displayHeaders = columnsToExport.map(

        (colId) => headersMap[colId] || colId

      );



      // Create worksheet with the display headers

      const worksheet = XLSX.utils.json_to_sheet(exportData, {

        header: displayHeaders,

      });



      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Admissions");



      // Generate file name with timestamp

      const timestamp = new Date()

        .toISOString()

        .slice(0, 19)

        .replace(/[:T]/g, "-");

      const fileName = `admissions_${type}_${timestamp}`;



      // Export to Excel

      XLSX.writeFile(workbook, `${fileName}.xlsx`);

      toast.success(`Exported ${dataToExport.length} records`);



      // Also generate CSV

      const csv = XLSX.utils.sheet_to_csv(worksheet);

      const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      saveAs(csvBlob, `${fileName}.csv`);

    } catch (error) {

      console.error("Export failed:", error);

      toast.error("Export failed. Please try again.");

    }

  };



  if (loading) return <LoadingComponent />;



  if (error)

    return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="p-6 text-red-600">Error: {error}</div>

      </div>

    );



  return (

    <div className="min-h-screen bg-gray-50 p-6">

      <Toaster />

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex gap-4 pb-4 justify-end ">

          <button

            onClick={() => setShowCharts(!showCharts)}

            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br to-blue-600 from-purple-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"

          >

            {showCharts ? (

              <>

                <BarChart2 className="w-4 h-4" />

                <span>Hide Charts</span>

              </>

            ) : (

              <>

                <BarChart2 className="w-4 h-4" />

                <span>Show Charts</span>

              </>

            )}

          </button>

          <button

            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br to-blue-600 from-purple-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md w-full sm:w-auto justify-center"

            onClick={() => setShowImportModal(true)}

            disabled={importLoading}

          >

            {importLoading ? (

              <span>Importing...</span>

            ) : (

              <>

                <Download className="w-4 h-4" />

                <span>Import</span>

              </>

            )}

          </button>



          <input

            ref={fileInputRef}

            id="fileInput"

            type="file"

            accept=".xlsx, .xls, .csv"

            className="hidden"

            onChange={handleFileUpload}

          />



          {/* Import Modal */}

          {showImportModal && (

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">

              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">

                <h2 className="text-xl font-bold mb-4">

                  {importLoading ? "Uploading File..." : "Import Data"}

                </h2>



                <div className="overflow-y-auto flex-1">

                  {" "}

                  {/* Added scrolling container */}

                  {!importLoading && (

                    <div className="space-y-8">

                      {/* Supported Formats Section */}

                      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">

                          <FileSpreadsheet className="w-5 h-5 mr-2 text-blue-500" />

                          Supported Formats

                        </h3>

                        <ul className="space-y-2">

                          <li className="flex items-center text-gray-600">

                            <ChevronRight className="w-4 h-4 text-blue-400 mr-2" />

                            <span>.xlsx (Excel)</span>

                          </li>

                          <li className="flex items-center text-gray-600">

                            <ChevronRight className="w-4 h-4 text-blue-400 mr-2" />

                            <span>.xls (Excel 97-2003)</span>

                          </li>

                          <li className="flex items-center text-gray-600">

                            <ChevronRight className="w-4 h-4 text-blue-400 mr-2" />

                            <span>.csv (Comma Separated Values)</span>

                          </li>

                        </ul>

                      </div>



                      {/* Required Format Section */}

                      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

                        <div className="flex justify-between items-start mb-6">

                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">

                            <ClipboardCheck className="w-5 h-5 mr-2 text-blue-500" />

                            Required Format

                          </h3>

                          <button

                            onClick={handleExportToExcelSample}

                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"

                          >

                            <Download className="w-4 h-4 mr-2" />

                            Download Sample Template

                          </button>

                        </div>



                        <p className="text-gray-600 mb-6">

                          Ensure your file has headers in the first row and data

                          follows the specified format below.

                        </p>



                        <div className="relative rounded-xl border border-gray-200 overflow-hidden">

                          <div className="overflow-x-auto">

                            <table className="min-w-full divide-y divide-gray-200">

                              <thead className="bg-gray-50">

                                <tr>

                                  {[

                                    "DTEApplicationNumber",

                                    "FirstName",

                                    "LastName",

                                    // "DateofBirth",

                                    "Gender",

                                    "Email",

                                    "StudentWhatsappNo",

     

                                  ].map((header) => (

                                    <th

                                      key={header}

                                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"

                                    >

                                      {header}

                                    </th>

                                  ))}

                                </tr>

                              </thead>

                              <tbody className="bg-white divide-y divide-gray-200">

                                <tr className="hover:bg-gray-50 transition-colors">

                                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">

                                    DTE1234567**

                                  </td>

                                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">

                                    John

                                  </td>

                                   <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">

                                    Doe

                                  </td>

                                   {/* <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">

                                   10 Jan 1995

                                  </td> */}

                                   <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">

                                   Male

                                  </td>

                                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">

                                    email@example.com

                                  </td>

                                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">

                                    9988776655

                                  </td>

                                </tr>

                              </tbody>

                            </table>

                          </div>

                        </div>



                        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">

                          <div className="flex">

                            <AlertCircle className="h-5 w-5 text-blue-400 mr-3" />

                            <div>

                              <h4 className="text-sm font-medium text-blue-800">

                                Important Notes

                              </h4>

                              <p className="text-sm text-blue-700 mt-1">

                                • The following fields are mandatory: DTEApplicationNumber, FirstName, LastName, Gender, Email, StudentWhatsappNo., AdmissionYear, ProgramType, Year, Branch, Round, Quota, SeatType, AdmissionCategoryDTE, CasteAsPerLC, Domicile, Nationality, ReligionAsPerLC, IsForeignNational, DateOfBirth, MotherName, FamilyIncome, FatherGuardianWhatsappNo, MotherMobileNumber, Address.

                              </p>

                            </div>

                          </div>

                        </div>

                      </div>



                      {/* Error Display Section */}

                      {importErrors.length > 0 && (

                        <div className="bg-red-50 rounded-lg p-4 border border-red-100">

                          <h3 className="text-lg font-semibold text-red-800 mb-2">

                            Import Errors ({importErrors.length})

                          </h3>

                          <div className="max-h-60 overflow-y-auto">

                            {importErrors.map((error, index) => (

                              <div

                                key={index}

                                className="mb-3 p-3 bg-white rounded border border-red-100"

                              >

                                <p className="font-medium text-red-700">

                                  Row {error.row || "Unknown"}:

                                </p>

                                <ul className="list-disc list-inside text-red-600 mt-1">

                                  {error.errors?.map((err, i) => (

                                    <li key={i}>{err}</li>

                                  ))}

                                </ul>

                                {error.data && (

                                  <div className="mt-2 text-xs text-gray-600">

                                    <p>Data:</p>

                                    <pre className="bg-gray-50 p-2 rounded overflow-x-auto">

                                      {JSON.stringify(error.data, null, 2)}

                                    </pre>

                                  </div>

                                )}

                              </div>

                            ))}

                          </div>

                        </div>

                      )}

                    </div>

                  )}

                </div>



                {importLoading ? (

                  <div className="space-y-4 mt-4">

                    {" "}

                    {/* Moved outside scrollable area */}

                    <div className="w-full bg-gray-200 rounded-full h-2.5">

                      <div

                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"

                        style={{ width: `${importProgress}%` }}

                      ></div>

                    </div>

                    <p className="text-sm text-center text-gray-600">

                      Uploading... {importProgress}%

                    </p>

                    <button

                      onClick={() => {

                        setImportLoading(false);

                        setShowImportModal(false);

                      }}

                      className="w-full px-4 py-2 text-red-600 rounded-lg border border-red-300 hover:bg-red-50"

                    >

                      Cancel Upload

                    </button>

                  </div>

                ) : (

                  <div className="flex justify-end gap-3 mt-4">

                    {" "}

                    {/* Moved outside scrollable area */}

                    <button

                      onClick={() => setShowImportModal(false)}

                      className="px-4 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"

                    >

                      Cancel

                    </button>

                    <button

                      onClick={() => fileInputRef.current.click()}

                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

                    >

                      <Upload className="w-4 h-4" />

                      <span>Select File</span>

                    </button>

                  </div>

                )}

              </div>

            </div>

          )}



          {/* Column selector dropdown */}

          <div className="relative">

            <button

              onClick={() => setShowColumnSelector(!showColumnSelector)}

              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br to-blue-600 from-purple-600 text-white border border-gray-300 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md hover:bg-gray-50"

            >

              <Columns className="w-4 h-4" />

              <span>Columns</span>

            </button>



            {showColumnSelector && (

              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 border border-gray-200 p-4">

                <h3 className="font-medium text-gray-800 mb-3">

                  Select Columns

                </h3>

                <div className="space-y-2 max-h-60 overflow-y-auto">

                  {allColumns.map((column) => (

                    <label

                      key={column.id}

                      className="flex items-center space-x-2"

                    >

                      <input

                        type="checkbox"

                        checked={selectedColumns.includes(column.id)}

                        onChange={() => toggleColumn(column.id)}

                        className="rounded text-blue-600 focus:ring-blue-500"

                      />

                      <span>{column.label}</span>

                    </label>

                  ))}

                </div>



                <div className="mt-4 pt-3 border-t border-gray-200">

                  <h4 className="text-sm font-medium text-gray-700 mb-2">

                    Column Order

                  </h4>

                  <div className="space-y-2">

                    {selectedColumns.map((colId, index) => {

                      const col = allColumns.find((c) => c.id === colId);

                      return (

                        <div

                          key={colId}

                          className="flex items-center justify-between p-2 bg-gray-50 rounded"

                          draggable

                          onDragStart={(e) =>

                            e.dataTransfer.setData("text/plain", index)

                          }

                          onDragOver={(e) => e.preventDefault()}

                          onDrop={(e) => {

                            e.preventDefault();

                            const fromIndex = parseInt(

                              e.dataTransfer.getData("text/plain")

                            );

                            moveColumn(fromIndex, index);

                          }}

                        >

                          <span className="text-sm">{col?.label || colId}</span>

                          <div className="flex space-x-1">

                            {index > 0 && (

                              <button

                                onClick={() => moveColumn(index, index - 1)}

                                className="p-1 text-gray-500 hover:text-gray-700"

                              >

                                <ChevronLeft className="w-4 h-4" />

                              </button>

                            )}

                            {index < selectedColumns.length - 1 && (

                              <button

                                onClick={() => moveColumn(index, index + 1)}

                                className="p-1 text-gray-500 hover:text-gray-700"

                              >

                                <ChevronRight className="w-4 h-4" />

                              </button>

                            )}

                          </div>

                        </div>

                      );

                    })}

                  </div>

                </div>



                <button

                  onClick={() => setShowColumnSelector(false)}

                  className="mt-4 w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"

                >

                  Apply

                </button>

              </div>

            )}

          </div>



          {/* Export Button */}

          <div className="relative" ref={exportDropdownRef}>

            <button

              onClick={() => setShowExportDropdown(!showExportDropdown)}

              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br to-blue-600 from-purple-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"

            >

              <UploadIcon className="w-4 h-4" />

              <span>Export</span>

            </button>



            {showExportDropdown && (

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 border border-gray-200 py-1">

                <button

                  onClick={() => handleExportToExcel("all")}

                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"

                >

                  Export All Data

                </button>

                <button

                  onClick={() => handleExportToExcel("filtered")}

                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"

                >

                  Export Filtered Data

                </button>

                <button

                  onClick={() => handleExportToExcel("current")}

                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"

                >

                  Export Current Page

                </button>

                {/* <div className="border-t border-gray-200"></div> */}

                {/* <button

                        onClick={handlePrint}

                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"

                      >

                        <Printer className="w-4 h-4 mr-2" />

                        Print

                      </button> */}

              </div>

            )}

          </div>

        </div>

        {/* Stats Cards */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-600">

                  Total Applications

                </p>

                <p className="text-2xl font-bold text-gray-900">

                  {admission.length}

                </p>

                <p className="text-xs mt-1 text-gray-500">

                  {calculateGrowth() > 0 ? (

                    <span className="text-green-600">

                      ↑ {Math.abs(calculateGrowth()).toFixed(1)}% this month

                    </span>

                  ) : calculateGrowth() < 0 ? (

                    <span className="text-red-600">

                      ↓ {Math.abs(calculateGrowth()).toFixed(1)}% this month

                    </span>

                  ) : (

                    <span>No change</span>

                  )}

                </p>

              </div>

              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">

                <FileText className="w-6 h-6 text-white" />

              </div>

            </div>

          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-600">

                  In Process Review

                </p>

                <p className="text-2xl font-bold text-yellow-600">

                  {admission.filter((a) => a.status === "inProcess").length}

                </p>

              </div>

              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">

                <Clock className="w-6 h-6 text-white" />

              </div>

            </div>

          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-600">Approved</p>

                <p className="text-2xl font-bold text-green-600">

                  {admission.filter((a) => a.status === "approved").length}

                </p>

              </div>

              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">

                <CheckCircle className="w-6 h-6 text-white" />

              </div>

            </div>

          </div>

          <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-600">Rejected</p>

                <p className="text-2xl font-bold text-red-600">

                  {admission.filter((a) => a.status === "rejected").length}

                </p>

              </div>

              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">

                <XCircle className="w-6 h-6 text-white" />

              </div>

            </div>

          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-600">

                  Avg Processing Time

                </p>

                <p className="text-2xl font-bold text-gray-900">

                  {getAverageProcessingTime()}

                </p>

                <p className="text-xs mt-1 text-gray-500">

                  For completed applications

                </p>

              </div>

              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">

                <Clock className="w-6 h-6 text-white" />

              </div>

            </div>

          </div>

          <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-600">

                  Most Popular Program

                </p>

                <p className="text-xl font-bold text-gray-900 truncate">

                  {getTopProgram()}

                </p>

                <p className="text-xs mt-1 text-gray-500">

                  By application volume

                </p>

              </div>

              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">

                <GraduationCap className="w-6 h-6 text-white" />

              </div>

            </div>

          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-600">

                  Approval Rate

                </p>

                <p className="text-2xl font-bold text-gray-900">

                  {getConversionRate()}

                </p>

                <p className="text-xs mt-1 text-gray-500">

                  Of total applications

                </p>

              </div>

              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">

                <CheckCircle className="w-6 h-6 text-white" />

              </div>

            </div>

          </div>

        </div>



        {/* Visualization Section */}

        {showCharts && (

          <div className="space-y-6 mb-8">

            {/* Summary Cards Row */}



            {/* Charts Section */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Program Distribution */}

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

                <div className="flex items-center justify-between mb-4">

                  <div>

                    <h3 className="text-lg font-semibold text-gray-800">

                      Program Distribution

                    </h3>

                    <p className="text-sm text-gray-500">

                      Breakdown by academic programs

                    </p>

                  </div>

                  <div className="bg-blue-50 p-2 rounded-lg">

                    <PieChart className="w-5 h-5 text-blue-600" />

                  </div>

                </div>

                <div className="h-64 relative">

                  <Pie

                    data={getProgramDistributionData()}

                    options={{

                      responsive: true,

                      maintainAspectRatio: false,

                      plugins: {

                        legend: {

                          position: "right",

                          labels: {

                            usePointStyle: true,

                            padding: 16,

                          },

                        },

                        tooltip: {

                          callbacks: {

                            label: function (context) {

                              const label = context.label || "";

                              const value = context.raw || 0;

                              const total = context.dataset.data.reduce(

                                (a, b) => a + b,

                                0

                              );

                              const percentage = Math.round(

                                (value / total) * 100

                              );

                              return `${label}: ${value} (${percentage}%)`;

                            },

                          },

                        },

                      },

                      elements: {

                        arc: {

                          borderWidth: 0,

                          borderRadius: 4,

                        },

                      },

                    }}

                  />

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">

                    <span className="text-2xl font-bold text-gray-700">

                      {/* {students.length} */}

                    </span>

                    <p className="text-xs text-gray-500">Total</p>

                  </div>

                </div>

              </div>



              {/* Status Distribution */}

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

                <div className="flex items-center justify-between mb-4">

                  <div>

                    <h3 className="text-lg font-semibold text-gray-800">

                      Status Distribution

                    </h3>

                    <p className="text-sm text-gray-500">

                      Current student status overview

                    </p>

                  </div>

                  <div className="bg-green-50 p-2 rounded-lg">

                    <Activity className="w-5 h-5 text-green-600" />

                  </div>

                </div>

                <div className="h-64">

                  <Pie

                    data={getStatusDistributionData()}

                    options={{

                      responsive: true,

                      maintainAspectRatio: false,

                      plugins: {

                        legend: {

                          position: "right",

                          labels: {

                            usePointStyle: true,

                            padding: 16,

                          },

                        },

                        tooltip: {

                          callbacks: {

                            label: function (context) {

                              const label = context.label || "";

                              const value = context.raw || 0;

                              const total = context.dataset.data.reduce(

                                (a, b) => a + b,

                                0

                              );

                              const percentage = Math.round(

                                (value / total) * 100

                              );

                              return `${label}: ${value} (${percentage}%)`;

                            },

                          },

                        },

                      },

                      elements: {

                        arc: {

                          borderWidth: 0,

                          borderRadius: 4,

                        },

                      },

                    }}

                  />

                </div>

              </div>



              {/* Monthly Trend */}

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">

                  <div>

                    <h3 className="text-lg font-semibold text-gray-800">

                      Monthly Admission Trend ({new Date().getFullYear()})

                    </h3>

                    <p className="text-sm text-gray-500">

                      New student admissions by month

                    </p>

                  </div>

                  <div className="flex items-center gap-2">

                    <div className="flex items-center">

                      <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>

                      <span className="text-xs text-gray-600">Admissions</span>

                    </div>

                    <div className="bg-indigo-50 p-2 rounded-lg">

                      <BarChart2 className="w-5 h-5 text-indigo-600" />

                    </div>

                  </div>

                </div>

                <div className="h-72">

                  <Bar

                    data={getMonthlyTrendData()}

                    options={{

                      responsive: true,

                      maintainAspectRatio: false,

                      scales: {

                        y: {

                          beginAtZero: true,

                          grid: {

                            drawBorder: false,

                          },

                          ticks: {

                            precision: 0,

                          },

                        },

                        x: {

                          grid: {

                            display: false,

                          },

                        },

                      },

                      plugins: {

                        tooltip: {

                          callbacks: {

                            title: function (context) {

                              return context[0].label;

                            },

                            label: function (context) {

                              return `Admissions: ${context.raw}`;

                            },

                          },

                        },

                      },

                      elements: {

                        bar: {

                          borderRadius: 4,

                          backgroundColor: "rgba(99, 102, 241, 0.7)",

                          hoverBackgroundColor: "rgba(99, 102, 241, 1)",

                        },

                      },

                    }}

                  />

                </div>

                <div className="mt-3 flex justify-end">

                  <p className="text-xs text-gray-500">

                    Last updated: {new Date().toLocaleDateString()}

                  </p>

                </div>

              </div>

            </div>

          </div>

        )}



        {/* Filters and Search */}

        <div className="bg-white rounded-xl shadow-sm mb-6">

          <div className="p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">

              <div className="flex items-center space-x-4">

                <div className="relative">

                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                  <input

                    type="text"

                    placeholder="Search applications..."

                    value={searchTerm}

                    onChange={(e) => setSearchTerm(e.target.value)}

                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                  />

                </div>

                <select

                  value={selectedFilter}

                  onChange={(e) => setSelectedFilter(e.target.value)}

                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                >

                  <option value="all">All Status</option>

                  <option value="inProcess">In Process</option>

                  <option value="approved">Approved</option>

                  <option value="rejected">Rejected</option>

                </select>

              </div>

            </div>

          </div>



          {/* Applications Table */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 ">



                <tr>

                  {selectedColumns.map((columnId) => {

                    const column = allColumns.find((c) => c.id === columnId);

                    return (

                      <th

                        key={columnId}

                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"

                      >

                        {column ? column.label : columnId}

                      </th>

                    );

                  })}

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                    Actions

                  </th>

                </tr>

              </thead>



              <tbody className="bg-white divide-y divide-gray-200">

                {currentItems?.map((application) => (

                  <tr key={application._id} className="hover:bg-gray-50">

                    {selectedColumns.map((columnId) => (

                      <td

                        key={columnId}

                        className="px-6 py-4 whitespace-nowrap"

                      >

                        {(() => {

                          switch (columnId) {

                            case "fullName":

                              return (

                                <Link

                                  href={`/admin/admission-applications/${application._id}`}

                                  className="flex items-center hover:text-blue-600 transition-colors"

                                >

                                  <div className="flex-shrink-0 h-10 w-10">

                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">

                                      <User className="w-5 h-5 text-gray-600" />

                                    </div>

                                  </div>

                                  <div className="ml-4">

                                    <div className="text-sm font-medium text-gray-900 hover:text-blue-600">

                                      {application.fullName || "N/A"}

                                    </div>

                                    <div className="text-xs text-gray-400">

                                      ID: {application._id?.slice(-6) || "N/A"}

                                    </div>

                                  </div>

                                </Link>

                              );

                            case "status":

                              const status = application.status || "inProcess";

                              const config =

                                statusConfig[status] || statusConfig.inProcess;

                              return (

                                <span

                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}

                                >

                                  <config.icon className="w-3 h-3 mr-1" />

                                  {config.label}

                                </span>

                              );

                            case "createdAt":

                            case "updatedAt":

                              return (

                                <div className="text-sm text-gray-500">

                                  {application[columnId]

                                    ? new Date(

                                      application[columnId]

                                    ).toLocaleDateString()

                                    : "N/A"}

                                </div>

                              );

                            default:

                              return (

                                <div className="text-sm text-gray-900">

                                  {application[columnId] || "N/A"}

                                </div>

                              );

                          }

                        })()}

                      </td>

                    ))}

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">

                      <div className="flex items-center space-x-2">

                        <button

                          className="text-blue-600 hover:text-blue-900"

                          onClick={() => openDetailsModal(application._id)}

                          title="View Details"

                        >

                          <Eye className="w-4 h-4" />

                        </button>

                        <Link

                          href={`/admin/admission-applications/edit/${application._id}`}

                          className="text-gray-400 hover:text-green-600"

                          title="Edit Application"

                        >

                          <Edit2 className="w-4 h-4" />

                        </Link>

                        {/* Status Change Dropdown - Only for imported files (inProcess status) */}

                        {console.log('Application status:', application.status, 'Application:', application._id) || application.status === 'inProcess' && (

                          <div className="relative">

                            <select

                              value={application.status}

                              onChange={(e) => handleStatusChange(application._id, e.target.value, application.fullName)}

                              className="text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-2 py-1"

                              title="Change Status (Imported File)"

                            >

                              <option value="inProcess">In Process</option>

                              <option value="approved">Approved</option>

                              <option value="rejected">Rejected</option>

                            </select>

                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center" title="Imported File">i</span>

                          </div>

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

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">

              <div className="flex items-center justify-between">

                <div className="text-sm text-gray-600">

                  Showing {indexOfFirstItem + 1} to{" "}

                  {Math.min(indexOfLastItem, filteredApplications?.length)} of{" "}

                  {filteredApplications?.length} results

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



      {showDetailsModal && (

        <AdmissionDetailsModal

          admissionId={selectedAdmissionId}

          admission={admission}

          onClose={() => {

            setShowDetailsModal(false);

            setSelectedAdmissionId(null);

          }}

        />

      )}

    </div>

  );

};



export default AdmissionApplications;

