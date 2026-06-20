import { useParams } from "react-router-dom";
import { useGetFreightBidQuery } from "@/redux/api/freightApi";
import { Loader2, AlertTriangle } from "lucide-react";
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

  const isAlreadySubmitted = (details.status !== "sent" && details.status !== "resubmit_requested") || details.quotedAmount !== null;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Logo & Style */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img src={logo} alt="Logo" className="h-16 w-auto mb-4 object-contain" />
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            {details.status === "resubmit_requested" ? "Revise Freight Bid" : "Carrier Bidding Portal"}
          </h1>
          {details.status === "resubmit_requested" && (
            <p className="mt-2 text-slate-500 max-w-md mx-auto text-sm">
              The plant operator has requested a revision. Please review the details below and submit a revised quote.
            </p>
          )}
        </div>

        {/* Resubmit Alert Banner */}
        {details.status === "resubmit_requested" && !isAlreadySubmitted && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row gap-4 items-start shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="font-bold text-amber-900 text-base">Revision Requested</h3>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-xs">
                  Request #{details.resubmitCount || 1}
                </span>
              </div>
              {(details.resubmitNote || details.plantNote) && (
                <p className="mt-2 text-sm text-amber-800 leading-relaxed font-medium bg-amber-100/50 p-3.5 rounded-xl border border-amber-100">
                  "{details.resubmitNote || details.plantNote}"
                </p>
              )}
              {(details.priorQuotedAmount !== undefined || details.requestedBidAmount !== undefined) && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {details.priorQuotedAmount !== undefined && (
                    <div className="bg-amber-150/50 px-3.5 py-2 rounded-xl border border-amber-200/60 text-amber-900">
                      <span className="text-[10px] text-amber-800/80 block font-bold uppercase tracking-wider">Prior Bid Amount</span>
                      <span className="text-sm font-extrabold">${details.priorQuotedAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {details.requestedBidAmount !== undefined && (
                    <div className="bg-amber-150/50 px-3.5 py-2 rounded-xl border border-amber-200/60 text-amber-900">
                      <span className="text-[10px] text-amber-800/80 block font-bold uppercase tracking-wider">Requested Bid Amount</span>
                      <span className="text-sm font-extrabold">${details.requestedBidAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
              {details.resubmitRequestedAt && (
                <p className="mt-3 text-[10px] text-amber-700/80 font-medium">
                  Requested at: {new Date(details.resubmitRequestedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

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
