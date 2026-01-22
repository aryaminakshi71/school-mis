import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useTheme, Theme } from "@/lib/services/theme.service";
import { useLanguage, languages, Language } from "@/lib/services/i18n.service";
import { useNotifications } from "@/lib/services/notification.service";
import {
  useWidgetConfig,
  availableWidgets,
  WidgetConfig,
} from "@/lib/services/widget.service.tsx";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  LayoutGrid,
  Moon,
  Sun,
  Monitor,
  Check,
  ChevronRight,
  Plus,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme, resolvedTheme, toggleTheme, isDark, themes } =
    useTheme();
  const {
    language,
    setLanguage,
    t,
    languages: langList,
    currentLanguage,
    isRTL,
  } = useLanguage();
  const {
    notifications,
    unreadCount,
    hasPermission,
    requestPermission,
    markAllAsRead,
  } = useNotifications();
  const {
    allWidgets,
    updateWidget,
    toggleVisibility,
    removeWidget,
    addWidget,
    resetWidgets,
  } = useWidgetConfig(user?.id || "default");
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "language", label: "Language", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "widgets", label: "Dashboard Widgets", icon: LayoutGrid },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {tab.id === "notifications" && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === "profile" && <ProfileSettings user={user} />}
          {activeTab === "appearance" && (
            <AppearanceSettings
              theme={theme}
              setTheme={setTheme}
              toggleTheme={toggleTheme}
              isDark={isDark}
              themes={themes}
            />
          )}
          {activeTab === "language" && (
            <LanguageSettings
              currentLang={language}
              setLang={setLanguage}
              languages={langList}
              t={t}
              isRTL={isRTL}
            />
          )}
          {activeTab === "notifications" && (
            <NotificationSettings
              notifications={notifications}
              hasPermission={hasPermission}
              requestPermission={requestPermission}
              markAllAsRead={markAllAsRead}
            />
          )}
          {activeTab === "widgets" && (
            <WidgetSettings
              allWidgets={allWidgets}
              updateWidget={updateWidget}
              toggleVisibility={toggleVisibility}
              removeWidget={removeWidget}
              addWidget={addWidget}
              resetWidgets={resetWidgets}
            />
          )}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ user }: { user: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Full Name</label>
          <input
            type="text"
            defaultValue={user?.name || ""}
            className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Email Address</label>
          <input
            type="email"
            defaultValue={user?.email || ""}
            className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            defaultValue="+91 98765 43210"
            className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Role</label>
          <input
            type="text"
            value={user?.role || "Student"}
            disabled
            className="flex h-10 w-full rounded-lg border border-input bg-gray-100 px-3 py-2 text-sm capitalize"
          />
        </div>
        <Button onClick={() => toast.success("Profile updated successfully")}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}

function AppearanceSettings({
  theme,
  setTheme,
  toggleTheme,
  isDark,
  themes,
}: {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  themes: Theme[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance
        </CardTitle>
        <CardDescription>Customize how the application looks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-3 block">Theme Mode</label>
          <div className="grid grid-cols-3 gap-3">
            {(["light", "dark", "system"] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  theme === t
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {t === "light" ? (
                  <Sun className="w-6 h-6" />
                ) : t === "dark" ? (
                  <Moon className="w-6 h-6" />
                ) : (
                  <Monitor className="w-6 h-6" />
                )}
                <span className="text-sm font-medium capitalize">{t}</span>
                {theme === t && <Check className="w-4 h-4 text-blue-500" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block">Quick Toggle</label>
          <Button variant="outline" onClick={toggleTheme} className="w-full">
            {isDark ? (
              <Sun className="w-4 h-4 mr-2" />
            ) : (
              <Moon className="w-4 h-4 mr-2" />
            )}
            Switch to {isDark ? "Light" : "Dark"} Mode
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">
            Current theme:{" "}
            <span className="font-medium capitalize">{theme}</span>
            {theme === "system" && (
              <span className="ml-1">
                (detected: {isDark ? "dark" : "light"})
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function LanguageSettings({
  currentLang,
  setLang,
  languages: langList,
  t,
  isRTL,
}: {
  currentLang: Language;
  setLang: (l: Language) => void;
  languages: typeof langList;
  t: any;
  isRTL: boolean;
}) {
  const [search, setSearch] = useState("");

  const filteredLanguages = langList.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Language
        </CardTitle>
        <CardDescription>Choose your preferred language</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="text"
          placeholder="Search languages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm"
        />

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLang(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-colors ${
                currentLang === lang.code
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <div className="flex-1 text-left">
                <p className="font-medium">{lang.nativeName}</p>
                <p className="text-sm text-gray-500">{lang.name}</p>
              </div>
              {currentLang === lang.code && (
                <Check className="w-5 h-5 text-blue-500" />
              )}
              {lang.direction === "rtl" && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  RTL
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">
            Current language:{" "}
            <span className="font-medium">{currentLanguage?.nativeName}</span>
            <span className="ml-1">({currentLanguage?.name})</span>
            {isRTL && (
              <span className="ml-2 text-yellow-600">(Right-to-Left)</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationSettings({
  notifications,
  hasPermission,
  requestPermission,
  markAllAsRead,
}: {
  notifications: any[];
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  markAllAsRead: () => void;
}) {
  const [settings, setSettings] = useState({
    email: true,
    sms: true,
    push: false,
    attendance: true,
    fees: true,
    exams: true,
    homework: true,
    notices: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Notification Channels</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.checked })
                }
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive notifications via SMS
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.sms}
                onChange={(e) =>
                  setSettings({ ...settings, sms: e.target.checked })
                }
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">
                  Browser push notifications
                </p>
              </div>
              {hasPermission ? (
                <input
                  type="checkbox"
                  checked={settings.push}
                  onChange={(e) =>
                    setSettings({ ...settings, push: e.target.checked })
                  }
                  className="h-4 w-4"
                />
              ) : (
                <Button variant="outline" size="sm" onClick={requestPermission}>
                  Enable
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Notification Types</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "attendance", label: "Attendance Alerts" },
              { key: "fees", label: "Fee Reminders" },
              { key: "exams", label: "Exam Notifications" },
              { key: "homework", label: "Homework Updates" },
              { key: "notices", label: "School Notices" },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm">{label}</span>
                <input
                  type="checkbox"
                  checked={(settings as any)[key]}
                  onChange={(e) =>
                    setSettings({ ...settings, [key]: e.target.checked })
                  }
                  className="h-4 w-4"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Recent Notifications</p>
              <p className="text-sm text-gray-500">
                {notifications.length} notifications
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          </div>
        </div>

        <Button
          onClick={() => {
            toast.success("Notification settings saved");
          }}
        >
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}

function WidgetSettings({
  allWidgets,
  updateWidget,
  toggleVisibility,
  removeWidget,
  addWidget,
  resetWidgets,
}: {
  allWidgets: WidgetConfig[];
  updateWidget: any;
  toggleVisibility: any;
  removeWidget: any;
  addWidget: any;
  resetWidgets: any;
}) {
  const [showAddWidget, setShowAddWidget] = useState(false);

  const visibleWidgets = allWidgets.filter((w) => w.visible);
  const hiddenWidgets = allWidgets.filter((w) => !w.visible);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          Dashboard Widgets
        </CardTitle>
        <CardDescription>Customize your dashboard layout</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {visibleWidgets.length} of {allWidgets.length} widgets
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddWidget(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Widget
            </Button>
            <Button variant="outline" size="sm" onClick={resetWidgets}>
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {allWidgets.map((widget) => (
            <div
              key={widget.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                widget.visible
                  ? "bg-white border-gray-200"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{widget.title}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    widget.size === "large"
                      ? "bg-purple-100 text-purple-700"
                      : widget.size === "medium"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {widget.size}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVisibility(widget.id)}
                  className="p-2 rounded hover:bg-gray-100"
                  title={widget.visible ? "Hide" : "Show"}
                >
                  {widget.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="p-2 rounded hover:bg-red-100 text-gray-400 hover:text-red-600"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddWidget && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-3">Add Widget</h4>
            <div className="grid grid-cols-2 gap-2">
              {availableWidgets
                .filter((w) => !allWidgets.find((aw) => aw.type === w.type))
                .map((widget) => (
                  <button
                    key={widget.type}
                    onClick={() => {
                      addWidget(widget.type);
                      setShowAddWidget(false);
                      toast.success(`${widget.title} widget added`);
                    }}
                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <span className="font-medium text-sm">{widget.title}</span>
                    <Plus className="w-4 h-4 ml-auto" />
                  </button>
                ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddWidget(false)}
              className="mt-3"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security
        </CardTitle>
        <CardDescription>Manage your account security</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm mt-1"
            />
          </div>
          <Button variant="outline">Change Password</Button>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Active Sessions</p>
              <p className="text-sm text-gray-500">
                Manage your logged-in devices
              </p>
            </div>
            <Button variant="outline" size="sm">
              View Sessions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SettingsPage;
