"use client";

import { useState, useEffect } from "react";
import { generateReceiptPdf } from "@/utils/generatePdfClient";
import { useSession } from "@/context/SessionContext";
import {
  Search,
  User,
  CreditCard,
  Receipt,
  Download,
  IndianRupee,
  BookOpen,
  Users,
  Calendar,
  DollarSign
} from "lucide-react";

export default function PaymentPage() {
  const { user } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [admissions, setAdmissions] = useState([]);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [admissionFeeStructure, setAdmissionFeeStructure] = useState(null);

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    amountPaid: '',
    paymentMode: 'Cash',
    remarks: ''
  });
  const [paymentAllocation, setPaymentAllocation] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Component-wise payments tracking
  const [componentPayments, setComponentPayments] = useState({});

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchAdmissions();
    } else {
      setAdmissions([]);
    }
  }, [searchTerm]);

  const searchAdmissions = async () => {
    try {
      console.log('Searching for admissions with term:', searchTerm);
      const response = await fetch(`/api/admission?search=${searchTerm}`);
      const data = await response.json();
      console.log('Search response:', data);
      if (data.success) {
        setAdmissions(data.data || []);
        console.log('Found admissions:', data.data?.length || 0);
      } else {
        console.error('Search failed:', data.message);
      }
    } catch (error) {
      console.error("Error searching admissions:", error);
    }
  };

  // Function to allocate payment automatically based on priority
  const allocatePayment = (totalAmount, feeStructure) => {
    const allocation = [];
    let remainingAmount = parseFloat(totalAmount);

    // Priority order: Tuition Fees first, then other fees
    const allFees = [];

    // Add student fees (Tuition fees have priority)
    if (feeStructure.feesFromStudent) {
      feeStructure.feesFromStudent.forEach(fee => {
        allFees.push({
          ...fee,
          isWelfare: false,
          priority: fee.componentName.toLowerCase().includes('tuition') ? 1 : 2
        });
      });
    }

    // Add welfare fees (lower priority)
    if (feeStructure.feesFromSocialWelfare) {
      feeStructure.feesFromSocialWelfare.forEach(fee => {
        allFees.push({
          ...fee,
          isWelfare: true,
          priority: 3
        });
      });
    }

    // Sort by priority
    allFees.sort((a, b) => a.priority - b.priority);

    // Allocate payment
    allFees.forEach(fee => {
      const feeAmount = parseFloat(fee.amount);
      const paidAmount = Math.min(remainingAmount, feeAmount);
      const balanceAmount = feeAmount - paidAmount;

      allocation.push({
        componentName: fee.componentName,
        totalAmount: feeAmount,
        paidAmount: paidAmount,
        balanceAmount: balanceAmount,
        isWelfare: fee.isWelfare,
        status: paidAmount === 0 ? 'Unpaid' : paidAmount === feeAmount ? 'Paid' : 'Partial'
      });

      remainingAmount -= paidAmount;
    });

    return allocation;
  };
  // Handle payment amount change
  const handlePaymentAmountChange = (amount) => {
    setPaymentData(prev => ({ ...prev, amountPaid: amount }));

    // Auto-allocate payment when amount changes
    if (amount && parseFloat(amount) > 0 && admissionFeeStructure) {
      const allocation = allocatePayment(amount, admissionFeeStructure);
      setPaymentAllocation(allocation);
      console.log('Payment allocation:', allocation);
    } else {
      setPaymentAllocation([]);
    }
  };
  const fetchAdmissionFeeStructure = async (admission) => {
    try {
      setIsLoading(true);
      console.log('Fetching fee structure for admission:', admission._id);
      const response = await fetch(`/api/fee/feestructure?branch=${admission.branch}&programType=${admission.programType}&year=${admission.year}`);
      const data = await response.json();
      console.log('Fee structure response:', data);
      if (data.success && data.feeStructure) {
        setAdmissionFeeStructure(data.feeStructure);
        console.log('Fee structure loaded:', data.feeStructure);

        // Calculate total fees
        const totalFees = data.feeStructure.totalFees || 0;
        console.log('Total fees:', totalFees);

        // Clear previous allocation
        setPaymentAllocation([]);
        setPaymentData(prev => ({ ...prev, amountPaid: '' }));
      } else {
        console.error('Fee structure error:', data.error);
        alert('No fee structure found for this admission: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error("Error fetching fee structure:", error);
      alert('Failed to fetch fee structure');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentHistory = async (admission) => {
    try {
      const response = await fetch(`/api/payments/tracking?admissionId=${admission._id}`);
      const data = await response.json();
      if (data.success) {
        setPaymentHistory(data.paymentRecords || []);
        console.log('Payment history loaded:', data.paymentRecords);
      } else {
        console.error('Failed to fetch payment history:', data.message);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const handleAdmissionSelect = (admission) => {
    setSelectedAdmission(admission);
    setSearchTerm(admission.fullName || admission.name);
    setAdmissions([]);
    fetchAdmissionFeeStructure(admission);
    fetchPaymentHistory(admission);
  };

  const handleComponentPayment = (componentName, amount) => {
    setComponentPayments(prev => ({
      ...prev,
      [componentName]: parseFloat(amount) || 0
    }));
  };

  const getTotalPaid = () => {
    return Object.values(componentPayments).reduce((sum, amount) => sum + amount, 0);
  };

  const getRemainingForComponent = (componentName, totalAmount) => {
    const paid = componentPayments[componentName] || 0;
    return Math.max(0, totalAmount - paid);
  };

  const handleSubmitPayment = async () => {
    if (!selectedAdmission || !admissionFeeStructure) {
      alert('Please select an admission');
      return;
    }

    const amountPaid = parseFloat(paymentData.amountPaid);
    if (!amountPaid || amountPaid <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    try {
      setIsLoading(true);

      // Create component payments from allocation
      const componentPayments = {};
      paymentAllocation.forEach(allocation => {
        if (allocation.paidAmount > 0) {
          componentPayments[allocation.componentName] = allocation.paidAmount;
        }
      });

      // Create receipt
      const receiptResponse = await fetch('/api/fee/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedAdmission._id,
          admissionId: selectedAdmission._id, // Add admissionId for linking
          paymentMode: paymentData.paymentMode,
          remarks: paymentData.remarks || `Payment of ₹${amountPaid}`,
          amountPaid: amountPaid,
          componentPayments: componentPayments,
          feeStructure: admissionFeeStructure
        })
      });

      const receiptData = await receiptResponse.json();

      if (receiptData.success) {
        // Generate PDF using Vercel-compatible function
        const pdfResult = await generateReceiptPdf(receiptData.receipt, {
          filename: `receipt-${receiptData.receipt.receiptNumber}-dual.pdf`
        });

        if (pdfResult.success) {
          console.log('PDF generated successfully:', pdfResult.message);
          alert('Payment processed successfully! Receipt downloaded.');
        } else {
          console.error('PDF generation failed:', pdfResult.error);
          alert('Payment processed successfully! PDF generation failed: ' + pdfResult.error);
        }

        // Refresh payment history
        if (selectedAdmission) {
          fetchPaymentHistory(selectedAdmission);
        }

        // Reset form
        setPaymentData({ amountPaid: '', paymentMode: 'Cash', remarks: '' });
        setPaymentAllocation([]);
        setSelectedAdmission(null);
      } else {
        alert('Failed to save receipt: ' + receiptData.message);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment processing failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment Processing</h1>
        <p className="text-gray-500 text-sm">Process student payments and generate receipts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="text-blue-600" size={24} />
            <h2 className="text-lg font-semibold text-gray-800">Payment Details</h2>
          </div>

          {/* Admission Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User size={16} className="inline mr-1" />
              Search Admission
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admission name or DTE number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Admission Dropdown */}
              {admissions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-10">
                  {admissions.map((admission) => (
                    <div
                      key={admission._id}
                      onClick={() => handleAdmissionSelect(admission)}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-800">{admission.fullName || admission.name}</div>
                      <div className="text-xs text-gray-500">DTE: {admission.dteApplicationNumber} | {admission.branch}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Admission Info */}
          {selectedAdmission && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                {selectedAdmission.fullName || selectedAdmission.name}
              </div>
              <div className="text-xs text-blue-600">
                DTE: {selectedAdmission.dteApplicationNumber} • {selectedAdmission.branch} • {selectedAdmission.programType}
              </div>
            </div>
          )}

          {/* Fee Structure Display */}
          {admissionFeeStructure && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen size={16} className="inline mr-1" />
                Fee Structure
              </label>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="text-sm font-medium text-gray-800">Total Fees: ₹{admissionFeeStructure.totalFees || 0}</div>

                {/* Student Fees */}
                {admissionFeeStructure.feesFromStudent?.map((fee, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{fee.componentName}:</span>
                    <span className="font-medium">₹{fee.amount}</span>
                  </div>
                ))}

                {/* Welfare Fees */}
                {admissionFeeStructure.feesFromSocialWelfare?.map((fee, index) => (
                  <div key={`welfare-${index}`} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{fee.componentName} (Welfare):</span>
                    <span className="font-medium text-green-600">₹{fee.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Amount */}
          {admissionFeeStructure && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign size={16} className="inline mr-1" />
                Amount Received
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount received"
                value={paymentData.amountPaid}
                onChange={(e) => handlePaymentAmountChange(e.target.value)}
                min="0"
                step="0.01"
              />
              <div className="text-xs text-gray-500 mt-1">
                Total Fees: ₹{admissionFeeStructure.totalFees || 0}
              </div>
            </div>
          )}

          {/* Payment Mode */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <CreditCard size={16} className="inline mr-1" />
              Payment Mode
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={paymentData.paymentMode}
              onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value })}
            >
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
            </select>
          </div>

          {/* Remarks */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks (Optional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={paymentData.remarks}
              onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          {/* Payment History Toggle */}
          {selectedAdmission && paymentHistory.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Calendar size={16} />
                {showHistory ? 'Hide' : 'Show'} Payment History ({paymentHistory.length})
              </button>
            </div>
          )}

          {/* Payment History */}
          {showHistory && paymentHistory.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Payments</h4>
              <div className="space-y-2">
                {paymentHistory.map((record, index) => (
                  <div key={record._id} className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{record.receiptNumber}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(record.createdAt).toLocaleDateString('en-IN')} • {record.paymentMode}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">₹{record.totalPaid}</div>
                      <div className="text-xs text-gray-500">{record.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitPayment}
            disabled={isLoading || !selectedAdmission || !paymentData.amountPaid || parseFloat(paymentData.amountPaid) <= 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {isLoading ? "Processing..." : `Process Payment ₹${paymentData.amountPaid || 0}`}
          </button>
        </div>

        {/* Fee Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Receipt className="text-blue-600" size={24} />
            <h2 className="text-lg font-semibold text-gray-800">Fee Summary</h2>
          </div>

          {admissionFeeStructure ? (
            <div className="space-y-4">
              {/* Total Fees */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Total Fees</div>
                <div className="text-2xl font-bold text-gray-800">
                  ₹{admissionFeeStructure.totalFees || 0}
                </div>
              </div>

              {/* Payment Allocation */}
              {paymentAllocation.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Payment Allocation</h3>

                  {paymentAllocation.map((allocation, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b border-gray-100">
                      <span className="text-sm text-gray-700">
                        {allocation.componentName}
                        {allocation.status === 'Partial' && ' (Partial)'}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-medium">₹{allocation.paidAmount}</div>
                        {allocation.status === 'Partial' && (
                          <div className="text-xs text-orange-500">
                            Balance: ₹{allocation.balanceAmount}
                          </div>
                        )}
                        {allocation.status === 'Unpaid' && (
                          <div className="text-xs text-red-500">
                            Not Paid
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Component Summary */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Fee Breakdown</h3>

                {admissionFeeStructure.feesFromStudent?.map((fee, index) => {
                  const allocation = paymentAllocation.find(a => a.componentName === fee.componentName);
                  return (
                    <div key={index} className="flex justify-between items-center p-2 border-b border-gray-100">
                      <span className="text-sm text-gray-700">{fee.componentName}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">₹{fee.amount}</div>
                        {allocation && (
                          <div className={`text-xs ${allocation.status === 'Paid' ? 'text-green-600' :
                            allocation.status === 'Partial' ? 'text-orange-500' : 'text-red-500'
                            }`}>
                            {allocation.status === 'Paid' ? 'Paid' :
                              allocation.status === 'Partial' ? `Paid: ₹${allocation.paidAmount}` :
                                'Unpaid'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {admissionFeeStructure.feesFromSocialWelfare?.map((fee, index) => {
                  const allocation = paymentAllocation.find(a => a.componentName === fee.componentName);
                  return (
                    <div key={`welfare-${index}`} className="flex justify-between items-center p-2 border-b border-gray-100">
                      <span className="text-sm text-gray-700">{fee.componentName} (Welfare)</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">₹{fee.amount}</div>
                        {allocation && (
                          <div className={`text-xs ${allocation.status === 'Paid' ? 'text-green-600' :
                            allocation.status === 'Partial' ? 'text-orange-500' : 'text-red-500'
                            }`}>
                            {allocation.status === 'Paid' ? 'Paid' :
                              allocation.status === 'Partial' ? `Paid: ₹${allocation.paidAmount}` :
                                'Unpaid'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Summary */}
              {paymentData.amountPaid && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Amount Received:</span>
                    <span className="text-lg font-semibold text-blue-600">₹{paymentData.amountPaid}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Balance:</span>
                    <span className="text-lg font-semibold text-red-600">
                      ₹{Math.max(0, (admissionFeeStructure.totalFees || 0) - parseFloat(paymentData.amountPaid))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="text-gray-400 mx-auto mb-3" size={48} />
              <p className="text-gray-500">Select an admission to view fee structure</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
