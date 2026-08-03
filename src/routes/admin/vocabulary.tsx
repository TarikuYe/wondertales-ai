import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { Languages } from "lucide-react";

export const Route = createFileRoute("/admin/vocabulary")({
  head: () => ({ meta: [{ title: "Vocabulary — TeretVerse Admin" }] }),
  component: () => (
    <AdminPlaceholder
      title="Vocabulary Management"
      description="View and manage vocabulary words unlocked across stories"
      icon={Languages}
      stats={[
        { label: "Total Words", value: "4,820" },
        { label: "Unique Words", value: "1,240" },
        { label: "Words This Month", value: "380" },
        { label: "Avg per Story", value: "4.2" },
      ]}
      tableHeaders={["Word", "Meaning", "Story", "Times Discovered", "Status"]}
      tableRows={[
        ["Adventure", "An exciting experience", "The Cloud Whale", "124", "Active"],
        ["Courage", "Being brave", "The Brave Fox", "98", "Active"],
        ["Discovery", "Finding something new", "Space Explorers", "76", "Active"],
      ]}
    />
  ),
});
