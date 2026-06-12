import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "./apiResponse";

export interface StackingInfo {
  stackLevel: string;
  loadingPriority: number;
}

export interface BundleDetails {
  _id: string;
  bundlePlanId: string;
  bundleNo: string;
  bundleType: string;
  title: string;
  totalQty: number;
  totalWeight: number;
  maxLengthFeet: number;
  stacking: StackingInfo;
  loadSequence: number;
  handlingInstruction: string;
  warnings: string[];
  notes: string;
}

export interface BundleItem {
  _id: string;
  vendorQuoteLineId: string;
  partCode: string;
  description: string;
  qty: number;
  lengthFeet: number;
  weight: number;
  markIds: string[];
  sourceLineSnapshot?: Record<string, unknown>;
}

export interface BundleResponse {
  bundle: BundleDetails;
  items: BundleItem[];
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const bundleApi = createApi({
  reducerPath: "bundleApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  tagTypes: ["BundleDetails"],
  endpoints: (builder) => ({
    getBundleDetails: builder.query<BundleResponse, string>({
      query: (bundleId) => `/api/plant/bundles/${bundleId}`,
      providesTags: ["BundleDetails"],
      transformResponse: (response: ApiResponse<BundleResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
  }),
});

export const { useGetBundleDetailsQuery } = bundleApi;
