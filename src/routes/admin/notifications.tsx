import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "Notifications — TeretVerse Admin" }] }),
  component: () => (
    <AdminPlaceholder
      title="Notification Center"
      description="Send push notifications, emails, and announcements to users"
      icon={Bell}
      stats={[
        { label: "Sent Today", value: "420" },
        { label: "Open Rate", value: "68%" },
        { label: "Scheduled", value: "12" },
        { label: "Total Recipients", value: "12,400" },
      ]}
      tableHeaders={["Title", "Type", "Target", "Sent At", "Status"]}
      tableRows={[
        ["New story feature!", "Push", "All Parents", "2 hrs ago", "Sent"],
        ["Weekly progress", "Email", "Premium Users", "5 hrs ago", "Sent"],
        ["Maintenance notice", "Email", "Everyone", "Scheduled", "Pending"],
      ]}
      ctaLabel="New Notification"
    />
  ),
});
