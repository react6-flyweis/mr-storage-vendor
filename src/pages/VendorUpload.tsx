import { useParams } from "react-router-dom";
import { useGetVendorUploadQuery } from "@/redux/api/vendorApi";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import InvalidRequestView from "@/components/InvalidRequestView";
import VendorRequestOverview from "@/components/VendorRequestOverview";
import ProposalSubmissionForm from "@/components/ProposalSubmissionForm";
import SubmissionSuccessView from "@/components/SubmissionSuccessView";
import ExceptionsList from "@/components/ExceptionsList";
import logo from "@/assets/logo.svg";

export default function VendorUpload() {
  const { token } = useParams<{ token: string }>();
  const { data: details, isLoading, error, refetch } = useGetVendorUploadQuery(token || "", {
    skip: !token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-600 font-medium">Fetching vendor request details...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return <InvalidRequestView onRetry={() => refetch()} />;
  }

  const isAlreadySubmitted = details.status === "submitted" && details.submittedAt !== null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
        {/* Header Logo & Style */}
        <div className="text-center flex flex-col items-center">
          <img src={logo} alt="Logo" className="h-16 w-auto mb-4 object-contain" />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            {details.isResubmit ? "Revise Your Proposal" : "Submit Your Proposal"}
          </h1>
          <p className="mt-2 text-slate-500 max-w-md mx-auto text-sm">
            {details.isResubmit 
              ? "The plant operator has requested changes. Please review the comments and submit a revised quote." 
              : "Review the project specifications and upload your quotation document below."
            }
          </p>
        </div>

        {/* Resubmit Alert Banner */}
        {details.isResubmit && !isAlreadySubmitted && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row gap-4 items-start shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="font-bold text-amber-900 text-base">Revision Requested</h3>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-xs">
                  Request #{details.resubmitCount || 1}
                </span>
              </div>
              {details.resubmitNote && (
                <p className="mt-2 text-sm text-amber-800 leading-relaxed font-medium bg-amber-100/50 p-3.5 rounded-xl border border-amber-100">
                  "{details.resubmitNote}"
                </p>
              )}
              {details.priorQuoteValue !== null && details.priorQuoteValue !== undefined && (
                <p className="mt-3 text-sm font-semibold text-amber-900 flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4 shrink-0 text-amber-700" />
                  Previous quote value:{" "}
                  <span className="font-bold text-slate-900">
                    ${details.priorQuoteValue.toLocaleString()}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}

        {isAlreadySubmitted ? (
          <SubmissionSuccessView />
        ) : (
          <>
            {/* Comparison Exceptions Section */}
            {details.isResubmit && details.exceptionSummary && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-350 delay-150">
                <ExceptionsList exceptionSummary={details.exceptionSummary} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <VendorRequestOverview />
              <ProposalSubmissionForm />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
