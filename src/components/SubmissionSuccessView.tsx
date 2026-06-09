import { useParams } from "react-router-dom";
import { useGetVendorUploadQuery } from "@/redux/api/vendorApi";
import { CheckCircle, FileText } from "lucide-react";

export default function SubmissionSuccessView() {
  const { token } = useParams<{ token: string }>();
  const { data: details } = useGetVendorUploadQuery(token || "", {
    skip: !token,
  });

  if (!details) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300">
      <div className="bg-emerald-500 px-8 py-10 text-white text-center">
        <div className="inline-flex bg-white/20 p-4 rounded-full mb-4">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Proposal Successfully Submitted</h2>
        <p className="mt-2 text-emerald-100 max-w-md mx-auto text-sm">
          Your proposal has been successfully registered. The operations team has been notified.
        </p>
        {details.allVendorsSubmitted && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-600/50 text-white text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
            </span>
            All Vendors Submitted
          </div>
        )}
      </div>
      <div className="p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
          Submission Summary
        </h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="text-slate-400 font-medium">Vendor Name</dt>
            <dd className="text-slate-800 font-semibold mt-0.5">{details.vendorName}</dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium">Project Name</dt>
            <dd className="text-slate-800 font-semibold mt-0.5">{details.projectName}</dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium">Job Reference ID</dt>
            <dd className="text-slate-800 font-semibold mt-0.5">{details.jobId}</dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium">Submitted At</dt>
            <dd className="text-slate-800 font-semibold mt-0.5">
              {formatDate(details.submittedAt || new Date().toISOString())}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium">Quote Value</dt>
            <dd className="text-slate-800 font-bold text-lg mt-0.5 text-blue-600">
              ${(details.quoteValue || 0).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium">Uploaded Proposal File</dt>
            <dd className="text-slate-800 font-semibold mt-0.5 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-slate-400" />
              <a
                href={details.submittedFileUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline cursor-pointer"
              >
                {details.submittedFileName || "Proposal Document"}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
