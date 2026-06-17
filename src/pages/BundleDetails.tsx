import { useParams } from "react-router-dom";
import { useGetBundleDetailsQuery } from "@/redux/api/bundleApi";
import { 
  Loader2, 
  Package, 
  Layers, 
  Scale, 
  AlertTriangle, 
  Maximize2,
  TrendingUp,
  FileText,
  CornerDownRight
} from "lucide-react";
import InvalidRequestView from "@/components/InvalidRequestView";
import logo from "@/assets/logo.svg";

export default function BundleDetails() {
  const { bundleId } = useParams<{ bundleId: string }>();
  const { data, isLoading, error, refetch } = useGetBundleDetailsQuery(bundleId || "", {
    skip: !bundleId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-600 font-medium">Fetching bundle details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <InvalidRequestView 
        onRetry={() => refetch()} 
        title="Bundle Not Found"
        description="We couldn't retrieve the details for this bundle. Please check the URL or try again."
      />
    );
  }

  const { bundle, items } = data;

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
                Bundle Details
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-inner self-start sm:self-auto">
            <Package className="h-4 w-4" />
            {bundle.bundleNo || "N/A"}
          </div>
        </div>

        {/* Warnings Section (if any) */}
        {bundle.warnings && bundle.warnings.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800">Bundle Warnings</h3>
                <ul className="mt-1 list-disc list-inside text-xs text-amber-700 space-y-1">
                  {bundle.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-white min-w-0">
              <Layers className="h-5 w-5 text-blue-400 shrink-0" />
              <h2 className="text-sm sm:text-base font-semibold tracking-wide truncate">{bundle.title || "Untitled Bundle"}</h2>
            </div>
            <span className="text-[10px] sm:text-xs font-medium bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 shrink-0">
              {bundle.bundleType}
            </span>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-100 flex flex-col justify-between min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Qty</span>
              <span className="text-base sm:text-xl font-bold text-slate-800 truncate">{bundle.totalQty} items</span>
            </div>

            <div className="bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-100 flex flex-col justify-between min-w-0">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Scale className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Total Weight</span>
              </div>
              <span className="text-base sm:text-xl font-bold text-slate-800 truncate">{bundle.totalWeight.toLocaleString()} lbs</span>
            </div>

            <div className="bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-100 flex flex-col justify-between min-w-0">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Maximize2 className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Max Length</span>
              </div>
              <span className="text-base sm:text-xl font-bold text-slate-800 truncate">{bundle.maxLengthFeet}'</span>
            </div>

            <div className="bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-100 flex flex-col justify-between min-w-0">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Load Seq</span>
              </div>
              <span className="text-base sm:text-xl font-bold text-slate-800 truncate">#{bundle.loadSequence}</span>
            </div>
          </div>

          {/* Stacking & Handling instructions */}
          <div className="border-t border-slate-100 px-4 sm:px-6 py-4 sm:py-5 bg-slate-50/30 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Stacking Info</span>
              <div className="flex gap-2 items-center">
                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize">
                  {bundle.stacking?.stackLevel || "N/A"} Level
                </span>
                <span className="text-slate-500 text-xs">
                  Priority: {bundle.stacking?.loadingPriority ?? "N/A"}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Handling Instruction</span>
              <p className="text-slate-700 text-xs italic">
                {bundle.handlingInstruction || "No special handling instructions."}
              </p>
            </div>
          </div>

          {bundle.notes && (
            <div className="border-t border-slate-100 px-4 sm:px-6 py-4 bg-slate-50/10">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Notes</span>
              <p className="text-slate-600 text-xs leading-relaxed">{bundle.notes}</p>
            </div>
          )}
        </div>

        {/* Item Rows List */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Bundle Items ({items.length})
            </h2>
          </div>

          {/* Mobile view / Desktop Table combined */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-55 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Part Code</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Qty</th>
                  <th className="px-6 py-4 text-right">Length (Ft)</th>
                  <th className="px-6 py-4 text-right">Weight (Lbs)</th>
                  <th className="px-6 py-4">Mark IDs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/55 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{item.partCode}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4 text-right font-semibold">{item.qty}</td>
                    <td className="px-6 py-4 text-right">{item.lengthFeet.toFixed(2)}'</td>
                    <td className="px-6 py-4 text-right">{item.weight.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.markIds && item.markIds.length > 0 ? (
                          item.markIds.map((mark, mIdx) => (
                            <span key={mIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                              {mark}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked layout */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:hidden">
            {items.map((item) => (
              <div key={item._id} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <span className="font-mono font-bold text-slate-900 text-sm sm:text-base break-all">{item.partCode}</span>
                    <p className="text-xs text-slate-500 mt-0.5 break-words">{item.description}</p>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0">
                    Qty: {item.qty}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-50 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] block">Length</span>
                    <span className="font-semibold text-slate-700">{item.lengthFeet.toFixed(2)} ft</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] block">Weight</span>
                    <span className="font-semibold text-slate-700">{item.weight.toLocaleString()} lbs</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-xs text-slate-500 pt-1">
                  <CornerDownRight className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="font-medium shrink-0">Marks:</span>
                  <div className="flex flex-wrap gap-1 min-w-0">
                    {item.markIds && item.markIds.length > 0 ? (
                      item.markIds.map((mark, mIdx) => (
                        <span key={mIdx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[11px] font-medium break-all">
                          {mark}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
