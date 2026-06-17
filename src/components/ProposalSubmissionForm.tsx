import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetVendorUploadQuery,
  useSubmitVendorUploadMutation,
} from "@/redux/api/vendorApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Loader2,
  DollarSign,
} from "lucide-react";
import FileUploader from "@/components/FileUploader";

export default function ProposalSubmissionForm() {
  const { token } = useParams<{ token: string }>();
  const { data: details } = useGetVendorUploadQuery(token || "", {
    skip: !token,
  });

  const [submitVendorUpload, { isLoading: isSubmitting }] = useSubmitVendorUploadMutation();

  const [quoteValue, setQuoteValue] = useState<string>("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!details) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (details.requiresQuoteValue) {
      if (!quoteValue || isNaN(Number(quoteValue)) || Number(quoteValue) <= 0) {
        setSubmitError("Please enter a valid quote value greater than 0.");
        return;
      }
    }

    if (!uploadedFileUrl && !details.submittedFileUrl) {
      setSubmitError("Please upload your proposal document.");
      return;
    }

    setSubmitError(null);

    try {
      // Submit request using pre-uploaded file details
      await submitVendorUpload({
        token,
        quoteValue: details.requiresQuoteValue ? Number(quoteValue) : 0,
        submittedFileUrl: uploadedFileUrl || details.submittedFileUrl || "",
        submittedFileName: uploadedFileName || details.submittedFileName || "",
      }).unwrap();
    } catch (err) {
      console.error(err);
      const errorResponse = err as { data?: { message?: string }; message?: string };
      setSubmitError(errorResponse.data?.message || errorResponse.message || "Failed to submit vendor proposal.");
    }
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative">
      <h3 className="text-lg font-bold text-slate-800 mb-6">
        {details.isResubmit ? "Submit Revised Proposal" : "Proposal Submission"}
      </h3>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {details.isResubmit ? "Updated Total Quote Value (USD)" : "Total Quote Value (USD)"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <Input
              type="number"
              step="any"
              required
              placeholder="0.00"
              value={quoteValue}
              onChange={(e) => setQuoteValue(e.target.value)}
              className="pl-10 block w-full rounded-xl border-slate-200 py-6 text-base focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <FileUploader
          token={token || ""}
          onUploadSuccess={(url, name) => {
            setUploadedFileUrl(url);
            setUploadedFileName(name);
          }}
          onClear={() => {
            setUploadedFileUrl(null);
            setUploadedFileName(null);
          }}
          onUploadingChange={setIsUploading}
        />

        {submitError && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isUploading || isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg py-6 flex items-center justify-center gap-2 text-base font-bold transition-all disabled:opacity-50"
        >
          {(isUploading || isSubmitting) && <Loader2 className="h-5 w-5 animate-spin" />}
          Submit Proposal
        </Button>
      </form>
    </div>
  );
}
