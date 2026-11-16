import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  Box,
  Calendar,
  Camera,
  CheckCircle,
  Key,
  MapPin,
  Plus,
  Search,
  Shirt,
  Smartphone,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";

interface LostItem {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  dateLost: string;
  image?: string;
  status: "lost" | "found" | "claimed";
  reportedBy: {
    id: string;
    name: string;
    type: "student" | "parent" | "staff";
  };
  foundBy?: {
    id: string;
    name: string;
  };
  foundDate?: string;
  foundLocation?: string;
  claimedBy?: {
    id: string;
    name: string;
  };
  claimedDate?: string;
  verificationQuestions?: string[];
  distinctiveMarks?: string;
}

interface LostAndFoundProps {
  className?: string;
}

const defaultItems: LostItem[] = [
  {
    id: "1",
    name: "Blue Water Bottle",
    description: "Steel water bottle with school logo sticker",
    category: "personal",
    location: "Classroom 10-A",
    dateLost: "2024-03-25",
    status: "found",
    reportedBy: { id: "s1", name: "Rahul Kumar", type: "student" },
    foundBy: { id: "t1", name: "Mrs. Sharma" },
    foundDate: "2024-03-26",
    foundLocation: "Staff Room",
    distinctiveMarks: "Dent on bottom, school sticker",
  },
  {
    id: "2",
    name: "Black Wallet",
    description: "Leather wallet containing ID cards and some cash",
    category: "valuable",
    location: "Cafeteria",
    dateLost: "2024-03-28",
    status: "lost",
    reportedBy: { id: "s2", name: "Priya Sharma", type: "student" },
    distinctiveMarks: "Brown leather with eagle emblem",
    verificationQuestions: [
      "What cards are inside?",
      "How much cash approximately?",
    ],
  },
  {
    id: "3",
    name: "Math Textbook - Class 10",
    description: "NCERT Mathematics textbook with notes",
    category: "academic",
    location: "Library",
    dateLost: "2024-03-27",
    status: "found",
    reportedBy: { id: "s3", name: "Amit Singh", type: "student" },
    foundBy: { id: "l1", name: "Librarian" },
    foundDate: "2024-03-27",
    foundLocation: "Library Reading Area",
    claimedBy: { id: "s3", name: "Amit Singh" },
    claimedDate: "2024-03-28",
    distinctiveMarks: "Name written on first page: Amit Singh",
  },
  {
    id: "4",
    name: "School ID Card",
    description: "Student ID card with lanyard",
    category: "valuable",
    location: "School Bus",
    dateLost: "2024-03-29",
    status: "found",
    reportedBy: { id: "p1", name: "Parent", type: "parent" },
    foundBy: { id: "d1", name: "Bus Driver" },
    foundDate: "2024-03-29",
    foundLocation: "Bus Route 5",
    distinctiveMarks: "Photo on card, name: Rahul Kumar",
  },
  {
    id: "5",
    name: "Blue Hoodie Jacket",
    description: "Navy blue hoodie with zip, size M",
    category: "clothing",
    location: "Sports Ground",
    dateLost: "2024-03-26",
    status: "lost",
    reportedBy: { id: "s4", name: "Vikram", type: "student" },
    distinctiveMarks: "Nike logo, initials VS written inside",
  },
];

const categories = [
  { id: "all", name: "All Items", icon: Box },
  { id: "academic", name: "Books & Academic", icon: BookOpen },
  { id: "electronics", name: "Electronics", icon: Smartphone },
  { id: "valuable", name: "Valuables & IDs", icon: Wallet },
  { id: "clothing", name: "Clothing", icon: Shirt },
  { id: "personal", name: "Personal Items", icon: Key },
];

const statusColors: Record<string, string> = {
  lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  found:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  claimed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function LostAndFound({ className }: LostAndFoundProps) {
  const [items, setItems] = useState<LostItem[]>(defaultItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimAnswers, setClaimAnswers] = useState<string[]>(["", ""]);

  const lostCount = items.filter((i) => i.status === "lost").length;
  const foundCount = items.filter((i) => i.status === "found").length;
  const claimedCount = items.filter((i) => i.status === "claimed").length;

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const reportItem = (formData: FormData) => {
    const newItem: LostItem = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      location: formData.get("location") as string,
      dateLost: new Date().toISOString().split("T")[0],
      status: "lost",
      reportedBy: { id: "me", name: "You", type: "student" },
      distinctiveMarks: formData.get("marks") as string,
    };
    setItems([newItem, ...items]);
    setShowReportModal(false);
  };

  const claimItem = () => {
    if (!selectedItem) return;
    setItems(
      items.map((i) =>
        i.id === selectedItem.id
          ? {
              ...i,
              status: "claimed",
              claimedBy: { id: "me", name: "You" },
              claimedDate: new Date().toISOString().split("T")[0],
            }
          : i,
      ),
    );
    setShowClaimModal(false);
    setSelectedItem(null);
    setClaimAnswers(["", ""]);
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
            <Box className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
              Lost & Found
            </h2>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              {lostCount} lost • {foundCount} found • {claimedCount} claimed
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Report Lost Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Lost</p>
              <p className="font-bold text-2xl text-red-600">{lostCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Found</p>
              <p className="font-bold text-2xl text-yellow-600">{foundCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <CheckCircle className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Claimed</p>
              <p className="font-bold text-2xl text-green-600">
                {claimedCount}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <User className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search lost items..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                selectedCategory === cat.id
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedStatus(null)}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              !selectedStatus
                ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800"
            }`}
          >
            All Status
          </button>
          {["lost", "found", "claimed"].map((status) => (
            <button
              key={status}
              onClick={() =>
                setSelectedStatus(selectedStatus === status ? null : status)
              }
              className={`rounded-full px-3 py-1.5 text-sm capitalize transition-colors ${
                selectedStatus === status
                  ? statusColors[status]
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              setSelectedItem(item);
              setShowItemDetail(true);
            }}
            className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Box className="h-12 w-12 text-orange-400" />
              )}
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[item.status]}`}
                >
                  {item.status}
                </span>
                <span className="text-gray-500 text-xs">{item.dateLost}</span>
              </div>
              <h4 className="mb-1 font-semibold text-gray-900 dark:text-white">
                {item.name}
              </h4>
              <p className="mb-3 line-clamp-2 text-gray-500 text-sm">
                {item.description}
              </p>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <MapPin className="h-3 w-3" />
                {item.location}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          <Box className="mx-auto mb-4 h-16 w-16 opacity-30" />
          <p className="font-medium text-lg">No items found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-lg">Report Lost Item</h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="rounded p-1 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  reportItem(new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1 block font-medium text-sm">
                    Item Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-lg bg-gray-100 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-sm">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full rounded-lg bg-gray-100 px-3 py-2"
                  >
                    <option value="academic">Books & Academic</option>
                    <option value="electronics">Electronics</option>
                    <option value="valuable">Valuables & IDs</option>
                    <option value="clothing">Clothing</option>
                    <option value="personal">Personal Items</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-sm">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full rounded-lg bg-gray-100 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-sm">
                    Last Seen Location
                  </label>
                  <input
                    name="location"
                    type="text"
                    required
                    className="w-full rounded-lg bg-gray-100 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-sm">
                    Distinctive Marks
                  </label>
                  <input
                    name="marks"
                    type="text"
                    placeholder="Scratches, stickers, names, etc."
                    className="w-full rounded-lg bg-gray-100 px-3 py-2"
                  />
                </div>
                <div className="rounded-lg border-2 border-gray-300 border-dashed p-4 text-center">
                  <Camera className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 text-sm">
                    Upload photo (optional)
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-orange-500 py-3 text-white hover:bg-orange-600"
                >
                  Submit Report
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {showItemDetail && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-gray-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${statusColors[selectedItem.status]}`}
                >
                  {selectedItem.status}
                </span>
                <button
                  onClick={() => setShowItemDetail(false)}
                  className="rounded p-1 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <h3 className="mb-2 font-semibold text-xl">
                {selectedItem.name}
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {selectedItem.description}
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>Lost at: {selectedItem.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Date: {selectedItem.dateLost}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Reported by: {selectedItem.reportedBy.name}</span>
                </div>
                {selectedItem.distinctiveMarks && (
                  <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                    <p className="font-medium text-yellow-800 dark:text-yellow-400">
                      Distinctive Marks:
                    </p>
                    <p>{selectedItem.distinctiveMarks}</p>
                  </div>
                )}
                {selectedItem.status === "found" && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Found by: {selectedItem.foundBy?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>Found at: {selectedItem.foundLocation}</span>
                    </div>
                  </>
                )}
              </div>
              {selectedItem.status === "found" && (
                <button
                  onClick={() => {
                    setShowItemDetail(false);
                    setShowClaimModal(true);
                  }}
                  className="mt-6 w-full rounded-xl bg-green-500 py-3 text-white hover:bg-green-600"
                >
                  Claim This Item
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claim Modal */}
      <AnimatePresence>
        {showClaimModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800"
            >
              <h3 className="mb-2 font-semibold text-lg">Verify Ownership</h3>
              <p className="mb-4 text-gray-600">
                Please answer the following questions to verify this is your
                item:
              </p>
              <div className="space-y-4">
                {selectedItem.verificationQuestions?.map((q, idx) => (
                  <div key={idx}>
                    <label className="mb-1 block font-medium text-sm">
                      {q}
                    </label>
                    <input
                      type="text"
                      value={claimAnswers[idx]}
                      onChange={(e) => {
                        const newAnswers = [...claimAnswers];
                        newAnswers[idx] = e.target.value;
                        setClaimAnswers(newAnswers);
                      }}
                      className="w-full rounded-lg bg-gray-100 px-3 py-2"
                    />
                  </div>
                )) || (
                  <div>
                    <label className="mb-1 block font-medium text-sm">
                      Describe distinctive marks on the item
                    </label>
                    <textarea
                      value={claimAnswers[0]}
                      onChange={(e) => {
                        const newAnswers = [...claimAnswers];
                        newAnswers[0] = e.target.value;
                        setClaimAnswers(newAnswers);
                      }}
                      rows={3}
                      className="w-full rounded-lg bg-gray-100 px-3 py-2"
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="flex-1 rounded-xl bg-gray-200 py-3 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={claimItem}
                  className="flex-1 rounded-xl bg-green-500 py-3 text-white hover:bg-green-600"
                >
                  Submit Claim
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
