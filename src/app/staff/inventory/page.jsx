import InventoryManagement from "@/components/Inventory/InventoryManagement";

export const metadata = {
  title: "Inventory | Staff Dashboard",
  description: "View inventory stock levels and assets.",
};

export default function StaffInventoryPage() {
  return <InventoryManagement role="Staff" />;
}
