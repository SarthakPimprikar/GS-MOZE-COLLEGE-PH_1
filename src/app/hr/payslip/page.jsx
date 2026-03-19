"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PayrollPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/hr/staff');
        const data = await res.json();
        if (data.success) {
          setEmployees(data.data);
          setFilteredEmployees(data.data);
        } else {
          setError(data.error || 'Failed to fetch staff');
        }
      } catch (error) {
        setError('Error fetching employees: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Search filtering
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => 
        (emp.staffId && emp.staffId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (emp.name && emp.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Payroll Management</h1>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by Staff ID or Name..."
            />
            <div className="absolute right-3 top-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees?.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id}>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.staffId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.name}</td> */}

                      <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className='flex-shrink-0 h-10 w-10 mr-2 rounded-full bg-gray-100 flex items-center justify-center text-gray-950 font-medium'>
                {getInitials(employee.name)}
              </div>
              <div className='flex flex-col'>
                <span className="text-sm font-medium text-gray-900">{employee.name}</span>
              <span className="text-xs text-gray-500">{employee.staffId}</span>
              </div>
              
            </div>
          </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link
                          href={`/hr/payslip/${employee.staffId}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Generate Slip
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
