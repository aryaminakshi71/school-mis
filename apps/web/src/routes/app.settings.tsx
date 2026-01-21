import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Building,
  Mail,
  Phone,
  MapPin,
  Save,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportToCSV, downloadTemplate } from "@/lib/csv";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  const [schoolInfo, setSchoolInfo] = useState({
    name: "Springfield High School",
    email: "contact@springfield.edu",
    phone: "+91 98765 43210",
    address: "123 Education Lane, Springfield",
    website: "www.springfield.edu",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    feeReminders: true,
    attendanceAlerts: true,
    examNotifications: true,
  });

  const [academicSettings, setAcademicSettings] = useState({
    currentSession: "2025-2026",
    examPattern: "Semester",
    gradingSystem: "Percentage",
    workingDays: "Monday - Saturday",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Settings saved successfully");
    setSaving(false);
  };

  const handleExportStudents = () => {
    const mockStudents = [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john@email.com",
        className: "Class 9-A",
        fatherName: "James Smith",
        fatherPhone: "555-1001",
      },
    ];
    exportToCSV(mockStudents, {
      filename: "students-export",
      columnHeaders: [
        "firstName",
        "lastName",
        "email",
        "className",
        "fatherName",
        "fatherPhone",
      ],
    });
    toast.success("Students exported successfully");
  };

  const handleExportTemplate = () => {
    downloadTemplate(
      [
        "firstName",
        "lastName",
        "email",
        "className",
        "fatherName",
        "fatherPhone",
      ],
      {
        firstName: "John",
        lastName: "Doe",
        email: "john@email.com",
        className: "Class 9-A",
        fatherName: "James Doe",
        fatherPhone: "555-1234",
      },
      "students-import",
    );
    toast.success("Template downloaded");
  };

  const tabs = [
    { id: "general", label: "General", icon: Building },
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "data", label: "Data Management", icon: Download },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your school and account settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          {activeTab === "general" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name
                  </label>
                  <Input
                    value={schoolInfo.name}
                    onChange={(e) =>
                      setSchoolInfo({ ...schoolInfo, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={schoolInfo.email}
                      onChange={(e) =>
                        setSchoolInfo({ ...schoolInfo, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input
                      value={schoolInfo.phone}
                      onChange={(e) =>
                        setSchoolInfo({ ...schoolInfo, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input
                    value={schoolInfo.address}
                    onChange={(e) =>
                      setSchoolInfo({ ...schoolInfo, address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <Input
                    value={schoolInfo.website}
                    onChange={(e) =>
                      setSchoolInfo({ ...schoolInfo, website: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Admin Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    A
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Admin User</p>
                    <p className="text-sm text-gray-500">
                      admin@springfield.edu
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input defaultValue="Admin" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input defaultValue="User" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input type="email" defaultValue="admin@springfield.edu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <Input defaultValue="+91 98765 43210" />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "emailAlerts",
                    label: "Email Alerts",
                    desc: "Receive alerts via email",
                  },
                  {
                    key: "smsAlerts",
                    label: "SMS Alerts",
                    desc: "Receive alerts via SMS",
                  },
                  {
                    key: "feeReminders",
                    label: "Fee Reminders",
                    desc: "Send fee payment reminders",
                  },
                  {
                    key: "attendanceAlerts",
                    label: "Attendance Alerts",
                    desc: "Alert for low attendance",
                  },
                  {
                    key: "examNotifications",
                    label: "Exam Notifications",
                    desc: "Exam schedule notifications",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          notifications[item.key as keyof typeof notifications]
                        }
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">
                    Change Password
                  </p>
                  <div className="space-y-3">
                    <Input type="password" placeholder="Current Password" />
                    <Input type="password" placeholder="New Password" />
                    <Input type="password" placeholder="Confirm New Password" />
                    <Button>Update Password</Button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "data" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">Student Data</p>
                  <p className="text-sm text-gray-500 mb-3">
                    Export or import student data in CSV format
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleExportStudents}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Students
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleExportTemplate}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Download Template
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">Teacher Data</p>
                  <p className="text-sm text-gray-500 mb-3">
                    Export teacher information
                  </p>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Teachers
                  </Button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">Fee Records</p>
                  <p className="text-sm text-gray-500 mb-3">
                    Export fee collection records
                  </p>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Fee Records
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
