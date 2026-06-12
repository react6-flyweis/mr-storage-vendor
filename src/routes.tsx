import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import { NotFound } from "@/pages/not-found";

const VendorUpload = lazy(() => import("@/pages/VendorUpload"));
const CarrierBid = lazy(() => import("@/pages/CarrierBid"));
const BundleDetails = lazy(() => import("@/pages/BundleDetails"));

export const routes: RouteObject[] = [
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
    path: "*",
    element: <NotFound />,
  },
];

