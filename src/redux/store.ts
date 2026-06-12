import { configureStore } from "@reduxjs/toolkit";
import { vendorApi } from "./api/vendorApi";
import { uploadApi } from "./api/uploadApi";
import { freightApi } from "./api/freightApi";
import { bundleApi } from "./api/bundleApi";
import { packingListPlanApi } from "./api/packingListPlanApi";

export const store = configureStore({
  reducer: {
    [vendorApi.reducerPath]: vendorApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [freightApi.reducerPath]: freightApi.reducer,
    [bundleApi.reducerPath]: bundleApi.reducer,
    [packingListPlanApi.reducerPath]: packingListPlanApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      vendorApi.middleware,
      uploadApi.middleware,
      freightApi.middleware,
      bundleApi.middleware,
      packingListPlanApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

