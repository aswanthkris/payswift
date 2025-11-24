import { useEffect } from "react";
import useWalletStore from "../../store/useWalletStore";
import useAuthStore from "../../store/useAuthStore";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Plus, ArrowRight, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { AnalyticsChart } from "../../components/AnalyticsChart";

export default function Home() {
  const {
    balance,
    transactions,
    fetchWalletData,
    analyticsData,
    fetchAnalytics,
  } = useWalletStore();
  const { user, isKYCVerified } = useAuthStore();

  useEffect(() => {
    fetchWalletData();
    fetchAnalytics();
  }, [fetchWalletData, fetchAnalytics]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hello, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-slate-500">Welcome back to your wallet.</p>
        </div>
        {!isKYCVerified && (
          <Link to="/kyc">
            <Button variant="outline" className="text-xs py-1 px-3">
              Verify Identity
            </Button>
          </Link>
        )}
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-green-600 to-emerald-600 border-none relative overflow-hidden shadow-lg shadow-green-500/20">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-white">
          <Wallet size={120} />
        </div>
        <div className="relative z-10">
          <p className="text-green-100 font-medium mb-1">Total Balance</p>
          <h2 className="text-4xl font-bold text-white mb-6">
            ₹{balance.toFixed(2)}
          </h2>

          <div className="flex gap-3">
            <Link to="/add-money">
              <Button className="bg-white text-green-700 hover:bg-green-50 border-none shadow-none">
                <Plus size={18} className="mr-2" /> Add Money
              </Button>
            </Link>
            <Link to="/transfer">
              <Button className="bg-green-700/50 hover:bg-green-700/60 text-white border-none backdrop-blur-sm shadow-none">
                <ArrowRight size={18} className="mr-2" /> Transfer
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Analytics Section */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalyticsChart data={analyticsData} type="income-expense" />
          <AnalyticsChart data={analyticsData} type="trend" />
        </div>
      )}

      {/* Recent Activity Preview */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Recent Activity
          </h3>
          <Link
            to="/history"
            className="text-green-600 text-sm hover:text-green-700 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {transactions.slice(0, 3).map((tx) => (
            <Card
              key={tx.id}
              className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors cursor-pointer border-slate-100"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === "CREDIT"
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {tx.type === "CREDIT" ? (
                    <Plus size={18} />
                  ) : (
                    <ArrowRight size={18} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{tx.description}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`font-bold ${
                  tx.type === "CREDIT" ? "text-green-600" : "text-slate-900"
                }`}
              >
                {tx.type === "CREDIT" ? "+" : "-"}₹
                {Number(tx.amount).toFixed(2)}
              </span>
            </Card>
          ))}
          {transactions.length === 0 && (
            <p className="text-slate-400 text-center py-8">
              No recent transactions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
