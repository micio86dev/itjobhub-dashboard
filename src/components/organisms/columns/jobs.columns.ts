import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types/api";

export function buildJobsColumns(t: (key: string) => string): ColumnDef<Job>[] {
  return [
    {
      accessorKey: "title",
      header: () => t("jobs.table.title"),
      cell: ({ row }) => {
        const job = row.original;
        return h("div", { class: "space-y-1" }, [
          h("div", { class: "text-sm font-medium" }, job.title),
          h("div", { class: "text-xs text-muted-foreground" }, job.company?.name ?? ""),
        ]);
      },
    },
    {
      accessorKey: "employment_type",
      header: () => t("jobs.table.type"),
      cell: ({ row }) => row.original.employment_type ?? t("common.placeholder"),
    },
    {
      accessorKey: "contractType",
      header: () => t("jobs.table.contract"),
      cell: ({ row }) => row.original.employment_type ?? t("common.placeholder"),
    },
    {
      accessorKey: "experience_level",
      header: () => t("jobs.table.level"),
      cell: ({ row }) => row.original.experience_level ?? t("common.placeholder"),
    },
    {
      accessorKey: "language",
      header: () => t("jobs.table.language"),
      cell: ({ row }) => row.original.language ?? t("common.placeholder"),
    },
    {
      accessorKey: "status",
      header: () => t("jobs.table.status"),
      cell: ({ row }) => h(Badge, { variant: "secondary" }, () => row.original.status),
    },
    {
      accessorKey: "published_at",
      header: () => t("jobs.table.published"),
      cell: ({ row }) => {
        const value = row.original.published_at;
        if (!value) return t("common.placeholder");
        return formatDistanceToNow(new Date(value), { addSuffix: true });
      },
    },
  ];
}
