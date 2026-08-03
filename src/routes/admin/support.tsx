import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/admin/support")({
  head: () => ({ meta: [{ title: "Support Center — TeretVerse Admin" }] }),
  component: () => (
    <AdminPlaceholder
      title="Support Center"
      description="Manage support tickets, live chat, FAQs, and bug reports"
      icon={LifeBuoy}
      stats={[
        { label: "Open Tickets", value: "24" },
        { label: "Avg Response", value: "1.2 hrs" },
        { label: "Resolved Today", value: "18" },
        { label: "Satisfaction", value: "94%" },
      ]}
      tableHeaders={["Ticket", "Subject", "Priority", "Assigned To", "Status"]}
      tableRows={[
        ["#1024", "Story not generating", "High", "Agent A", "Open"],
        ["#1023", "Payment failed", "Medium", "Agent B", "In Progress"],
        ["#1022", "Audio playback issue", "Low", "Agent C", "Resolved"],
      ]}
    />
  ),
});
