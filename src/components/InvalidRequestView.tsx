import { AlertCircle, RefreshCw } from "lucide-react";
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
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground font-sans p-6">
      {/* Decorative background gradients matching theme */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-md space-y-6 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <AlertCircle className="size-10" />
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight">
            {title}
          </h1>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <Button
            onClick={onRetry}
            variant="default"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-5 cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="size-4" />
            Retry Connection
          </Button>
        </div>
      </div>
    </div>
  );
}

