import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Heart,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import { useState } from "react";

export type DietaryRestriction =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "nut-free"
  | "halal"
  | "kosher"
  | "none";
export type OrderStatus =
  | "draft"
  | "submitted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";
export type MealType = "breakfast" | "lunch" | "snack" | "dinner";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  dietaryTags: DietaryRestriction[];
  allergens: string[];
  nutrition: NutritionInfo;
  isAvailable: boolean;
  servingSize: string;
  preparationTime: number;
  popularity: number;
  rating: number;
  reviews: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  customizations?: string[];
}

export interface PreOrder {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  items: CartItem[];
  pickupDate: Date;
  pickupTime: string;
  mealType: MealType;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed";
  dietaryPreferences: DietaryRestriction[];
  allergies: string[];
  createdAt: Date;
  estimatedReadyTime?: Date;
  pickupLocation: string;
  confirmationCode: string;
  specialNotes?: string;
}

export interface WeeklyMenu {
  weekStart: Date;
  meals: DailyMenu[];
}

export interface DailyMenu {
  date: Date;
  mealType: MealType;
  items: MenuItem[];
  featuredItem?: MenuItem;
  specialTheme?: string;
}

export interface NutritionGoal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface CafeteriaPreOrderingProps {
  userRole?: "student" | "parent" | "admin" | "kitchen-staff";
  userId?: string;
  onAddToCart?: (
    item: MenuItem,
    quantity: number,
    customizations?: string[],
  ) => Promise<void>;
  onSubmitOrder?: (
    order: Omit<PreOrder, "id" | "status" | "createdAt" | "confirmationCode">,
  ) => Promise<string>;
  onCancelOrder?: (orderId: string) => Promise<void>;
  onUpdateDietaryPreferences?: (
    restrictions: DietaryRestriction[],
    allergies: string[],
  ) => Promise<void>;
}

export function CafeteriaPreOrdering({
  userRole = "student",
  userId = "S001",
  onAddToCart,
  onSubmitOrder,
  onCancelOrder,
  onUpdateDietaryPreferences,
}: CafeteriaPreOrderingProps) {
  const [activeTab, setActiveTab] = useState<
    "menu" | "cart" | "orders" | "nutrition"
  >("menu");
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(Date.now() + 86400000),
  );
  const [selectedMealType, setSelectedMealType] = useState<MealType>("lunch");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showDietaryFilters, setShowDietaryFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DietaryRestriction[]>([]);

  const [dietaryPreferences, setDietaryPreferences] = useState<
    DietaryRestriction[]
  >(["none"]);
  const [allergies, setAllergies] = useState<string[]>([]);

  const [menuItems] = useState<MenuItem[]>([
    {
      id: "M001",
      name: "Grilled Chicken Caesar Salad",
      description:
        "Fresh romaine lettuce, grilled chicken breast, parmesan cheese, croutons, and house-made Caesar dressing",
      price: 8.99,
      category: "Salads",
      dietaryTags: ["gluten-free"],
      allergens: ["dairy", "eggs"],
      nutrition: {
        calories: 420,
        protein: 35,
        carbs: 18,
        fat: 22,
        fiber: 4,
        sodium: 680,
      },
      isAvailable: true,
      servingSize: "1 bowl",
      preparationTime: 8,
      popularity: 89,
      rating: 4.5,
      reviews: 124,
    },
    {
      id: "M002",
      name: "Veggie Wrap with Hummus",
      description:
        "Whole wheat wrap with fresh vegetables, hummus, feta cheese, and mixed greens",
      price: 7.49,
      category: "Wraps",
      dietaryTags: ["vegetarian"],
      allergens: ["gluten", "dairy"],
      nutrition: {
        calories: 380,
        protein: 14,
        carbs: 48,
        fat: 16,
        fiber: 8,
        sodium: 520,
      },
      isAvailable: true,
      servingSize: "1 wrap",
      preparationTime: 5,
      popularity: 76,
      rating: 4.3,
      reviews: 89,
    },
    {
      id: "M003",
      name: "Quinoa Buddha Bowl",
      description:
        "Quinoa base with roasted vegetables, chickpeas, avocado, and tahini dressing",
      price: 9.49,
      category: "Bowls",
      dietaryTags: ["vegan", "gluten-free"],
      allergens: ["sesame"],
      nutrition: {
        calories: 520,
        protein: 18,
        carbs: 62,
        fat: 24,
        fiber: 14,
        sodium: 480,
      },
      isAvailable: true,
      servingSize: "1 bowl",
      preparationTime: 6,
      popularity: 92,
      rating: 4.7,
      reviews: 156,
    },
    {
      id: "M004",
      name: "Turkey & Cheese Sandwich",
      description:
        "Whole grain bread, roasted turkey breast, cheddar cheese, lettuce, tomato, and mayo",
      price: 6.99,
      category: "Sandwiches",
      dietaryTags: [],
      allergens: ["gluten", "dairy", "eggs"],
      nutrition: {
        calories: 450,
        protein: 28,
        carbs: 42,
        fat: 18,
        fiber: 5,
        sodium: 890,
      },
      isAvailable: true,
      servingSize: "1 sandwich",
      preparationTime: 4,
      popularity: 84,
      rating: 4.2,
      reviews: 201,
    },
    {
      id: "M005",
      name: "Gluten-Free Pasta Primavera",
      description:
        "Rice pasta with seasonal vegetables in light olive oil sauce",
      price: 8.49,
      category: "Pasta",
      dietaryTags: ["gluten-free", "vegetarian"],
      allergens: [],
      nutrition: {
        calories: 420,
        protein: 12,
        carbs: 68,
        fat: 14,
        fiber: 8,
        sodium: 420,
      },
      isAvailable: true,
      servingSize: "1 plate",
      preparationTime: 12,
      popularity: 71,
      rating: 4.4,
      reviews: 67,
    },
    {
      id: "M006",
      name: "Fresh Fruit Cup",
      description: "Seasonal fresh fruits including berries, melon, and citrus",
      price: 3.99,
      category: "Sides",
      dietaryTags: ["vegan", "gluten-free"],
      allergens: [],
      nutrition: {
        calories: 120,
        protein: 1,
        carbs: 30,
        fat: 0,
        fiber: 4,
        sodium: 5,
      },
      isAvailable: true,
      servingSize: "1 cup",
      preparationTime: 2,
      popularity: 95,
      rating: 4.8,
      reviews: 312,
    },
    {
      id: "M007",
      name: "Chocolate Chip Cookie",
      description: "Fresh-baked chocolate chip cookie with sea salt",
      price: 2.49,
      category: "Desserts",
      dietaryTags: ["vegetarian"],
      allergens: ["gluten", "dairy", "eggs"],
      nutrition: {
        calories: 280,
        protein: 3,
        carbs: 38,
        fat: 14,
        fiber: 1,
        sodium: 180,
      },
      isAvailable: true,
      servingSize: "1 cookie",
      preparationTime: 1,
      popularity: 88,
      rating: 4.6,
      reviews: 423,
    },
    {
      id: "M008",
      name: "Halal Chicken Tikka Masala",
      description:
        "Tender chicken in rich tomato-based curry sauce with basmati rice",
      price: 10.49,
      category: "Hot Meals",
      dietaryTags: ["halal", "gluten-free"],
      allergens: ["dairy"],
      nutrition: {
        calories: 580,
        protein: 32,
        carbs: 58,
        fat: 24,
        fiber: 4,
        sodium: 720,
      },
      isAvailable: true,
      servingSize: "1 plate",
      preparationTime: 10,
      popularity: 82,
      rating: 4.5,
      reviews: 98,
    },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [orders, setOrders] = useState<PreOrder[]>([
    {
      id: "ORD001",
      studentId: "S001",
      studentName: "Emma Johnson",
      grade: "11",
      items: [
        { menuItem: menuItems[0], quantity: 1 },
        { menuItem: menuItems[5], quantity: 1 },
      ],
      pickupDate: new Date(Date.now() + 86400000),
      pickupTime: "12:15",
      mealType: "lunch",
      status: "submitted",
      totalAmount: 12.98,
      paymentMethod: "Student Card",
      paymentStatus: "completed",
      dietaryPreferences: ["none"],
      allergies: [],
      createdAt: new Date(Date.now() - 86400000),
      pickupLocation: "Main Cafeteria - Counter A",
      confirmationCode: "CF-240315-001",
    },
    {
      id: "ORD002",
      studentId: "S001",
      studentName: "Emma Johnson",
      grade: "11",
      items: [
        { menuItem: menuItems[2], quantity: 1 },
        { menuItem: menuItems[6], quantity: 2 },
      ],
      pickupDate: new Date(Date.now() + 172800000),
      pickupTime: "12:30",
      mealType: "lunch",
      status: "draft",
      totalAmount: 14.47,
      paymentMethod: "Pending",
      paymentStatus: "pending",
      dietaryPreferences: ["vegan"],
      allergies: [],
      createdAt: new Date(),
      pickupLocation: "Main Cafeteria - Counter B",
      confirmationCode: "DRAFT",
    },
  ]);

  const [nutritionGoals] = useState<NutritionGoal>({
    calories: 600,
    protein: 25,
    carbs: 75,
    fat: 25,
  });

  const mealTypeLabels: Record<MealType, string> = {
    breakfast: "Breakfast (7:00 - 9:00 AM)",
    lunch: "Lunch (11:00 AM - 2:00 PM)",
    snack: "Afternoon Snack (2:30 - 4:00 PM)",
    dinner: "Dinner (5:00 - 7:00 PM)",
  };

  const statusColors: Record<OrderStatus, string> = {
    draft: "bg-slate-100 text-slate-700",
    submitted: "bg-blue-100 text-blue-700",
    preparing: "bg-amber-100 text-amber-700",
    ready: "bg-green-100 text-green-700",
    completed: "bg-slate-100 text-slate-600",
    cancelled: "bg-red-100 text-red-700",
  };

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category)),
  );

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesDietary =
      activeFilters.length === 0 ||
      activeFilters.every((filter) => item.dietaryTags.includes(filter));
    const matchesPreferences =
      dietaryPreferences.includes("none") ||
      dietaryPreferences.every((pref) => item.dietaryTags.includes(pref));
    const matchesAllergies = !allergies.some((allergy) =>
      item.allergens.includes(allergy.toLowerCase()),
    );
    return (
      matchesSearch &&
      matchesCategory &&
      matchesDietary &&
      matchesPreferences &&
      matchesAllergies
    );
  });

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id
            ? { ...c, quantity: c.quantity + quantity }
            : c,
        );
      }
      return [...prev, { menuItem: item, quantity }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((c) => {
            if (c.menuItem.id === itemId) {
              const newQuantity = Math.max(0, c.quantity + delta);
              return newQuantity === 0 ? null : { ...c, quantity: newQuantity };
            }
            return c;
          })
          .filter(Boolean) as CartItem[],
    );
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0,
  );
  const cartCalories = cart.reduce(
    (sum, item) => sum + item.menuItem.nutrition.calories * item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckout(true);
  };

  const submitOrder = () => {
    const order: PreOrder = {
      id: `ORD${Date.now()}`,
      studentId: userId,
      studentName: "Current User",
      grade: "11",
      items: cart,
      pickupDate: selectedDate,
      pickupTime: "12:00",
      mealType: selectedMealType,
      status: "submitted",
      totalAmount: cartTotal,
      paymentMethod: "Student Card",
      paymentStatus: "completed",
      dietaryPreferences,
      allergies,
      createdAt: new Date(),
      pickupLocation: "Main Cafeteria",
      confirmationCode: `CF-${Date.now().toString().slice(-6)}`,
    };

    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setShowCheckout(false);
    setActiveTab("orders");
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3 font-bold text-3xl text-slate-900">
            <Utensils className="h-8 w-8 text-orange-500" />
            Cafeteria Pre-Ordering
          </h2>
          <p className="mt-1 text-slate-600">
            Order meals in advance and skip the line
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDietaryFilters(!showDietaryFilters)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Heart className="h-4 w-4" />
            Dietary Preferences
          </button>
          <button
            onClick={() => setActiveTab("cart")}
            className="relative flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
            {cart.length > 0 && (
              <span className="-top-2 -right-2 absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {showDietaryFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-xl border border-orange-200 bg-orange-50 p-6"
        >
          <h3 className="mb-3 font-semibold text-orange-900">
            Dietary Preferences
          </h3>
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              "vegetarian",
              "vegan",
              "gluten-free",
              "dairy-free",
              "nut-free",
              "halal",
              "kosher",
              "none",
            ].map((restriction) => (
              <button
                key={restriction}
                onClick={() => {
                  if (restriction === "none") {
                    setDietaryPreferences(["none"]);
                  } else {
                    setDietaryPreferences((prev) =>
                      prev.includes("none")
                        ? [restriction as DietaryRestriction]
                        : prev.includes(restriction as DietaryRestriction)
                          ? prev.filter((r) => r !== restriction)
                          : [...prev, restriction as DietaryRestriction],
                    );
                  }
                }}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  dietaryPreferences.includes(restriction as DietaryRestriction)
                    ? "bg-orange-500 text-white"
                    : "border border-orange-200 bg-white text-slate-700"
                }`}
              >
                {restriction.charAt(0).toUpperCase() +
                  restriction.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>

          <h3 className="mb-3 font-semibold text-orange-900">Filter Menu By</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "vegetarian",
              "vegan",
              "gluten-free",
              "dairy-free",
              "nut-free",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilters((prev) =>
                    prev.includes(filter as DietaryRestriction)
                      ? prev.filter((f) => f !== filter)
                      : [...prev, filter as DietaryRestriction],
                  );
                }}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  activeFilters.includes(filter as DietaryRestriction)
                    ? "bg-orange-500 text-white"
                    : "border border-orange-200 bg-white text-slate-700"
                }`}
              >
                {filter.charAt(0).toUpperCase() +
                  filter.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex gap-2 border-slate-200 border-b">
        {[
          { id: "menu", label: "Menu", icon: Utensils },
          { id: "cart", label: "My Cart", icon: ShoppingCart },
          { id: "orders", label: "My Orders", icon: Calendar },
          { id: "nutrition", label: "Nutrition", icon: Heart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-orange-600 border-b-2 text-orange-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.id === "cart" && cart.length > 0 && (
              <span className="ml-1 rounded-full bg-orange-500 px-2 py-0.5 text-white text-xs">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "menu" && (
        <>
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block font-medium text-slate-700 text-sm">
                Pickup Date
              </label>
              <input
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block font-medium text-slate-700 text-sm">
                Meal Type
              </label>
              <select
                value={selectedMealType}
                onChange={(e) =>
                  setSelectedMealType(e.target.value as MealType)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {Object.entries(mealTypeLabels).map(([type, label]) => (
                  <option key={type} value={type}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-slate-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedCategory(e.target.value)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                    <Utensils className="h-16 w-16 text-orange-400" />
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold text-lg text-slate-900">
                        {item.name}
                      </h3>
                      <span className="font-bold text-orange-600 text-xl">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="mb-3 line-clamp-2 text-slate-600 text-sm">
                      {item.description}
                    </p>

                    <div className="mb-3 flex flex-wrap gap-1">
                      {item.dietaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-green-100 px-2 py-0.5 text-green-700 text-xs"
                        >
                          {tag.replace("-", " ")}
                        </span>
                      ))}
                    </div>

                    <div className="mb-4 flex items-center gap-4 text-slate-500 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {item.nutrition.calories} cal
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        {item.rating}
                      </span>
                      <span>{item.preparationTime} min</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-700 text-sm transition-colors hover:bg-slate-50"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => addToCart(item)}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-orange-500 px-3 py-2 text-sm text-white transition-colors hover:bg-orange-600"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {activeTab === "cart" && (
        <div className="space-y-6">
          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <h3 className="mb-2 font-semibold text-slate-900 text-xl">
                Your cart is empty
              </h3>
              <p className="mb-4 text-slate-600">
                Add items from the menu to get started
              </p>
              <button
                onClick={() => setActiveTab("menu")}
                className="rounded-lg bg-orange-500 px-6 py-3 text-white transition-colors hover:bg-orange-600"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="border-slate-200 border-b p-6">
                  <h3 className="font-bold text-slate-900 text-xl">
                    Your Order
                  </h3>
                  <p className="text-slate-600">
                    Pickup: {selectedDate.toLocaleDateString()} at{" "}
                    {mealTypeLabels[selectedMealType]}
                  </p>
                </div>
                <div className="divide-y divide-slate-200">
                  {cart.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="flex items-center gap-4 p-6"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-orange-100">
                        <Utensils className="h-8 w-8 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">
                          {item.menuItem.name}
                        </h4>
                        <p className="text-slate-600 text-sm">
                          ${item.menuItem.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, -1)}
                          className="rounded border border-slate-300 p-1 hover:bg-slate-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, 1)}
                          className="rounded border border-slate-300 p-1 hover:bg-slate-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="min-w-[100px] text-right">
                        <p className="font-semibold text-slate-900">
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.menuItem.id)}
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-slate-200 border-t bg-slate-50 p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-slate-600">Total Calories</span>
                    <span className="font-semibold text-slate-900">
                      {cartCalories} cal
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xl">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-orange-600">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full rounded-xl bg-orange-500 px-6 py-4 font-semibold text-lg text-white transition-colors hover:bg-orange-600"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md"
            >
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-bold text-lg text-slate-900">
                        Order #{order.confirmationCode}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${statusColors[order.status]}`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      {order.pickupDate.toLocaleDateString()} •{" "}
                      {mealTypeLabels[order.mealType]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-slate-900">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm ${order.paymentStatus === "completed" ? "text-green-600" : "text-amber-600"}`}
                    >
                      {order.paymentStatus === "completed"
                        ? "✓ Paid"
                        : "Payment Pending"}
                    </p>
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-700">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span className="text-slate-500">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-slate-200 border-t pt-4">
                  <div className="text-slate-500 text-sm">
                    <span className="flex items-center gap-1">
                      <Utensils className="h-4 w-4" />
                      Pickup: {order.pickupLocation}
                    </span>
                  </div>
                  {order.status === "draft" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="rounded-lg px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setCart(order.items);
                          setActiveTab("cart");
                        }}
                        className="rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
                      >
                        Complete Order
                      </button>
                    </div>
                  )}
                  {(order.status === "submitted" ||
                    order.status === "preparing") && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="rounded-lg px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "nutrition" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="mb-4 font-bold text-slate-900 text-xl">
              Daily Nutrition Goals
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                {
                  label: "Calories",
                  value: nutritionGoals.calories,
                  current: cartCalories,
                  unit: "cal",
                },
                {
                  label: "Protein",
                  value: nutritionGoals.protein,
                  current: 0,
                  unit: "g",
                },
                {
                  label: "Carbs",
                  value: nutritionGoals.carbs,
                  current: 0,
                  unit: "g",
                },
                {
                  label: "Fat",
                  value: nutritionGoals.fat,
                  current: 0,
                  unit: "g",
                },
              ].map((goal) => (
                <div
                  key={goal.label}
                  className="rounded-lg bg-slate-50 p-4 text-center"
                >
                  <p className="mb-1 text-slate-500 text-sm">{goal.label}</p>
                  <p className="font-bold text-2xl text-slate-900">
                    {goal.current}/{goal.value} {goal.unit}
                  </p>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-orange-500"
                      style={{
                        width: `${Math.min(100, (goal.current / goal.value) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {cart.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 font-bold text-slate-900 text-xl">
                Current Cart Nutrition
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-orange-50 p-4">
                  <p className="mb-1 text-orange-600 text-sm">Total Calories</p>
                  <p className="font-bold text-2xl text-orange-900">
                    {cartCalories}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="mb-1 text-blue-600 text-sm">Protein</p>
                  <p className="font-bold text-2xl text-blue-900">
                    {cart.reduce(
                      (sum, item) =>
                        sum + item.menuItem.nutrition.protein * item.quantity,
                      0,
                    )}
                    g
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="mb-1 text-green-600 text-sm">Carbs</p>
                  <p className="font-bold text-2xl text-green-900">
                    {cart.reduce(
                      (sum, item) =>
                        sum + item.menuItem.nutrition.carbs * item.quantity,
                      0,
                    )}
                    g
                  </p>
                </div>
                <div className="rounded-lg bg-yellow-50 p-4">
                  <p className="mb-1 text-sm text-yellow-600">Fat</p>
                  <p className="font-bold text-2xl text-yellow-900">
                    {cart.reduce(
                      (sum, item) =>
                        sum + item.menuItem.nutrition.fat * item.quantity,
                      0,
                    )}
                    g
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
              <Utensils className="h-24 w-24 text-orange-400" />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 rounded-full bg-white/50 p-2 transition-colors hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="mb-2 font-bold text-2xl text-slate-900">
                {selectedItem.name}
              </h3>
              <p className="mb-3 font-bold text-orange-600 text-xl">
                ${selectedItem.price.toFixed(2)}
              </p>
              <p className="mb-4 text-slate-700">{selectedItem.description}</p>

              <div className="mb-4 flex flex-wrap gap-2">
                {selectedItem.dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-green-100 px-2 py-1 text-green-700 text-sm"
                  >
                    {tag.replace("-", " ")}
                  </span>
                ))}
                {selectedItem.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="rounded-full bg-red-100 px-2 py-1 text-red-700 text-sm"
                  >
                    Contains: {allergen}
                  </span>
                ))}
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Calories</p>
                  <p className="font-semibold text-lg text-slate-900">
                    {selectedItem.nutrition.calories}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Protein</p>
                  <p className="font-semibold text-lg text-slate-900">
                    {selectedItem.nutrition.protein}g
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Carbs</p>
                  <p className="font-semibold text-lg text-slate-900">
                    {selectedItem.nutrition.carbs}g
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500 text-sm">Fat</p>
                  <p className="font-semibold text-lg text-slate-900">
                    {selectedItem.nutrition.fat}g
                  </p>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  <span className="font-semibold">{selectedItem.rating}</span>
                  <span className="text-slate-500">
                    ({selectedItem.reviews} reviews)
                  </span>
                </div>
                <span className="text-slate-500">
                  • {selectedItem.preparationTime} min prep
                </span>
              </div>

              <button
                onClick={() => {
                  addToCart(selectedItem);
                  setSelectedItem(null);
                }}
                className="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Add to Cart - ${selectedItem.price.toFixed(2)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showCheckout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCheckout(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl bg-white"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="border-slate-200 border-b p-6">
              <h3 className="font-bold text-slate-900 text-xl">
                Confirm Order
              </h3>
            </div>
            <div className="space-y-4 p-6">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="mb-1 text-slate-500 text-sm">Pickup Details</p>
                <p className="font-semibold text-slate-900">
                  {selectedDate.toLocaleDateString()}
                </p>
                <p className="text-slate-600">
                  {mealTypeLabels[selectedMealType]}
                </p>
                <p className="text-slate-600">Main Cafeteria</p>
              </div>

              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="font-semibold">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-slate-200 border-t pt-4">
                <div className="flex items-center justify-between text-xl">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-orange-600">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-blue-800 text-sm">
                  Payment will be charged to your Student Card
                </p>
              </div>
            </div>
            <div className="flex gap-3 border-slate-200 border-t p-6">
              <button
                onClick={submitOrder}
                className="flex-1 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Place Order
              </button>
              <button
                onClick={() => setShowCheckout(false)}
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Back to Cart
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
