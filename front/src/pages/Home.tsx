// src/pages/Home.tsx
import { useEffect } from "react";
import { isTokenExpired } from "../api/auth";
import AdminHome from "./admin/AdminHome";
// import ProHome from "./ProHome";
// import UserHome from "./UserHome";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { PATHS } from "../routes/paths";

const Home = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user || isTokenExpired()) {
      logout();
    }
  }, [user, logout]);

  // handle expired token
  if (!user || isTokenExpired()) {
    // TODO: home page for guest
    // return <GuestHome />;

    // temporary
    return <Navigate to={PATHS.GUEST.LOGIN} />;
  } else {
    // Render component based on role
    switch (user.role) {
      case "admin":
        return <AdminHome />;
      // TODO: add other home page for each role
      // case "pro":
      //   return <ProHome />;
      // case "user":
      //   return <UserHome />;
      default:
        // return <GuestHome />;

        // temporary
        return <Navigate to={PATHS.GUEST.LOGIN} />;
    }
  }
};

export default Home;
