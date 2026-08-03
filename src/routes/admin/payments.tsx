import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { DollarSign } from "lucide-react";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments — TeretVerse Admin" }] }),
  component: () => (
    <AdminPlaceholder
      title="Payments"
      description="Revenue dashboard, transactions, refunds, and invoices"
      icon={DollarSign}
      stats={[
        { label: "Revenue (MTD)", value: "$4,820" },
        { label: "Transactions", value: "1,240" },
        { label: "Refunds (30d)", value: "8" },
        { label: "Avg Order Value", value: "$12.40" },
      ]}
      tableHeaders={["Transaction ID", "Customer", "Amount", "Method", "Status"]}
      tableRows={[
        ["txn_8821", "Marta B.", "$12.00", "Visa", "Completed"],
        ["txn_4410", "Mr. Okonkwo", "$24.00", "Mastercard", "Completed"],
        ["txn_9932", "Daniel R.", "$12.00", "PayPal", "Refunded"],
      ]}
    />
  ),
});
