import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import { NotFound } from "@/pages/not-found";

const VendorUpload = lazy(() => import("@/pages/VendorUpload"));
const CarrierBid = lazy(() => import("@/pages/CarrierBid"));

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
    path: "*",
    element: <NotFound />,
  },
];

