import { useState } from "react";
import type { ExceptionSummary } from "@/redux/api/vendorApi";
import { Check, Filter } from "lucide-react";

interface ExceptionsListProps {
  exceptionSummary: ExceptionSummary;
}

const ISSUE_TYPE_LABELS: Record<string, string> = {
  missing: "Missing in quote",
  extra: "Extra in quote (not in BOM)",
  qty_mismatch: "Quantity mismatch",
  length_mismatch: "Length mismatch",
  ambiguous: "Ambiguous match",
  part_mismatch: "Part code mismatch",
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-50 text-slate-600 border-slate-200",
};

const ISSUE_TYPE_COLORS: Record<string, string> = {
  missing: "bg-red-100 text-red-800",
  extra: "bg-purple-100 text-purple-800",
  qty_mismatch: "bg-amber-100 text-amber-800",
  length_mismatch: "bg-blue-100 text-blue-800",
  ambiguous: "bg-yellow-100 text-yellow-800",
  part_mismatch: "bg-orange-100 text-orange-800",
};

export default function ExceptionsList({ exceptionSummary }: ExceptionsListProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const exceptions = exceptionSummary.exceptions || [];
  const summary = exceptionSummary.comparisonSummary;

  const filteredExceptions = activeFilter === "all"
    ? exceptions
    : exceptions.filter((item) => item.issueType === activeFilter);

  // Group counts for filter buttons
  const counts = exceptions.reduce((acc, item) => {
    acc[item.issueType] = (acc[item.issueType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // Pagination Math
  const itemsPerPage = 10;
  const totalItems = filteredExceptions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedExceptions = filteredExceptions.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Comparison Exceptions</h3>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
            {exceptions.length} {exceptions.length === 1 ? "Exception" : "Exceptions"} Found
          </span>
        </div>
        <p className="text-sm text-slate-500">
          The table below highlights discrepancies found between your previous quote and the project's Consolidated BOM. Please address these before resubmitting.
        </p>
      </div>

      {/* Summary Stats Table */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Expected Lines</p>
            <p className="text-base font-bold text-slate-800">{summary.expectedLines}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Quoted Lines</p>
            <p className="text-base font-bold text-slate-800">{summary.vendorLines}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Matched Lines</p>
            <p className="text-base font-bold text-emerald-600">{summary.matchedLines}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Missing Items</p>
            <p className={`text-base font-bold ${summary.missingItems > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {summary.missingItems}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Extra Items</p>
            <p className={`text-base font-bold ${summary.extraItems > 0 ? 'text-purple-600' : 'text-slate-800'}`}>
              {summary.extraItems}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Qty Mismatches</p>
            <p className={`text-base font-bold ${summary.qtyMismatches > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              {summary.qtyMismatches}
            </p>
          </div>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 items-center border-b border-slate-100 pb-4">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-2">
          <Filter className="h-3.5 w-3.5" /> Filter issues:
        </span>
        <button
          onClick={() => handleFilterChange("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            activeFilter === "all"
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          All ({exceptions.length})
        </button>
        {Object.entries(ISSUE_TYPE_LABELS).map(([key, label]) => {
          const count = counts[key] || 0;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeFilter === key
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Exception Rows */}
      {filteredExceptions.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Check className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No issues found matching this filter</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead>
                <tr className="text-slate-400 font-semibold text-left">
                  <th className="pb-3 font-semibold">Mark / Reference</th>
                  <th className="pb-3 font-semibold">Issue Type</th>
                  <th className="pb-3 font-semibold">Severity</th>
                  <th className="pb-3 font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedExceptions.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pr-4">
                      <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono text-xs">
                        {item.mark || "—"}
                      </code>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ISSUE_TYPE_COLORS[item.issueType] || "bg-slate-100 text-slate-800"}`}>
                        {ISSUE_TYPE_LABELS[item.issueType] || item.issueType}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${SEVERITY_COLORS[item.severity] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 text-sm font-normal">
                      {item.reason}
                      {item.direction && (
                        <span className="ml-1.5 font-bold text-xs uppercase text-slate-400">
                          ({item.direction})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
              <span className="text-xs font-semibold text-slate-500">
                Showing <span className="text-slate-800 font-bold">{startIndex + 1}</span> to{" "}
                <span className="text-slate-800 font-bold">{endIndex}</span> of{" "}
                <span className="text-slate-800 font-bold">{totalItems}</span> exceptions
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white"
                >
                  Previous
                </button>
                <span className="flex items-center text-xs font-semibold text-slate-500 px-1">
                  Page <span className="text-slate-800 font-bold mx-1">{currentPage}</span> of{" "}
                  <span className="text-slate-800 font-bold ml-1">{totalPages}</span>
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
