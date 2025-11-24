import { useState, useEffect } from "react";
import useWalletStore from "../../store/useWalletStore";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Plus, ArrowRight, Search } from "lucide-react";

export default function History() {
  const { transactions, fetchWalletData } = useWalletStore();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const filtered = transactions.filter(
    (tx) =>
      tx.description.toLowerCase().includes(filter.toLowerCase()) ||
      tx.amount.toString().includes(filter)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Transaction History
        </h2>
        <div className="relative w-full md:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-green-50 border-green-100">
          <p className="text-slate-500 text-xs uppercase font-bold">Total In</p>
          <p className="text-2xl font-bold text-green-600">
            ₹
            {transactions
              .filter((t) => t.type === "CREDIT")
              .reduce((acc, t) => acc + Number(t.amount), 0)
              .toFixed(2)}
          </p>
        </Card>
        <Card className="p-4 bg-orange-50 border-orange-100">
          <p className="text-slate-500 text-xs uppercase font-bold">
            Total Out
          </p>
          <p className="text-2xl font-bold text-orange-600">
            ₹
            {transactions
              .filter((t) => t.type === "DEBIT")
              .reduce((acc, t) => acc + Number(t.amount), 0)
              .toFixed(2)}
          </p>
        </Card>
        <Card className="p-4 bg-slate-50 border-slate-100">
          <p className="text-slate-500 text-xs uppercase font-bold">Net Flow</p>
          <p className="text-2xl font-bold text-slate-900">
            ₹
            {(
              transactions
                .filter((t) => t.type === "CREDIT")
                .reduce((acc, t) => acc + Number(t.amount), 0) -
              transactions
                .filter((t) => t.type === "DEBIT")
                .reduce((acc, t) => acc + Number(t.amount), 0)
            ).toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="space-y-3">
        {filtered.map((tx) => (
          <Card
            key={tx.id}
            className="p-4 flex justify-between items-center border-slate-100"
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
                  {new Date(tx.date).toLocaleString()}
                </p>
              </div>
            </div>
            <span
              className={`font-bold ${
                tx.type === "CREDIT" ? "text-green-600" : "text-slate-900"
              }`}
            >
              {tx.type === "CREDIT" ? "+" : "-"}₹{Number(tx.amount).toFixed(2)}
            </span>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}
