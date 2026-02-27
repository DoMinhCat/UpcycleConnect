import { Container, Grid, Title, Table, Button, TextInput, Select } from "@mantine/core";
import AdminTable from "../../components/admin/AdminTable";
import { IconSearch, IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllAccounts, type Account } from "../../api/admin/userModule";
import { showNotification } from "@mantine/notifications";
import dayjs from "dayjs";

export default function AdminUsersModule() {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
    const [sortValue, setSortValue] = useState<string | null>(null);
    const [roleValue, setRoleValue] = useState<string | null>(null);
    const [statusValue, setStatusValue] = useState<string | null>(null);

    const [accounts, setAccounts] = useState<Account[]>([]);
    useEffect(() => {
        const fetchAccounts = async () => {
            setIsLoading(true);
            try {
                const response = await getAllAccounts();
                setAccounts(response);
            } catch (error) {
                showNotification({
                    title: "Error",
                    message: "Failed to fetch accounts",
                    color: "red",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);
    const listUsers = accounts.map((account) => (
        <Table.Tr key={account.id}>
            <Table.Td>{dayjs(account.created_at).format("DD/MM/YYYY - HH:mm")}</Table.Td>
            <Table.Td>{account.id}</Table.Td>
            <Table.Td>{account.username}</Table.Td>
            <Table.Td>{account.email}</Table.Td>
            <Table.Td>{capitalize(account.role)}</Table.Td>
            <Table.Td>{account.status}</Table.Td>
            <Table.Td>
                <Button variant="edit" me="sm" size="xs">Edit</Button>
                <Button variant="delete" size="xs">Delete</Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container px="md" size="xl">
            <Title order={2} mt="lg" mb="xl">
                User Management
            </Title>


            <Grid mb="xl" align="flex-end">
                <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
                    <TextInput variant="filled" placeholder="Search by name or email" rightSection={<IconSearch size={14} />} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                </Grid.Col>

                <Grid.Col span={{ base: 6, sm: 1.5, lg: 1.5 }}>
                    <Select placeholder="Sort by" data={['Option 1']} rightSection={<IconChevronDown size={14} />} value={sortValue} onChange={(e) => setSortValue(e)} />
                </Grid.Col>

                <Grid.Col span={{ base: 6, sm: 1.5, lg: 1.5 }}>
                    <Select placeholder="Role" data={['User', 'Pro', 'Employee', 'Admin']} rightSection={<IconChevronDown size={14} />} value={roleValue} onChange={(e) => setRoleValue(e)} />
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 1.5, lg: 1.5 }}>
                    <Select placeholder="Status" data={['Active', 'Banned']} rightSection={<IconChevronDown size={14} />} value={statusValue} onChange={(e) => setStatusValue(e)} />
                </Grid.Col>

                <Grid.Col span={{ base: 6, sm: 1.5, lg: 1.5 }}>
                    <Button fullWidth variant="primary" leftSection={<IconPlus size={14} />}>New Account</Button>
                </Grid.Col>
            </Grid>

            <AdminTable header={["Registered on", "ID", "Username", "Email", "Role", "Status", "Actions"]} >
                {listUsers}
            </AdminTable>
        </Container>
    );
}