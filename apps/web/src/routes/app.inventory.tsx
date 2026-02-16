import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  FileText,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/app/inventory")({
  component: InventoryPage,
});

function InventoryPage() {
  const { user, hasRole } = useAuth();

  if (!hasRole(["admin", "accountant", "librarian"])) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 font-bold text-foreground text-xl">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don't have permission to view inventory.
          </p>
        </div>
      </div>
    );
  }

  const mockInventory = [
    {
      id: "1",
      name: "Textbooks Class 9",
      category: "Books",
      quantity: 150,
      unit: "pcs",
      threshold: 50,
      price: 450,
      status: "in-stock",
    },
    {
      id: "2",
      name: "Notebooks (100 pages)",
      category: "Stationery",
      quantity: 45,
      unit: "pcs",
      threshold: 100,
      price: 35,
      status: "low-stock",
    },
    {
      id: "3",
      name: "Whiteboard Markers",
      category: "Stationery",
      quantity: 200,
      unit: "boxes",
      threshold: 50,
      price: 120,
      status: "in-stock",
    },
    {
      id: "4",
      name: "Science Lab Equipment",
      category: "Lab",
      quantity: 12,
      unit: "sets",
      threshold: 5,
      price: 15000,
      status: "in-stock",
    },
    {
      id: "5",
      name: "Sports Equipment",
      category: "Sports",
      quantity: 8,
      unit: "items",
      threshold: 10,
      price: 5000,
      status: "low-stock",
    },
    {
      id: "6",
      name: "Chalk Pieces",
      category: "Stationery",
      quantity: 500,
      unit: "pcs",
      threshold: 200,
      price: 10,
      status: "in-stock",
    },
  ];

  const mockPurchaseOrders = [
    {
      id: "PO-001",
      supplier: "Stationery Mart",
      items: 5,
      amount: 12500,
      status: "pending",
      date: "2026-01-20",
    },
    {
      id: "PO-002",
      supplier: "Book Distributors",
      items: 100,
      amount: 45000,
      status: "delivered",
      date: "2026-01-15",
    },
    {
      id: "PO-003",
      supplier: "Lab Supplies Co",
      items: 3,
      amount: 28000,
      status: "processing",
      date: "2026-01-18",
    },
  ];

  const totalValue = mockInventory.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0,
  );
  const lowStockItems = mockInventory.filter((i) => i.status === "low-stock");

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-foreground">
          Inventory Management
        </h1>
        <p className="text-muted-foreground">
          Track and manage school supplies and equipment
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl">{mockInventory.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-success" />
              <span className="font-bold text-2xl">
                ₹{totalValue.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <span className="font-bold text-2xl">{lowStockItems.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl">
                {
                  mockPurchaseOrders.filter((p) => p.status !== "delivered")
                    .length
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Inventory Items</span>
                <Button size="sm">
                  <Package className="mr-1 h-4 w-4" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockInventory.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      item.status === "low-stock"
                        ? "border-warning/30 bg-warning/15"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          item.status === "low-stock"
                            ? "bg-warning/15"
                            : "bg-primary/10"
                        }`}
                      >
                        <Package
                          className={`h-5 w-5 ${
                            item.status === "low-stock"
                              ? "text-warning"
                              : "text-primary"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {item.category} • {item.quantity} {item.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">
                        ₹{item.price.toLocaleString()}
                      </span>
                      {item.status === "low-stock" ? (
                        <span className="rounded bg-warning/15 px-2 py-1 font-medium text-warning text-xs">
                          Low Stock
                        </span>
                      ) : (
                        <span className="rounded bg-success/15 px-2 py-1 font-medium text-success text-xs">
                          In Stock
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Purchase Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPurchaseOrders.map((order) => (
                  <div key={order.id} className="rounded-lg bg-muted p-3">
                    <div className="mb-2 flex items-start justify-between">
                      <span className="font-medium">{order.id}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          order.status === "delivered"
                            ? "bg-success/15 text-success"
                            : order.status === "processing"
                              ? "bg-primary/10 text-primary"
                              : "bg-warning/15 text-warning"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {order.supplier}
                    </p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {order.items} items
                      </span>
                      <span className="font-medium">
                        ₹{order.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                <FileText className="mr-2 h-4 w-4" />
                View All Orders
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="mr-2 h-4 w-4" />
                New Purchase Order
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Stock Entry
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ArrowUp className="mr-2 h-4 w-4" />
                Stock Adjustment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ArrowDown className="mr-2 h-4 w-4" />
                Stock Consumption
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
