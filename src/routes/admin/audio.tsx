import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { Headphones } from "lucide-react";

export const Route = createFileRoute("/admin/audio")({
  head: () => ({ meta: [{ title: "Audio Library — TeretVerse Admin" }] }),
  component: () => (
    <AdminPlaceholder
      title="Audio Library"
      description="Preview, replace, and manage narration audio and voice models"
      icon={Headphones}
      stats={[
        { label: "Total Audio Files", value: "8,420" },
        { label: "Voice Models", value: "7" },
        { label: "Total Duration", value: "142 hrs" },
        { label: "Storage Used", value: "6.4 GB" },
      ]}
      tableHeaders={["Story", "Voice", "Duration", "Format", "Status"]}
      tableRows={[
        ["The Cloud Whale", "Grandmother", "4:32", "MP3", "Active"],
        ["Space Explorers", "Friendly Dad", "6:18", "MP3", "Active"],
        ["Ocean Friends", "Young Girl", "3:45", "MP3", "Active"],
      ]}
    />
  ),
});
