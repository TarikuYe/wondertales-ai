import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/admin/teachers")({
  head: () => ({ meta: [{ title: "Teachers — TeretVerse Admin" }] }),
  component: () => (
    <AdminPlaceholder
      title="Teacher Management"
      description="Manage teacher accounts, classrooms, and student rosters"
      icon={GraduationCap}
      stats={[
        { label: "Total Teachers", value: "48" },
        { label: "Active Classrooms", value: "32" },
        { label: "Students Enrolled", value: "890" },
        { label: "Stories Assigned", value: "1,240" },
      ]}
      tableHeaders={["Teacher", "School", "Classrooms", "Students", "Status"]}
      tableRows={[
        ["Mr. Okonkwo", "Sunrise Primary", "3", "78", "Active"],
        ["Ms. Hadley", "Riverside Elementary", "2", "52", "Active"],
        ["Mr. Bekele", "Addis Ababa Academy", "1", "30", "Active"],
      ]}
      ctaLabel="Add Teacher"
    />
  ),
});
