import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { Circle as HelpCircle } from "lucide-react";

export const Route = createFileRoute("/admin/quizzes")({
  head: () => ({ meta: [{ title: "Quizzes — TeretVerse Admin" }] }),
  component: () => (
    <AdminPlaceholder
      title="Quiz Management"
      description="Review and manage AI-generated comprehension quizzes"
      icon={HelpCircle}
      stats={[
        { label: "Total Quizzes", value: "2,840" },
        { label: "Avg Score", value: "76%" },
        { label: "Completion Rate", value: "73%" },
        { label: "Quizzes Today", value: "120" },
      ]}
      tableHeaders={["Story", "Questions", "Avg Score", "Attempts", "Status"]}
      tableRows={[
        ["The Cloud Whale", "3", "82%", "412", "Active"],
        ["Space Explorers", "3", "71%", "310", "Active"],
        ["Ocean Friends", "3", "78%", "280", "Active"],
      ]}
    />
  ),
});
