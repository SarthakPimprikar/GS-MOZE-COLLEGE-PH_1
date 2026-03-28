'use client'
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Book as BookIcon, 
  Clock, 
  AlertCircle,
  FileText,
  Calendar,
  History,
  Library as LibraryIcon,
  Tag,
  Hash
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import toast, { Toaster } from 'react-hot-toast';

const StudentLibraryDashboard = () => {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState('catalog');
  const [books, setBooks] = useState([]);
  const [myTransactions, setMyTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const userId = user?.id || user?._id;

  const fetchData = async () => {
    setLoading(true);
    try {
      const bookRes = await fetch('/api/library/books');
      const bookData = await bookRes.json();
      if (bookData.success) setBooks(bookData.data);

      if (userId) {
        const transRes = await fetch(`/api/library/issue?userId=${userId}`);
        const transData = await transRes.json();
        if (transData.success) setMyTransactions(transData.data);
      }
    } catch (error) {
      toast.error("Failed to load library data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const categories = ['all', ...new Set(books.map(b => b.category))];
  
  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.isbn.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeIssues = myTransactions.filter(t => t.status === 'issued');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster />
      
      {/* Header */}
      <div className="bg-white rounded-[40px] px-10 py-12 shadow-sm border border-gray-100 mb-10 overflow-hidden relative group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full translate-x-20 -translate-y-20 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100 rotate-3 transition-transform hover:rotate-0">
               <LibraryIcon size={36} />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-black text-gray-900 leading-tight">Digital Library</h1>
              <p className="text-gray-500 font-medium tracking-wide">Browse catalog, track issued books & due dates</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-indigo-50/50 backdrop-blur-sm px-6 py-4 rounded-3xl border border-indigo-100/50 text-center min-w-[120px]">
                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Books Owned</p>
                <p className="text-2xl font-black text-indigo-700">{activeIssues.length}</p>
             </div>
             <div className="bg-amber-50/50 backdrop-blur-sm px-6 py-4 rounded-3xl border border-amber-100/50 text-center min-w-[120px]">
                <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest mb-1">Due Fine</p>
                <p className="text-2xl font-black text-amber-600">₹0</p>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-10">
        {[
          { id: 'catalog', label: 'Book Catalog', icon: BookIcon },
          { id: 'my-books', label: 'My Issued Books', icon: Hash },
          { id: 'history', label: 'Issue History', icon: History }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-4 rounded-3xl font-black text-sm flex items-center gap-3 transition-all ${
              activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'catalog' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="flex flex-col md:flex-row gap-6 items-center">
             <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-600" size={20} />
                <input 
                  type="text"
                  placeholder="Search and discover books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent rounded-3xl shadow-sm focus:border-indigo-500 focus:shadow-xl focus:shadow-indigo-50 transition-all font-bold text-gray-800"
                />
             </div>
             <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-3 rounded-2xl font-bold text-xs capitalize transition-all whitespace-nowrap ${
                      selectedCategory === cat ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr className="text-left">
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Book Information</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBooks.map(book => (
                    <tr key={book._id} className="hover:bg-gray-50/30 transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-16 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                              <BookIcon size={24} />
                           </div>
                           <div>
                              <p className="text-lg font-black text-gray-900 leading-tight mb-1">{book.title}</p>
                              <p className="text-xs text-indigo-500 font-bold tracking-wide">By {book.author}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">ISBN: {book.isbn}</p>
                            <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black uppercase text-gray-500">{book.category}</span>
                         </div>
                      </td>
                      <td className="px-10 py-8 font-black text-sm text-gray-700">{book.location}</td>
                      <td className="px-10 py-8">
                         <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${book.available > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                               <span className={`text-xs font-black uppercase tracking-widest ${book.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {book.available > 0 ? 'In Stock' : 'Out of Stock'}
                               </span>
                            </div>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{book.available} / {book.quantity} Copies</p>
                         </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBooks.length === 0 && (
                     <tr><td colSpan="4" className="py-20 text-center text-gray-400 font-bold italic">No books found matching your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'my-books' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-10 duration-500">
           {activeIssues.map(t => {
              const isOverdue = new Date() > new Date(t.dueDate);
              const diffTime = Math.abs(new Date() - new Date(t.dueDate));
              const diffDays = isOverdue ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
              const currentFine = diffDays * 50;

              return (
                <div key={t._id} className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex gap-8 items-start relative group transition-all hover:shadow-2xl">
                   {isOverdue && (
                      <div className="absolute -top-3 -right-3 bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest animate-bounce shadow-xl shadow-red-200 border-2 border-white">
                         OVERDUE
                      </div>
                   )}
                   <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center text-indigo-600 shrink-0 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                      <BookIcon size={40} />
                   </div>
                   <div className="flex-1">
                      <div className="mb-6">
                        <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">{t.bookId?.title}</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Due on {new Date(t.dueDate).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Issue Date</p>
                            <p className="text-sm font-black text-gray-700">{new Date(t.issueDate).toLocaleDateString()}</p>
                         </div>
                         <div className={`rounded-2xl p-4 border ${isOverdue ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                            <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>Late Fine</p>
                            <p className={`text-sm font-black ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>₹{currentFine}</p>
                         </div>
                      </div>
                   </div>
                </div>
              );
           })}
           {activeIssues.length === 0 && (
              <div className="col-span-full bg-white rounded-[40px] py-32 flex flex-col items-center justify-center border border-dashed border-gray-200">
                 <div className="p-10 bg-gray-50 rounded-full mb-8">
                    <History size={48} className="text-gray-300" />
                 </div>
                 <h2 className="text-3xl font-serif font-black text-gray-900 mb-2">No active issues</h2>
                 <p className="text-gray-400 font-medium">Head to the catalog to discover your next favorite book</p>
              </div>
           )}
        </div>
      )}

      {activeTab === 'history' && (
         <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-10 border-b border-gray-50 flex justify-between items-center">
               <h2 className="text-2xl font-black text-gray-900">Your Reading Timeline</h2>
               <p className="text-indigo-600 font-black text-sm uppercase tracking-widest">{myTransactions.filter(t => t.status === 'returned').length} Books Read</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr className="text-left">
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Book Information</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reading Period</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fine Status</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myTransactions.filter(t => t.status === 'returned').map(t => (
                    <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-10 py-8">
                        <p className="font-bold text-gray-900 mb-1">{t.bookId?.title}</p>
                        <p className="text-xs text-indigo-400 font-black uppercase tracking-widest">By {t.bookId?.author}</p>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                           <div className="text-center">
                              <p className="text-[10px] font-black uppercase text-gray-300">Issued</p>
                              <p className="text-sm font-bold text-gray-600">{new Date(t.issueDate).toLocaleDateString()}</p>
                           </div>
                           <div className="flex-1 h-[2px] w-8 bg-gray-100"></div>
                           <div className="text-center">
                              <p className="text-[10px] font-black uppercase text-gray-300">Returned</p>
                              <p className="text-sm font-bold text-gray-600">{new Date(t.returnDate).toLocaleDateString()}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-900">₹{t.fineAmount}</span>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${t.fineAmount > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                               {t.fineAmount > 0 ? 'Fine Assessed' : 'Clear Return'}
                            </span>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <button className="px-4 py-2 bg-white border border-gray-200 text-gray-400 font-black rounded-xl text-[10px] uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all">Submit Review</button>
                      </td>
                    </tr>
                  ))}
                  {myTransactions.filter(t => t.status === 'returned').length === 0 && (
                    <tr><td colSpan="4" className="py-20 text-center text-gray-400 font-bold italic">No circulation history yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
         </div>
      )}

    </div>
  );
};

export default StudentLibraryDashboard;
