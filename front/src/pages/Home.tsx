// src/pages/Home.tsx
import { getUserRole, isTokenExpired } from "../api/auth";
import AdminHome from "./admin/AdminHome";
// import ProHome from "./ProHome";
// import UserHome from "./UserHome";
import { Navigate } from "react-router-dom";
import { PATHS } from "../routes/paths";

const Home = () => {
  const role = getUserRole();

  // handle expired token
  if (!role || isTokenExpired()) {
    localStorage.removeItem("token");
    return <Navigate to={PATHS.GUEST.LOGIN} replace />;
  }

  // Render component based on role
  switch (role) {
    case "admin":
      return <AdminHome />;
    // TODO: add other home page for each role
    // case "pro":
    //   return <ProHome />;
    // case "user":
    //   return <UserHome />;
    default:
      return <Navigate to={PATHS.GUEST.LOGIN} replace />;
  }
};

export default Home;
