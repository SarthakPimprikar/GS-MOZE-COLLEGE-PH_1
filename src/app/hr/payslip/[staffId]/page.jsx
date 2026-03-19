"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GeneratePayslip({ params }) {
  const { staffId } = use(params);
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [payslip, setPayslip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Fetch staff data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const empRes = await fetch(`/api/hr/staff/${staffId}`);
        if (!empRes.ok) throw new Error('Failed to fetch staff');
        const empData = await empRes.json();
        setEmployee(empData);
        setPayslip(null);
      } catch (error) {
        setError(error.message);
        setEmployee(null);
        setPayslip(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [staffId]);

  useEffect(() => {
    setPayslip(null);
  }, [month, year]);

  const handleGeneratePayslip = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
      const res = await fetch(`/api/hr/staff/${staffId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId: employee?._id, month: monthName, year }),
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setPayslip(data.data[0]);
      } else {
        throw new Error(data.message || 'Failed to generate payslip');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Dynamically import libraries
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = document.getElementById('payslip-to-print');
      if (!element) {
        throw new Error('Payslip element not found');
      }

      // Add padding for PDF generation
      const originalPadding = element.style.padding;
      element.style.padding = '40px';

      // Generate canvas from HTML with higher quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('payslip-to-print');
          if (clonedElement) {
            clonedElement.style.color = '#111827';
          }
        }
      });

      // Restore original padding
      element.style.padding = originalPadding;

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions to fit content properly
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
      pdf.save(`Payslip_${employee?.staffId}_${monthName}_${year}.pdf`);
      
    } catch (error) {
      alert('Failed to generate PDF: ' + error.message);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto text-center">
          <div className="mx-auto w-24 h-24 text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Occurred</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => router.back()} 
            className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:shadow-md transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Generate Payslip
            </h1>
            <p className="text-gray-500">Create and download employee payslips</p>
          </div>
        </div>
        
        {/* Employee Info */}
        {employee && (
          <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Employee Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Staff ID</p>
                <p className="font-semibold text-gray-800 mt-1">{employee.staffId}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
                <p className="font-semibold text-gray-800 mt-1">{employee.name}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Department</p>
                <p className="font-semibold text-gray-800 mt-1">{employee.department}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Position</p>
                <p className='font-semibold text-gray-800 mt-1'>{employee.designation}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</p>
                <p className="font-semibold text-gray-800 mt-1">{employee.salary}</p>
              </div>
            </div>
          </div>
        )}

        {/* Month/Year Selection */}
        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Select Period
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(year, m - 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleGeneratePayslip}
            disabled={isGenerating}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all disabled:opacity-70 w-full md:w-auto flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Generate Payslip
              </>
            )}
          </button>
        </div>

        {/* Payslip Display */}
        {payslip && (
          <div className="mb-8">
            {/* Wrapper with border for display only */}
            <div className="p-8 border-2 border-gray-300 rounded-xl shadow-sm bg-white">
              <div id="payslip-to-print" style={{backgroundColor: '#ffffff', color: '#111827'}} className="payslip-content">
                {/* Payslip Header */}
                <div className="text-center mb-8 pb-6" style={{borderBottom: '2px solid #d1d5db'}}>
                  <h2 className="text-3xl font-bold mb-2" style={{color: '#1f2937'}}>PAYSLIP</h2>
                  <p className="text-lg" style={{color: '#4b5563'}}>
                    {payslip.month} {payslip.year}
                  </p>
                </div>

                {/* Employee Details */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-4 rounded-lg" style={{backgroundColor: '#f9fafb', border: '1px solid #d1d5db'}}>
                    <p className="text-sm font-semibold mb-1" style={{color: '#4b5563'}}>Employee ID</p>
                    <p className="text-base font-medium" style={{color: '#1f2937'}}>{employee.staffId}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{backgroundColor: '#f9fafb', border: '1px solid #d1d5db'}}>
                    <p className="text-sm font-semibold mb-1" style={{color: '#4b5563'}}>Employee Name</p>
                    <p className="text-base font-medium" style={{color: '#1f2937'}}>{employee.name}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{backgroundColor: '#f9fafb', border: '1px solid #d1d5db'}}>
                    <p className="text-sm font-semibold mb-1" style={{color: '#4b5563'}}>Department</p>
                    <p className="text-base font-medium" style={{color: '#1f2937'}}>{employee.department}</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{backgroundColor: '#f9fafb', border: '1px solid #d1d5db'}}>
                    <p className="text-sm font-semibold mb-1" style={{color: '#4b5563'}}>Date of Issue</p>
                    <p className="text-base font-medium" style={{color: '#1f2937'}}>{new Date(payslip.dateOfIssue).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Earnings and Deductions */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Earnings */}
                  <div className="rounded-lg p-6" style={{border: '2px solid #d1d5db'}}>
                    <h3 className="font-bold text-lg pb-3 mb-4" style={{color: '#1f2937', borderBottom: '2px solid #d1d5db'}}>
                      EARNINGS
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span style={{color: '#374151'}}>Basic Salary:</span>
                        <span className="font-semibold" style={{color: '#1f2937'}}>₹{Number(payslip?.earnings?.basic ?? 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{color: '#374151'}}>HRA:</span>
                        <span className="font-semibold" style={{color: '#1f2937'}}>₹{Number(payslip?.earnings?.hra ?? 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{color: '#374151'}}>DA:</span>
                        <span className="font-semibold" style={{color: '#1f2937'}}>₹{Number(payslip?.earnings?.da ?? 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{color: '#374151'}}>Special Allowance:</span>
                        <span className="font-semibold" style={{color: '#1f2937'}}>₹{Number(payslip?.earnings?.specialallowance ?? 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{color: '#374151'}}>Bonus:</span>
                        <span className="font-semibold" style={{color: '#1f2937'}}>₹{Number(payslip?.earnings?.bonus ?? 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 mt-4" style={{borderTop: '2px solid #d1d5db'}}>
                        <span className="font-bold" style={{color: '#1f2937'}}>Total Earnings:</span>
                        <span className="font-bold text-lg" style={{color: '#15803d'}}>₹{Number(payslip?.earnings?.grossEarnings ?? 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="rounded-lg p-6" style={{border: '2px solid #d1d5db'}}>
                    <h3 className="font-bold text-lg pb-3 mb-4" style={{color: '#1f2937', borderBottom: '2px solid #d1d5db'}}>
                      DEDUCTIONS
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span style={{color: '#374151'}}>PF:</span>
                        <span className="font-semibold" style={{color: '#1f2937'}}>₹{payslip.deductions.pf.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{color: '#374151'}}>TDS:</span>
                        <span className="font-semibold" style={{color: '#1f2937'}}>₹{payslip.deductions.tds.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{color: '#374151'}}>Loan:</span>
                        <span className="font-semibold" style={{color: '#1f2937'}}>₹{payslip.deductions.loan.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{color: '#374151'}}>Leave:</span>
                        <span className="font-semibold" style={{color: '#1f2937'}}>₹{payslip.deductions.leave.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{color: '#374151'}}>Other:</span>
                        <span className="font-semibold" style={{color: '#1f2937'}}>₹{payslip.deductions.other.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 mt-4" style={{borderTop: '2px solid #d1d5db'}}>
                        <span className="font-bold" style={{color: '#1f2937'}}>Total Deductions:</span>
                        <span className="font-bold text-lg" style={{color: '#b91c1c'}}>₹{payslip.totalDeductions.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <div className="p-6 rounded-lg" style={{backgroundColor: '#dbeafe', border: '2px solid #93c5fd'}}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{color: '#374151'}}>Net Salary Payable</p>
                      <p className="font-bold text-3xl" style={{color: '#111827'}}>₹{payslip.netSalary.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold mb-1" style={{color: '#374151'}}>Payment Status</p>
                      <p className="font-bold text-lg" style={{color: '#15803d'}}>{payslip.paymentStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Cancel
              </button>
              <button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-md transition-all disabled:opacity-70 flex items-center justify-center"
              >
                {isGeneratingPDF ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}