import { type RouteObject, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout.tsx";
import AdminHome from "../pages/admin/AdminHome.tsx";
import { PATHS } from "./paths.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { isTokenExpired } from "../api/auth.ts";
import AdminUsersModule from "../pages/admin/AdminUsersModule.tsx";

// implement the same Guard component for user and pro
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const unauthorized = !user || user.role !== "admin" || isTokenExpired();

  if (unauthorized) {
    if (user && isTokenExpired()) logout();

    return <Navigate to={PATHS.GUEST.LOGIN} replace />;
  }

  return <>{children}</>;
};

export const adminRoutes: RouteObject = {
  path: PATHS.ADMIN.HOME,
  element: (
    <AdminGuard>
      <AdminLayout />,
    </AdminGuard>
  ),
  children: [
    {
      index: true,
      element: <AdminHome />, // page
    },
    {
      path: "users",     // Affiche <AdminUsersModule /> sur "/admin/users"
      element: <AdminUsersModule />,
    },
  ],
};
