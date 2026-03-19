"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import {
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";

export default function AccountantDashboard() {
  const { user, loading } = useSession();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingFees: 0,
    paidStudents: 0,
    thisMonthRevenue: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch("/api/accountant/dashboard");
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch recent transactions
      const transactionsResponse = await fetch("/api/accountant/transactions");
      const transactionsData = await transactionsResponse.json();
      
      if (transactionsData.success) {
        setRecentTransactions(transactionsData.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Accountant Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Welcome back, {user?.name || "Accountant"}! Manage financial operations here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
          trend="+12.5%"
        />
        <StatsCard
          title="Pending Fees"
          value={`₹${stats.pendingFees.toLocaleString()}`}
          icon={AlertCircle}
          color="bg-red-500"
          trend="-5.2%"
        />
        <StatsCard
          title="Paid Students"
          value={stats.paidStudents}
          icon={Users}
          color="bg-blue-500"
          trend="+8.1%"
        />
        <StatsCard
          title="This Month Revenue"
          value={`₹${stats.thisMonthRevenue.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-purple-500"
          trend="+15.3%"
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        
        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{transaction.studentName}</p>
                        <p className="text-xs text-gray-500">{transaction.studentId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-800">
                        ₹{transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{transaction.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          transaction.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : transaction.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No recent transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
