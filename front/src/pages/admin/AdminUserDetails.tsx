import {
  Avatar,
  Box,
  Container,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Group,
  Text,
  Title,
  Button,
  Modal,
} from "@mantine/core";
import { PATHS } from "../../routes/paths";
import AdminBreadcrumbs from "../../components/admin/AdminBreadcrumbs";
import { ScoreRing } from "../../components/ScoreRing";
import { useEffect, useState } from "react";
import {
  deleteAccount,
  getAccountDetails,
  updatePassword,
  type Account,
  type updatePasswordPayload,
} from "../../api/admin/userModule";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../components/NotificationToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import FullScreenLoader from "../../components/FullScreenLoader";
import InfoField from "../../components/InfoField";
import dayjs from "dayjs";
import PasswordStrengthInput, {
  requirements,
} from "../../components/PasswordStrengthInput";
import { IconLock } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "../../context/AuthContext";

export default function AdminUserDetails() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // modal control
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [openedBan, { open: openBan, close: closeBan }] = useDisclosure(false);
  const [
    openedChangePassword,
    { open: openChangePassword, close: closeChangePassword },
  ] = useDisclosure(false);

  // states for password form
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoadingPasswordForm, setIsLoadingPasswordForm] =
    useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

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

  // Fetch account info to display
  const params = useParams();
  const accountId: number = params.id ? parseInt(params.id) : 0;
  const isValidId = !isNaN(accountId) && accountId > 0;
  const {
    data: accountDetails,
    isLoading: isAccountDetailsLoading,
    error: errorAccountDetails,
  } = useQuery<Account>({
    queryKey: ["accountDetails", accountId],
    queryFn: () => getAccountDetails(accountId),
    enabled: isValidId, // only run query if isValidId
  });

  useEffect(() => {
    if (errorAccountDetails) {
      showErrorNotification("Error", "Error while fetching account details");
    }
  }, [errorAccountDetails]);

  // delete hook
  const deletionMutation = useMutation({
    mutationFn: (accountId: number) => deleteAccount(accountId),
    onSuccess: (response) => {
      if (response.status === 204) {
        showSuccessNotification(
          "Account deleted",
          "Account deleted successfully.",
        );
        closeDelete();
        navigate(PATHS.ADMIN.USERS);
      }
    },
    onError: (error: any) => {
      showErrorNotification("Account deletion failed", error);
    },
  });
  const handleDeleteAccount = async () => {
    if (accountId) {
      deletionMutation.mutate(accountId);
    }
  };

  // change pass hook
  const { mutate: mutatePasswordUpdate, isPending: isPendingPasswordUpdate } =
    useMutation({
      mutationFn: (payload: updatePasswordPayload) => updatePassword(payload),
      onSuccess: (response) => {
        if (response?.status === 204) {
          showSuccessNotification(
            "Password updated",
            "Password changed successfully.",
          );
          closeChangePassword();
          setPassword("");
          setConfirmPassword("");
        }
      },
      onError: (error: any) => {
        showErrorNotification("Password update failed", error);
      },
    });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !validatePassword(password) ||
      !validateConfirmPassword(confirmPassword)
    )
      return;

    mutatePasswordUpdate({ id: accountId, newPassword: password });
  };

  if (isAccountDetailsLoading) {
    return <FullScreenLoader />;
  }
  if (errorAccountDetails) {
    return <Navigate to={PATHS.ADMIN.USERS} replace />;
  }
  const role = accountDetails?.role;
  console.log(role === "admin" && accountId != user?.id);
  console.log(accountId.toString(), user?.id);
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
            <Text ps="sm" mt="xs">
              {dayjs(accountDetails?.last_active).format("DD/MM/YYYY - HH:mm")}
            </Text>
          </InfoField>
          {role == "user" && (
            <>
              <InfoField label="Total container deposits" mt="xl">
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
              <InfoField label="Total events/workshops assigned" mt="xl">
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
              <InfoField label="Total listings acquired" mt="xl">
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
          <InfoField label="Edit account">
            <Box ps="sm" mb="xl">
              <Text c="dimmed" mt="xs">
                Modify account's username, contact information, etc.
              </Text>
              <Button
                mt="xs"
                variant="edit"
                onClick={openEdit}
                disabled={role === "admin" && accountId != user?.id}
              >
                Edit account
              </Button>
            </Box>
          </InfoField>

          <InfoField label="Change password">
            <Box ps="sm" mb="xl">
              <Text mt="xs" mb="xs" c="dimmed">
                Assign a new password for this account
              </Text>
              <form onSubmit={handleChangePassword}>
                <PasswordStrengthInput
                  w="50%"
                  variant="body-color"
                  placeholder="New password"
                  value={password}
                  disabled={
                    isLoadingPasswordForm ||
                    (role === "admin" && accountId != user?.id)
                  }
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
                  value={confirmPassword}
                  placeholder="Confirm new password"
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    setConfirmPassword(value);
                    validateConfirmPassword(value);
                  }}
                  disabled={
                    isLoadingPasswordForm ||
                    (role === "admin" && accountId != user?.id)
                  }
                  error={confirmPasswordError}
                  required
                />
                <Button
                  mt="md"
                  variant="edit"
                  onClick={() => {
                    if (
                      !validatePassword(password) ||
                      !validateConfirmPassword(confirmPassword)
                    )
                      return;
                    openChangePassword();
                  }}
                  loading={isPendingPasswordUpdate}
                  disabled={
                    isPendingPasswordUpdate ||
                    (role === "admin" && accountId != user?.id)
                  }
                >
                  Change password
                </Button>
                {/* // modal change pass */}
                <Modal
                  opened={openedChangePassword}
                  onClose={closeChangePassword}
                  title="Change password"
                >
                  Are you sure you change password for this account? The old
                  password will be replaced by the new one.
                  <Group mt="lg" justify="flex-end">
                    <Button onClick={closeChangePassword} variant="grey">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      variant="edit"
                      loading={isPendingPasswordUpdate}
                    >
                      Change password
                    </Button>
                  </Group>
                </Modal>
              </form>
            </Box>
          </InfoField>
          <InfoField label="Ban account">
            <Box ps="sm" mb="xl">
              <Text c="dimmed" mt="xs">
                This account will not be able to access to UpAgain until an
                admin unbans it
              </Text>
              <Button
                mt="xs"
                variant="delete"
                onClick={openBan}
                disabled={role === "admin" && accountId != user?.id}
              >
                Ban account
              </Button>
            </Box>
          </InfoField>

          <InfoField label="Delete account">
            <Box ps="sm" mb="xl">
              <Text c="dimmed" mt="xs">
                This account will be soft deleted
              </Text>
              <Button
                mt="xs"
                variant="delete"
                onClick={openDelete}
                disabled={role === "admin" && accountId != user?.id}
              >
                Delete account
              </Button>
            </Box>
          </InfoField>
        </Paper>
      </Container>
      {/* // modal delete */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Delete account">
        Are you sure you want to delete this account?
        <br />
        This account will be soft deleted.
        <Group mt="lg" justify="flex-end">
          <Button onClick={closeDelete} variant="grey">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteAccount();
            }}
            variant="delete"
            loading={deletionMutation.isPending}
          >
            Delete
          </Button>
        </Group>
      </Modal>
      {/* // modal edit */}
      <Modal opened={openedEdit} onClose={closeEdit} title="Edit account">
        Edit
        <Group mt="lg" justify="flex-end">
          <Button onClick={closeEdit} variant="grey">
            Cancel
          </Button>
          <Button
            // onClick={() => {
            //   handleDeleteAccount();
            // }}
            variant="primary"
            // loading={deletionMutation.isPending}
          >
            Delete
          </Button>
        </Group>
      </Modal>
      {/* // modal ban */}
      <Modal opened={openedBan} onClose={closeBan} title="Ban account">
        Are you sure you want to ban this account? This account will be banned.
        <Group mt="lg" justify="flex-end">
          <Button onClick={closeBan} variant="grey">
            Cancel
          </Button>
          <Button
            // onClick={() => {
            //   handleDeleteAccount();
            // }}
            variant="delete"
            // loading={deletionMutation.isPending}
          >
            Ban account
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
