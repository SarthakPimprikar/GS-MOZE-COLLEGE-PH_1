// components/InstallmentTable.jsx
'use client';

import { useEffect, useState } from 'react';

export default function InstallmentTable({ studentId }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch(`/api/students/${studentId}/fee/installments`);
        const json = await res.json();
        if (json.success) {
          setPlan(json.data);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [studentId]);

  if (loading) return <p>Loading...</p>;
  if (!plan || !plan.installments) return <p>No installment plan found.</p>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Installment Plan</h2>
      <p><strong>Total Fee:</strong> ₹{plan.totalFee}</p>
      <table className="w-full mt-4 border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {plan.installments.map((amt, i) => (
            <tr key={i}>
              <td className="border p-2 text-center">{i + 1}</td>
              <td className="border p-2 text-center">₹{amt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
