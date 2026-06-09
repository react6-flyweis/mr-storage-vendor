import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "./apiResponse";

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
