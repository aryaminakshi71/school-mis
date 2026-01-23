import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
  FileText,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/app/inventory")({
  component: InventoryPage,
});

function InventoryPage() {
  const { user, hasRole } = useAuth();

  if (!hasRole(["admin", "accountant", "librarian"])) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
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
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory Management
        </h1>
        <p className="text-gray-600">
          Track and manage school supplies and equipment
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold">{mockInventory.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold">
                ₹{totalValue.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold">{lowStockItems.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold">
                {
                  mockPurchaseOrders.filter((p) => p.status !== "delivered")
                    .length
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Inventory Items</span>
                <Button size="sm">
                  <Package className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockInventory.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      item.status === "low-stock"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.status === "low-stock"
                            ? "bg-yellow-100"
                            : "bg-blue-100"
                        }`}
                      >
                        <Package
                          className={`w-5 h-5 ${
                            item.status === "low-stock"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.category} • {item.quantity} {item.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">
                        ₹{item.price.toLocaleString()}
                      </span>
                      {item.status === "low-stock" ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
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
                <ShoppingCart className="w-5 h-5" />
                Purchase Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPurchaseOrders.map((order) => (
                  <div key={order.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{order.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.supplier}</p>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-gray-500">{order.items} items</span>
                      <span className="font-medium">
                        ₹{order.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <FileText className="w-4 h-4 mr-2" />
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
                <ShoppingCart className="w-4 h-4 mr-2" />
                New Purchase Order
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Stock Entry
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ArrowUp className="w-4 h-4 mr-2" />
                Stock Adjustment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ArrowDown className="w-4 h-4 mr-2" />
                Stock Consumption
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
