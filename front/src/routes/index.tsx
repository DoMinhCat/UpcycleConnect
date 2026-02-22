import { createBrowserRouter } from "react-router-dom";
import { adminRoutes } from "./admin.routes.tsx";
import { guestRoutes } from "./guest.routes.tsx";
import { NotFoundPage } from "../pages/error/404.tsx";
import { PATHS } from "./paths.ts";
import Home from "../pages/Home.tsx";
export const router = createBrowserRouter([
  adminRoutes,
  guestRoutes,
  {
    path: PATHS.HOME,
    element: <Home />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
