import { useParams } from "react-router-dom";
import { useGetFreightBidQuery } from "@/redux/api/freightApi";
import { Loader2 } from "lucide-react";
import InvalidRequestView from "@/components/InvalidRequestView";
import CarrierRequestOverview from "@/components/CarrierRequestOverview";
import CarrierSubmissionForm from "@/components/CarrierSubmissionForm";
import CarrierSuccessView from "@/components/CarrierSuccessView";
import logo from "@/assets/logo.svg";

export default function CarrierBid() {
  const { token } = useParams<{ token: string }>();
  const { data: details, isLoading, error, refetch } = useGetFreightBidQuery(token || "", {
    skip: !token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-600 font-medium">Fetching freight bid details...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <InvalidRequestView
        onRetry={() => refetch()}
        title="Freight Bid Link Invalid"
        description="This carrier freight link is invalid, expired, or has already been deactivated."
      />
    );
  }

  const isAlreadySubmitted = details.status !== "sent" || details.quotedAmount !== null;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Logo & Style */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img src={logo} alt="Logo" className="h-16 w-auto mb-4 object-contain" />
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Carrier Bidding Portal
          </h1>
        </div>

        {isAlreadySubmitted ? (
          <CarrierSuccessView />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CarrierRequestOverview />
            <CarrierSubmissionForm />
          </div>
        )}
      </div>
    </div>
  );
}
