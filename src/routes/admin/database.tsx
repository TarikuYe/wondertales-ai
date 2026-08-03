import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { Database } from "lucide-react";

export const Route = createFileRoute("/admin/database")({
  head: () => ({ meta: [{ title: "Database — TeretVerse Admin" }] }),
  component: () => (
    <AdminPlaceholder
      title="Database Management"
      description="Browse Firestore, search documents, export, import, backup, and restore"
      icon={Database}
      stats={[
        { label: "Collections", value: "7" },
        { label: "Total Documents", value: "18,420" },
        { label: "Storage Used", value: "2.1 GB" },
        { label: "Indexes", value: "12" },
      ]}
      tableHeaders={["Collection", "Documents", "Size", "Reads (24h)", "Writes (24h)"]}
      tableRows={[
        ["profiles", "1,240", "48 MB", "8,200", "320"],
        ["child_profiles", "640", "22 MB", "4,100", "180"],
        ["stories", "2,840", "1.8 GB", "12,400", "420"],
        ["user_roles", "1,240", "8 MB", "3,200", "120"],
      ]}
    />
  ),
});
