import { useParams } from "react-router-dom";
import { useGetVendorUploadQuery } from "@/redux/api/vendorApi";
import { Button } from "@/components/ui/button";
import { Building, Briefcase, FileSpreadsheet, Download } from "lucide-react";

export default function VendorRequestOverview() {
  const { token } = useParams<{ token: string }>();
  const { data: details } = useGetVendorUploadQuery(token || "", {
    skip: !token,
  });

  if (!details) return null;

  return (
    <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Request Overview</h3>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Vendor</p>
              <p className="text-sm font-semibold text-slate-800">{details.vendorName}</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Project</p>
              <p className="text-sm font-semibold text-slate-800">{details.projectName}</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Job ID</p>
              <p className="text-sm font-semibold text-slate-800">{details.jobId}</p>
            </div>
          </div>
        </div>
      </div>

      {details.consolidatedBOMFileUrl && (
        <div className="mt-auto pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Please download the consolidated BOM file to review technical specifications before submitting your quote.
          </p>
          <Button
            onClick={() => window.open(details.consolidatedBOMFileUrl, "_blank")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md py-5 flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <Download className="h-4 w-4" /> Download BOM File
          </Button>
        </div>
      )}
    </div>
  );
}
