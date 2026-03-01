import { type RouteObject } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout.tsx";
import AdminHome from "../pages/admin/AdminHome.tsx";
import { PATHS } from "./paths.ts";
import { useAuth } from "../context/AuthContext.tsx";
import AdminUsersModule from "../pages/admin/AdminUsersModule.tsx";
import { Center, Loader } from "@mantine/core";
import AdminUserDetails from "../pages/admin/AdminUserDetails.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// implement the same Guard component for user and pro
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user, isInitializing } = useAuth();
  const unauthorized = !user || user.role !== "admin";

  useEffect(() => {
    if (unauthorized) {
      navigate(PATHS.GUEST.LOGIN, { replace: true });
    }
  }, [unauthorized]);

  if (isInitializing) {
    return (
      <Center style={{ width: "100vw", height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
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
      element: <AdminHome />, // home page user hub
    },
    {
      path: "users", // Affiche <AdminUsersModule /> sur "/admin/users"
      element: <AdminUsersModule />,
    },
    {
      path: "users/:id",
      element: <AdminUserDetails />,
    },
  ],
};
