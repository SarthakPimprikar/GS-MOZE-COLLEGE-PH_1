"use client";

import React from "react";
import { Printer, ArrowLeft, Download, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";

export default function FeeReceipt() {
  const { user } = useSession();

  const receiptData = {
    receiptNo: "REC-2025-0892",
    date: "19 Mar 2026",
    studentName: user?.fullName || "Rohit Sharma",
    prn: "PRN-2024-889921",
    course: "B.Tech Computer Engineering",
    academicYear: "2026-27",
    amountPaid: 65000,
    amountWords: "Sixty Five Thousand Rupees Only",
    paymentMode: "Net Banking (TXN-892341)",
    feeCategory: "Tuition Fee - 1st Installment",
  };

  // The actual receipt layout template (used twice: Student Copy & Office Copy)
  const ReceiptTemplate = ({ copyType }) => (
    <div className="bg-white border-2 border-gray-800 p-8 w-full relative">
      {/* Dynamic Watermark connecting back to brand via print styles */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <GraduationCap className="w-96 h-96 text-gray-900" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-white border-2 border-gray-800 p-2 rounded-lg text-gray-900 print:border-black">
            <GraduationCap className="w-10 h-10 print:text-black" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-black text-gray-900 tracking-tight print:text-black">
              G.S. Moze College
            </h1>
            <p className="text-xs font-bold text-gray-700 tracking-widest uppercase print:text-black mt-1">
              Sector 12, University Road, Pune 411005
            </p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="border-2 border-gray-800 px-3 py-1 font-bold text-xs uppercase tracking-wider mb-2 print:border-black">
            {copyType}
          </div>
          <h2 className="text-xl font-bold text-gray-900 print:text-black">FEE RECEIPT</h2>
        </div>
      </div>

      {/* Meta Data */}
      <div className="flex justify-between mb-8 text-sm">
        <div>
          <p className="mb-1"><span className="font-bold text-gray-700 w-24 inline-block">Receipt No:</span> <span className="font-bold text-gray-900">{receiptData.receiptNo}</span></p>
          <p><span className="font-bold text-gray-700 w-24 inline-block">Date:</span> <span className="font-medium text-gray-900">{receiptData.date}</span></p>
        </div>
        <div className="text-right">
          <p className="mb-1"><span className="font-bold text-gray-700">Academic Year:</span> <span className="font-medium text-gray-900">{receiptData.academicYear}</span></p>
        </div>
      </div>

      {/* Student Details Grid */}
      <div className="border border-gray-300 p-5 rounded-lg mb-8 bg-gray-50/50 print:bg-transparent print:border-black">
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div>
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Student Name</span>
            <span className="font-bold text-gray-900 text-base uppercase">{receiptData.studentName}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">PRN / Roll No.</span>
            <span className="font-bold text-gray-900 text-base">{receiptData.prn}</span>
          </div>
          <div className="col-span-2">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Course / Branch</span>
            <span className="font-bold text-gray-900 text-base">{receiptData.course}</span>
          </div>
        </div>
      </div>

      {/* Payment Details Table */}
      <table className="w-full text-left mb-6 border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-800 text-sm">
            <th className="py-2 px-2 font-bold uppercase text-gray-700">Particulars</th>
            <th className="py-2 px-2 font-bold uppercase text-gray-700 text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-4 px-2 font-semibold text-gray-800">{receiptData.feeCategory}</td>
            <td className="py-4 px-2 font-bold text-gray-900 text-right">₹{receiptData.amountPaid.toLocaleString()}.00</td>
          </tr>
          <tr>
            <td className="py-4 px-2 font-bold uppercase text-gray-900">Total Paid</td>
            <td className="py-4 px-2 font-black text-gray-900 text-lg text-right">₹{receiptData.amountPaid.toLocaleString()}.00</td>
          </tr>
        </tbody>
      </table>

      {/* Amount in words & Meta */}
      <div className="mb-12">
        <p className="text-sm font-bold text-gray-900 bg-gray-100 p-3 rounded print:bg-transparent print:border-black print:border">
          <span className="text-gray-600 uppercase tracking-wider text-xs mr-2">In Words:</span>
          {receiptData.amountWords}
        </p>
        <p className="text-sm mt-4 text-gray-600">
          <span className="font-bold uppercase tracking-wider text-xs mr-2 text-gray-500">Payment Mode:</span> 
          {receiptData.paymentMode}
        </p>
      </div>

      {/* Signatures */}
      <div className="flex justify-between items-end mt-16 pt-8">
        <div className="text-center">
          <div className="w-40 border-t border-gray-400 mb-2"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Student's Signature</p>
        </div>
        <div className="text-center">
          <div className="w-40 border-t border-gray-400 mb-2"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Authorized Signatory</p>
        </div>
      </div>
      
      {/* Print Footer Text */}
      <div className="mt-8 text-center text-[10px] text-gray-400 italic print:block">
        This is a computer-generated receipt and requires an authorized signature to be valid.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-20 print:bg-white print:p-0 print:m-0">
      
      {/* Top Action Bar (Hidden when printing via CSS config) */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/student/fees" className="flex items-center text-gray-500 hover:text-moze-primary font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Fees
          </Link>
          <div className="flex gap-4">
            <button 
              onClick={() => window.print()}
              className="flex items-center bg-moze-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-maroon-800 transition-colors shadow-sm"
            >
              <Printer className="w-5 h-5 mr-2" /> Print Receipt
            </button>
            <button className="flex items-center border-2 border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 mr-2" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Preview Area */}
      <div className="max-w-4xl mx-auto mt-8 px-4 print:mt-0 print:px-0 print:w-full print:max-w-none">
        
        {/* Print instructions for preview UI */}
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-8 flex items-start gap-3 border border-blue-100 print:hidden shadow-sm">
          <Printer className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
          <div className="text-sm">
            <p className="font-bold">Ready to Print</p>
            <p>Click "Print Receipt". Our print CSS will automatically hide the sidebars, backgrounds, and buttons, ensuring a clean, A4-friendly dual receipt.</p>
          </div>
        </div>

        {/* The actual A4 Dual Copy Document Wrapper */}
        <div className="bg-white shadow-2xl overflow-hidden print:shadow-none print:bg-white w-full print:w-[210mm] print:h-[297mm] mx-auto print:mx-0 flex flex-col gap-8 print:gap-4 box-border">
          
          <ReceiptTemplate copyType="Office Copy" />
          
          <div className="w-full border-t-2 border-dashed border-gray-300 relative my-4 print:my-2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest print:bg-white">
              Fold or Cut Here
            </div>
          </div>

          <ReceiptTemplate copyType="Student Copy" />
          
        </div>
      </div>

    </div>
  );
}
