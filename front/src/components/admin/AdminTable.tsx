import { Table } from "@mantine/core";
import type React from "react";

export interface AdminTableProps {
  header: string[];
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AdminTable({
  header,
  children,
  footer,
}: AdminTableProps) {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          {header.map((title, index) => (
            <Table.Th key={index}>{title}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>{children}</Table.Tbody>

      {footer && <Table.Caption>{footer}</Table.Caption>}
    </Table>
  );
}
