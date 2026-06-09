import { useParams } from "react-router-dom";
import { useGetVendorUploadQuery } from "@/redux/api/vendorApi";
import { Loader2 } from "lucide-react";
import InvalidRequestView from "@/components/InvalidRequestView";
import VendorRequestOverview from "@/components/VendorRequestOverview";
import ProposalSubmissionForm from "@/components/ProposalSubmissionForm";
import SubmissionSuccessView from "@/components/SubmissionSuccessView";
import logo from "@/assets/logo.png";

export default function VendorUpload() {
  const { token } = useParams<{ token: string }>();
  const { data: details, isLoading, error, refetch } = useGetVendorUploadQuery(token || "", {
    skip: !token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
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

  const isAlreadySubmitted = details.status !== "sent" || details.submittedAt !== null;

  return (
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Logo & Style */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img src={logo} alt="Logo" className="h-16 w-auto mb-4 object-contain" />
          {/* <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Vendor Portal</h2> */}
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Submit Your Proposal
          </h1>
        </div>

        {isAlreadySubmitted ? (
          <SubmissionSuccessView />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <VendorRequestOverview />
            <ProposalSubmissionForm />
          </div>
        )}
      </div>
    </div>
  );
}
