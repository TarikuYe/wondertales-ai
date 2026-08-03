import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — TeretVerse Admin" }] }),
  component: () => (
    <AdminPlaceholder
      title="Report Center"
      description="Review user reports for stories, images, audio, and bugs"
      icon={ShieldAlert}
      stats={[
        { label: "Pending Reports", value: "12" },
        { label: "Resolved Today", value: "8" },
        { label: "Escalated", value: "3" },
        { label: "Avg Resolution Time", value: "2.4 hrs" },
      ]}
      tableHeaders={["Type", "Reported By", "Reason", "Reported At", "Status"]}
      tableRows={[
        ["Story", "parent_8821", "Inappropriate content", "1 hr ago", "Pending"],
        ["Image", "parent_4410", "Scary illustration", "3 hrs ago", "Pending"],
        ["Bug", "parent_9932", "Audio not playing", "5 hrs ago", "Assigned"],
      ]}
    />
  ),
});
