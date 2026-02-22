import { Grid } from "@mantine/core";
import { LoginForm } from "../../components/guest/LoginForm";
import classes from "../../styles/GlobalStyles.module.css";
import { isTokenExpired } from "../../api/auth";
import { Navigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { user } = useAuth();

  if (user && !isTokenExpired()) {
    if (user.role == "admin") return <Navigate to={PATHS.ADMIN.HOME} replace />;
    else return <Navigate to={PATHS.HOME} replace />;
  }
  return (
    <div className={classes.main}>
      <Grid justify="center" align="center" style={{ width: "100%" }}>
        {/* Span 12/12 on mobile (base)
           Span 6/12 on tablet (sm)
           Span 4/12 on desktop (lg) 
        */}
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <LoginForm />
        </Grid.Col>
      </Grid>
    </div>
  );
}
