import { useState } from "react";
import useWalletStore from "../../store/useWalletStore";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Smartphone, Zap, Wifi, Tv } from "lucide-react";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import toast from "react-hot-toast";

export default function Services() {
  const { payBill, balance, isLoading } = useWalletStore();
  const [processing, setProcessing] = useState(null);

  const services = [
    {
      id: "mobile",
      name: "Mobile Recharge",
      icon: Smartphone,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: "electricity",
      name: "Electricity",
      icon: Zap,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      id: "internet",
      name: "Internet",
      icon: Wifi,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      id: "dth",
      name: "DTH / TV",
      icon: Tv,
      bg: "bg-pink-100",
    },
  ];

  const handlePay = async (service) => {
    if (balance < 50) {
      toast.error("Insufficient balance! (Cost: ₹50)");
      return;
    }

    setProcessing(service.id);
    const success = await payBill(50, service.name);
    setProcessing(null);

    if (success) {
      toast.success(`Paid ₹50 for ${service.name}`);
    } else {
      toast.error("Payment failed");
    }
  };

  return (
    <div className="relative">
      {(isLoading || processing) && (
        <LoadingOverlay message="Processing bill..." />
      )}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Services & Bills
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card
              key={service.id}
              className="hover:shadow-md transition-all cursor-pointer group border-slate-200"
            >
              <div
                className={`w-12 h-12 rounded-xl ${service.bg} ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon size={24} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {service.name}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Pay your bills instantly
              </p>

              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => handlePay(service)}
                disabled={processing === service.id}
              >
                {processing === service.id ? "Processing..." : "Pay Now"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
