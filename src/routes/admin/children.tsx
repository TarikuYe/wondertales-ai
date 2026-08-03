import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { Users } from "lucide-react";

export const Route = createFileRoute("/admin/children")({
  head: () => ({ meta: [{ title: "Children — TeretVerse Admin" }] }),
  component: () => (
    <AdminPlaceholder
      title="Child Management"
      description="View reading progress, achievements, and learning statistics"
      icon={Users}
      stats={[
        { label: "Total Children", value: "640" },
        { label: "Active This Week", value: "412" },
        { label: "Avg Reading Time", value: "18 min" },
        { label: "Stories Read", value: "2,840" },
      ]}
      tableHeaders={["Name", "Age", "Reading Level", "Stories Read", "Favorite Category"]}
      tableRows={[
        ["Lily M.", "6", "Emerging", "24", "Adventure"],
        ["Leo K.", "8", "Developing", "31", "Space"],
        ["Amina B.", "5", "Pre-reader", "12", "Animals"],
        ["Tariq O.", "10", "Confident", "45", "STEM"],
      ]}
    />
  ),
});
