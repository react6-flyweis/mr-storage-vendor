import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetFreightBidQuery, useSubmitFreightBidMutation } from "@/redux/api/freightApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, DollarSign, FileText, Calendar, Clock } from "lucide-react";

export default function CarrierSubmissionForm() {
  const { token } = useParams<{ token: string }>();
  const { data: details } = useGetFreightBidQuery(token || "", {
    skip: !token,
  });

  const [submitFreightBid, { isLoading: isSubmitting }] = useSubmitFreightBidMutation();

  const [quotedAmount, setQuotedAmount] = useState<string>("");
  const [carrierNotes, setCarrierNotes] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!details) return null;

  const isExpired = new Date() > new Date(details.bidDeadline);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (isExpired) {
      setSubmitError("Bidding deadline has passed. Submission rejected.");
      return;
    }

    if (!quotedAmount || isNaN(Number(quotedAmount)) || Number(quotedAmount) <= 0) {
      setSubmitError("Please enter a valid quoted amount greater than 0.");
      return;
    }

    setSubmitError(null);

    try {
      await submitFreightBid({
        token,
        quotedAmount: Number(quotedAmount),
        carrierNotes,
      }).unwrap();
    } catch (err) {
      console.error(err);
      const errorResponse = err as { data?: { message?: string }; message?: string };
      setSubmitError(errorResponse.data?.message || errorResponse.message || "Failed to submit freight quote.");
    }
  };

  return (
    <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          {details.status === "resubmit_requested" ? "Submit Revised Freight Bid" : "Submit Freight Bid"}
        </h3>
        <div className={`p-4 rounded-2xl flex flex-col gap-2 ${isExpired ? 'bg-red-50 border border-red-100 text-red-800' : 'bg-amber-50 border border-amber-100 text-amber-800'}`}>
          <div className="flex items-center gap-2">
            {isExpired ? <Clock className="h-5 w-5 text-red-600" /> : <Calendar className="h-5 w-5 text-amber-600" />}
            <span className="font-bold text-sm">
              {isExpired ? "Bidding Closed" : "Bid Deadline"}
            </span>
          </div>
          <p className="text-xs font-semibold leading-relaxed">
            {formatDate(details.bidDeadline)}
          </p>
          {!isExpired && (
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
              Submit your rate before the deadline above.
            </p>
          )}
        </div>
      </div>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <div className="flex flex-wrap justify-between items-baseline gap-2 mb-2">
            <Label className="block text-sm font-semibold text-slate-700">
              Quoted Freight Amount (USD)
            </Label>
            {details.status === "resubmit_requested" && (
              <div className="flex gap-2.5 text-xs font-medium text-slate-500">
                {details.priorQuotedAmount !== undefined && (
                  <span>
                    Prior: <span className="font-semibold text-slate-700">${details.priorQuotedAmount.toLocaleString()}</span>
                  </span>
                )}
                {details.requestedBidAmount !== undefined && (
                  <span>
                    Requested: <span className="font-semibold text-blue-600">${details.requestedBidAmount.toLocaleString()}</span>
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <Input
              type="number"
              step="any"
              required
              disabled={isExpired || isSubmitting}
              placeholder="0.00"
              value={quotedAmount}
              onChange={(e) => setQuotedAmount(e.target.value)}
              className="pl-10 block w-full rounded-xl border-slate-200 py-6 text-base focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <Label className="block text-sm font-semibold text-slate-700 mb-2">
            Carrier Notes / Special Instructions
          </Label>
          <div className="relative">
            <div className="absolute top-3.5 left-3.5 flex items-start pointer-events-none text-slate-400">
              <FileText className="h-5 w-5" />
            </div>
            <textarea
              disabled={isExpired || isSubmitting}
              placeholder="E.g., Rate valid for 24h, transit time, vehicle specifications..."
              value={carrierNotes}
              onChange={(e) => setCarrierNotes(e.target.value)}
              className="pl-10 block w-full min-h-[120px] rounded-xl border border-slate-200 p-4 text-base focus:border-blue-500 focus:ring-blue-500 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
            />
          </div>
        </div>

        {isExpired && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              This bidding window closed on {new Date(details.bidDeadline).toLocaleString()}. Submissions are no longer accepted.
            </p>
          </div>
        )}

        {submitError && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isExpired || isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg py-6 flex items-center justify-center gap-2 text-base font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
          Submit Freight Quote
        </Button>
      </form>
    </div>
  );
}
