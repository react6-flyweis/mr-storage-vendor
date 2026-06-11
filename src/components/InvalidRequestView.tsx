import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvalidRequestViewProps {
  onRetry: () => void;
  title?: string;
  description?: string;
}

export default function InvalidRequestView({
  onRetry,
  title = "Request Expired or Invalid",
  description = "This vendor upload link is invalid, expired, or has already been deactivated.",
}: InvalidRequestViewProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
        <p className="text-slate-500 mb-6 text-sm">{description}</p>
        <Button onClick={onRetry} variant="outline" className="w-full">
          Retry Connection
        </Button>
      </div>
    </div>
  );
}
