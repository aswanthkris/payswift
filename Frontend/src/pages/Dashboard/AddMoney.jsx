import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useWalletStore from "../../store/useWalletStore";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { CreditCard } from "lucide-react";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import toast from "react-hot-toast";

export default function AddMoney() {
  const [amount, setAmount] = useState("");
  const { addMoney, isLoading } = useWalletStore();
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;

    try {
      await addMoney(Number(amount));
      toast.success(`Successfully added ₹${amount}`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="max-w-md mx-auto relative">
      {isLoading && <LoadingOverlay message="Processing payment..." />}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Add Money</h2>
      <Card>
        <div className="flex items-center gap-3 mb-6 text-slate-500">
          <CreditCard />
          <span>Mock Payment Gateway</span>
        </div>

        <form onSubmit={handleAdd} className="space-y-6">
          <Input
            label="Amount (₹)"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />

          <div className="grid grid-cols-3 gap-2">
            {[10, 50, 100].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val.toString())}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm transition-colors font-medium"
              >
                +₹{val}
              </button>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={!amount}>
            Pay Securely
          </Button>
        </form>
      </Card>
    </div>
  );
}
