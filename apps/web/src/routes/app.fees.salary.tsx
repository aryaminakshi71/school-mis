/**
 * Salary Management - Staff Salary Processing
 */

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
    Download,
    CheckCircle,
    Clock,
    Banknote,
    Users,
    Loader2,
    Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export const Route = createFileRoute("/app/fees/salary")({
    component: SalaryPage,
});

const subFeatures = [
    { name: "Dashboard", href: "/app/fees", icon: PieChart },
    { name: "Fee Structure", href: "/app/fees/structure", icon: FileText },
    { name: "Collection", href: "/app/fees/collection", icon: Receipt },
    { name: "Online Payment", href: "/app/fees/payment", icon: CreditCard },
    { name: "Expenses", href: "/app/fees/expenses", icon: ArrowDownRight },
    { name: "Salary", href: "/app/fees/salary", icon: Calculator, active: true },
    { name: "Budget", href: "/app/fees/budget", icon: Building },
    { name: "Reports", href: "/app/fees/reports", icon: FileText },
];

// Mock salary data (would come from backend)
const salaryRecords = [
    { id: "1", staffName: "Dr. Anil Kumar", designation: "Principal", department: "Administration", baseSalary: 85000, allowances: 15000, deductions: 8500, netSalary: 91500, status: "paid", month: "January 2026" },
    { id: "2", staffName: "Mrs. Priya Sharma", designation: "Teacher", department: "Mathematics", baseSalary: 45000, allowances: 8000, deductions: 4500, netSalary: 48500, status: "paid", month: "January 2026" },
    { id: "3", staffName: "Mr. Rajesh Singh", designation: "Teacher", department: "Science", baseSalary: 42000, allowances: 7000, deductions: 4200, netSalary: 44800, status: "pending", month: "January 2026" },
    { id: "4", staffName: "Ms. Anita Verma", designation: "Teacher", department: "English", baseSalary: 40000, allowances: 6000, deductions: 4000, netSalary: 42000, status: "pending", month: "January 2026" },
    { id: "5", staffName: "Mr. Suresh Yadav", designation: "Clerk", department: "Administration", baseSalary: 25000, allowances: 3000, deductions: 2500, netSalary: 25500, status: "paid", month: "January 2026" },
    { id: "6", staffName: "Mrs. Sunita Devi", designation: "Librarian", department: "Library", baseSalary: 30000, allowances: 4000, deductions: 3000, netSalary: 31000, status: "paid", month: "January 2026" },
];

function SalaryPage() {
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("2026-01");
    const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [salaryForm, setSalaryForm] = useState({
        staffId: "",
        baseSalary: "",
        allowances: "",
        deductions: "",
    });

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const data = await api.teachers.list();
                setTeachers(data);
            } catch (error) {
                console.error("Failed to fetch teachers:", error);
            }
        };
        fetchTeachers();
    }, []);

    const filteredRecords = salaryRecords.filter((record) =>
        record.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleProcessSalary = async () => {
        setProcessing(true);
        // Simulate salary processing
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Salary processed successfully for selected staff");
        setProcessing(false);
        setIsProcessDialogOpen(false);
    };

    const stats = {
        totalStaff: salaryRecords.length,
        totalPayable: salaryRecords.reduce((sum, r) => sum + r.netSalary, 0),
        paid: salaryRecords.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.netSalary, 0),
        pending: salaryRecords.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.netSalary, 0),
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Salary Management</h1>
                    <p className="text-muted-foreground">
                        Process and manage staff salaries.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-40">
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2026-01">January 2026</SelectItem>
                            <SelectItem value="2025-12">December 2025</SelectItem>
                            <SelectItem value="2025-11">November 2025</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Banknote className="mr-2 h-4 w-4" />
                                Process Salary
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Process Salary</DialogTitle>
                                <DialogDescription>
                                    Process salary for selected staff members.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Select Staff</Label>
                                    <Select
                                        value={salaryForm.staffId}
                                        onValueChange={(val) => setSalaryForm({ ...salaryForm, staffId: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select staff member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Staff (Bulk Process)</SelectItem>
                                            {teachers.map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id}>
                                                    {teacher.firstName} {teacher.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Base Salary (₹)</Label>
                                        <Input
                                            type="number"
                                            placeholder="40000"
                                            value={salaryForm.baseSalary}
                                            onChange={(e) => setSalaryForm({ ...salaryForm, baseSalary: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Allowances (₹)</Label>
                                        <Input
                                            type="number"
                                            placeholder="5000"
                                            value={salaryForm.allowances}
                                            onChange={(e) => setSalaryForm({ ...salaryForm, allowances: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Deductions (₹)</Label>
                                        <Input
                                            type="number"
                                            placeholder="3000"
                                            value={salaryForm.deductions}
                                            onChange={(e) => setSalaryForm({ ...salaryForm, deductions: e.target.value })}
                                        />
                                    </div>
                                </div>
                                {salaryForm.baseSalary && (
                                    <div className="p-4 bg-secondary rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Net Salary</span>
                                            <span className="text-xl font-bold text-primary">
                                                ₹{(
                                                    Number(salaryForm.baseSalary || 0) +
                                                    Number(salaryForm.allowances || 0) -
                                                    Number(salaryForm.deductions || 0)
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsProcessDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleProcessSalary} disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Process Salary
                                </Button>
                            </DialogFooter>
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
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStaff}</div>
                        <p className="text-xs text-muted-foreground">Active employees</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Payable</CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{(stats.totalPayable / 1000).toFixed(0)}K</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Paid</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{(stats.paid / 1000).toFixed(0)}K</div>
                        <p className="text-xs text-muted-foreground">{salaryRecords.filter((r) => r.status === "paid").length} staff members</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">₹{(stats.pending / 1000).toFixed(0)}K</div>
                        <p className="text-xs text-muted-foreground">{salaryRecords.filter((r) => r.status === "pending").length} staff members</p>
                    </CardContent>
                </Card>
            </div>

            {/* Salary Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Salary Records</CardTitle>
                        <CardDescription>January 2026 salary details</CardDescription>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search staff..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-left text-sm text-muted-foreground">
                                    <th className="pb-3 font-medium">Staff Name</th>
                                    <th className="pb-3 font-medium">Designation</th>
                                    <th className="pb-3 font-medium">Department</th>
                                    <th className="pb-3 font-medium text-right">Base Salary</th>
                                    <th className="pb-3 font-medium text-right">Allowances</th>
                                    <th className="pb-3 font-medium text-right">Deductions</th>
                                    <th className="pb-3 font-medium text-right">Net Salary</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.map((record) => (
                                    <tr key={record.id} className="border-b last:border-0">
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <span className="text-xs font-medium">
                                                        {record.staffName
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </span>
                                                </div>
                                                <span className="font-medium">{record.staffName}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-sm text-muted-foreground">{record.designation}</td>
                                        <td className="py-3 text-sm text-muted-foreground">{record.department}</td>
                                        <td className="py-3 text-sm text-right">₹{record.baseSalary.toLocaleString()}</td>
                                        <td className="py-3 text-sm text-right text-green-600">+₹{record.allowances.toLocaleString()}</td>
                                        <td className="py-3 text-sm text-right text-red-600">-₹{record.deductions.toLocaleString()}</td>
                                        <td className="py-3 text-sm text-right font-semibold text-primary">₹{record.netSalary.toLocaleString()}</td>
                                        <td className="py-3">
                                            <Badge variant={record.status === "paid" ? "success" : "warning"}>
                                                {record.status}
                                            </Badge>
                                        </td>
                                        <td className="py-3">
                                            {record.status === "pending" ? (
                                                <Button size="sm">Pay</Button>
                                            ) : (
                                                <Button size="sm" variant="outline">View Slip</Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
