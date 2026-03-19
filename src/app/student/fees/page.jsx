"use client";

import React, { useState, useEffect } from "react";
import { Wallet, CreditCard, Clock, CheckCircle2, Copy, FileText, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";

export default function FeePayment() {
  const { user } = useSession();
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default Fallback Fake Data (replaces correctly via API if present)
  const [feeDetails, setFeeDetails] = useState({
    totalFees: 0,
    paidAmount: 0,
    pendingBalance: 0,
    nextDueDate: "Oct 15, 2026",
    course: ""
  });

  useEffect(() => {
    const fetchRealFees = async () => {
      if (!user) return;
      try {
        const studentId = user.id || user._id;
        
        // Parallel fetches for admission status & mapped fee structure
        const [feeRes, admissionRes] = await Promise.all([
          fetch(`/api/students/${studentId}/fee`),
          fetch(`/api/students/${studentId}/admission`)
        ]);

        let feeData = {};
        let adminData = {};

        if (feeRes.ok) feeData = await feeRes.json();
        if (admissionRes.ok) adminData = await admissionRes.json();

        // Safe Defaults
        let computedTotal = 0;
        let computedPaid = 0;
        
        // Extract real total fees from backend fee structure mapped by course/year/caste
        if (feeData.success && feeData.feeStructure) {
          computedTotal = feeData.feeStructure.totalFee || 0;
        }

        // We assume admission records map how much student already paid, or defaults if none
        // NOTE: For now 'payAmount' will be simulated as 0 if not tracked.
        
        setFeeDetails({
          totalFees: computedTotal,
          paidAmount: computedPaid,
          pendingBalance: computedTotal - computedPaid,
          nextDueDate: "End of Semester",
          course: feeData.student?.course || "Enrolled Course"
        });

      } catch (err) {
        console.error("Failed to fetch live fees", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealFees();
  }, [user]);

  const transactionHistory = [
    { id: "TXN-892341", date: "Aug 02, 2025", amount: 45000, method: "Net Banking", status: "Success" }
  ];

  const handlePayment = (e) => {
    e.preventDefault();
    if (!paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0) return;
    if (paymentAmount > feeDetails.pendingBalance) return; // Basic validation

    setIsProcessing(true);
    
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Normally, here you'd redirect to the receipt or update DB
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {loading && (
        <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-moze-primary" />
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">Fee Management</h1>
        <p className="text-gray-500 text-sm">View your fee structure, pay balances, and download receipts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Payment */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Fee Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 opacity-50"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Wallet className="w-5 h-5" /></div>
                <h3 className="font-semibold text-gray-600">Total Fees</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">₹{feeDetails.totalFees.toLocaleString()}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-10 opacity-50"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
                <h3 className="font-semibold text-gray-600">Paid Amount</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">₹{feeDetails.paidAmount.toLocaleString()}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-moze-primary p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 text-white rounded-lg backdrop-blur-sm"><AlertCircle className="w-5 h-5" /></div>
                  <h3 className="font-semibold text-maroon-100">Pending Balance</h3>
                </div>
                <p className="text-3xl font-bold text-white mb-2">₹{feeDetails.pendingBalance.toLocaleString()}</p>
                <div className="inline-flex items-center text-xs font-medium text-yellow-300 bg-black/20 px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3 mr-1.5" /> Due by {feeDetails.nextDueDate}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Gateway Simulation */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-50 flex items-center gap-3">
              <div className="bg-maroon-50 p-2.5 rounded-xl text-moze-primary">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-gray-900">Make a Payment</h2>
                <p className="text-sm text-gray-500">Secure online fee payment portal</p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {!showSuccess ? (
                <form onSubmit={handlePayment}>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Amount to Pay (INR)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₹</span>
                      <input 
                        type="number" 
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter amount"
                        max={feeDetails.pendingBalance}
                        className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-moze-primary focus:border-moze-primary outline-none transition-all text-lg font-bold text-gray-900"
                        required
                      />
                    </div>
                    {paymentAmount && paymentAmount > feeDetails.pendingBalance && (
                      <p className="text-red-500 text-xs mt-2 font-medium">Amount cannot exceed pending balance.</p>
                    )}
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-8">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-bold mb-1">Important Instructions</p>
                        <p className="text-blue-600">Ensure a stable internet connection before proceeding. Do not refresh the page while payment is processing.</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isProcessing || paymentAmount > feeDetails.pendingBalance}
                    className={`w-full py-4 rounded-full font-bold text-white text-lg transition-all shadow-md flex items-center justify-center ${
                      isProcessing ? "bg-maroon-800 opacity-70 cursor-wait" : "bg-moze-primary hover:bg-maroon-800 hover:-translate-y-1 hover:shadow-xl"
                    }`}
                  >
                    {isProcessing ? "Processing Payment..." : `Pay ₹${paymentAmount || "0"}`}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto">Your payment has been securely processed. A digital acknowledgment receipt has been generated.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      href="/student/fees/receipt"
                      className="px-8 py-3.5 bg-moze-primary text-white font-bold rounded-full hover:bg-maroon-800 transition-colors shadow-md flex items-center justify-center"
                    >
                      <FileText className="w-5 h-5 mr-2" /> Download Receipt
                    </Link>
                    <button 
                      onClick={() => { setShowSuccess(false); setPaymentAmount(""); }}
                      className="px-8 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      Make Another Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-full">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Recent Transactions</h3>
            
            <div className="space-y-4">
              {transactionHistory.map((txn, index) => (
                <div key={index} className="p-4 rounded-2xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-gray-100 hover:shadow-sm transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-bold tracking-wider text-gray-400 uppercase block mb-1">Transaction ID</span>
                      <span className="text-sm font-semibold text-moze-primary flex items-center gap-1.5">
                        {txn.id} <Copy className="w-3 h-3 text-gray-300 group-hover:text-moze-primary transition-colors" />
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold tracking-wider text-gray-400 uppercase block mb-1">Amount</span>
                      <span className="text-sm font-bold text-gray-900">₹{txn.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end border-t border-gray-100 pt-3 mt-1">
                    <div>
                      <span className="text-xs text-gray-500 block">{txn.date}</span>
                      <span className="text-xs text-gray-500 block">{txn.method}</span>
                    </div>
                    <Link href="/student/fees/receipt" className="text-xs font-bold text-moze-primary bg-maroon-50 px-3 py-1.5 rounded-lg flex items-center hover:bg-moze-primary hover:text-white transition-colors">
                      Receipt <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 text-sm font-bold text-gray-500 hover:text-moze-primary transition-colors flex items-center justify-center border-t border-dashed border-gray-200 pt-6">
              View All Transactions <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Info({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
