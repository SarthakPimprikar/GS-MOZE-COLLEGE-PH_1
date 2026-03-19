// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   Plus,
//   Trash2,
//   X,
//   Save,
//   Search,
//   FileText,
//   LayoutDashboard,
//   CreditCard,
//   Filter,
//   DollarSign,
//   TrendingUp,
//   Users,
//   AlertCircle,
//   Lock
// } from "lucide-react";
// import ExportButton from "@/components/ExportButton";
// import Card from "@/components/Card";
// import StatsCard from "@/components/StatsCard";
// import { useSession } from "@/context/SessionContext";

// export default function FeeStructurePage() {
//   // Get user session and role
//   const { user, loading: sessionLoading } = useSession();
//   const userRole = user?.role?.toLowerCase() || '';
//   const isAdmin = userRole === 'admin' || userRole === 'superadmin';
//   const isStudent = userRole === 'student';
//   const isTeacher = userRole === 'teacher';
//   const isStaff = userRole === 'staff' || userRole === 'hr';

//   const [activeTab, setActiveTab] = useState(isAdmin ? "dashboard" : "structures"); // dashboard, structures, payments
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [editingStructure, setEditingStructure] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Filter States
//   const [filterDepartment, setFilterDepartment] = useState("");
//   const [filterYear, setFilterYear] = useState("");
//   const [showFilterMenu, setShowFilterMenu] = useState(false);


//   // Data States
//   const [existingFeeStructures, setExistingFeeStructures] = useState([]);
//   const [departmentData, setDepartmentData] = useState([]);
//   const [yearList, setYearList] = useState([]);
//   const [dashboardStats, setDashboardStats] = useState({ totalCollections: 0, activeStructures: 0, totalStructureValue: 0, pendingFees: 0 });

//   // Form State
//   const [formData, setFormData] = useState({
//     programType: "",
//     departmentName: "",
//     year: "",
//     caste: "",
//     category: "",
//     yearWiseFeeStructure: "",
//     scholarshipParticular: "",
//     feesFromStudent: [],
//     feesFromSocialWelfare: [],
//     totalStudentFees: 0,
//     totalSocialWelfareFees: 0,
//     totalFees: 0,
//     paymentModes: {
//       cash: true,
//       upi: true,
//       cheque: true,
//       bankTransfer: true
//     }
//   });

//   const [studentFeeItem, setStudentFeeItem] = useState({
//     componentName: "",
//     amount: "",
//     collectionOrder: "",
//     displayOrder: "",
//   });

//   const [welfareFeeItem, setWelfareFeeItem] = useState({
//     componentName: "",
//     amount: "",
//     collectionOrder: "",
//     displayOrder: "",
//   });

//   // Refs
//   const studentComponentRef = useRef(null);
//   const studentAmountRef = useRef(null);
//   const welfareComponentRef = useRef(null);
//   const welfareAmountRef = useRef(null);

//   // Static Lists
//   const [casteList] = useState([
//     { id: "general", name: "General" },
//     { id: "obc", name: "OBC" },
//     { id: "sc", name: "SC" },
//     { id: "st", name: "ST" },
//     { id: "ews", name: "EWS" },
//   ]);

//   const [categoryList] = useState([
//     { id: "regular", name: "Regular" },
//     { id: "management", name: "Management Quota" },
//     { id: "nri", name: "NRI Quota" },
//     { id: "sports", name: "Sports Quota" },
//     { id: "defense", name: "Defense Quota" },
//   ]);

//   const [yearWiseFeeStructureList] = useState([
//     { id: "annual", name: "Annual" },
//     { id: "semester", name: "Semester" },
//     { id: "quarterly", name: "Quarterly" },
//     { id: "monthly", name: "Monthly" },
//   ]);

//   const [scholarshipList] = useState([
//     { id: "none", name: "No Scholarship" },
//     { id: "merit", name: "Merit-based Scholarship" },
//     { id: "need", name: "Need-based Scholarship" },
//     { id: "government", name: "Government Scholarship" },
//     { id: "institutional", name: "Institutional Scholarship" },
//     { id: "sports", name: "Sports Scholarship" },
//     { id: "minority", name: "Minority Scholarship" },
//   ]);

//   // Initial Data Fetching
//   useEffect(() => {
//     loadFeeStructures();
//     loadDepartments();
//   }, []);

//   const loadFeeStructures = async () => {
//     try {
//       const res = await fetch("/api/fee/feestructure");
//       const data = await res.json();
//       if (data.success && data.feeStructures) {
//         setExistingFeeStructures(data.feeStructures);
//       }
//     } catch (err) {
//       console.error("Error loading fee structures:", err);
//     }
//   };

//   const loadDepartments = async () => {
//     try {
//       const res = await fetch("/api/department");
//       const data = await res.json();
//       if (data.departments) {
//         setDepartmentData(data.departments);
//       }
//     } catch (err) {
//       console.error("Error loading departments:", err);
//     }
//   };

//   // Auto-load years when department selected
//   useEffect(() => {
//     if (formData.departmentName) {
//       const dept = departmentData.find(
//         (d) => d.department === formData.departmentName
//       );
//       if (dept) {
//         setYearList(dept.years || []);
//       }
//     }
//   }, [formData.departmentName, departmentData]);

//   // Handlers
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleStudentFeeItemChange = (e) => {
//     const { name, value } = e.target;
//     setStudentFeeItem((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleWelfareFeeItemChange = (e) => {
//     const { name, value } = e.target;
//     setWelfareFeeItem((prev) => ({ ...prev, [name]: value }));
//   };

//   const addStudentFeeItem = () => {
//     if (!studentFeeItem.componentName || !studentFeeItem.amount) {
//       alert("Please enter component name and amount");
//       return;
//     }

//     const updatedFees = [
//       ...formData.feesFromStudent,
//       {
//         componentName: studentFeeItem.componentName,
//         amount: parseFloat(studentFeeItem.amount),
//         collectionOrder: parseInt(studentFeeItem.collectionOrder) || 1,
//         displayOrder: parseInt(studentFeeItem.displayOrder) || 1,
//       },
//     ];

//     const studentTotal = updatedFees.reduce(
//       (sum, item) => sum + parseFloat(item.amount || 0),
//       0
//     );

//     setFormData((prev) => ({
//       ...prev,
//       feesFromStudent: updatedFees,
//       totalStudentFees: studentTotal,
//       totalFees: studentTotal + prev.totalSocialWelfareFees,
//     }));

//     setStudentFeeItem({
//       componentName: "",
//       amount: "",
//       collectionOrder: "",
//       displayOrder: "",
//     });

//     studentComponentRef.current?.focus();
//   };

//   const addWelfareFeeItem = () => {
//     if (!welfareFeeItem.componentName || !welfareFeeItem.amount) {
//       alert("Please enter component name and amount");
//       return;
//     }

//     const updatedFees = [
//       ...formData.feesFromSocialWelfare,
//       {
//         componentName: welfareFeeItem.componentName,
//         amount: parseFloat(welfareFeeItem.amount),
//         collectionOrder: parseInt(welfareFeeItem.collectionOrder) || 1,
//         displayOrder: parseInt(welfareFeeItem.displayOrder) || 1,
//       },
//     ];

//     const welfareTotal = updatedFees.reduce(
//       (sum, item) => sum + parseFloat(item.amount || 0),
//       0
//     );

//     setFormData((prev) => ({
//       ...prev,
//       feesFromSocialWelfare: updatedFees,
//       totalSocialWelfareFees: welfareTotal,
//       totalFees: prev.totalStudentFees + welfareTotal,
//     }));

//     setWelfareFeeItem({
//       componentName: "",
//       amount: "",
//       collectionOrder: "",
//       displayOrder: "",
//     });

//     welfareComponentRef.current?.focus();
//   };

//   const removeStudentFeeItem = (index) => {
//     const updatedFees = formData.feesFromStudent.filter((_, i) => i !== index);
//     const studentTotal = updatedFees.reduce(
//       (sum, item) => sum + parseFloat(item.amount || 0),
//       0
//     );
//     setFormData((prev) => ({
//       ...prev,
//       feesFromStudent: updatedFees,
//       totalStudentFees: studentTotal,
//       totalFees: studentTotal + prev.totalSocialWelfareFees,
//     }));
//   };

//   const removeWelfareFeeItem = (index) => {
//     const updatedFees = formData.feesFromSocialWelfare.filter((_, i) => i !== index);
//     const welfareTotal = updatedFees.reduce(
//       (sum, item) => sum + parseFloat(item.amount || 0),
//       0
//     );
//     setFormData((prev) => ({
//       ...prev,
//       feesFromSocialWelfare: updatedFees,
//       totalSocialWelfareFees: welfareTotal,
//       totalFees: prev.totalStudentFees + welfareTotal,
//     }));
//   };

//   const closeEditForm = () => {
//     setShowEditForm(false);
//     setEditingStructure(null);
//     // Reset form to add mode
//     setFormData({
//       programType: "",
//       departmentName: "",
//       year: "",
//       caste: "",
//       category: "",
//       yearWiseFeeStructure: "",
//       scholarshipParticular: "",
//       feesFromStudent: [],
//       feesFromSocialWelfare: [],
//       totalStudentFees: 0,
//       totalSocialWelfareFees: 0,
//       totalFees: 0,
//       paymentModes: {
//         cash: true,
//         upi: true,
//         cheque: true,
//         bankTransfer: true
//       }
//     });
//   };

//   const openEditForm = (structure) => {
//     setEditingStructure(structure);
//     setFormData({
//       programType: structure.programType || "",
//       departmentName: structure.departmentName || "",
//       year: structure.year || "",
//       caste: structure.caste || "",
//       category: structure.category || "",
//       yearWiseFeeStructure: structure.yearWiseFeeStructure || "",
//       scholarshipParticular: structure.scholarshipParticular || "",
//       feesFromStudent: structure.feesFromStudent || [],
//       feesFromSocialWelfare: structure.feesFromSocialWelfare || [],
//       totalStudentFees: structure.totalStudentFees || 0,
//       totalSocialWelfareFees: structure.totalSocialWelfareFees || 0,
//       totalFees: structure.totalFees || 0,
//       paymentModes: structure.paymentModes || {
//         cash: true,
//         upi: true,
//         cheque: true,
//         bankTransfer: true
//       }
//     });
//     setShowEditForm(true);
//   };

//   const handleEditSubmit = async () => {
//     if (
//       !formData.programType ||
//       !formData.departmentName ||
//       !formData.year ||
//       !formData.caste ||
//       !formData.category ||
//       (formData.feesFromStudent.length === 0 && formData.feesFromSocialWelfare.length === 0)
//     ) {
//       alert("Please fill all required fields and add at least one fee item");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await fetch(`/api/fee/feestructure?id=${editingStructure._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("Fee structure updated successfully!");
//         closeEditForm();
//         loadFeeStructures();
//       } else {
//         alert(data.error || "Failed to update fee structure");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error occurred");
//     }

//     setIsLoading(false);
//   };

//   const handleSubmit = async () => {
//     if (
//       !formData.programType ||
//       !formData.departmentName ||
//       !formData.year ||
//       (formData.feesFromStudent.length === 0 && formData.feesFromSocialWelfare.length === 0)
//     ) {
//       alert("Please fill all required fields and add at least one fee item");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/fee/feestructure", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("Fee structure saved successfully!");
//         setFormData({
//           programType: "",
//           departmentName: "",
//           year: "",
//           caste: "",
//           category: "",
//           yearWiseFeeStructure: "",
//           scholarshipParticular: "",
//           feesFromStudent: [],
//           feesFromSocialWelfare: [],
//           totalStudentFees: 0,
//           totalSocialWelfareFees: 0,
//           totalFees: 0,
//         });
//         setShowAddForm(false);
//         loadFeeStructures();
//       } else {
//         alert(data.error || "Failed to save fee structure");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error occurred");
//     }

//     setIsLoading(false);
//   };

//   const deleteFeeStructure = async (id) => {
//     if (!confirm("Are you sure you want to delete this fee structure?")) {
//       return;
//     }

//     try {
//       const res = await fetch(`/api/fee/feestructure?id=${id}`, {
//         method: "DELETE",
//       });

//       const data = await res.json();

//       if (data.success) {
//         // alert("Fee structure deleted!");
//         setExistingFeeStructures(
//           existingFeeStructures.filter((f) => f._id !== id)
//         );
//       } else {
//         alert(data.error || "Failed to delete");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error occurred");
//     }
//   };

//   // Unique Program Types from departments
//   const uniqueProgramTypes = [...new Set(departmentData.map(d => d.programType).filter(Boolean))];

//   // Departments filtered by selected program type in form
//   const filteredDepartmentsForForm = formData.programType
//     ? departmentData.filter(d => d.programType === formData.programType)
//     : departmentData;

//   // All unique departments and years for filters
//   const allDepartments = [...new Set(existingFeeStructures.map(s => s.departmentName).filter(Boolean))];
//   const allYears = [...new Set(existingFeeStructures.map(s => s.year).filter(Boolean))];

//   // Filter Logic with Department and Year filters
//   const filteredStructures = existingFeeStructures.filter((structure) => {
//     const searchLower = searchTerm.toLowerCase();
//     const matchesSearch =
//       structure.departmentName?.toLowerCase().includes(searchLower) ||
//       structure.programType?.toLowerCase().includes(searchLower) ||
//       structure.year?.toLowerCase().includes(searchLower) ||
//       structure.caste?.toLowerCase().includes(searchLower);
//     const matchesDept = filterDepartment ? structure.departmentName === filterDepartment : true;
//     const matchesYear = filterYear ? structure.year === filterYear : true;
//     return matchesSearch && matchesDept && matchesYear;
//   });

//   // Calculate Dashboard Stats from API data
//   const totalFeesConfigured = existingFeeStructures.reduce((acc, curr) => acc + (curr.totalFees || 0), 0);
//   const totalStructures = existingFeeStructures.length;
//   const totalCollections = dashboardStats.totalCollections;
//   const pendingFees = dashboardStats.pendingFees;

//   // Fetch Dashboard Stats
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await fetch('/api/fee/dashboard-stats');
//         const data = await res.json();
//         if (data.success) {
//           setDashboardStats(data.data);
//         }
//       } catch (err) {
//         console.error('Error fetching dashboard stats:', err);
//       }
//     };
//     fetchStats();
//   }, [existingFeeStructures]);



//   // Modal JSX is rendered inline below to prevent re-mounting on state changes

//   return (
//     <div className="min-h-screen bg-gray-50/50 p-6">

//       {/* Header Tabs */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 inline-flex">
//           {isAdmin && (
//             <button
//               onClick={() => setActiveTab("dashboard")}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "dashboard"
//                 ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
//                 : "text-gray-500 hover:text-indigo-900 hover:bg-indigo-50"
//                 }`}
//             >
//               <LayoutDashboard className="w-4 h-4" />
//               Dashboard
//             </button>
//           )}
//           <button
//             onClick={() => setActiveTab("structures")}
//             className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "structures"
//               ? "bg-blue-600 text-white shadow-md shadow-blue-200"
//               : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
//               }`}
//           >
//             <FileText className="w-4 h-4" />
//             Fee Structures
//           </button>
//           <button
//             onClick={() => setActiveTab("payments")}
//             className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "payments"
//               ? "bg-green-600 text-white shadow-md shadow-green-200"
//               : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
//               }`}
//           >
//             <CreditCard className="w-4 h-4" />
//             {isStudent ? "My Payments" : "Payments & Due"}
//           </button>
//         </div>

//         {/* Role Indicator for non-admins */}
//         {!isAdmin && (
//           <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
//             <Lock className="w-4 h-4" />
//             <span>Read-only access ({userRole})</span>
//           </div>
//         )}
//       </div>

//       {/* DASHBOARD TAB */}
//       {activeTab === "dashboard" && (
//         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//           {/* Header with Export Button */}
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-bold text-gray-900">Overview</h2>
//             <div className="relative">
//               <ExportButton
//                 data={existingFeeStructures.map(s => ({
//                   Department: s.departmentName,
//                   Program: s.programType,
//                   Year: s.year,
//                   Caste: s.caste || 'All',
//                   Category: s.category || 'All',
//                   "Student Fees": s.totalStudentFees || 0,
//                   "Welfare Fees": s.totalSocialWelfareFees || 0,
//                   "Total Fees": s.totalFees || 0
//                 }))}
//                 filename="Fee_Structures_Report"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <StatsCard
//               title="Total Collections"
//               value={`₹${(totalCollections / 100000).toFixed(2)}L`}
//               icon={DollarSign}
//               color="green"
//               trend="up"
//               trendValue="12%"
//             />
//             <StatsCard
//               title="Pending Fees"
//               value={`₹${(pendingFees / 100000).toFixed(2)}L`}
//               icon={AlertCircle}
//               color="orange"
//               trend="down"
//               trendValue="5%"
//             />
//             <StatsCard
//               title="Active Structures"
//               value={totalStructures}
//               icon={FileText}
//               color="blue"
//             />
//             <StatsCard
//               title="Total Value"
//               value={`₹${(totalFeesConfigured / 10000000).toFixed(2)}Cr`}
//               icon={TrendingUp}
//               color="purple"
//             />
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//               <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
//               <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400">
//                 Chart Placeholder (Transactions over time)
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//               <h3 className="text-lg font-bold text-gray-900 mb-4">Collection by Dept</h3>
//               <div className="space-y-4">
//                 {['Computer Science', 'Mechanical', 'Civil', 'Electrical'].map((dept, i) => (
//                   <div key={i} className="flex justify-between items-center">
//                     <span className="text-sm font-medium text-gray-600">{dept}</span>
//                     <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* FEE STRUCTURES TAB */}
//       {activeTab === "structures" && (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//             <div className="relative flex-1 max-w-md w-full">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search fee structures / department..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm shadow-sm"
//               />
//             </div>

//             <div className="flex gap-3 w-full sm:w-auto">
//               <div className="relative">
//                 <button
//                   onClick={() => setShowFilterMenu(!showFilterMenu)}
//                   className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium transition-colors ${filterDepartment || filterYear
//                     ? "border-blue-500 bg-blue-50 text-blue-700"
//                     : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
//                     }`}
//                 >
//                   <Filter className="w-4 h-4" />
//                   <span>Filter</span>
//                   {(filterDepartment || filterYear) && (
//                     <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
//                       {[filterDepartment, filterYear].filter(Boolean).length}
//                     </span>
//                   )}
//                 </button>

//                 {showFilterMenu && (
//                   <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20 w-64">
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-xs font-semibold text-gray-500 mb-1.5">Department</label>
//                         <select
//                           value={filterDepartment}
//                           onChange={(e) => setFilterDepartment(e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                         >
//                           <option value="">All Departments</option>
//                           {allDepartments.map((dept) => (
//                             <option key={dept} value={dept}>{dept}</option>
//                           ))}
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-xs font-semibold text-gray-500 mb-1.5">Year</label>
//                         <select
//                           value={filterYear}
//                           onChange={(e) => setFilterYear(e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                         >
//                           <option value="">All Years</option>
//                           {allYears.map((year) => (
//                             <option key={year} value={year}>{year}</option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="flex gap-2 pt-2 border-t border-gray-100">
//                         <button
//                           onClick={() => { setFilterDepartment(""); setFilterYear(""); }}
//                           className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
//                         >
//                           Clear
//                         </button>
//                         <button
//                           onClick={() => setShowFilterMenu(false)}
//                           className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                           Apply
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               {isAdmin && (
//                 <button
//                   onClick={() => setShowAddForm(true)}
//                   className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-md shadow-blue-200 w-full sm:w-auto justify-center"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span>Create New Structure</span>
//                 </button>
//               )}
//             </div>
//           </div>

//           {filteredStructures.length === 0 ? (
//             <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
//               <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <FileText className="w-8 h-8 text-blue-400" />
//               </div>
//               <h3 className="text-lg font-bold text-gray-900 mb-1">No Fee Structures Found</h3>
//               <p className="text-sm text-gray-500 mb-6">Get started by creating a new fee structure for a department.</p>
//               <button
//                 onClick={() => setShowAddForm(true)}
//                 className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm"
//               >
//                 Create Now
//               </button>
//             </div>
//           ) : (
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50/50 border-b border-gray-100">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Program / Dept</th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year / Term</th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applies To</th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Fee</th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Welfare Fee</th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
//                       <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {filteredStructures.map((structure) => (
//                       <tr
//                         key={structure._id}
//                         className="hover:bg-gray-50/50 transition-colors group"
//                       >
//                         <td className="px-6 py-4">
//                           <div className="text-sm font-medium text-gray-900">{structure.departmentName}</div>
//                           <div className="text-xs text-gray-500">{structure.programType}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
//                             {structure.year}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-700">
//                             {structure.caste ? structure.caste.toUpperCase() : "All Castes"}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {structure.category ? structure.category : "All Categories"}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">₹{structure.totalStudentFees?.toLocaleString() || 0}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">₹{structure.totalSocialWelfareFees?.toLocaleString() || 0}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg inline-block">
//                             ₹{structure.totalFees?.toLocaleString() || 0}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                           {isAdmin ? (
//                             <>
//                               <button
//                                 onClick={() => openEditForm(structure)}
//                                 className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg mr-2"
//                                 title="Edit"
//                               >
//                                 <Edit2 className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() => deleteFeeStructure(structure._id)}
//                                 className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
//                                 title="Delete"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             </>
//                           ) : (
//                             <span className="text-gray-300 text-xs">—</span>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* PAYMENTS TAB (Placeholder for now) */}
//       {activeTab === "payments" && (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
//             <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm">
//               <Download className="w-4 h-4" />
//               Export Report
//             </button>
//           </div>

//           <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
//             <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CreditCard className="w-8 h-8 text-green-400" />
//             </div>
//             <h3 className="text-lg font-bold text-gray-900">Payment Module Integration</h3>
//             <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
//               This section would show the list of student payments, due dates, and collection status.
//               It requires integration with the student database and payment gateway records.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-100 shadow-xl">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold text-gray-900">
//                 Edit Fee Structure
//               </h2>
//               <button
//                 onClick={() => setShowEditForm(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="space-y-6">
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Program Type *</label>
//                   <select
//                     name="programType"
//                     value={formData.programType}
//                     onChange={(e) => {
//                       handleInputChange(e);
//                       setFormData(prev => ({ ...prev, departmentName: "", year: "" }));
//                       setYearList([]);
//                     }}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
//                   >
//                     <option value="">Select Program Type</option>
//                     {uniqueProgramTypes.map((pt) => (
//                       <option key={pt} value={pt}>{pt}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Department Name *</label>
//                   <select
//                     name="departmentName"
//                     value={formData.departmentName}
//                     onChange={handleInputChange}
//                     disabled={!formData.programType}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <option value="">{formData.programType ? "Select Department" : "Select Program Type first"}</option>
//                     {filteredDepartmentsForForm.map((d) => (
//                       <option key={d._id} value={d.department}>{d.department}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
//                   <select
//                     name="year"
//                     value={formData.year}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
//                   >
//                     <option value="">Select Year</option>
//                     {yearList.map((y, index) => (
//                       <option key={index} value={y.year}>{y.year}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Caste *</label>
//                   <select
//                     name="caste"
//                     value={formData.caste}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
//                   >
//                     <option value="">Select Caste</option>
//                     {casteList.map((c) => (
//                       <option key={c.id} value={c.id}>{c.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
//                   >
//                     <option value="">Select Category</option>
//                     {categoryList.map((c) => (
//                       <option key={c.id} value={c.id}>{c.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Fee Structure Type</label>
//                   <select
//                     name="yearWiseFeeStructure"
//                     value={formData.yearWiseFeeStructure}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
//                   >
//                     <option value="">Select Type</option>
//                     {yearWiseFeeStructureList.map((y) => (
//                       <option key={y.id} value={y.id}>{y.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Scholarship Type</label>
//                   <select
//                     name="scholarshipParticular"
//                     value={formData.scholarshipParticular}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
//                   >
//                     <option value="">Select Scholarship</option>
//                     {scholarshipList.map((s) => (
//                       <option key={s.id} value={s.id}>{s.name}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="border-t border-gray-100 my-4"></div>

//               {/* Fee Components Section */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* Fees From Student */}
//                 <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
//                   <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
//                     <Users className="w-5 h-5" />
//                     Fees From Student
//                   </h3>

//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-3">
//                       <input
//                         ref={studentComponentRef}
//                         type="text"
//                         name="componentName"
//                         placeholder="Component Name"
//                         value={studentFeeItem.componentName}
//                         onChange={handleStudentFeeItemChange}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       />
//                       <input
//                         ref={studentAmountRef}
//                         type="number"
//                         name="amount"
//                         placeholder="Amount (₹)"
//                         value={studentFeeItem.amount}
//                         onChange={handleStudentFeeItemChange}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-3">
//                       <input
//                         type="number"
//                         name="collectionOrder"
//                         placeholder="Collection Order"
//                         title="Order in which fees are collected"
//                         value={studentFeeItem.collectionOrder}
//                         onChange={handleStudentFeeItemChange}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       />
//                       <input
//                         type="number"
//                         name="displayOrder"
//                         placeholder="Display Rank (1=first)"
//                         title="Ranking for display sequence (1 appears first)"
//                         value={studentFeeItem.displayOrder}
//                         onChange={handleStudentFeeItemChange}
//                         onKeyPress={(e) => e.key === "Enter" && addStudentFeeItem()}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       />
//                     </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={addStudentFeeItem}
//                       className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md shadow-blue-200"
//                     >
//                       Add Student Fee Component
//                     </button>
//                   </div>

//                   {/* Student Fee List */}
//                   <div className="mt-5 space-y-2 max-h-60 overflow-y-auto pr-1">
//                     {formData.feesFromStudent.length === 0 && (
//                       <p className="text-sm text-gray-400 text-center italic py-2">No components added yet.</p>
//                     )}
//                     {formData.feesFromStudent.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex justify-between items-center bg-white p-3 border border-blue-100 rounded-xl shadow-sm"
//                       >
//                         <div className="flex-1">
//                           <p className="text-sm font-semibold text-gray-900">{item.componentName}</p>
//                           <p className="text-xs text-gray-500 mt-0.5">
//                             Col: {item.collectionOrder} • Disp: {item.displayOrder}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span className="text-sm font-bold text-blue-600">₹{item.amount}</span>
//                           <button
//                             type="button"
//                             onClick={() => removeStudentFeeItem(index)}
//                             className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all"
//                             title="Remove"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-4 pt-3 border-t border-blue-100 flex justify-between items-center">
//                     <span className="text-sm font-medium text-blue-800">Total Student Fees</span>
//                     <span className="text-lg font-bold text-blue-700">₹{formData.totalStudentFees.toLocaleString()}</span>
//                   </div>
//                 </div>

//                 {/* Fees From Social Welfare */}
//                 <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5">
//                   <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
//                     <AlertCircle className="w-5 h-5" />
//                     Fees From Social Welfare
//                   </h3>

//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-3">
//                       <input
//                         ref={welfareComponentRef}
//                         type="text"
//                         name="componentName"
//                         placeholder="Component Name"
//                         value={welfareFeeItem.componentName}
//                         onChange={handleWelfareFeeItemChange}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                       <input
//                         ref={welfareAmountRef}
//                         type="number"
//                         name="amount"
//                         placeholder="Amount (₹)"
//                         value={welfareFeeItem.amount}
//                         onChange={handleWelfareFeeItemChange}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-3">
//                       <input
//                         type="number"
//                         name="collectionOrder"
//                         placeholder="Collection Order"
//                         title="Order in which fees are collected"
//                         value={welfareFeeItem.collectionOrder}
//                         onChange={handleWelfareFeeItemChange}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                       <input
//                         type="number"
//                         name="displayOrder"
//                         placeholder="Display Rank (1=first)"
//                         title="Ranking for display sequence (1 appears first)"
//                         value={welfareFeeItem.displayOrder}
//                         onChange={handleWelfareFeeItemChange}
//                         onKeyPress={(e) => e.key === "Enter" && addWelfareFeeItem()}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                     </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={addWelfareFeeItem}
//                       className="w-full px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold shadow-md shadow-green-200"
//                     >
//                       Add Welfare Fee Component
//                     </button>
//                   </div>

//                   {/* Welfare Fee List */}
//                   <div className="mt-5 space-y-2 max-h-60 overflow-y-auto pr-1">
//                     {formData.feesFromSocialWelfare.length === 0 && (
//                       <p className="text-sm text-gray-400 text-center italic py-2">No components added yet.</p>
//                     )}
//                     {formData.feesFromSocialWelfare.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex justify-between items-center bg-white p-3 border border-green-100 rounded-xl shadow-sm"
//                       >
//                         <div className="flex-1">
//                           <p className="text-sm font-semibold text-gray-900">{item.componentName}</p>
//                           <p className="text-xs text-gray-500 mt-0.5">
//                             Col: {item.collectionOrder} • Disp: {item.displayOrder}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span className="text-sm font-bold text-green-600">₹{item.amount}</span>
//                           <button
//                             type="button"
//                             onClick={() => removeWelfareFeeItem(index)}
//                             className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all"
//                             title="Remove"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-4 pt-3 border-t border-green-100 flex justify-between items-center">
//                     <span className="text-sm font-medium text-green-800">Total Welfare Fees</span>
//                     <span className="text-lg font-bold text-green-700">₹{formData.totalSocialWelfareFees.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="border-t border-gray-100 my-4"></div>

//               {/* Grand Total */}
//               <div className="bg-gray-900 p-5 rounded-2xl text-white flex justify-between items-center shadow-lg">
//                 <div className="text-gray-300 text-sm">Total Fee Structure Value</div>
//                 <div className="text-3xl font-bold">₹{formData.totalFees.toLocaleString()}</div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   onClick={closeEditForm}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleEditSubmit}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-md shadow-blue-200"
//                 >
//                   Update Fee Structure
//                 </button>
//               </div>
//             </div>
          
//       )}
//       {/* Add Fee Structure Modal - Rendered inline to prevent focus loss */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-100 shadow-xl">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold text-gray-900">
//                 Create New Fee Structure
//               </h2>
//               <button
//                 onClick={() => setShowAddForm(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="space-y-6">
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Program Type *</label>
//                   <select
//                     name="programType"
//                     value={formData.programType}
//                     onChange={(e) => {
//                       handleInputChange(e);
//                       setFormData(prev => ({ ...prev, departmentName: "", year: "" }));
//                       setYearList([]);
//                     }}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
//                   >
//                     <option value="">Select Program Type</option>
//                     {uniqueProgramTypes.map((pt) => (
//                       <option key={pt} value={pt}>{pt}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Department Name *</label>
//                   <select
//                     name="departmentName"
//                     value={formData.departmentName}
//                     onChange={handleInputChange}
//                     disabled={!formData.programType}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <option value="">{formData.programType ? "Select Department" : "Select Program Type first"}</option>
//                     {filteredDepartmentsForForm.map((d) => (
//                       <option key={d._id} value={d.department}>{d.department}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
//                   <select
//                     name="year"
//                     value={formData.year}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
//                   >
//                     <option value="">Select Year</option>
//                     {yearList.map((y, index) => (
//                       <option key={index} value={y.year}>{y.year}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Caste *</label>
//                   <select
//                     name="caste"
//                     value={formData.caste}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
//                   >
//                     <option value="">Select Caste</option>
//                     {casteList.map((c) => (
//                       <option key={c.id} value={c.id}>{c.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
//                   >
//                     <option value="">Select Category</option>
//                     {categoryList.map((c) => (
//                       <option key={c.id} value={c.id}>{c.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Fee Structure Type</label>
//                   <select
//                     name="yearWiseFeeStructure"
//                     value={formData.yearWiseFeeStructure}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
//                   >
//                     <option value="">Select Type</option>
//                     {yearWiseFeeStructureList.map((y) => (
//                       <option key={y.id} value={y.id}>{y.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">Scholarship Type</label>
//                   <select
//                     name="scholarshipParticular"
//                     value={formData.scholarshipParticular}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
//                   >
//                     <option value="">Select Scholarship</option>
//                     {scholarshipList.map((s) => (
//                       <option key={s.id} value={s.id}>{s.name}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Payment Modes Section */}
//               <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border border-purple-100">
//                 <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
//                   <CreditCard className="w-4 h-4 text-purple-600" />
//                   Accepted Payment Modes
//                 </h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {[
//                     { key: 'cash', label: 'Cash', icon: '💵', receiptInfo: 'Signature line, Received by' },
//                     { key: 'upi', label: 'UPI', icon: '📱', receiptInfo: 'Transaction ID, UPI Reference' },
//                     { key: 'cheque', label: 'Cheque', icon: '📝', receiptInfo: 'Cheque No., Bank Name' },
//                     { key: 'bankTransfer', label: 'Bank Transfer', icon: '🏦', receiptInfo: 'Account No., IFSC, Txn Ref' }
//                   ].map((mode) => (
//                     <label
//                       key={mode.key}
//                       className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentModes[mode.key]
//                         ? 'border-purple-500 bg-white shadow-md'
//                         : 'border-gray-200 bg-gray-50 opacity-60'
//                         }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={formData.paymentModes[mode.key]}
//                         onChange={(e) => setFormData(prev => ({
//                           ...prev,
//                           paymentModes: { ...prev.paymentModes, [mode.key]: e.target.checked }
//                         }))}
//                         className="sr-only"
//                       />
//                       <span className="text-2xl mb-2">{mode.icon}</span>
//                       <span className="text-sm font-semibold text-gray-800">{mode.label}</span>
//                       <span className="text-xs text-gray-500 text-center mt-1">{mode.receiptInfo}</span>
//                     </label>
//                   ))}
//                 </div>
//                 <p className="text-xs text-purple-600 mt-3 flex items-center gap-1">
//                   <AlertCircle className="w-3 h-3" />
//                   Receipt format will vary based on selected payment mode
//                 </p>
//               </div>

//               <div className="border-t border-gray-100 my-4"></div>

//               {/* Fee Components Section */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* Fees From Student */}
//                 <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
//                   <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
//                     <Users className="w-5 h-5" />
//                     Fees From Student
//                   </h3>

//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-3">
//                       <input
//                         ref={studentComponentRef}
//                         type="text"
//                         name="componentName"
//                         placeholder="Component Name"
//                         value={studentFeeItem.componentName}
//                         onChange={handleStudentFeeItemChange}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       />
//                       <input
//                         ref={studentAmountRef}
//                         type="number"
//                         name="amount"
//                         placeholder="Amount (₹)"
//                         value={studentFeeItem.amount}
//                         onChange={handleStudentFeeItemChange}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <input
//                         type="number"
//                         name="collectionOrder"
//                         placeholder="Collection Order"
//                         title="Order in which fees are collected"
//                         value={studentFeeItem.collectionOrder}
//                         onChange={handleStudentFeeItemChange}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       />
//                       <input
//                         type="number"
//                         name="displayOrder"
//                         placeholder="Display Rank (1=first)"
//                         title="Ranking for display sequence (1 appears first)"
//                         value={studentFeeItem.displayOrder}
//                         onChange={handleStudentFeeItemChange}
//                         onKeyPress={(e) => e.key === "Enter" && addStudentFeeItem()}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                       />
//                     </div>

//                     <button
//                       type="button"
//                       onClick={addStudentFeeItem}
//                       className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md shadow-blue-200"
//                     >
//                       Add Student Fee Component
//                     </button>
//                   </div>

//                   {/* Student Fee List */}
//                   <div className="mt-5 space-y-2 max-h-60 overflow-y-auto pr-1">
//                     {formData.feesFromStudent.length === 0 && (
//                       <p className="text-sm text-gray-400 text-center italic py-2">No components added yet.</p>
//                     )}
//                     {formData.feesFromStudent.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex justify-between items-center bg-white p-3 border border-blue-100 rounded-xl shadow-sm"
//                       >
//                         <div className="flex-1">
//                           <p className="text-sm font-semibold text-gray-900">{item.componentName}</p>
//                           <p className="text-xs text-gray-500 mt-0.5">
//                             Col: {item.collectionOrder} • Disp: {item.displayOrder}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span className="text-sm font-bold text-blue-600">₹{item.amount}</span>
//                           <button
//                             type="button"
//                             onClick={() => removeStudentFeeItem(index)}
//                             className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-4 pt-3 border-t border-blue-100 flex justify-between items-center">
//                     <span className="text-sm font-medium text-blue-800">Total Student Fees</span>
//                     <span className="text-lg font-bold text-blue-700">₹{formData.totalStudentFees.toLocaleString()}</span>
//                   </div>
//                 </div>

//                 {/* Fees From Social Welfare */}
//                 <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5">
//                   <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
//                     <AlertCircle className="w-5 h-5" />
//                     Fees From Social Welfare
//                   </h3>

//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-3">
//                       <input
//                         ref={welfareComponentRef}
//                         type="text"
//                         name="componentName"
//                         placeholder="Component Name"
//                         value={welfareFeeItem.componentName}
//                         onChange={handleWelfareFeeItemChange}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                       <input
//                         ref={welfareAmountRef}
//                         type="number"
//                         name="amount"
//                         placeholder="Amount (₹)"
//                         value={welfareFeeItem.amount}
//                         onChange={handleWelfareFeeItemChange}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <input
//                         type="number"
//                         name="collectionOrder"
//                         placeholder="Collection Order"
//                         title="Order in which fees are collected"
//                         value={welfareFeeItem.collectionOrder}
//                         onChange={handleWelfareFeeItemChange}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                       <input
//                         type="number"
//                         name="displayOrder"
//                         placeholder="Display Rank (1=first)"
//                         title="Ranking for display sequence (1 appears first)"
//                         value={welfareFeeItem.displayOrder}
//                         onChange={handleWelfareFeeItemChange}
//                         onKeyPress={(e) => e.key === "Enter" && addWelfareFeeItem()}
//                         className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                     </div>

//                     <button
//                       type="button"
//                       onClick={addWelfareFeeItem}
//                       className="w-full px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold shadow-md shadow-green-200"
//                     >
//                       Add Welfare Fee Component
//                     </button>
//                   </div>

//                   {/* Welfare Fee List */}
//                   <div className="mt-5 space-y-2 max-h-60 overflow-y-auto pr-1">
//                     {formData.feesFromSocialWelfare.length === 0 && (
//                       <p className="text-sm text-gray-400 text-center italic py-2">No components added yet.</p>
//                     )}
//                     {formData.feesFromSocialWelfare.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex justify-between items-center bg-white p-3 border border-green-100 rounded-xl shadow-sm"
//                       >
//                         <div className="flex-1">
//                           <p className="text-sm font-semibold text-gray-900">{item.componentName}</p>
//                           <p className="text-xs text-gray-500 mt-0.5">
//                             Col: {item.collectionOrder} • Disp: {item.displayOrder}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span className="text-sm font-bold text-green-600">₹{item.amount}</span>
//                           <button
//                             type="button"
//                             onClick={() => removeWelfareFeeItem(index)}
//                             className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-4 pt-3 border-t border-green-100 flex justify-between items-center">
//                     <span className="text-sm font-medium text-green-800">Total Welfare Fees</span>
//                     <span className="text-lg font-bold text-green-700">₹{formData.totalSocialWelfareFees.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Grand Total */}
//               <div className="bg-gray-900 p-5 rounded-2xl text-white flex justify-between items-center shadow-lg">
//                 <div className="text-gray-300 text-sm">Total Fee Structure Value</div>
//                 <div className="text-3xl font-bold">₹{formData.totalFees.toLocaleString()}</div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddForm(false)}
//                   className="px-6 py-2.5 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={isLoading}
//                   className={`px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-lg shadow-blue-200 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
//                     }`}
//                 >
//                   {isLoading ? (
//                     <span>Processing...</span>
//                   ) : (
//                     <>
//                       <Save className="w-4 h-4" />
//                       <span>Save Structure</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }







"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  X,
  Save,
  Search,
  FileText,
  LayoutDashboard,
  CreditCard,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  Lock,
  Edit2,
  Download
} from "lucide-react";
import ExportButton from "@/components/ExportButton";
import Card from "@/components/Card";
import StatsCard from "@/components/StatsCard";
import { useSession } from "@/context/SessionContext";

export default function FeeStructurePage() {
  // Get user session and role
  const { user, loading: sessionLoading } = useSession();
  const userRole = user?.role?.toLowerCase() || '';
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const isStudent = userRole === 'student';
  const isTeacher = userRole === 'teacher';
  const isStaff = userRole === 'staff' || userRole === 'hr';

  const [activeTab, setActiveTab] = useState(isAdmin ? "dashboard" : "structures"); // dashboard, structures, payments
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter States
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);


  // Data States
  const [existingFeeStructures, setExistingFeeStructures] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ totalCollections: 0, activeStructures: 0, totalStructureValue: 0, pendingFees: 0 });

  // Form State
  const [formData, setFormData] = useState({
    programType: "",
    departmentName: "",
    year: "",
    caste: "",
    category: "",
    yearWiseFeeStructure: "",
    scholarshipParticular: "",
    feesFromStudent: [],
    feesFromSocialWelfare: [],
    totalStudentFees: 0,
    totalSocialWelfareFees: 0,
    totalFees: 0,
    paymentModes: {
      cash: true,
      upi: true,
      cheque: true,
      bankTransfer: true
    }
  });

  const [studentFeeItem, setStudentFeeItem] = useState({
    componentName: "",
    amount: "",
    collectionOrder: "",
    displayOrder: "",
  });

  const [welfareFeeItem, setWelfareFeeItem] = useState({
    componentName: "",
    amount: "",
    collectionOrder: "",
    displayOrder: "",
  });

  // Refs
  const studentComponentRef = useRef(null);
  const studentAmountRef = useRef(null);
  const welfareComponentRef = useRef(null);
  const welfareAmountRef = useRef(null);

  // Static Lists
  const [casteList] = useState([
    { id: "general", name: "General" },
    { id: "obc", name: "OBC" },
    { id: "sc", name: "SC" },
    { id: "st", name: "ST" },
    { id: "ews", name: "EWS" },
  ]);

  const [categoryList] = useState([
    { id: "regular", name: "Regular" },
    { id: "management", name: "Management Quota" },
    { id: "nri", name: "NRI Quota" },
    { id: "sports", name: "Sports Quota" },
    { id: "defense", name: "Defense Quota" },
  ]);

  const [yearWiseFeeStructureList] = useState([
    { id: "annual", name: "Annual" },
    { id: "semester", name: "Semester" },
    { id: "quarterly", name: "Quarterly" },
    { id: "monthly", name: "Monthly" },
  ]);

  const [scholarshipList] = useState([
    { id: "none", name: "No Scholarship" },
    { id: "merit", name: "Merit-based Scholarship" },
    { id: "need", name: "Need-based Scholarship" },
    { id: "government", name: "Government Scholarship" },
    { id: "institutional", name: "Institutional Scholarship" },
    { id: "sports", name: "Sports Scholarship" },
    { id: "minority", name: "Minority Scholarship" },
  ]);

  // Initial Data Fetching
  useEffect(() => {
    loadFeeStructures();
    loadDepartments();
  }, []);

  const loadFeeStructures = async () => {
    try {
      console.log('Loading fee structures...');
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/fee/feestructure?t=${timestamp}`);
      const data = await res.json();
      console.log('Fee structures loaded:', data);
      if (data.success && data.feeStructures) {
        console.log('Setting existing fee structures:', data.feeStructures);
        setExistingFeeStructures(data.feeStructures);
      }
    } catch (err) {
      console.error("Error loading fee structures:", err);
    }
  };

  const loadDepartments = async () => {
    try {
      const res = await fetch("/api/department");
      const data = await res.json();
      if (data.departments) {
        setDepartmentData(data.departments);
      }
    } catch (err) {
      console.error("Error loading departments:", err);
    }
  };

  // Auto-load years when department selected
  useEffect(() => {
    if (formData.departmentName) {
      const dept = departmentData.find(
        (d) => d.department === formData.departmentName
      );
      if (dept) {
        setYearList(dept.years || []);
      }
    }
  }, [formData.departmentName, departmentData]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentFeeItemChange = (e) => {
    const { name, value } = e.target;
    setStudentFeeItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleWelfareFeeItemChange = (e) => {
    const { name, value } = e.target;
    setWelfareFeeItem((prev) => ({ ...prev, [name]: value }));
  };

  const addStudentFeeItem = () => {
    if (!studentFeeItem.componentName || !studentFeeItem.amount) {
      alert("Please enter component name and amount");
      return;
    }

    const updatedFees = [
      ...formData.feesFromStudent,
      {
        componentName: studentFeeItem.componentName,
        amount: parseFloat(studentFeeItem.amount),
        collectionOrder: parseInt(studentFeeItem.collectionOrder) || 1,
        displayOrder: parseInt(studentFeeItem.displayOrder) || 1,
      },
    ];

    const studentTotal = updatedFees.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      feesFromStudent: updatedFees,
      totalStudentFees: studentTotal,
      totalFees: studentTotal + (prev.totalSocialWelfareFees || 0),
    }));

    setStudentFeeItem({
      componentName: "",
      amount: "",
      collectionOrder: "",
      displayOrder: "",
    });

    studentComponentRef.current?.focus();
  };

  const addWelfareFeeItem = () => {
    if (!welfareFeeItem.componentName || !welfareFeeItem.amount) {
      alert("Please enter component name and amount");
      return;
    }

    const updatedFees = [
      ...formData.feesFromSocialWelfare,
      {
        componentName: welfareFeeItem.componentName,
        amount: parseFloat(welfareFeeItem.amount),
        collectionOrder: parseInt(welfareFeeItem.collectionOrder) || 1,
        displayOrder: parseInt(welfareFeeItem.displayOrder) || 1,
      },
    ];

    const welfareTotal = updatedFees.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      feesFromSocialWelfare: updatedFees,
      totalSocialWelfareFees: welfareTotal,
      totalFees: (prev.totalStudentFees || 0) + welfareTotal,
    }));

    setWelfareFeeItem({
      componentName: "",
      amount: "",
      collectionOrder: "",
      displayOrder: "",
    });

    welfareComponentRef.current?.focus();
  };

  const removeStudentFeeItem = (index) => {
    const updatedFees = formData.feesFromStudent.filter((_, i) => i !== index);
    const studentTotal = updatedFees.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    setFormData((prev) => ({
      ...prev,
      feesFromStudent: updatedFees,
      totalStudentFees: studentTotal,
      totalFees: studentTotal + prev.totalSocialWelfareFees,
    }));
  };

  const removeWelfareFeeItem = (index) => {
    const updatedFees = formData.feesFromSocialWelfare.filter((_, i) => i !== index);
    const welfareTotal = updatedFees.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    setFormData((prev) => ({
      ...prev,
      feesFromSocialWelfare: updatedFees,
      totalSocialWelfareFees: welfareTotal,
      totalFees: prev.totalStudentFees + welfareTotal,
    }));
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingStructure(null);
    // Reset form to add mode
    setFormData({
      programType: "",
      departmentName: "",
      year: "",
      caste: "",
      category: "",
      yearWiseFeeStructure: "",
      scholarshipParticular: "",
      feesFromStudent: [],
      feesFromSocialWelfare: [],
      totalStudentFees: 0,
      totalSocialWelfareFees: 0,
      totalFees: 0,
      paymentModes: {
        cash: true,
        upi: true,
        cheque: true,
        bankTransfer: true
      }
    });
  };

  const openEditForm = (structure) => {
    setEditingStructure(structure);
    setFormData({
      programType: structure.programType || "",
      departmentName: structure.departmentName || "",
      year: structure.year || "",
      caste: structure.caste || "",
      category: structure.category || "",
      yearWiseFeeStructure: structure.yearWiseFeeStructure || "",
      scholarshipParticular: structure.scholarshipParticular || "",
      feesFromStudent: structure.feesFromStudent || [],
      feesFromSocialWelfare: structure.feesFromSocialWelfare || [],
      totalStudentFees: structure.totalStudentFees || 0,
      totalSocialWelfareFees: structure.totalSocialWelfareFees || 0,
      totalFees: structure.totalFees || 0,
      paymentModes: structure.paymentModes || {
        cash: true,
        upi: true,
        cheque: true,
        bankTransfer: true
      }
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = async () => {
    if (
      !formData.programType ||
      !formData.departmentName ||
      !formData.year ||
      !formData.caste ||
      !formData.category ||
      (formData.feesFromStudent.length === 0 && formData.feesFromSocialWelfare.length === 0)
    ) {
      alert("Please fill all required fields and add at least one fee item");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/fee/feestructure?id=${editingStructure._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Fee structure updated successfully!");
        closeEditForm();
        console.log('Edit successful, calling loadFeeStructures...');
        loadFeeStructures();
      } else {
        alert(data.error || "Failed to update fee structure");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    }

    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (
      !formData.programType ||
      !formData.departmentName ||
      !formData.year ||
      (formData.feesFromStudent.length === 0 && formData.feesFromSocialWelfare.length === 0)
    ) {
      alert("Please fill all required fields and add at least one fee item");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/fee/feestructure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Fee structure saved successfully!");
        setFormData({
          programType: "",
          departmentName: "",
          year: "",
          caste: "",
          category: "",
          yearWiseFeeStructure: "",
          scholarshipParticular: "",
          feesFromStudent: [],
          feesFromSocialWelfare: [],
          totalStudentFees: 0,
          totalSocialWelfareFees: 0,
          totalFees: 0,
          paymentModes: {
            cash: true,
            upi: true,
            cheque: true,
            bankTransfer: true
          }
        });
        setShowAddForm(false);
        loadFeeStructures();
      } else {
        alert(data.error || "Failed to save fee structure");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFeeStructure = async (id) => {
    if (!confirm("Are you sure you want to delete this fee structure?")) {
      return;
    }

    try {
      const res = await fetch(`/api/fee/feestructure?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        // alert("Fee structure deleted!");
        setExistingFeeStructures(
          existingFeeStructures.filter((f) => f._id !== id)
        );
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    }
  };

  // Unique Program Types from departments
  const uniqueProgramTypes = [...new Set(departmentData.map(d => d.programType).filter(Boolean))];

  // Departments filtered by selected program type in form
  const filteredDepartmentsForForm = formData.programType
    ? departmentData.filter(d => d.programType === formData.programType)
    : departmentData;

  // All unique departments and years for filters
  const allDepartments = [...new Set(existingFeeStructures.map(s => s.departmentName).filter(Boolean))];
  const allYears = [...new Set(existingFeeStructures.map(s => s.year).filter(Boolean))];

  // Filter Logic with Department and Year filters
  const filteredStructures = existingFeeStructures.filter((structure) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      structure.departmentName?.toLowerCase().includes(searchLower) ||
      structure.programType?.toLowerCase().includes(searchLower) ||
      structure.year?.toLowerCase().includes(searchLower) ||
      structure.caste?.toLowerCase().includes(searchLower);
    const matchesDept = filterDepartment ? structure.departmentName === filterDepartment : true;
    const matchesYear = filterYear ? structure.year === filterYear : true;
    return matchesSearch && matchesDept && matchesYear;
  });

  // Calculate Dashboard Stats from API data
  const totalFeesConfigured = existingFeeStructures.reduce((acc, curr) => acc + (curr.totalFees || 0), 0);
  const totalStructures = existingFeeStructures.length;
  const totalCollections = dashboardStats.totalCollections;
  const pendingFees = dashboardStats.pendingFees;

  // Fetch Dashboard Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/fee/dashboard-stats');
        const data = await res.json();
        if (data.success) {
          setDashboardStats(data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchStats();
  }, [existingFeeStructures]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">

      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 inline-flex">
          {isAdmin && (
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-gray-500 hover:text-indigo-900 hover:bg-indigo-50"
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
          )}
          <button
            onClick={() => setActiveTab("structures")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "structures"
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
          >
            <FileText className="w-4 h-4" />
            Fee Structures
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "payments"
              ? "bg-green-600 text-white shadow-md shadow-green-200"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
          >
            <CreditCard className="w-4 h-4" />
            {isStudent ? "My Payments" : "Payments & Due"}
          </button>
        </div>

        {/* Role Indicator for non-admins */}
        {!isAdmin && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
            <Lock className="w-4 h-4" />
            <span>Read-only access ({userRole})</span>
          </div>
        )}
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header with Export Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Overview</h2>
            <div className="relative">
              <ExportButton
                data={existingFeeStructures.map(s => ({
                  Department: s.departmentName,
                  Program: s.programType,
                  Year: s.year,
                  Caste: s.caste || 'All',
                  Category: s.category || 'All',
                  "Student Fees": s.totalStudentFees || 0,
                  "Welfare Fees": s.totalSocialWelfareFees || 0,
                  "Total Fees": s.totalFees || 0
                }))}
                filename="Fee_Structures_Report"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Collections"
              value={`₹${(totalCollections / 100000).toFixed(2)}L`}
              icon={DollarSign}
              color="green"
              trend="up"
              trendValue="12%"
            />
            <StatsCard
              title="Pending Fees"
              value={`₹${(pendingFees / 100000).toFixed(2)}L`}
              icon={AlertCircle}
              color="orange"
              trend="down"
              trendValue="5%"
            />
            <StatsCard
              title="Active Structures"
              value={totalStructures}
              icon={FileText}
              color="blue"
            />
            <StatsCard
              title="Total Value"
              value={`₹${(totalFeesConfigured / 10000000).toFixed(2)}Cr`}
              icon={TrendingUp}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
              <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400">
                Chart Placeholder (Transactions over time)
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Collection by Dept</h3>
              <div className="space-y-4">
                {['Computer Science', 'Mechanical', 'Civil', 'Electrical'].map((dept, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">{dept}</span>
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEE STRUCTURES TAB */}
      {activeTab === "structures" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search fee structures / department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm shadow-sm"
              />
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium transition-colors ${filterDepartment || filterYear
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  {(filterDepartment || filterYear) && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                      {[filterDepartment, filterYear].filter(Boolean).length}
                    </span>
                  )}
                </button>

                {showFilterMenu && (
                  <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20 w-64">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Department</label>
                        <select
                          value={filterDepartment}
                          onChange={(e) => setFilterDepartment(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">All Departments</option>
                          {allDepartments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Year</label>
                        <select
                          value={filterYear}
                          onChange={(e) => setFilterYear(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">All Years</option>
                          {allYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => { setFilterDepartment(""); setFilterYear(""); }}
                          className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => setShowFilterMenu(false)}
                          className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-md shadow-blue-200 w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Structure</span>
                </button>
              )}
            </div>
          </div>

          {filteredStructures.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Fee Structures Found</h3>
              <p className="text-sm text-gray-500 mb-6">Get started by creating a new fee structure for a department.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm"
              >
                Create Now
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Program / Dept</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year / Term</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applies To</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Fee</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Welfare Fee</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStructures.map((structure) => (
                      <tr
                        key={structure._id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{structure.departmentName}</div>
                          <div className="text-xs text-gray-500">{structure.programType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {structure.year}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {structure.caste ? structure.caste.toUpperCase() : "All Castes"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {structure.category ? structure.category : "All Categories"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{structure.totalStudentFees?.toLocaleString() || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{structure.totalSocialWelfareFees?.toLocaleString() || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg inline-block">
                            ₹{structure.totalFees?.toLocaleString() || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {isAdmin ? (
                            <>
                              <button
                                onClick={() => openEditForm(structure)}
                                className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg mr-2"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteFeeStructure(structure._id)}
                                className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAYMENTS TAB (Placeholder for now) */}
      {activeTab === "payments" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Payment Module Integration</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
              This section would show the list of student payments, due dates, and collection status.
              It requires integration with the student database and payment gateway records.
            </p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-100 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Edit Fee Structure
              </h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Program Type *</label>
                  <select
                    name="programType"
                    value={formData.programType}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData(prev => ({ ...prev, departmentName: "", year: "" }));
                      setYearList([]);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  >
                    <option value="">Select Program Type</option>
                    {uniqueProgramTypes.map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Department Name *</label>
                  <select
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleInputChange}
                    disabled={!formData.programType}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{formData.programType ? "Select Department" : "Select Program Type first"}</option>
                    {filteredDepartmentsForForm.map((d) => (
                      <option key={d._id} value={d.department}>{d.department}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  >
                    <option value="">Select Year</option>
                    {yearList.map((y, index) => (
                      <option key={index} value={y.year}>{y.year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Caste *</label>
                  <select
                    name="caste"
                    value={formData.caste}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  >
                    <option value="">Select Caste</option>
                    {casteList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  >
                    <option value="">Select Category</option>
                    {categoryList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fee Structure Type</label>
                  <select
                    name="yearWiseFeeStructure"
                    value={formData.yearWiseFeeStructure}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  >
                    <option value="">Select Type</option>
                    {yearWiseFeeStructureList.map((y) => (
                      <option key={y.id} value={y.id}>{y.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Scholarship Type</label>
                  <select
                    name="scholarshipParticular"
                    value={formData.scholarshipParticular}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  >
                    <option value="">Select Scholarship</option>
                    {scholarshipList.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Modes Section */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border border-purple-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  Accepted Payment Modes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'cash', label: 'Cash', icon: '💵', receiptInfo: 'Signature line, Received by' },
                    { key: 'upi', label: 'UPI', icon: '📱', receiptInfo: 'Transaction ID, UPI Reference' },
                    { key: 'cheque', label: 'Cheque', icon: '📝', receiptInfo: 'Cheque No., Bank Name' },
                    { key: 'bankTransfer', label: 'Bank Transfer', icon: '🏦', receiptInfo: 'Account No., IFSC, Txn Ref' }
                  ].map((mode) => (
                    <label
                      key={mode.key}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentModes[mode.key]
                        ? 'border-purple-500 bg-white shadow-md'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.paymentModes[mode.key]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          paymentModes: { ...prev.paymentModes, [mode.key]: e.target.checked }
                        }))}
                        className="sr-only"
                      />
                      <span className="text-2xl mb-2">{mode.icon}</span>
                      <span className="text-sm font-semibold text-gray-800">{mode.label}</span>
                      <span className="text-xs text-gray-500 text-center mt-1">{mode.receiptInfo}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-purple-600 mt-3 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Receipt format will vary based on selected payment mode
                </p>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Fee Components Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Fees From Student */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Fees From Student
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        ref={studentComponentRef}
                        type="text"
                        name="componentName"
                        placeholder="Component Name"
                        value={studentFeeItem.componentName}
                        onChange={handleStudentFeeItemChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        ref={studentAmountRef}
                        type="number"
                        name="amount"
                        placeholder="Amount (₹)"
                        value={studentFeeItem.amount}
                        onChange={handleStudentFeeItemChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        name="collectionOrder"
                        placeholder="Collection Order"
                        title="Order in which fees are collected"
                        value={studentFeeItem.collectionOrder}
                        onChange={handleStudentFeeItemChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="number"
                        name="displayOrder"
                        placeholder="Display Rank (1=first)"
                        title="Ranking for display sequence (1 appears first)"
                        value={studentFeeItem.displayOrder}
                        onChange={handleStudentFeeItemChange}
                        onKeyPress={(e) => e.key === "Enter" && addStudentFeeItem()}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addStudentFeeItem}
                      className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md shadow-blue-200"
                    >
                      Add Student Fee Component
                    </button>
                  </div>

                  {/* Student Fee List */}
                  <div className="mt-5 space-y-2 max-h-60 overflow-y-auto pr-1">
                    {formData.feesFromStudent.length === 0 && (
                      <p className="text-sm text-gray-400 text-center italic py-2">No components added yet.</p>
                    )}
                    {formData.feesFromStudent.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white p-3 border border-blue-100 rounded-xl shadow-sm"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{item.componentName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Col: {item.collectionOrder} • Disp: {item.displayOrder}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-blue-600">₹{item.amount}</span>
                          <button
                            type="button"
                            onClick={() => removeStudentFeeItem(index)}
                            className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-blue-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">Total Student Fees</span>
                    <span className="text-lg font-bold text-blue-700">₹{formData.totalStudentFees.toLocaleString()}</span>
                  </div>
                </div>

                {/* Fees From Social Welfare */}
                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Fees From Social Welfare
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        ref={welfareComponentRef}
                        type="text"
                        name="componentName"
                        placeholder="Component Name"
                        value={welfareFeeItem.componentName}
                        onChange={handleWelfareFeeItemChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                      <input
                        ref={welfareAmountRef}
                        type="number"
                        name="amount"
                        placeholder="Amount (₹)"
                        value={welfareFeeItem.amount}
                        onChange={handleWelfareFeeItemChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        name="collectionOrder"
                        placeholder="Collection Order"
                        title="Order in which fees are collected"
                        value={welfareFeeItem.collectionOrder}
                        onChange={handleWelfareFeeItemChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                      <input
                        type="number"
                        name="displayOrder"
                        placeholder="Display Rank (1=first)"
                        title="Ranking for display sequence (1 appears first)"
                        value={welfareFeeItem.displayOrder}
                        onChange={handleWelfareFeeItemChange}
                        onKeyPress={(e) => e.key === "Enter" && addWelfareFeeItem()}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addWelfareFeeItem}
                      className="w-full px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold shadow-md shadow-green-200"
                    >
                      Add Welfare Fee Component
                    </button>
                  </div>

                  {/* Welfare Fee List */}
                  <div className="mt-5 space-y-2 max-h-60 overflow-y-auto pr-1">
                    {formData.feesFromSocialWelfare.length === 0 && (
                      <p className="text-sm text-gray-400 text-center italic py-2">No components added yet.</p>
                    )}
                    {formData.feesFromSocialWelfare.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white p-3 border border-green-100 rounded-xl shadow-sm"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{item.componentName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Col: {item.collectionOrder} • Disp: {item.displayOrder}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-green-600">₹{item.amount}</span>
                          <button
                            type="button"
                            onClick={() => removeWelfareFeeItem(index)}
                            className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-green-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-green-800">Total Welfare Fees</span>
                    <span className="text-lg font-bold text-green-700">₹{formData.totalSocialWelfareFees.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Grand Total */}
              <div className="bg-gray-900 p-5 rounded-2xl text-white flex justify-between items-center shadow-lg">
                <div className="text-gray-300 text-sm">Total Fee Structure Value</div>
                <div className="text-3xl font-bold">₹{formData.totalFees.toLocaleString()}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeEditForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-md shadow-blue-200"
                >
                  Update Fee Structure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Fee Structure Modal - Rendered inline to prevent focus loss */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-100 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Fee Structure
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Program Type *</label>
                  <select
                    name="programType"
                    value={formData.programType}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData(prev => ({ ...prev, departmentName: "", year: "" }));
                      setYearList([]);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  >
                    <option value="">Select Program Type</option>
                    {uniqueProgramTypes.map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Department Name *</label>
                  <select
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleInputChange}
                    disabled={!formData.programType}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{formData.programType ? "Select Department" : "Select Program Type first"}</option>
                    {filteredDepartmentsForForm.map((d) => (
                      <option key={d._id} value={d.department}>{d.department}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  >
                    <option value="">Select Year</option>
                    {yearList.map((y, index) => (
                      <option key={index} value={y.year}>{y.year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Caste *</label>
                  <select
                    name="caste"
                    value={formData.caste}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  >
                    <option value="">Select Caste</option>
                    {casteList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  >
                    <option value="">Select Category</option>
                    {categoryList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fee Structure Type</label>
                  <select
                    name="yearWiseFeeStructure"
                    value={formData.yearWiseFeeStructure}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  >
                    <option value="">Select Type</option>
                    {yearWiseFeeStructureList.map((y) => (
                      <option key={y.id} value={y.id}>{y.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Scholarship Type</label>
                  <select
                    name="scholarshipParticular"
                    value={formData.scholarshipParticular}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50/50"
                  >
                    <option value="">Select Scholarship</option>
                    {scholarshipList.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Modes Section */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border border-purple-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  Accepted Payment Modes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'cash', label: 'Cash', icon: '💵', receiptInfo: 'Signature line, Received by' },
                    { key: 'upi', label: 'UPI', icon: '📱', receiptInfo: 'Transaction ID, UPI Reference' },
                    { key: 'cheque', label: 'Cheque', icon: '📝', receiptInfo: 'Cheque No., Bank Name' },
                    { key: 'bankTransfer', label: 'Bank Transfer', icon: '🏦', receiptInfo: 'Account No., IFSC, Txn Ref' }
                  ].map((mode) => (
                    <label
                      key={mode.key}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentModes[mode.key]
                        ? 'border-purple-500 bg-white shadow-md'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.paymentModes[mode.key]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          paymentModes: { ...prev.paymentModes, [mode.key]: e.target.checked }
                        }))}
                        className="sr-only"
                      />
                      <span className="text-2xl mb-2">{mode.icon}</span>
                      <span className="text-sm font-semibold text-gray-800">{mode.label}</span>
                      <span className="text-xs text-gray-500 text-center mt-1">{mode.receiptInfo}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-purple-600 mt-3 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Receipt format will vary based on selected payment mode
                </p>
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              {/* Fee Components Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Fees From Student */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Fees From Student
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        ref={studentComponentRef}
                        type="text"
                        name="componentName"
                        placeholder="Component Name"
                        value={studentFeeItem.componentName}
                        onChange={handleStudentFeeItemChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        ref={studentAmountRef}
                        type="number"
                        name="amount"
                        placeholder="Amount (₹)"
                        value={studentFeeItem.amount}
                        onChange={handleStudentFeeItemChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        name="collectionOrder"
                        placeholder="Collection Order"
                        title="Order in which fees are collected"
                        value={studentFeeItem.collectionOrder}
                        onChange={handleStudentFeeItemChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="number"
                        name="displayOrder"
                        placeholder="Display Rank (1=first)"
                        title="Ranking for display sequence (1 appears first)"
                        value={studentFeeItem.displayOrder}
                        onChange={handleStudentFeeItemChange}
                        onKeyPress={(e) => e.key === "Enter" && addStudentFeeItem()}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addStudentFeeItem}
                      className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md shadow-blue-200"
                    >
                      Add Student Fee Component
                    </button>
                  </div>

                  {/* Student Fee List */}
                  <div className="mt-5 space-y-2 max-h-60 overflow-y-auto pr-1">
                    {formData.feesFromStudent.length === 0 && (
                      <p className="text-sm text-gray-400 text-center italic py-2">No components added yet.</p>
                    )}
                    {formData.feesFromStudent.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white p-3 border border-blue-100 rounded-xl shadow-sm"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{item.componentName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Col: {item.collectionOrder} • Disp: {item.displayOrder}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-blue-600">₹{item.amount}</span>
                          <button
                            type="button"
                            onClick={() => removeStudentFeeItem(index)}
                            className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-blue-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">Total Student Fees</span>
                    <span className="text-lg font-bold text-blue-700">₹{formData.totalStudentFees.toLocaleString()}</span>
                  </div>
                </div>

                {/* Fees From Social Welfare */}
                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Fees From Social Welfare
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        ref={welfareComponentRef}
                        type="text"
                        name="componentName"
                        placeholder="Component Name"
                        value={welfareFeeItem.componentName}
                        onChange={handleWelfareFeeItemChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                      <input
                        ref={welfareAmountRef}
                        type="number"
                        name="amount"
                        placeholder="Amount (₹)"
                        value={welfareFeeItem.amount}
                        onChange={handleWelfareFeeItemChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        name="collectionOrder"
                        placeholder="Collection Order"
                        title="Order in which fees are collected"
                        value={welfareFeeItem.collectionOrder}
                        onChange={handleWelfareFeeItemChange}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                      <input
                        type="number"
                        name="displayOrder"
                        placeholder="Display Rank (1=first)"
                        title="Ranking for display sequence (1 appears first)"
                        value={welfareFeeItem.displayOrder}
                        onChange={handleWelfareFeeItemChange}
                        onKeyPress={(e) => e.key === "Enter" && addWelfareFeeItem()}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addWelfareFeeItem}
                      className="w-full px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold shadow-md shadow-green-200"
                    >
                      Add Welfare Fee Component
                    </button>
                  </div>

                  {/* Welfare Fee List */}
                  <div className="mt-5 space-y-2 max-h-60 overflow-y-auto pr-1">
                    {formData.feesFromSocialWelfare.length === 0 && (
                      <p className="text-sm text-gray-400 text-center italic py-2">No components added yet.</p>
                    )}
                    {formData.feesFromSocialWelfare.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white p-3 border border-green-100 rounded-xl shadow-sm"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{item.componentName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Col: {item.collectionOrder} • Disp: {item.displayOrder}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-green-600">₹{item.amount}</span>
                          <button
                            type="button"
                            onClick={() => removeWelfareFeeItem(index)}
                            className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-green-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-green-800">Total Welfare Fees</span>
                    <span className="text-lg font-bold text-green-700">₹{formData.totalSocialWelfareFees.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-gray-900 p-5 rounded-2xl text-white flex justify-between items-center shadow-lg">
                <div className="text-gray-300 text-sm">Total Fee Structure Value</div>
                <div className="text-3xl font-bold">₹{formData.totalFees.toLocaleString()}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2.5 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-lg shadow-blue-200 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {isLoading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Structure</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}