import {
  Avatar,
  Box,
  Container,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Text,
  Title,
  Button,
} from "@mantine/core";
import { PATHS } from "../../routes/paths";
import AdminBreadcrumbs from "../../components/admin/AdminBreadcrumbs";
import { ScoreRing } from "../../components/ScoreRing";
import { useEffect, useState } from "react";
import { getAccountDetails, type Account } from "../../api/admin/userModule";
import { Navigate, useParams } from "react-router-dom";
import { showErrorNotification } from "../../components/NotificationToast";
import { useQuery } from "@tanstack/react-query";
import FullScreenLoader from "../../components/FullScreenLoader";
import InfoField from "../../components/InfoField";
import dayjs from "dayjs";
import PasswordStrengthInput, {
  requirements,
} from "../../components/PasswordStrengthInput";
import { IconLock } from "@tabler/icons-react";

export default function AdminUserDetails() {
  // states for password form
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoadingPasswordForm, setIsLoadingPasswordForm] =
    useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const params = useParams();
  const accountId: number = params.id ? parseInt(params.id) : 0;
  const isValidId = !isNaN(accountId) && accountId > 0;
  const {
    data: accountDetails,
    isLoading: isAccountDetailsLoading,
    error,
  } = useQuery<Account>({
    queryKey: ["accountDetails", accountId],
    queryFn: () => getAccountDetails(accountId),
    enabled: isValidId, // only run query if isValidId
  });

  useEffect(() => {
    if (error) {
      showErrorNotification("Error", "Error while fetching account details");
    }
  }, [error]);

  if (isAccountDetailsLoading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <Navigate to={PATHS.ADMIN.USERS} replace />;
  }

  const role = accountDetails?.role;

  //validations
  const validatePassword = (val: string) => {
    if (!val) {
      setPasswordError("Password is required");
      return false;
    }
    if (val.length < 12) {
      setPasswordError("Password must be at least 12 characters long");
      return false;
    }
    if (val.length > 60) {
      setPasswordError("Password must be at most 60 characters long");
      return false;
    }
    if (!requirements.every((requirement) => requirement.re.test(val))) {
      setPasswordError(
        "Password must contain at least one number, one uppercase letter, and one special character",
      );
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const validateConfirmPassword = (val: string) => {
    if (!val) {
      setConfirmPasswordError("You must confirm your password");
      return false;
    } else if (val !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  return (
    <Container px="md" size="xl">
      <AdminBreadcrumbs
        breadcrumbs={[
          { title: "User Management", href: PATHS.ADMIN.USERS },
          { title: "Users Details", href: "#" },
        ]}
      />
      <Container px="md" size="sm" mt="xl">
        {accountDetails?.role === "user" && (
          <Flex align="flex-start" justify="flex-end">
            <ScoreRing score={accountDetails.score} size={90} />
          </Flex>
        )}

        <Stack justify="center" align="center">
          <Avatar
            // avatar must be in /src/assets/avatars
            src={accountDetails?.avatar}
            name="User's name"
            color="initials"
            size="100"
          />
          <Title order={3}>{accountDetails?.username}</Title>
        </Stack>
        <Title order={3} ta="left" mt="xl">
          General Information
        </Title>

        <Paper variant="primary" px="lg" py="md" mt="sm">
          <InfoField label="Username">
            <Text ps="sm" mt="xs" mb="xl">
              {accountDetails?.username}
            </Text>
          </InfoField>
          <InfoField label="Registered on">
            <Text ps="sm" mt="xs" mb="xl">
              {dayjs(accountDetails?.created_at).format("DD/MM/YYYY - HH:mm")}
            </Text>
          </InfoField>
          <InfoField label="Role">
            {accountDetails?.role === "user" ? (
              <Text ps="sm" mt="xs" mb="xl" c="blue">
                User
              </Text>
            ) : accountDetails?.role === "pro" ? (
              <Text ps="sm" mt="xs" mb="xl" c="yellow">
                Pro
              </Text>
            ) : accountDetails?.role === "employee" ? (
              <Text ps="sm" mt="xs" mb="xl" c="green">
                Employee
              </Text>
            ) : (
              <Text ps="sm" mt="xs" mb="xl" c="red">
                Admin
              </Text>
            )}
          </InfoField>
          <InfoField label="Status">
            {accountDetails?.is_banned ? (
              <Text ps="sm" mt="xs" mb="xl" c="red">
                Banned
              </Text>
            ) : (
              <Text ps="sm" mt="xs" mb="xl" c="green">
                Active
              </Text>
            )}
          </InfoField>
          {accountDetails?.is_premium ??
            (accountDetails?.is_premium ? (
              <InfoField label="Subscription">
                <Text ps="sm" mt="xs" mb="xl">
                  Freemium
                </Text>
              </InfoField>
            ) : (
              <InfoField label="Subscription">
                <Text
                  ps="sm"
                  mt="xs"
                  mb="xl"
                  gradient={{
                    from: "rgba(199, 165, 70, 1)",
                    to: "rgba(230, 225, 188, 1)",
                    deg: 90,
                  }}
                >
                  Premium
                </Text>
              </InfoField>
            ))}
        </Paper>

        <Title order={3} ta="left" mt="xl">
          Contact
        </Title>
        <Paper variant="primary" px="lg" py="md" mt="sm">
          <InfoField label="Email">
            <Text ps="sm" mt="xs" mb="xl">
              {accountDetails?.email}
            </Text>
          </InfoField>
          <InfoField label="Phone number">
            <Text ps="sm" mt="xs" mb="xl">
              {accountDetails?.phone ? accountDetails?.phone : "N/A"}
            </Text>
          </InfoField>
        </Paper>

        <Title order={3} ta="left" mt="xl">
          Activities
        </Title>
        <Paper variant="primary" px="lg" py="md" mt="sm">
          <InfoField label="Last active on">
            <Text ps="sm" mt="xs" mb="xl">
              {dayjs(accountDetails?.last_active).format("DD/MM/YYYY - HH:mm")}
            </Text>
          </InfoField>
          {role == "user" && (
            <>
              <InfoField label="Total container deposits">
                <Text ps="sm" mt="xs" mb="xl">
                  TODO: total container deposits of user
                </Text>
              </InfoField>
              <InfoField label="Total listings">
                <Text ps="sm" mt="xs" mb="xl">
                  TODO: total listings (annonces) of user
                </Text>
              </InfoField>
              <InfoField label="Total spendings">
                <Text ps="sm" mt="xs" mb="xl">
                  TODO: total money user spent for events/workshops
                </Text>
              </InfoField>
            </>
          )}

          {role == "employee" && (
            <>
              <InfoField label="Total events/workshops assigned">
                <Text ps="sm" mt="xs" mb="xl">
                  TODO: total events linked to employee
                </Text>
              </InfoField>
              <InfoField label="Total articles posted">
                <Text ps="sm" mt="xs" mb="xl">
                  TODO: total articles employee posted
                </Text>
              </InfoField>
            </>
          )}
          {role == "pro" && (
            <>
              <InfoField label="Total listings acquired">
                <Text ps="sm" mt="xs" mb="xl">
                  TODO: total listings reserved/purchased
                </Text>
              </InfoField>
              <InfoField label="Total container deposits acquired">
                <Text ps="sm" mt="xs" mb="xl">
                  TODO: total container deposits acquired
                </Text>
              </InfoField>
              <InfoField label="Total projects posted">
                <Text ps="sm" mt="xs" mb="xl">
                  TODO: total projects posted
                </Text>
              </InfoField>
              <InfoField label="Total spendings posted">
                <Text ps="sm" mt="xs" mb="xl">
                  TODO: total money spent through subscription/buying
                  object/participate events and workshops
                </Text>
              </InfoField>
            </>
          )}
        </Paper>

        <Title order={3} ta="left" mt="xl" c="red">
          Danger zone
        </Title>
        <Paper variant="primary" px="lg" py="md" mt="sm">
          <InfoField label="Change password">
            <Box ps="sm" mb="xl">
              <Text mt="xs" mb="xs" c="dimmed">
                Assign a new password for this account
              </Text>
              <PasswordStrengthInput
                w="50%"
                variant="body-color"
                placeholder="New password"
                value={password}
                disabled={isLoadingPasswordForm}
                leftSection={<IconLock size={14} />}
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  setPassword(value);
                  validatePassword(value);
                }}
                error={passwordError}
                required
              />
              <PasswordInput
                leftSection={<IconLock size={14} />}
                variant="body-color"
                w="50%"
                mt="xs"
                placeholder="Confirm new password"
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  setConfirmPassword(value);
                  validateConfirmPassword(value);
                }}
                disabled={isLoadingPasswordForm}
                error={confirmPasswordError}
                required
              />
              <Button mt="md" variant="delete">
                Change password
              </Button>
            </Box>
          </InfoField>
          <InfoField label="Ban account">
            <Box ps="sm" mb="xl">
              <Text c="dimmed" mt="xs">
                This account will not be able to log in until an admin unban it
              </Text>
              <Button mt="xs" variant="delete">
                Ban account
              </Button>
            </Box>
          </InfoField>

          <InfoField label="Delete account">
            <Box ps="sm" mb="xl">
              <Text c="dimmed" mt="xs">
                This account be soft deleted
              </Text>
              <Button mt="xs" variant="delete">
                Delete account
              </Button>
            </Box>
          </InfoField>
        </Paper>
      </Container>
    </Container>
  );
}
