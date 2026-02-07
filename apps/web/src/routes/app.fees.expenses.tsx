
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
    PieChart,
    FileText,
    Receipt,
    CreditCard,
    ArrowDownRight,
    Calculator,
    Building,
    Plus,
    Search,
    Filter,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/fees/expenses")({
    component: ExpensesPage,
});

// Sub-features navigation
const subFeatures = [
    { name: "Dashboard", href: "/app/fees", icon: PieChart },
    { name: "Fee Structure", href: "/app/fees/structure", icon: FileText },
    { name: "Collection", href: "/app/fees/collection", icon: Receipt },
    { name: "Online Payment", href: "/app/fees/payment", icon: CreditCard },
    { name: "Expenses", href: "/app/fees/expenses", icon: ArrowDownRight, active: true },
    { name: "Salary", href: "/app/fees/salary", icon: Calculator },
    { name: "Budget", href: "/app/fees/budget", icon: Building },
    { name: "Reports", href: "/app/fees/reports", icon: FileText },
];

function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({
        category: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "Bank Transfer",
        paidTo: "",
    });

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const data = await api.expenses.list();
            setExpenses(data);
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
            toast.error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category || !formData.description || !formData.amount) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setSubmitting(true);
            await api.expenses.create(formData);
            toast.success("Expense added successfully");
            setIsDialogOpen(false);

            // Reset form
            setFormData({
                category: "",
                description: "",
                amount: "",
                date: new Date().toISOString().split("T")[0],
                paymentMethod: "Bank Transfer",
                paidTo: "",
            });

            // Refresh list
            fetchExpenses();
        } catch (error) {
            console.error("Failed to create expense:", error);
            toast.error("Failed to add expense");
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate stats
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const filteredExpenses = expenses.filter(e =>
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.paidTo?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Expense Management</h1>
                    <p className="text-muted-foreground">
                        Track and manage school expenditures and operational costs.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Expense
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Expense</DialogTitle>
                                <DialogDescription>
                                    Record a new expenditure for the school.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category *</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(val) => handleSelectChange("category", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Salary">Salary</SelectItem>
                                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                                                <SelectItem value="Utilities">Utilities</SelectItem>
                                                <SelectItem value="Supplies">Supplies</SelectItem>
                                                <SelectItem value="Transport">Transport</SelectItem>
                                                <SelectItem value="Events">Events</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="paymentMethod">Payment Method</Label>
                                        <Select
                                            value={formData.paymentMethod}
                                            onValueChange={(val) => handleSelectChange("paymentMethod", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Cash">Cash</SelectItem>
                                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                                <SelectItem value="Cheque">Cheque</SelectItem>
                                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                                <SelectItem value="UPI">UPI</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Electricity Bill for Jan"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount (₹) *</Label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date *</Label>
                                        <Input
                                            id="date"
                                            name="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="paidTo">Paid To (Vendor/Person)</Label>
                                    <Input
                                        id="paidTo"
                                        name="paidTo"
                                        value={formData.paidTo}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Electric Board"
                                    />
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={submitting}>
                                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Expense
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Sub-features Navigation */}
            <div className="border-b">
                <nav className="flex gap-1 overflow-x-auto pb-px">
                    {subFeatures.map((feature) => (
                        <a
                            key={feature.name}
                            href={feature.href}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${feature.active
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <feature.icon className="h-4 w-4" />
                            {feature.name}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <div className="p-2 rounded-lg bg-red-100">
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">All time expenditure</p>
                    </CardContent>
                </Card>
                {/* Placeholder stats */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <div className="p-2 rounded-lg bg-red-100">
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{(totalExpenses * 0.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <p className="text-xs text-muted-foreground">Approx. monthly avg</p>
                    </CardContent>
                </Card>
            </div>

            {/* Expense List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Expense History</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search expenses..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <Receipt className="mx-auto h-10 w-10 mb-3 opacity-20" />
                            <p>No expenses found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredExpenses.map((expense) => (
                                <div
                                    key={expense.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-full bg-red-100">
                                            <ArrowDownRight className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-foreground">{expense.description}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Badge variant="outline">{expense.category}</Badge>
                                                <span>•</span>
                                                <span>{new Date(expense.date).toLocaleDateString()}</span>
                                                {expense.paidTo && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{expense.paidTo}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-red-600">-₹{Number(expense.amount).toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">{expense.paymentMethod}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
