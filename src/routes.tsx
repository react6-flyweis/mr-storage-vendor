import { lazy } from "react";
import { type RouteObject, Outlet } from "react-router-dom";
import { NotFound } from "@/pages/not-found";
import { RouterErrorFallback } from "@/components/ErrorBoundary";

const VendorUpload = lazy(() => import("@/pages/VendorUpload"));
const CarrierBid = lazy(() => import("@/pages/CarrierBid"));
const BundleDetails = lazy(() => import("@/pages/BundleDetails"));
const PackingListPlanDetails = lazy(() => import("@/pages/PackingListPlanDetails"));

export const routes: RouteObject[] = [
  {
    element: <Outlet />,
    errorElement: <RouterErrorFallback />,
    children: [
      {
        path: "/vendor/:token",
        element: <VendorUpload />,
      },
      {
        path: "/carrier/:token",
        element: <CarrierBid />,
      },
      {
        path: "/bundle/:bundleId",
        element: <BundleDetails />,
      },
      {
        path: "/packing-list-plan/:packingListPlanId",
        element: <PackingListPlanDetails />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

