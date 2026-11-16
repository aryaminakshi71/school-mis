import { AnimatePresence, motion } from "framer-motion";
import { Clock, Minus, Plus, ShoppingCart, Utensils, X } from "lucide-react";
import { useState } from "react";

export type MealType = "breakfast" | "lunch" | "snacks" | "dinner";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  calories: number;
  isVegetarian: boolean;
  allergens: string[];
  available: boolean;
  image?: string;
}

export interface DailyMenu {
  date: Date;
  mealType: MealType;
  items: MenuItem[];
  specialItem?: MenuItem;
}

export interface StudentWallet {
  studentId: string;
  studentName: string;
  balance: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  timestamp: Date;
}

export interface Order {
  id: string;
  studentId: string;
  studentName: string;
  items: { item: MenuItem; quantity: number }[];
  totalAmount: number;
  status: "pending" | "preparing" | "ready" | "completed";
  timestamp: Date;
  paymentMethod: "wallet" | "cash" | "card";
}

interface CanteenManagementProps {
  onAddMenuItem: (item: Omit<MenuItem, "id">) => Promise<void>;
  onPlaceOrder: (
    order: Omit<Order, "id" | "timestamp" | "status">,
  ) => Promise<void>;
  onUpdateDailyMenu: (menu: DailyMenu) => Promise<void>;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Masala Dosa",
    category: "Breakfast",
    price: 40,
    calories: 250,
    isVegetarian: true,
    allergens: [],
    available: true,
  },
  {
    id: "2",
    name: "Idli Sambar",
    category: "Breakfast",
    price: 30,
    calories: 180,
    isVegetarian: true,
    allergens: [],
    available: true,
  },
  {
    id: "3",
    name: "Poha",
    category: "Breakfast",
    price: 25,
    calories: 200,
    isVegetarian: true,
    allergens: [],
    available: true,
  },
  {
    id: "4",
    name: "Veg Biryani",
    category: "Lunch",
    price: 60,
    calories: 450,
    isVegetarian: true,
    allergens: [],
    available: true,
  },
  {
    id: "5",
    name: "Chicken Biryani",
    category: "Lunch",
    price: 80,
    calories: 550,
    isVegetarian: false,
    allergens: [],
    available: true,
  },
  {
    id: "6",
    name: "Dal Rice",
    category: "Lunch",
    price: 40,
    calories: 350,
    isVegetarian: true,
    allergens: [],
    available: true,
  },
  {
    id: "7",
    name: "Veg Sandwich",
    category: "Snacks",
    price: 35,
    calories: 200,
    isVegetarian: true,
    allergens: ["gluten"],
    available: true,
  },
  {
    id: "8",
    name: "Samosa",
    category: "Snacks",
    price: 15,
    calories: 150,
    isVegetarian: true,
    allergens: ["gluten"],
    available: true,
  },
  {
    id: "9",
    name: "Paneer Tikka",
    category: "Dinner",
    price: 70,
    calories: 300,
    isVegetarian: true,
    allergens: ["dairy"],
    available: true,
  },
  {
    id: "10",
    name: "Chapati Curry",
    category: "Dinner",
    price: 50,
    calories: 280,
    isVegetarian: true,
    allergens: ["gluten"],
    available: true,
  },
];

export function CanteenManagement({
  onAddMenuItem,
  onPlaceOrder,
  onUpdateDailyMenu,
}: CanteenManagementProps) {
  const [activeTab, setActiveTab] = useState<"menu" | "wallet" | "orders">(
    "menu",
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<MealType>("lunch");
  const [showCart, setShowCart] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      studentId: "s1",
      studentName: "Rahul Sharma",
      items: [{ item: MENU_ITEMS[0], quantity: 2 }],
      totalAmount: 80,
      status: "ready",
      timestamp: new Date(),
      paymentMethod: "wallet",
    },
  ]);
  const [wallets, setWallets] = useState<StudentWallet[]>([
    {
      studentId: "s1",
      studentName: "Rahul Sharma",
      balance: 250,
      transactions: [
        {
          id: "t1",
          type: "credit",
          amount: 500,
          description: "Wallet recharge",
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: "t2",
          type: "debit",
          amount: 80,
          description: "Order #1",
          timestamp: new Date(),
        },
        {
          id: "t3",
          type: "debit",
          amount: 170,
          description: "Order #2",
          timestamp: new Date(),
        },
      ],
    },
  ]);

  const mealTypes: {
    type: MealType;
    label: string;
    time: string;
    icon: any;
  }[] = [
    {
      type: "breakfast",
      label: "Breakfast",
      time: "7:30 - 9:00 AM",
      icon: Clock,
    },
    { type: "lunch", label: "Lunch", time: "12:00 - 2:00 PM", icon: Clock },
    { type: "snacks", label: "Snacks", time: "4:00 - 5:30 PM", icon: Clock },
    { type: "dinner", label: "Dinner", time: "7:30 - 9:00 PM", icon: Clock },
  ];

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    setShowCart(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((i) => {
            if (i.item.id === itemId) {
              const newQuantity = Math.max(0, i.quantity + delta);
              return newQuantity === 0 ? null : { ...i, quantity: newQuantity };
            }
            return i;
          })
          .filter(Boolean) as typeof cart,
    );
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0,
  );

  const placeOrder = async () => {
    if (cart.length === 0) return;

    const order: Order = {
      id: `order-${Date.now()}`,
      studentId: "s1",
      studentName: "Rahul Sharma",
      items: cart,
      totalAmount: cartTotal,
      status: "pending",
      timestamp: new Date(),
      paymentMethod: "wallet",
    };

    await onPlaceOrder({
      studentId: order.studentId,
      studentName: order.studentName,
      items: order.items,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
    });

    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setShowCart(false);
    alert("Order placed successfully!");
  };

  const getMealItems = () => {
    const mealCategories: Record<MealType, string[]> = {
      breakfast: ["Breakfast"],
      lunch: ["Lunch"],
      snacks: ["Snacks"],
      dinner: ["Dinner"],
    };
    return menuItems.filter(
      (item) =>
        mealCategories[selectedMeal].includes(item.category) && item.available,
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Utensils className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                Canteen Management
              </h2>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Menu planning, student wallets, and orders
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {["menu", "wallet", "orders"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`rounded-lg px-4 py-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "menu" && (
          <div className="space-y-6">
            {/* Meal Type Selector */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {mealTypes.map(({ type, label, time, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => setSelectedMeal(type)}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${
                    selectedMeal === type
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{label}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{time}</p>
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 capitalize dark:text-gray-100">
                {selectedMeal} Menu
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getMealItems().map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {item.name}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                          {item.isVegetarian && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700 text-xs dark:bg-green-900/30 dark:text-green-300">
                              Veg
                            </span>
                          )}
                          <span className="text-gray-500 text-xs">
                            {item.calories} kcal
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-lg text-primary">
                        ₹{item.price}
                      </span>
                    </div>

                    {item.allergens.length > 0 && (
                      <p className="mb-2 text-orange-600 text-xs dark:text-orange-400">
                        Contains: {item.allergens.join(", ")}
                      </p>
                    )}

                    <button
                      onClick={() => addToCart(item)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-white transition-colors hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="space-y-6">
            {wallets.map((wallet) => (
              <div
                key={wallet.studentId}
                className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg dark:text-gray-100">
                      {wallet.studentName}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Student ID: {wallet.studentId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">Current Balance</p>
                    <p className="font-bold text-3xl text-primary">
                      ₹{wallet.balance}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">
                    Recent Transactions
                  </h4>
                  {wallet.transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-gray-800"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm dark:text-gray-100">
                          {transaction.description}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {transaction.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`font-medium ${
                          transaction.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}₹
                        {transaction.amount}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <button className="flex-1 rounded-lg bg-primary py-2 text-white hover:bg-primary/90">
                    Add Money
                  </button>
                  <button className="flex-1 rounded-lg border border-gray-300 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    View All Transactions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Recent Orders ({orders.length})
              </h3>
            </div>

            <div className="space-y-3">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          Order #{order.id.slice(-4)}
                        </h4>
                        <span
                          className={`rounded-full px-2 py-1 text-xs capitalize ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "preparing"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "ready"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="mb-2 text-gray-600 text-sm dark:text-gray-400">
                        {order.studentName} •{" "}
                        {order.timestamp.toLocaleTimeString()}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-gray-700 text-sm dark:text-gray-300"
                          >
                            {item.item.name} x{item.quantity}
                            {idx < order.items.length - 1 && ","}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg dark:text-gray-100">
                        ₹{order.totalAmount}
                      </p>
                      <p className="text-gray-500 text-xs capitalize">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 z-50 h-full w-80 border-gray-200 border-l bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between border-gray-200 border-b p-6 dark:border-gray-800">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100">
                <ShoppingCart className="h-5 w-5" />
                Your Cart
              </h3>
              <button
                onClick={() => setShowCart(false)}
                className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto p-6"
              style={{ maxHeight: "calc(100% - 200px)" }}
            >
              {cart.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.item.id} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {item.item.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          ₹{item.item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.item.id, -1)}
                          className="rounded-full bg-gray-100 p-1 hover:bg-gray-200 dark:bg-gray-800"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.item.id, 1)}
                          className="rounded-full bg-gray-100 p-1 hover:bg-gray-200 dark:bg-gray-800"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="absolute right-0 bottom-0 left-0 border-gray-200 border-t bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Total
                </span>
                <span className="font-bold text-gray-900 text-xl dark:text-gray-100">
                  ₹{cartTotal}
                </span>
              </div>
              <button
                onClick={placeOrder}
                disabled={cart.length === 0}
                className="w-full rounded-xl bg-primary py-3 text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                Place Order
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CanteenManagement;
