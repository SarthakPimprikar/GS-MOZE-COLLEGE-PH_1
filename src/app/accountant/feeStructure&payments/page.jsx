"use client";

import { useState, useEffect } from "react";
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
  Edit,
  Download
} from "lucide-react";
import ExportButton from "@/components/ExportButton";
import Card from "@/components/Card";
import StatsCard from "@/components/StatsCard";
import { useSession } from "@/context/SessionContext";

export default function AccountantFeeStructurePage() {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState("structures");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter States
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [receiptAmounts, setReceiptAmounts] = useState({});

  // Data States
  const [existingFeeStructures, setExistingFeeStructures] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [paymentRecords, setPaymentRecords] = useState([]);

  // Form States
  const [formData, setFormData] = useState({
    department: "",
    year: "",
    semester: "",
    feeType: "",
    amount: "",
    dueDate: "",
    description: "",
  });

  // For API compatibility - transform form data
  const transformFormDataForAPI = (formData) => {
    return {
      course: 'B.E.',
      category: formData.feeType || 'General',
      class: formData.semester || '1st Year',
      department: formData.department,
      fee: {
        tuitionFee: parseInt(formData.amount) || 0,
        libraryFee: 0,
        developmentFee: 0,
        examFee: 0
      }
    };
  };

  useEffect(() => {
    fetchFeeStructures();
    fetchDepartments();
    fetchYears();
    if (activeTab === "payments") {
      fetchPaymentRecords();
    }
  }, [activeTab]);

  const fetchFeeStructures = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/fee/feestructure");
      const data = await response.json();
      if (data.success) {
        setExistingFeeStructures(data.feeStructures || []);
      }
    } catch (error) {
      console.error("Error fetching fee structures:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/department");
      const data = await response.json();
      if (data.departments) {
        // Transform department data to match expected format
        const transformedDepartments = data.departments.map(dept => ({
          _id: dept._id,
          name: dept.department
        }));
        setDepartmentData(transformedDepartments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchYears = async () => {
    try {
      const response = await fetch("/api/fee/feestructure");
      const data = await response.json();
      if (data.success && data.feeStructures) {
        // Extract unique years from fee structures
        const uniqueYears = [...new Set(data.feeStructures.map(structure => structure.year).filter(Boolean))];
        const yearData = uniqueYears.map((year, index) => ({
          _id: `year-${index}`,
          year: year
        }));
        setYearList(yearData);
      }
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const fetchPaymentRecords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/payments");
      const data = await response.json();
      if (data.success) {
        setPaymentRecords(data.data);
      }
    } catch (error) {
      console.error("Error fetching payment records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // Use the correct API endpoint for fee structures
      const url = editingStructure
        ? `/api/fee/feestructure?id=${editingStructure._id}`
        : "/api/fee/feestructure";
      const method = editingStructure ? "PUT" : "POST";

      // Transform form data to match the new API format
      const apiData = {
        programType: "B.E.",
        departmentName: formData.department,
        year: formData.year,
        caste: "general",
        category: formData.feeType || "regular",
        yearWiseFeeStructure: "annual",
        scholarshipParticular: "none",
        feesFromStudent: [
          {
            componentName: formData.feeType || "Tuition Fee",
            amount: parseFloat(formData.amount) || 0,
            collectionOrder: 1,
            displayOrder: 1
          }
        ],
        feesFromSocialWelfare: []
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();
      if (data.success) {
        fetchFeeStructures();
        fetchYears(); // Refresh years after adding new structure
        setShowAddForm(false);
        setShowEditForm(false);
        setEditingStructure(null);
        setFormData({
          department: "",
          year: "",
          semester: "",
          feeType: "",
          amount: "",
          dueDate: "",
          description: "",
        });
      } else {
        alert(data.error || data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (structure) => {
    setEditingStructure(structure);
    // Transform API data back to form format
    setFormData({
      department: structure.departmentName || "",
      year: structure.year || "",
      semester: structure.year || "",
      feeType: structure.category || "",
      amount: structure.feesFromStudent?.[0]?.amount?.toString() || "0",
      dueDate: "", // API doesn't have due date
      description: "", // API doesn't have description
    });
    setShowEditForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this fee structure?")) return;
    try {
      const response = await fetch(`/api/fee/feestructure?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        fetchFeeStructures();
        fetchYears(); // Refresh years after deletion
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting fee structure");
    }
  };

  const downloadReceipt = async (payment) => {
    try {
      console.log('Starting receipt download for payment:', payment);
      
      // Get the custom amount for this specific payment
      const customAmount = receiptAmounts[payment._id];
      const amountToUse = customAmount && customAmount.trim() !== '' ? parseFloat(customAmount) : null;
      
      if (amountToUse && (isNaN(amountToUse) || amountToUse <= 0)) {
        alert('Please enter a valid amount greater than 0');
        return;
      }
      
      // Prevent double downloads with stronger protection
      const downloadKey = `downloading_${payment._id}`;
      if (window[downloadKey]) {
        console.log('Download already in progress for payment:', payment._id);
        return;
      }
      
      window[downloadKey] = true;
      
      // First create a receipt for this payment
      const receiptResponse = await fetch('/api/fee/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: payment._id,
          paymentMode: 'Cash', // Default payment mode
          remarks: amountToUse ? `Partial payment receipt - ₹${amountToUse}` : 'Full fee payment receipt',
          amountPaid: amountToUse
        })
      });
      
      const receiptData = await receiptResponse.json();
      console.log('Receipt creation response:', receiptData);
      
      if (receiptData.success) {
        // Create download link with relative URL for production compatibility
        const downloadUrl = `/api/fee/receipts/pdf?receiptId=${receiptData.receipt._id}`;
        console.log('Download URL:', downloadUrl);
        
        // Single download approach - fetch and create blob
        try {
          const response = await fetch(downloadUrl);
          const blob = await response.blob();
            
          // Create download link with blob for direct download only
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = `Receipt-${receiptData.receipt.receiptNumber}.pdf`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
            
          // Clean up and clear flag with delay
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            // Clear download flag after successful download
            delete window[downloadKey];
          }, 200);
          
          // Auto-clear flag after 5 seconds as backup
          setTimeout(() => {
            delete window[downloadKey];
          }, 5000);
            
        } catch (blobError) {
          console.error('Download failed:', blobError);
          // Clear download flag on error
          delete window[downloadKey];
          alert('Failed to download receipt');
        }
          
      } else {
        // Clear download flag on error
        delete window[downloadKey];
        alert('Failed to generate receipt: ' + (receiptData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      // Clear download flag on exception
      delete window[downloadKey];
      alert('Failed to download receipt');
    }
  };

  const handlePaymentStatusChange = async (payment, newStatus) => {
    try {
      // Update the payment status in the local state first for immediate UI feedback
      const updatedPayments = paymentRecords.map(p => 
        p._id === payment._id ? { ...p, status: newStatus } : p
      );
      setPaymentRecords(updatedPayments);

      // No automatic receipt generation - just update the status
      console.log(`Payment status updated to ${newStatus} for ${payment.studentName}`);
      
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
      // Revert status on error
      const revertedPayments = paymentRecords.map(p => 
        p._id === payment._id ? { ...p, status: payment.status } : p
      );
      setPaymentRecords(revertedPayments);
    }
  };

  const filteredStructures = existingFeeStructures.filter((structure) => {
    const matchesSearch = structure.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         structure.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         structure.programType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         structure.year?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || structure.departmentName === filterDepartment;
    const matchesYear = !filterYear || structure.year === filterYear;
    return matchesSearch && matchesDepartment && matchesYear;
  });

  const filteredPayments = paymentRecords.filter((payment) => {
    const matchesSearch = payment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.feeType?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fee Structure & Payments</h1>
        <p className="text-gray-500 text-sm">Manage fee structures and payment records</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setActiveTab("structures")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "structures"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          Fee Structures
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "payments"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          Payment Records
        </button>
      </div>

      {activeTab === "structures" && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search fee structures..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departmentData.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">All Years</option>
                {yearList.map((year) => (
                  <option key={year._id} value={year.year}>
                    {year.year}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Add Structure
              </button>
              <ExportButton
                data={filteredStructures.map(s => ({
                  Department: s.departmentName,
                  Program: s.programType,
                  Year: s.year,
                  Category: s.category || 'General',
                  StudentFees: s.totalStudentFees || 0,
                  WelfareFees: s.totalSocialWelfareFees || 0,
                  TotalFees: s.totalFees || 0
                }))}
                filename="Fee_Structures"
              />
            </div>
          </div>

          {/* Fee Structures Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Department</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Program</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Year</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Category</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Student Fees</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Welfare Fees</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Total Fees</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStructures.map((structure) => (
                    <tr key={structure._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800">{structure.departmentName}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800">{structure.programType}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800">{structure.year}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800">{structure.category || 'General'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-800">₹{structure.totalStudentFees || 0}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-800">₹{structure.totalSocialWelfareFees || 0}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-bold text-blue-600">₹{structure.totalFees || 0}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(structure)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(structure._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "payments" && (
        <>
          {/* Search for Payments */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search payments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ExportButton
              data={filteredPayments.map(p => ({
                StudentName: p.studentName,
                FeeType: p.feeType,
                Amount: p.amount,
                PaymentDate: p.paymentDate,
                Status: p.status,
                TransactionId: p.transactionId
              }))}
              filename="Payment_Records"
            />
          </div>

          {/* Payment Records Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Student Name</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Fee Type</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Payment Date</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Transaction ID</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Receipt Amount</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800">{payment.studentName}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800">{payment.feeType}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-800">₹{payment.amount}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-800">{payment.paymentDate}</span>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={payment.status}
                          onChange={(e) => handlePaymentStatusChange(payment, e.target.value)}
                          className={`px-3 py-1 text-xs rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${
                            payment.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : payment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">{payment.transactionId}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-2">
                          <input
                            type="number"
                            placeholder="Enter amount"
                            value={receiptAmounts[payment._id] || ''}
                            onChange={(e) => setReceiptAmounts(prev => ({
                              ...prev,
                              [payment._id]: e.target.value
                            }))}
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                          {receiptAmounts[payment._id] && (
                            <span className="text-xs text-gray-500">
                              Remaining: ₹{Math.max(0, (payment.amount || 0) - parseFloat(receiptAmounts[payment._id]))}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {payment.status === "Paid" && (
                          <button
                            onClick={() => downloadReceipt(payment)}
                            className="text-green-600 hover:text-green-800 flex items-center gap-1"
                            title="Download Receipt"
                          >
                            <Download size={16} />
                            <span className="text-xs">Receipt</span>
                          </button>
                        )}
                        {payment.status !== "Paid" && (
                          <span className="text-gray-400 text-xs">Not Available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {editingStructure ? "Edit Fee Structure" : "Add Fee Structure"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                >
                  <option value="">Select Department</option>
                  {departmentData.map((dept) => (
                    <option key={dept._id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                >
                  <option value="">Select Year</option>
                  {yearList.map((year) => (
                    <option key={year._id} value={year.year}>
                      {year.year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  placeholder="e.g., 1st Semester"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.feeType}
                  onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                  placeholder="e.g., Tuition Fee"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setShowEditForm(false);
                    setEditingRole(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : editingStructure ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
