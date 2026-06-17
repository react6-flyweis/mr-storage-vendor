import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "./apiResponse";

export interface PackingListPlan {
  _id: string;
  status: string;
  totalPackingLists: number;
  totalBundles: number;
  totalWeight: number;
}

export interface PackingList {
  _id: string;
  packingListNo: string;
  truckType: string;
  totalWeight: number;
}

export interface TruckSummary {
  semi53Count?: number;
  hotshot40Count?: number;
  totalTrucks: number;
  [key: string]: number | undefined;
}

export interface PackingListPlanSummary {
  totalWeight: number;
  totalBundles: number;
  totalPackingLists: number;
  truckSummary: TruckSummary;
  warnings: string[];
}

export interface Bundle {
  _id: string;
  bundleNo: string;
  bundleType: string;
  title: string;
  totalQty: number;
  totalWeight: number;
  maxLengthFeet?: number;
  packingListId?: string;
  status?: string;
  loadSequence?: number;
  warnings?: string[];
}

export interface PackingListPlanResponse {
  packingListPlan: PackingListPlan;
  packingLists: PackingList[];
  summary: PackingListPlanSummary;
  bundles?: Bundle[];
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const packingListPlanApi = createApi({
  reducerPath: "packingListPlanApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  tagTypes: ["PackingListPlan"],
  endpoints: (builder) => ({
    getPackingListPlanDetails: builder.query<PackingListPlanResponse, string>({
      query: (packingListPlanId) => `/api/plant/packing-list-plans/${packingListPlanId}`,
      providesTags: ["PackingListPlan"],
      transformResponse: (response: ApiResponse<PackingListPlanResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
  }),
});

export const { useGetPackingListPlanDetailsQuery } = packingListPlanApi;
