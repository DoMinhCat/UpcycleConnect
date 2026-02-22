import { Grid } from "@mantine/core";
import { LoginForm } from "../../components/guest/LoginForm";
import classes from "../../styles/GlobalStyles.module.css";

export default function Login() {
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
