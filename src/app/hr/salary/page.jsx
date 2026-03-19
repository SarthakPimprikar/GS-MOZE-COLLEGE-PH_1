"use client";

import { useState, useEffect } from 'react';

export default function SalaryPage() {
  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    baseSalary: '',
    allowances: '',
    deductions: '',
    leaveDeduction: ''
  });
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [staffList, setStaffList] = useState([]); // NEW: staff list state
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [staffInfo,setStaffInfo] = useState(null);

  useEffect(() => {
    const fetchStaffList = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/hr/staff');
        const data = await res.json();
        if (data.success) setStaffList(data.data);
      } catch (error) {
        console.error('Error fetching staff list:', error);
        setStaffList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffList();
  }, []);


  useEffect(() => {
    if (formData.staffId || formData.name) {
      searchStaff();
    } else {
      setStaffInfo(null);
      setSearchTerm('');
    }
  }, [formData.staffId, formData.name]);

  const searchStaff = async () => {
    setSearchTerm('Searching...');
    
    try {
      // Check if we have the staff in our local list first
      const foundStaff = staffList.find(staff => 
        staff.staffId === formData.staffId || staff.name === formData.name
      );
      
      if (foundStaff) {
        setStaffInfo(foundStaff);
        setSearchTerm('Staff found!');
        
        // Check if this staff already has a salary record
        await checkExistingSalary(foundStaff.staffId);
        return;
      }
      
      // If not found in local list, try to fetch from API
      const res = await fetch('/api/hr/staff');
      const data = await res.json();
      
      if (data.success) {
        const staffFromApi = data.data.find(staff => 
          staff.staffId === formData.staffId || staff.name === formData.name
        );
        
        if (staffFromApi) {
          setStaffInfo(staffFromApi);
          setSearchTerm('Staff found!');
          await checkExistingSalary(staffFromApi.staffId);
        } else {
          setStaffInfo(null);
          setSearchTerm('Staff not found. Please check the Staff ID or Name.');
        }
      } else {
        setStaffInfo(null);
        setSearchTerm('Error searching for staff.');
      }
    } catch (error) {
      console.error('Error searching for staff:', error);
      setStaffInfo(null);
      setSearchTerm('Error searching for staff.');
    }
  };


  const checkExistingSalary = async (staffId) =>{
    try{
      const res = await fetch('/api/hr/salary');
      const data = await res.json();

      if(data.success){
        const existingSalary = data.data.find(record => record.staffId === staffId || record.staffId?.staffId === staffId);

        if(existingSalary){
          setEditingId(existingSalary._id);
          setFormData(prev =>({
            ...prev,
            baseSalary:existingSalary.baseSalary?.toString() || '',
            allowances:existingSalary.allowances?.toString() || '',
            deductions:existingSalary.deductions?.toString() || '',
            leaveDeduction:existingSalary.leaveDeduction?.toString() || ''
          }));
        }else{
          setEditingId(null);
          setFormData(prev => ({
            ...prev,
            baseSalary:'',
            allowances:'',
            deductions:'',
            leaveDeduction:''
          }));
        }
      }
    }catch(error){
      console.error('Error check existing',error);
    }
  }

  // Enhanced input change handler for syncing
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   let updatedForm = { ...formData, [name]: value };

  //   // Helper: find in salaryRecords
  //   const findInSalary = (key, val) => salaryRecords.find(r => r[key] === val);
  //   // Helper: find in staffList
  //   const findInStaff = (key, val) => staffList.find(s => s[key] === val);

  //   if (name === 'staffId') {
  //     // Try to find in salary records first
  //     const salaryRec = findInSalary('staffId', value);
  //     if (salaryRec) {
  //       updatedForm = {
  //         staffId: salaryRec.staffId.staffId,
  //         name: salaryRec.name,
  //         baseSalary: salaryRec.baseSalary?.toString() || '',
  //         allowances: salaryRec.allowances?.toString() || '',
  //         deductions: salaryRec.deductions?.toString() || '',
  //         leaveDeduction: salaryRec.leaveDeduction?.toString() || ''
  //       };
  //       setEditingId(salaryRec._id);
  //     } else {
  //       // Not in salary, try staff list
  //       const staff = findInStaff('staffId', value);
  //       if (staff) {
  //         updatedForm.name = staff.name;
  //       }
  //       // Clear salary fields for new entry
  //       updatedForm.baseSalary = '';
  //       updatedForm.allowances = '';
  //       updatedForm.deductions = '';
  //       updatedForm.leaveDeduction = '';
  //       setEditingId(null);
  //     }
  //   }
  //   if (name === 'name') {
  //     // Try to find in salary records first
  //     const salaryRec = findInSalary('name', value);
  //     if (salaryRec) {
  //       updatedForm = {
  //         staffId: salaryRec.staffId._id,
  //         name: salaryRec.name,
  //         baseSalary: salaryRec.baseSalary?.toString() || '',
  //         allowances: salaryRec.allowances?.toString() || '',
  //         deductions: salaryRec.deductions?.toString() || '',
  //         leaveDeduction: salaryRec.leaveDeduction?.toString() || ''
  //       };
  //       setEditingId(salaryRec._id);
  //     } else {
  //       // Not in salary, try staff list
  //       const staff = findInStaff('name', value);
  //       if (staff) {
  //         updatedForm.staffId = staff.staffId;
  //       }
  //       // Clear salary fields for new entry
  //       updatedForm.baseSalary = '';
  //       updatedForm.allowances = '';
  //       updatedForm.deductions = '';
  //       updatedForm.leaveDeduction = '';
  //       setEditingId(null);
  //     }
  //   }
  //   setFormData(updatedForm);
  // };

  const handleInputChange = (e) =>{
    const {name,value} = e.target;
    setFormData(prev =>({...prev,[name]:value}));
  }
  const calculateNetSalary = () => {
    const base = parseFloat(formData.baseSalary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const leaveDeduction = parseFloat(formData.leaveDeduction) || 0;
    return base + allowances - deductions - leaveDeduction;
  };

  const handleSubmit = async () => {
    if (!staffInfo || !formData.baseSalary) {
      alert('Please find a staff member first');
      return};

    setIsLoading(true);
    try {
      const res = await fetch('/api/hr/salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
         // staffId: formData.staffId?.staffId,
         staffId:staffInfo._id || staffInfo.staffId,
          name: formData.name,
          baseSalary: parseFloat(formData.baseSalary),
          allowances: parseFloat(formData.allowances) || 0,
          deductions: parseFloat(formData.deductions) || 0,
          leaveDeduction: parseFloat(formData.leaveDeduction) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
          alert(editingId?'Salary updated successfully!':'Salary structured added successfully!');
          setFormData({
            staffId:'',
            name:'',
            baseSalary:'',
            allowances:'',
            deductions:'',
            leaveDeduction:''
          });
          setStaffInfo(null);
          setEditingId(null);
          setSearchTerm('');
        }else{
          alert(data.error || 'Failed to save salary');
        }
    } catch (err) {
      alert('Error saving salary');
    }
    setIsLoading(false);
  };

  // const handleEdit = (record) => {
  //   setFormData({
  //     staffId: record.staffId?.staffId || record.staffId,
  //     name: record.name,
  //     baseSalary: record.baseSalary.toString(),
  //     allowances: record.allowances.toString(),
  //     deductions: record.deductions.toString(),
  //     leaveDeduction: record.leaveDeduction.toString()
  //   });
  //   setEditingId(record._id);
  // };

  // No backend delete implemented yet
  // const handleDelete = (id) => {
  //   setSalaryRecords(prev => prev.filter(record => record._id !== id));
  // };

  const filteredRecords = salaryRecords?.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.staffId.toLowerCase().includes(searchTerm.toLowerCase())
  );
console.log(salaryRecords)
  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-8 max-w-5xl mx-auto w-full">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Salary Structure Management</h1>
          <a 
            href="/hr/payroll" 
            className="inline-flex items-center text-[#093FB4] hover:text-blue-700 font-medium cursor-pointer text-sm sm:text-base"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Payroll
          </a>
        </div>

        {/* Add/Edit Salary Form */}
        <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Salary Structure' : 'Add New Salary Structure'}
          </h2>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-1">
                  Staff ID *
                </label>
                <input
                  type="text"
                  id="staffId"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., STF010"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter employee name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700 mb-1">
                  Base Salary *
                </label>
                <input
                  type="number"
                  id="baseSalary"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="allowances" className="block text-sm font-medium text-gray-700 mb-1">
                  Allowances
                </label>
                <input
                  type="number"
                  id="allowances"
                  name="allowances"
                  value={formData.allowances}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="deductions" className="block text-sm font-medium text-gray-700 mb-1">
                  Deductions
                </label>
                <input
                  type="number"
                  id="deductions"
                  name="deductions"
                  value={formData.deductions}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="leaveDeduction" className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Deduction
                </label>
                <input
                  type="number"
                  id="leaveDeduction"
                  name="leaveDeduction"
                  value={formData.leaveDeduction}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Net Salary Preview */}
            {(formData.baseSalary || formData.allowances || formData.deductions || formData.leaveDeduction) && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-md border">
                <p className="text-xs sm:text-sm text-gray-600">
                  Net Salary Preview: <span className="font-bold text-base sm:text-lg text-[#093FB4]">${calculateNetSalary().toLocaleString()}</span>
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-4 sm:px-6 py-2 rounded-md font-medium ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#093FB4] hover:bg-blue-700 text-[#FFFCFB]'}`}
              >
                {isLoading ? 'Processing...' : editingId ? 'Update Salary' : 'Add Salary Structure'}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      staffId: '',
                      name: '',
                      baseSalary: '',
                      allowances: '',
                      deductions: '',
                      leaveDeduction: ''
                    });
                  }}
                  className="px-4 sm:px-6 py-2 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search and Table */}
        {/* <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Search by name or staff ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/3"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff ID</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Salary</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Deduction</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map(record => (
                <tr key={record._id}>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{record.staffId}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{record.name}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">₹{record.baseSalary?.toLocaleString?.() ?? '-'}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">${record.allowances?.toLocaleString?.() ?? '-'}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">${record.deductions?.toLocaleString?.() ?? '-'}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">₹{record.leaveDeduction?.toLocaleString?.() ?? '-'}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-bold">₹{record.netSalary?.toLocaleString?.() ?? '-'}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-2"
                       onClick={() => handleEdit(record)}
                    >
                      Edit
                    </button>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </div>
  );
}