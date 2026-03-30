import InventoryManagement from "@/components/Inventory/InventoryManagement";

export const metadata = {
  title: "Inventory Management | Admin Dashboard",
  description: "Manage college assets, stock levels, and AMC renewals.",
};

export default function AdminInventoryPage() {
  return <InventoryManagement role="Admin" />;
}
