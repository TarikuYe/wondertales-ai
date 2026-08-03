import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { Image } from "lucide-react";

export const Route = createFileRoute("/admin/illustrations")({
  head: () => ({ meta: [{ title: "Illustrations — TeretVerse Admin" }] }),
  component: () => (
    <AdminPlaceholder
      title="Illustration Management"
      description="Browse, preview, regenerate, and moderate AI-generated images"
      icon={Image}
      stats={[
        { label: "Total Images", value: "12,840" },
        { label: "Generated Today", value: "420" },
        { label: "Storage Used", value: "18.2 GB" },
        { label: "Flagged", value: "3" },
      ]}
      tableHeaders={["Story", "Page", "Style", "Generated", "Status"]}
      tableRows={[
        ["The Cloud Whale", "1", "Watercolor", "2 min ago", "Active"],
        ["Space Explorers", "5", "3D Cartoon", "5 min ago", "Active"],
        ["Kindness Kingdom", "12", "Storybook", "12 min ago", "Flagged"],
      ]}
    />
  ),
});
