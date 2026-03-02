import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { PATHS } from "../../routes/paths";
import { useState } from "react";
import { LoginRequest } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { showErrorNotification } from "../NotificationToast";
import { useMutation } from "@tanstack/react-query";

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: () => LoginRequest({ email, password }),
    onSuccess: (data) => {
      const user = login(data.token);

      // redirect
      if (user.role === "admin") {
        navigate(PATHS.ADMIN.HOME);
      } else {
        navigate(PATHS.HOME);
      }
    },
    onError: (error: any) => {
      showErrorNotification("Login failed", error);
    },
  });

  const validateEmail = (val: string) => {
    const regex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/;
    if (!val) {
      setEmailError("Email is required");
      return false;
    } else if (!regex.test(val)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (val: string) => {
    if (!val) {
      setPasswordError("Password is required");
      return false;
    }
    setPasswordError(null);
    return true;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload

    if (!validateEmail(email)) return;

    loginMutation.mutate();
  };

  return (
    <Container size={520} my={40}>
      <Title ta="center">Welcome back!</Title>

      <Text mt="sm" ta={"center"}>
        Do not have an account yet?{" "}
        <Anchor href={PATHS.GUEST.REGISTER}>Create account</Anchor>
      </Text>

      <Paper
        withBorder
        shadow="sm"
        p={22}
        mt={30}
        radius="md"
        variant="primary"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            variant="body-color"
            label="Email"
            placeholder="example@gmail.com"
            radius="md"
            error={emailError}
            mb="md"
            onChange={(event) => {
              const email = event.currentTarget.value;
              setEmail(email);
              validateEmail(email);
            }}
            onBlur={() => validateEmail(email)}
            disabled={loginMutation.isPending}
            required
          />
          <PasswordInput
            variant="body-color"
            label="Password"
            placeholder="Your secret"
            onChange={(event) => {
              const password = event.currentTarget.value;
              setPassword(password);
              validatePassword(password);
            }}
            onBlur={() => validatePassword(password)}
            disabled={loginMutation.isPending}
            error={passwordError}
            required
          />

          <Group justify="center" mt="lg">
            <Anchor size="sm" href={PATHS.GUEST.FORGOT}>
              Forgot password?
            </Anchor>
          </Group>
          <Button
            variant="primary"
            fullWidth
            mt="xl"
            type="submit"
            disabled={loginMutation.isPending}
            loading={loginMutation.isPending}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
