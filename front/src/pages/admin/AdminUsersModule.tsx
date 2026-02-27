import { Container, Grid, Group, Title, Table, Button, TextInput, Select } from "@mantine/core";
import AdminTable from "../../components/admin/AdminTable";
import { IconSearch, IconChevronDown } from "@tabler/icons-react";

export default function AdminUsersModule() {
    return (
        <Container px="md" size="xl">
            <Title order={2} mt="lg" mb="xl">
                User Management
            </Title>


            <Group justify="space-between" mb="lg" grow>
                <TextInput variant="filled" placeholder="Search by username or email" rightSection={<IconSearch />} />
                <Select
                    placeholder="Sort by"
                    data={['Option 1', 'Option 2', 'Option 3', 'Option 4']}
                    clearable
                    rightSection={<IconChevronDown />}
                    comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                />
                <Select
                    placeholder="Filter by"
                    data={['Option 1', 'Option 2', 'Option 3', 'Option 4']}
                    clearable
                    rightSection={<IconChevronDown />}
                    comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                />
                <Button variant="primary">Add User</Button>
            </Group>

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
            </AdminTable>
        </Container>
    );
}