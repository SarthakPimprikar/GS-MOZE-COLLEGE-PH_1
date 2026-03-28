'use client'
import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Search, 
  Plus, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  AlertCircle,
  FileText,
  CheckCircle2,
  Trash2,
  Edit,
  History,
  Library as LibraryIcon
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const LibrarianDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    studentNumber: ''
  });

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    quantity: 1,
    location: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const bookRes = await fetch('/api/library/books');
      const bookData = await bookRes.json();
      if (bookData.success) setBooks(bookData.data);

      const transRes = await fetch('/api/library/issue');
      const transData = await transRes.json();
      if (transData.success) setTransactions(transData.data);
    } catch (error) {
      toast.error("Failed to load library data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/library/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueForm)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Book issued successfully");
        setShowIssueModal(false);
        fetchData();
      } else {
        toast.error(data.error || "Failed to issue book");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleReturn = async (transactionId) => {
    if (!window.confirm("Mark this book as returned? Fine will be calculated automatically.")) return;
    try {
      const res = await fetch('/api/library/return', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Book returned. Fine: ₹${data.fineAmount}`);
        fetchData();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/library/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookForm)
      });
      if (res.ok) {
        toast.success("Book added to catalog");
        setShowAddModal(false);
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to add book");
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.isbn.includes(searchQuery)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
            <LibraryIcon size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Library Management</h1>
            <p className="text-gray-500 text-sm font-medium">Manage catalog, issue books and track fines</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus size={18} />
            Add New Book
          </button>
          <button 
            onClick={() => setShowIssueModal(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
          >
            <ArrowUpRight size={18} />
            Issue Book
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-200/50 rounded-2xl w-fit mb-8">
        {[
          { id: 'inventory', label: 'Book Inventory', icon: Book },
          { id: 'transactions', label: 'Active Issues', icon: RefreshCw },
          { id: 'history', label: 'Return History', icon: History }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {activeTab === 'inventory' && (
          <>
            <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search by title, author or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Book Details</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Location</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Stock</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBooks.map(book => (
                    <tr key={book._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{book.title}</p>
                        <p className="text-xs text-gray-500">By {book.author} • ISBN: {book.isbn}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">{book.category}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">{book.location}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <span className={`w-2 h-2 rounded-full ${book.available > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                           <p className="font-bold text-sm">{book.available} / {book.quantity}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit size={16} /></button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
             <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Book</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Due Date</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Fine</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.filter(t => t.status === 'issued').map(t => {
                    const isLate = new Date() > new Date(t.dueDate);
                    const diffTime = Math.abs(new Date() - new Date(t.dueDate));
                    const diffDays = isLate ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
                    const estimatedFine = diffDays * 50;

                    return (
                      <tr key={t._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{t.studentId?.fullName}</p>
                          <p className="text-xs text-gray-500">{t.studentId?.studentId} • {t.studentId?.branch}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{t.bookId?.title}</p>
                          <p className="text-xs text-gray-400">ISBN: {t.bookId?.isbn}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-2 ${isLate ? 'text-red-600' : 'text-gray-600'}`}>
                            <Clock size={16} />
                            <span className="font-bold text-sm">{new Date(t.dueDate).toLocaleDateString()}</span>
                            {isLate && <span className="text-[10px] bg-red-100 px-2 py-0.5 rounded-full">{diffDays} Days Late</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`font-black ${estimatedFine > 0 ? 'text-red-600' : 'text-gray-400'}`}>₹{estimatedFine}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleReturn(t._id)}
                            className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl text-xs hover:bg-green-700 transition-all shadow-sm"
                          >
                            Mark Returned
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {transactions.filter(t => t.status === 'issued').length === 0 && (
                    <tr><td colSpan="5" className="py-20 text-center text-gray-400 font-bold italic">No active book issues</td></tr>
                  )}
                </tbody>
             </table>
          </div>
        )}

        {activeTab === 'history' && (
           <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Book & Student</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Issue Date</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Return Date</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Fine Paid</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.filter(t => t.status === 'returned').map(t => (
                    <tr key={t._id}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{t.bookId?.title}</p>
                        <p className="text-xs text-gray-500">Returned by {t.studentId?.fullName}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{new Date(t.issueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{new Date(t.returnDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold text-sm">₹{t.fineAmount}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">Returned</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        )}

      </div>

      {/* Modals */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Issue Book</h2>
            <form onSubmit={handleIssue} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Select Book</label>
                <select 
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                  onChange={e => setIssueForm({...issueForm, bookId: e.target.value})}
                  required
                >
                  <option value="">Select a book...</option>
                  {books.filter(b => b.available > 0).map(b => (
                    <option key={b._id} value={b._id}>{b.title} ({b.available} left)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Student Email (Login Email)</label>
                <input 
                  type="email"
                  placeholder="Enter student's email id..."
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-gray-900"
                  value={issueForm.studentNumber}
                  onChange={e => setIssueForm({...issueForm, studentNumber: e.target.value})}
                  required
                />
              </div>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-sm text-amber-700 font-medium">Book must be returned within 7 days. Late fine ₹50/day applies thereafter.</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowIssueModal(false)} className="flex-1 px-8 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest">Complete Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Add New Book</h2>
            <form onSubmit={handleAddBook} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Book Title</label>
                <input 
                  type="text"
                  required
                  className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                  onChange={e => setBookForm({...bookForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Author</label>
                <input 
                  type="text"
                  required
                  className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                  onChange={e => setBookForm({...bookForm, author: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">ISBN</label>
                <input 
                  type="text"
                  required
                  className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                  onChange={e => setBookForm({...bookForm, isbn: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Category</label>
                <select 
                  className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold appearance-none"
                  onChange={e => setBookForm({...bookForm, category: e.target.value})}
                >
                  <option>Computer Science</option>
                  <option>Mechanical</option>
                  <option>Software Engineering</option>
                  <option>Electronics</option>
                  <option>Business</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Total Quantity</label>
                <input 
                  type="number"
                  min="1"
                  required
                  className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
                  onChange={e => setBookForm({...bookForm, quantity: Number(e.target.value)})}
                />
              </div>
              <div className="col-span-2 flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-8 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest">Add Book</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LibrarianDashboard;
