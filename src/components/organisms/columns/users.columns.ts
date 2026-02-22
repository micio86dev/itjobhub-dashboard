import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types/api";

export function buildUsersColumns(t: (key: string) => string): ColumnDef<User>[] {
  return [
    {
      accessorKey: "first_name",
      header: () => t("users.table.name"),
      cell: ({ row }) => {
        const user = row.original;
        const fullName = `${user.first_name} ${user.last_name}`.trim();
        return h("div", { class: "text-sm font-medium" }, fullName || user.email);
      },
    },
    {
      accessorKey: "email",
      header: () => t("users.table.email"),
    },
    {
      accessorKey: "oauth_provider",
      header: () => t("users.table.method"),
      cell: ({ row }) => {
        const provider = row.original.oauth_provider ?? "email";
        const label = provider.toString().toUpperCase();
        return h(Badge, { variant: "secondary" }, () => label);
      },
    },
    {
      accessorKey: "created_at",
      header: () => t("users.table.created"),
      cell: ({ row }) => {
        const value = row.original.created_at;
        if (!value) return t("common.placeholder");
        const date = new Date(value);
        return formatDistanceToNow(date, { addSuffix: true });
      },
    },
  ];
}
