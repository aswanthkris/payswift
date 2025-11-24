import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Card } from "../../components/Card";
import { ShieldCheck } from "lucide-react";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import toast from "react-hot-toast";

export default function KYC() {
  const [idNumber, setIdNumber] = useState("");
  const { completeKYC, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (idNumber.length < 5) return;

    try {
      await completeKYC({ kycId: idNumber });
      toast.success("Identity verified!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {isLoading && <LoadingOverlay message="Verifying identity..." />}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/40 rounded-full blur-[120px]" />

      <Card className="w-full max-w-md relative z-10 text-center shadow-xl border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Verify Identity
        </h1>
        <p className="text-slate-500 mb-8">
          Please enter your National ID to unlock all features.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="National ID Number"
            placeholder="XXXX-XXXX-XXXX"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={idNumber.length < 5}
          >
            Complete Verification
          </Button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-slate-400 hover:text-slate-600"
        >
          Skip for now (Limited Access)
        </button>
      </Card>
    </div>
  );
}
