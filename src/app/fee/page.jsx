'use client';
import { useEffect, useState } from 'react';

function FeeTable({ studentId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch(`/api/fee/summary/${studentId}`);
        const result = await res.json();
        if (result.success) setSummary(result.data);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [studentId]);

  if (loading) return <p className="text-gray-500">Loading fee summary...</p>;
  if (!summary) return <p className="text-red-600">Could not load data.</p>;

  return (
    <div className="p-6 bg-white shadow rounded max-w-xl mx-auto mt-6">
      <h1 className="text-xl font-semibold mb-4">Fee Summary</h1>
      <table className="table-auto w-full border text-sm">
        <tbody>
          <tr><td className="border p-2 font-medium">Total Installment</td><td className="border p-2">₹{summary.totalInstallment}</td></tr>
          <tr><td className="border p-2 font-medium">Total Discount</td><td className="border p-2">₹{summary.totalDiscount}</td></tr>
          <tr><td className="border p-2 font-medium">Total Scholarship</td><td className="border p-2">₹{summary.totalScholarship}</td></tr>
          <tr className="font-bold bg-green-50"><td className="border p-2">Final Payable</td><td className="border p-2 text-green-600">₹{summary.finalPayable}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// Page with example studentId (replace with dynamic route or auth)
export default function FeePage() {
  const studentId = '685e5da298d08fcbb443cdfc'; // <-- replace as needed
  return <FeeTable studentId={studentId} />;
}
