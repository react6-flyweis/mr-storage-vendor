import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "./apiResponse";

export interface ComparisonSummary {
  expectedLines: number;
  vendorLines: number;
  matchedLines: number;
  missingItems: number;
  extraItems: number;
  qtyMismatches: number;
  lengthMismatches: number;
  weightMismatches: number;
  priceMismatches: number;
  partMismatches: number;
  ambiguousMatches: number;
  manualReviewRequired: number;
}

export interface ExceptionItem {
  issueType: "missing" | "extra" | "qty_mismatch" | "length_mismatch" | "ambiguous" | "part_mismatch";
  severity: "critical" | "high" | "medium" | "low";
  reason: string;
  mark: string;
  direction?: "over" | "under" | null;
  auditType?: string | null;
}

export interface ExceptionHighlight {
  issueType: string;
  count: number;
  samples: Array<{
    mark: string;
    severity: string;
    reason: string;
    direction?: string | null;
  }>;
}

export interface ExceptionSummary {
  blockers: string[];
  canProceedToApproval: boolean;
  comparisonSummary: ComparisonSummary;
  exceptionCount: number;
  exceptions: ExceptionItem[];
  highlights: ExceptionHighlight[];
  priorQuoteValue: number | null;
  priorSubmittedFileName: string;
  priorSubmittedAt: string | null;
}

export interface VendorUploadDetails {
  requestId: string;
  status: string;
  vendorName: string;
  projectName: string;
  jobId: string;
  consolidatedBOMFileUrl: string;
  submittedFileUrl: string | null;
  submittedFileName: string;
  submittedAt: string | null;
  quoteValue: number | null;
  allVendorsSubmitted?: boolean;
  isResubmit?: boolean;
  resubmitCount?: number;
  resubmitRequestedAt?: string | null;
  resubmitNote?: string;
  priorQuoteValue?: number | null;
  requiresQuoteValue?: boolean;
  exceptionSummary?: ExceptionSummary | null;
  submissionHistoryCount?: number;
}

export interface SubmitQuoteRequest {
  token: string;
  quoteValue: number;
  submittedFileUrl: string;
  submittedFileName: string;
}

export interface VendorPresignedUrlRequest {
  token: string;
  fileName: string;
  fileType: string;
  folder: string;
}

export interface VendorPresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const vendorApi = createApi({
  reducerPath: "vendorApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  tagTypes: ["VendorUpload"],
  endpoints: (builder) => ({
    getVendorUpload: builder.query<VendorUploadDetails, string>({
      query: (token) => `/api/public/vendor-upload/${token}`,
      providesTags: ["VendorUpload"],
      transformResponse: (response: ApiResponse<VendorUploadDetails>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    submitVendorUpload: builder.mutation<VendorUploadDetails, SubmitQuoteRequest>({
      query: ({ token, ...body }) => ({
        url: `/api/public/vendor-upload/${token}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["VendorUpload"],
      transformResponse: (response: ApiResponse<VendorUploadDetails>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getVendorPresignedUrl: builder.mutation<
      VendorPresignedUrlResponse,
      VendorPresignedUrlRequest
    >({
      query: ({ token, ...body }) => ({
        url: `/api/public/vendor-upload/${token}/presigned-url`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<VendorPresignedUrlResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
  }),
});

export const {
  useGetVendorUploadQuery,
  useSubmitVendorUploadMutation,
  useGetVendorPresignedUrlMutation,
} = vendorApi;
