import { useParams } from "react-router-dom";
import { useGetPackingListPlanDetailsQuery } from "@/redux/api/packingListPlanApi";
import {
  Loader2,
  Package,
  Layers,
  Scale,
  AlertTriangle,
  Truck,
  FileText
} from "lucide-react";
import InvalidRequestView from "@/components/InvalidRequestView";
import logo from "@/assets/logo.png";

export default function PackingListPlanDetails() {
  const { packingListPlanId } = useParams<{ packingListPlanId: string }>();
  const { data, isLoading, error, refetch } = useGetPackingListPlanDetailsQuery(packingListPlanId || "", {
    skip: !packingListPlanId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-600 font-medium">Fetching packing list plan...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <InvalidRequestView
        onRetry={() => refetch()}
        title="Packing List Plan Not Found"
        description="We couldn't retrieve the details for this packing list plan. Please check the URL or try again."
      />
    );
  }

  const { packingListPlan, packingLists, summary } = data;

  // Render nicer labels for standard truck types
  const formatTruckType = (type: string) => {
    switch (type) {
      case "SEMI_53":
        return "Semi 53' Flatbed";
      case "HOTSHOT_40":
        return "Hotshot 40'";
      default:
        return type.replace(/_/g, " ");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full space-y-4 sm:space-y-6">
        
        {/* Header Block */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <img src={logo} alt="Logo" className="h-8 sm:h-10 w-auto object-contain" />
            <div className="border-l border-slate-200 pl-3 sm:pl-4">
              <span className="text-[10px] sm:text-xs font-semibold text-blue-600 tracking-wider uppercase">Plant Portal</span>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight sm:text-2xl">
                Packing List Plan
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-inner self-start sm:self-auto">
            <Truck className="h-4 w-4" />
            {packingListPlan.status || "N/A"}
          </div>
        </div>

        {/* Warnings Section (if any) */}
        {summary.warnings && summary.warnings.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800">Plan Warnings</h3>
                <ul className="mt-1 list-disc list-inside text-xs text-amber-700 space-y-1">
                  {summary.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Main Summary Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-w-0">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Scale className="h-4 w-4 text-blue-500 shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Total Weight</span>
            </div>
            <span className="text-lg sm:text-2xl font-black text-slate-800 truncate">
              {summary.totalWeight.toLocaleString()} lbs
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-w-0">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Layers className="h-4 w-4 text-indigo-500 shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Total Bundles</span>
            </div>
            <span className="text-lg sm:text-2xl font-black text-slate-800 truncate">
              {summary.totalBundles} bundles
            </span>
          </div>

          <div className="bg-white p-4 col-span-2 md:col-span-1 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-w-0">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <FileText className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Packing Lists</span>
            </div>
            <span className="text-lg sm:text-2xl font-black text-slate-800 truncate">
              {summary.totalPackingLists} lists
            </span>
          </div>
        </div>

        {/* Truck Summary Card */}
        {summary.truckSummary && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-white min-w-0">
                <Truck className="h-5 w-5 text-blue-400 shrink-0" />
                <h2 className="text-sm sm:text-base font-semibold tracking-wide truncate">Truck Summary Breakdown</h2>
              </div>
              <span className="text-[10px] sm:text-xs font-medium bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 shrink-0">
                Total Trucks: {summary.truckSummary.totalTrucks}
              </span>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {summary.truckSummary.semi53Count !== undefined && summary.truckSummary.semi53Count > 0 && (
                <div className="bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Semi 53'</span>
                  <span className="text-base sm:text-xl font-bold text-slate-800">{summary.truckSummary.semi53Count}</span>
                </div>
              )}
              {summary.truckSummary.hotshot40Count !== undefined && summary.truckSummary.hotshot40Count > 0 && (
                <div className="bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Hotshot 40'</span>
                  <span className="text-base sm:text-xl font-bold text-slate-800">{summary.truckSummary.hotshot40Count}</span>
                </div>
              )}
              {/* Fallback display for dynamic keys in truckSummary that aren't the standard counts */}
              {Object.entries(summary.truckSummary)
                .filter(([key]) => key !== "semi53Count" && key !== "hotshot40Count" && key !== "totalTrucks")
                .map(([key, val]) => (
                  <div key={key} className="bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      {key.replace(/Count$/i, "").replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-base sm:text-xl font-bold text-slate-800">{val}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Packing List Rows */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              Packing Lists ({packingLists.length})
            </h2>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Packing List No</th>
                  <th className="px-6 py-4">Truck Type</th>
                  <th className="px-6 py-4 text-right">Total Weight (Lbs)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {packingLists.map((pl) => (
                  <tr key={pl._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{pl.packingListNo}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {formatTruckType(pl.truckType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">{pl.totalWeight.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards Layout */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:hidden">
            {packingLists.map((pl) => (
              <div key={pl._id} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <span className="font-mono font-bold text-slate-900 text-sm sm:text-base break-all">{pl.packingListNo}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 shrink-0">
                    {formatTruckType(pl.truckType)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-t border-slate-50 text-xs">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">Total Weight</span>
                  <span className="font-bold text-slate-800 text-sm">{pl.totalWeight.toLocaleString()} lbs</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
