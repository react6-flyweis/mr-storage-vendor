import { useParams } from "react-router-dom";
import { useGetFreightBidQuery } from "@/redux/api/freightApi";
import { CheckCircle, Calendar, Truck, FileText } from "lucide-react";

export default function CarrierSuccessView() {
  const { token } = useParams<{ token: string }>();
  const { data: details } = useGetFreightBidQuery(token || "", {
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
        <h2 className="text-2xl font-bold">Bid Successfully Submitted</h2>
        <p className="mt-2 text-emerald-100 max-w-md mx-auto text-sm">
          Your freight bid has been registered successfully. The logistics team has been notified.
        </p>
      </div>
      <div className="p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
          Submission Summary
        </h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 text-sm">
          <div>
            <dt className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">Carrier Name</dt>
            <dd className="text-slate-800 font-semibold mt-1 text-base">{details.carrierName}</dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">Project Name</dt>
            <dd className="text-slate-800 font-semibold mt-1 text-base">{details.projectName}</dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">Job Reference ID</dt>
            <dd className="text-slate-800 font-semibold mt-1 text-base">{details.jobId}</dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">Delivery Number</dt>
            <dd className="text-slate-800 font-semibold mt-1 text-base flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-slate-400" />
              {details.deliveryNumber}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">Quoted Amount</dt>
            <dd className="text-slate-900 font-bold text-2xl mt-1 text-emerald-600">
              ${(details.quotedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">Submitted At</dt>
            <dd className="text-slate-800 font-semibold mt-1 text-base flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              {formatDate(details.submittedAt || new Date().toISOString())}
            </dd>
          </div>
          {details.carrierNotes && (
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <dt className="text-slate-400 font-medium uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1.5">
                <FileText className="h-4 w-4 text-slate-400" />
                Submitted Carrier Notes
              </dt>
              <dd className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">{details.carrierNotes}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
