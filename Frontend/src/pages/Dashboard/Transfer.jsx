import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useWalletStore from "../../store/useWalletStore";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Send, UserPlus, Star, Trash2 } from "lucide-react";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import toast from "react-hot-toast";

export default function Transfer() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [validationState, setValidationState] = useState({
    status: "idle",
    message: "",
  }); // idle, validating, valid, invalid
  const [showSaveBeneficiary, setShowSaveBeneficiary] = useState(false);
  const [nickname, setNickname] = useState("");

  const {
    transferMoney,
    validateRecipient,
    balance,
    isLoading,
    beneficiaries,
    fetchBeneficiaries,
    addBeneficiary,
    deleteBeneficiary,
  } = useWalletStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  // Debounce validation
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!recipient || !recipient.includes("@")) {
        setValidationState({ status: "idle", message: "" });
        setShowSaveBeneficiary(false);
        return;
      }

      setValidationState({ status: "validating", message: "Checking..." });
      try {
        const user = await validateRecipient(recipient);
        setValidationState({
          status: "valid",
          message: `Verified: ${user.name}`,
        });

        // Check if already a beneficiary
        const isBeneficiary = beneficiaries.some(
          (b) => b.details.email === user.email
        );
        setShowSaveBeneficiary(!isBeneficiary);
      } catch (error) {
        setValidationState({
          status: "invalid",
          message: "Recipient not found",
        });
        setShowSaveBeneficiary(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [recipient, validateRecipient, beneficiaries]);

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (validationState.status !== "valid") {
      toast.error("Please enter a valid recipient");
      return;
    }

    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }

    const val = Number(amount);
    if (val <= 0) {
      toast.error("Invalid amount");
      return;
    }

    if (val > balance) {
      toast.error("Insufficient balance");
      return;
    }

    const success = await transferMoney(val, recipient);
    if (success) {
      toast.success(`Sent ₹${val} to ${recipient}`);
      navigate("/");
    } else {
      toast.error("Transaction failed");
    }
  };

  const handleSaveBeneficiary = async () => {
    const success = await addBeneficiary(recipient, nickname);
    if (success) {
      toast.success("Beneficiary added!");
      setShowSaveBeneficiary(false);
      setNickname("");
    } else {
      toast.error("Failed to add beneficiary");
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative grid grid-cols-1 md:grid-cols-3 gap-6">
      {isLoading && <LoadingOverlay message="Processing..." />}

      {/* Main Transfer Form */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Transfer Money
        </h2>
        <Card>
          <div className="flex items-center gap-3 mb-6 text-green-600">
            <Send />
            <span>P2P Transfer</span>
          </div>

          <form onSubmit={handleTransfer} className="space-y-6">
            <div>
              <Input
                label="Recipient (Email)"
                placeholder="friend@example.com"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={
                  validationState.status === "valid"
                    ? "border-green-500 focus:ring-green-200"
                    : validationState.status === "invalid"
                    ? "border-red-500 focus:ring-red-200"
                    : ""
                }
              />
              <div className="flex justify-between items-start mt-1">
                {validationState.status !== "idle" && (
                  <p
                    className={`text-xs ${
                      validationState.status === "valid"
                        ? "text-green-600 font-medium"
                        : validationState.status === "invalid"
                        ? "text-red-500"
                        : "text-slate-400"
                    }`}
                  >
                    {validationState.message}
                  </p>
                )}

                {showSaveBeneficiary && validationState.status === "valid" && (
                  <button
                    type="button"
                    onClick={() => setShowSaveBeneficiary("input")}
                    className="text-xs text-green-600 hover:underline flex items-center gap-1"
                  >
                    <UserPlus size={12} /> Save Beneficiary
                  </button>
                )}
              </div>

              {showSaveBeneficiary === "input" && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg flex items-end gap-2 border border-slate-200">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">
                      Nickname (Optional)
                    </label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full text-sm p-2 border border-slate-300 rounded-md"
                      placeholder="e.g. Mom, Bestie"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSaveBeneficiary}
                    size="sm"
                    className="h-[38px]"
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            <Input
              label="Amount (₹)"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <p className="text-right text-sm text-slate-500">
              Available:{" "}
              <span className="text-slate-900 font-medium">
                ₹{balance.toFixed(2)}
              </span>
            </p>

            <Button
              type="submit"
              className="w-full"
              disabled={validationState.status !== "valid" || !amount}
            >
              Send Money
            </Button>
          </form>
        </Card>
      </div>

      {/* Beneficiaries Sidebar */}
      <div className="md:col-span-1">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Star className="text-yellow-500 fill-yellow-500" size={20} />
          Beneficiaries
        </h3>
        <div className="space-y-3">
          {beneficiaries.length === 0 ? (
            <p className="text-slate-400 text-sm italic">
              No saved beneficiaries yet.
            </p>
          ) : (
            beneficiaries.map((b) => (
              <div
                key={b.id}
                className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
                onClick={() => setRecipient(b.details.email)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {b.nickname[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">
                      {b.nickname}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-[120px]">
                      {b.details.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBeneficiary(b.id);
                  }}
                  className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
