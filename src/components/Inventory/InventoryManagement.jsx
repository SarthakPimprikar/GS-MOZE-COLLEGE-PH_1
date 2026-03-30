"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  AlertTriangle, 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  Trash2, 
  Edit3,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  ChevronDown
} from "lucide-react";
import { toast } from "react-hot-toast";

const InventoryManagement = ({ role }) => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventory, setInventory] = useState([]);
  const [amcs, setAmcs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("item"); // 'item' or 'amc'
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states
  const [inventoryForm, setInventoryForm] = useState({
    itemName: "",
    category: "Electronics",
    quantity: 0,
    unit: "Pcs",
    minStockLevel: 5,
    pricePerUnit: 0,
    supplier: { name: "", contact: "", email: "" },
    location: "Main Store"
  });

  const [amcForm, setAmcForm] = useState({
    itemId: "",
    itemName: "",
    vendorName: "",
    vendorContact: "",
    startDate: "",
    endDate: "",
    renewalDate: "",
    amcCost: 0,
    description: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, amcRes, alertRes] = await Promise.all([
        fetch("/api/inventory"),
        fetch("/api/amc"),
        fetch("/api/amc/reminders")
      ]);

      const invData = await invRes.json();
      const amcData = await amcRes.json();
      const alertData = await alertRes.json();

      setInventory(Array.isArray(invData) ? invData : []);
      setAmcs(Array.isArray(amcData) ? amcData : []);
      setAlerts(Array.isArray(alertData) ? alertData : []);
    } catch (error) {
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInventory = async (e) => {
    e.preventDefault();
    try {
      const method = selectedItem ? "PUT" : "POST";
      const url = selectedItem ? `/api/inventory/${selectedItem._id}` : "/api/inventory";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inventoryForm),
      });

      if (res.ok) {
        toast.success(`Item ${selectedItem ? "updated" : "added"} successfully`);
        fetchData();
        setShowModal(false);
        resetForms();
      }
    } catch (error) {
      toast.error("Error saving inventory item");
    }
  };

  const handleCreateAMC = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/amc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(amcForm),
      });

      if (res.ok) {
        toast.success("AMC added successfully");
        fetchData();
        setShowModal(false);
        resetForms();
      }
    } catch (error) {
      toast.error("Error saving AMC");
    }
  };

  const deleteItem = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      const res = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchData();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const resetForms = () => {
    setInventoryForm({
      itemName: "",
      category: "Electronics",
      quantity: 0,
      unit: "Pcs",
      minStockLevel: 5,
      pricePerUnit: 0,
      supplier: { name: "", contact: "", email: "" },
      location: "Main Store"
    });
    setAmcForm({
      itemId: "",
      itemName: "",
      vendorName: "",
      vendorContact: "",
      startDate: "",
      endDate: "",
      renewalDate: "",
      amcCost: 0,
      description: ""
    });
    setSelectedItem(null);
  };

  const glassStyle = "bg-white/70 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl";

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
      {/* Header & Alerts */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            Inventory & Asset Management
          </h1>
          <p className="text-gray-500">Track items, stock levels, and AMC renewals</p>
        </div>
        {role === "Admin" && (
          <button 
            onClick={() => { setModalType("item"); setShowModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-200"
          >
            <Plus size={20} />
            <span>Add New Item</span>
          </button>
        )}
      </div>

      {/* Renewal Alerts Banner */}
      {alerts.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <AlertTriangle size={24} className="animate-pulse" />
            </div>
            <div>
              <p className="font-semibold text-amber-800">{alerts.length} AMCs Require Immediate Renewal</p>
              <p className="text-sm text-amber-700">Check the AMC tab for items nearing expiration within 30 days.</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab("amc")}
            className="text-amber-800 font-medium hover:underline text-sm"
          >
            View All Alerts
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Asset Items", value: inventory.length, icon: Package, color: "blue" },
          { label: "Low Stock Items", value: inventory.filter(i => i.status === "Low Stock").length, icon: AlertTriangle, color: "orange" },
          { label: "Active AMCs", value: amcs.filter(a => a.status === "Active").length, icon: ShieldCheck, color: "green" },
          { label: "Pending Renewals", value: alerts.length, icon: Clock, color: "amber" }
        ].map((stat, idx) => (
          <div key={idx} className={`${glassStyle} p-5 flex items-center justify-between`}>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 bg-${stat.color}-100 text-${stat.color}-600 rounded-xl`}>
              <stat.icon size={26} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs & Filters */}
      <div className={`${glassStyle} overflow-hidden`}>
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab("inventory")}
            className={`flex-1 py-4 font-semibold text-sm transition-all ${activeTab === "inventory" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Stock Tracking
          </button>
          <button 
            onClick={() => setActiveTab("amc")}
            className={`flex-1 py-4 font-semibold text-sm transition-all ${activeTab === "amc" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30" : "text-gray-500 hover:bg-gray-50"}`}
          >
            AMC Details
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={fetchData}
                className="p-2 text-gray-500 hover:bg-slate-100 rounded-lg transition-all"
                title="Refresh Data"
              >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              </button>
              {activeTab === "inventory" && role === "Admin" && (
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
                  <Filter size={16} />
                  Filter
                </button>
              )}
            </div>
          </div>

          {activeTab === "inventory" ? (
             <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                 <thead>
                   <tr className="text-left text-gray-400 text-sm uppercase tracking-wider border-b border-gray-50">
                     <th className="pb-4 font-medium">Item Name</th>
                     <th className="pb-4 font-medium">Category</th>
                     <th className="pb-4 font-medium">Stock Level</th>
                     <th className="pb-4 font-medium">Location</th>
                     <th className="pb-4 font-medium">Status</th>
                     {role === "Admin" && <th className="pb-4 font-medium text-right">Actions</th>}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {inventory.length > 0 ? (
                     inventory
                       .filter(i => i.itemName.toLowerCase().includes(searchTerm.toLowerCase()))
                       .map((item) => (
                       <tr key={item._id} className="group hover:bg-slate-50/50 transition-all">
                         <td className="py-4">
                           <div className="flex flex-col">
                             <span className="font-semibold text-slate-800">{item.itemName}</span>
                             <span className="text-xs text-gray-400">ID: {item._id.slice(-6).toUpperCase()}</span>
                           </div>
                         </td>
                         <td className="py-4 text-sm text-gray-600">{item.category}</td>
                         <td className="py-4">
                           <div className="flex items-center gap-2">
                             <span className={`font-bold ${item.quantity <= item.minStockLevel ? "text-red-500" : "text-emerald-600"}`}>
                               {item.quantity}
                             </span>
                             <span className="text-xs text-gray-400">{item.unit}</span>
                           </div>
                         </td>
                         <td className="py-4 text-sm text-gray-600">{item.location}</td>
                         <td className="py-4">
                           <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                             item.status === 'Low Stock' ? 'bg-orange-100 text-orange-600' : 
                             item.status === 'Out of Stock' ? 'bg-red-100 text-red-600' : 
                             'bg-emerald-100 text-emerald-600'
                           }`}>
                             {item.status}
                           </span>
                         </td>
                         {role === "Admin" && (
                           <td className="py-4 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={() => {
                                   setSelectedItem(item);
                                   setInventoryForm(item);
                                   setModalType("item");
                                   setShowModal(true);
                                 }}
                                 className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                 <Edit3 size={16} />
                               </button>
                               <button 
                                 onClick={() => deleteItem(item._id, "inventory")}
                                 className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           </td>
                         )}
                       </tr>
                     ))
                   ) : (
                     <tr><td colSpan="6" className="py-10 text-center text-gray-400">No inventory items found.</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          ) : (
            <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                 <thead>
                   <tr className="text-left text-gray-400 text-sm uppercase tracking-wider border-b border-gray-50">
                     <th className="pb-4 font-medium">Asset Name</th>
                     <th className="pb-4 font-medium">Vendor</th>
                     <th className="pb-4 font-medium">End Date</th>
                     <th className="pb-4 font-medium">Renewal Date</th>
                     <th className="pb-4 font-medium">Status</th>
                     {role === "Admin" && <th className="pb-4 font-medium text-right">Actions</th>}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {amcs.length > 0 ? (
                     amcs
                       .filter(a => a.itemName.toLowerCase().includes(searchTerm.toLowerCase()))
                       .map((amc) => (
                       <tr key={amc._id} className="group hover:bg-slate-50/50 transition-all">
                         <td className="py-4 font-semibold text-slate-800">{amc.itemName}</td>
                         <td className="py-4 text-sm text-gray-600">{amc.vendorName}</td>
                         <td className="py-4 text-sm text-gray-600">
                           {new Date(amc.endDate).toLocaleDateString()}
                         </td>
                         <td className="py-4 text-sm text-gray-600">
                           {new Date(amc.renewalDate).toLocaleDateString()}
                         </td>
                         <td className="py-4">
                           <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                             amc.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 
                             amc.status === 'Pending Renewal' ? 'bg-amber-100 text-amber-600' : 
                             'bg-red-100 text-red-600'
                           }`}>
                             {amc.status}
                           </span>
                         </td>
                         {role === "Admin" && (
                           <td className="py-4 text-right">
                              <div className="flex justify-end gap-2">
                               <button 
                                 onClick={() => {
                                   setModalType("amc");
                                   setAmcForm({
                                     ...amc,
                                     startDate: amc.startDate.split('T')[0],
                                     endDate: amc.endDate.split('T')[0],
                                     renewalDate: amc.renewalDate.split('T')[0],
                                   });
                                   setShowModal(true);
                                 }}
                                 className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                 <Edit3 size={16} />
                               </button>
                               <button 
                                 onClick={() => deleteItem(amc._id, "amc")}
                                 className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           </td>
                         )}
                       </tr>
                     ))
                   ) : (
                     <tr><td colSpan="6" className="py-10 text-center text-gray-400">No AMC records found.</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className={`${glassStyle} w-full max-w-2xl bg-white p-8 max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {selectedItem ? "Edit" : "Add New"} {modalType === "item" ? "Inventory Item" : "AMC Record"}
              </h2>
              <button onClick={() => { setShowModal(false); resetForms(); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <ChevronDown className="rotate-90" />
              </button>
            </div>

            <div className="flex gap-4 mb-6 p-1 bg-slate-100 rounded-xl">
              <button 
                onClick={() => setModalType("item")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${modalType === 'item' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              >
                Inventory Details
              </button>
              <button 
                onClick={() => setModalType("amc")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${modalType === 'amc' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              >
                AMC Details
              </button>
            </div>

            {modalType === "item" ? (
              <form onSubmit={handleCreateInventory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Item Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={inventoryForm.itemName}
                    onChange={(e) => setInventoryForm({...inventoryForm, itemName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={inventoryForm.category}
                    onChange={(e) => setInventoryForm({...inventoryForm, category: e.target.value})}
                  >
                    {['Electronics', 'Furniture', 'Stationery', 'Lab Equipment', 'Cleaning', 'Others'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Initial Quantity</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={inventoryForm.quantity}
                    onChange={(e) => setInventoryForm({...inventoryForm, quantity: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Unit</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Pcs, Boxes"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={inventoryForm.unit}
                    onChange={(e) => setInventoryForm({...inventoryForm, unit: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Min. Stock Level</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={inventoryForm.minStockLevel}
                    onChange={(e) => setInventoryForm({...inventoryForm, minStockLevel: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                    {selectedItem ? "Update Item" : "Create Item"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateAMC} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Select Asset</label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={amcForm.itemId}
                    onChange={(e) => {
                      const item = inventory.find(i => i._id === e.target.value);
                      setAmcForm({...amcForm, itemId: e.target.value, itemName: item?.itemName || ""});
                    }}
                    required
                  >
                    <option value="">Choose an item...</option>
                    {inventory.map(item => (
                      <option key={item._id} value={item._id}>{item.itemName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Vendor Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={amcForm.vendorName}
                    onChange={(e) => setAmcForm({...amcForm, vendorName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Renewal Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={amcForm.renewalDate}
                    onChange={(e) => setAmcForm({...amcForm, renewalDate: e.target.value})}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-600 mb-1">Start & End Dates</label>
                   <div className="flex gap-4">
                     <input 
                      type="date" 
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl"
                      value={amcForm.startDate}
                      onChange={(e) => setAmcForm({...amcForm, startDate: e.target.value})}
                    />
                    <input 
                      type="date" 
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl"
                      value={amcForm.endDate}
                      onChange={(e) => setAmcForm({...amcForm, endDate: e.target.value})}
                    />
                   </div>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all">
                    Register AMC
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
