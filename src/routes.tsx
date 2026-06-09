import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import { NotFound } from "@/pages/not-found";

const VendorUpload = lazy(() => import("@/pages/VendorUpload"));

export const routes: RouteObject[] = [
  {
    path: "/vendor/:token",
    element: <VendorUpload />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

