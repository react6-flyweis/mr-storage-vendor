import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";

const router = createBrowserRouter(routes);

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
