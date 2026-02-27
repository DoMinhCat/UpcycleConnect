import { Container, Grid, Title, Table, Button, TextInput, Select } from "@mantine/core";
import AdminTable from "../../components/admin/AdminTable";
import { IconSearch, IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminUsersModule() {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
    const [sortValue, setSortValue] = useState<string | null>(null);
    const [roleValue, setRoleValue] = useState<string | null>(null);
    const [statusValue, setStatusValue] = useState<string | null>(null);

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
                <Table.Tr>
                    <Table.Td>2022-01-01</Table.Td>
                    <Table.Td>1</Table.Td>
                    <Table.Td>John Doe</Table.Td>
                    <Table.Td>[EMAIL_ADDRESS]</Table.Td>
                    <Table.Td>User</Table.Td>
                    <Table.Td>Active</Table.Td>
                    <Table.Td>
                        <Button variant="edit" me="sm" size="xs">Edit</Button>
                        <Button variant="delete" size="xs">Delete</Button>
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>2022-01-01</Table.Td>
                    <Table.Td>1</Table.Td>
                    <Table.Td>John Doe</Table.Td>
                    <Table.Td>[EMAIL_ADDRESS]</Table.Td>
                    <Table.Td>User</Table.Td>
                    <Table.Td>Active</Table.Td>
                    <Table.Td>
                        <Button variant="edit" me="sm" size="xs">Edit</Button>
                        <Button variant="delete" size="xs">Delete</Button>
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>2022-01-01</Table.Td>
                    <Table.Td>1</Table.Td>
                    <Table.Td>John Doe</Table.Td>
                    <Table.Td>[EMAIL_ADDRESS]</Table.Td>
                    <Table.Td>User</Table.Td>
                    <Table.Td>Active</Table.Td>
                    <Table.Td>
                        <Button variant="edit" me="sm" size="xs">Edit</Button>
                        <Button variant="delete" size="xs">Delete</Button>
                    </Table.Td>
                </Table.Tr>
            </AdminTable>
        </Container>
    );
}