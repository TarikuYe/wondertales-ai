import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { CreditCard } from "lucide-react";

export const Route = createFileRoute("/admin/subscriptions")({
  head: () => ({ meta: [{ title: "Subscriptions — TeretVerse Admin" }] }),
  component: () => (
    <AdminPlaceholder
      title="Subscriptions"
      description="Manage Free, Premium, Family, School, and Enterprise plans"
      icon={CreditCard}
      stats={[
        { label: "Active Subscriptions", value: "420" },
        { label: "Trials", value: "85" },
        { label: "Expired (30d)", value: "32" },
        { label: "MRR", value: "$4,820" },
      ]}
      tableHeaders={["Customer", "Plan", "Status", "Renewal Date", "Amount"]}
      tableRows={[
        ["Marta B.", "Family Premium", "Active", "Aug 15", "$12/mo"],
        ["Mr. Okonkwo", "Teacher & School", "Active", "Sep 1", "$24/mo"],
        ["Daniel R.", "Family Premium", "Trial", "Aug 10", "$0"],
      ]}
    />
  ),
});
