import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { PATHS } from "../../routes/paths";

export function LoginForm() {
  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome back!</Title>

      <Text mt="sm">
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
        <TextInput
          label="Email"
          placeholder="example@gmail.com"
          required
          radius="md"
        />
        <PasswordInput
          label="Password"
          placeholder="Your super secret"
          required
          mt="md"
          radius="md"
        />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" />
          <Anchor size="sm" href={PATHS.GUEST.FORGOT}>
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" variant="primary">
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
