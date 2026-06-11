import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "./apiResponse";

export interface FreightBidDetails {
  bidId: string;
  status: string;
  carrierName: string;
  projectName: string;
  jobId: string;
  deliveryNumber: string;
  description: string;
  pickupLocation: string;
  deliveryLocation: string;
  bidDeadline: string;
  quotedAmount: number | null;
  carrierNotes: string;
  submittedAt?: string | null;
}

export interface SubmitFreightBidRequest {
  token: string;
  quotedAmount: number;
  carrierNotes: string;
}

export interface SubmitFreightBidResponse {
  bidId: string;
  status: string;
  quotedAmount: number;
  carrierNotes: string;
  submittedAt: string;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const freightApi = createApi({
  reducerPath: "freightApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  tagTypes: ["FreightBid"],
  endpoints: (builder) => ({
    getFreightBid: builder.query<FreightBidDetails, string>({
      query: (token) => `/api/public/freight-bids/${token}`,
      providesTags: ["FreightBid"],
      transformResponse: (response: ApiResponse<FreightBidDetails>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    submitFreightBid: builder.mutation<SubmitFreightBidResponse, SubmitFreightBidRequest>({
      query: ({ token, ...body }) => ({
        url: `/api/public/freight-bids/${token}/submit`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["FreightBid"],
      transformResponse: (response: ApiResponse<SubmitFreightBidResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
  }),
});

export const {
  useGetFreightBidQuery,
  useSubmitFreightBidMutation,
} = freightApi;
