'use client';
import { useState, useEffect } from 'react';

export default function StaffPage() {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch('/api/staff');
        const data = await res.json();
        setStaffData(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStaff();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Staff Information</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffData.map(staff => (
          <div key={staff.staffId} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{staff.name}</h2>
            <p>{staff.designation}</p>
            <p>{staff.department}</p>
            <p>Base Salary: ₹{staff.currentSalary.base.toLocaleString()}</p>
            <p>Leaves Taken: {staff.leaves.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}