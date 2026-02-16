import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { Language, useLanguage } from "@/lib/services/i18n.service";
import { useNotifications } from "@/lib/services/notification.service";
import { Theme, useTheme } from "@/lib/services/theme.service";
import {
  WidgetConfig,
  availableWidgets,
  useWidgetConfig,
} from "@/lib/services/widget.service.tsx";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Check,
  Eye,
  EyeOff,
  Globe,
  LayoutGrid,
  Monitor,
  Moon,
  Palette,
  Plus,
  Shield,
  Sun,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
        <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full flex-shrink-0 md:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
                {tab.id === "notifications" && unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-destructive px-2 py-0.5 text-destructive-foreground text-xs">
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
          <label className="font-medium text-sm">Full Name</label>
          <input
            type="text"
            defaultValue={user?.name || ""}
            className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-2">
          <label className="font-medium text-sm">Email Address</label>
          <input
            type="email"
            defaultValue={user?.email || ""}
            className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-2">
          <label className="font-medium text-sm">Phone Number</label>
          <input
            type="tel"
            defaultValue="+91 98765 43210"
            className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-2">
          <label className="font-medium text-sm">Role</label>
          <input
            type="text"
            value={user?.role || "Student"}
            disabled
            className="flex h-10 w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm capitalize"
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
          <label className="mb-3 block font-medium text-sm">Theme Mode</label>
          <div className="grid grid-cols-3 gap-3">
            {(["light", "dark", "system"] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                  theme === t
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border"
                }`}
              >
                {t === "light" ? (
                  <Sun className="h-6 w-6" />
                ) : t === "dark" ? (
                  <Moon className="h-6 w-6" />
                ) : (
                  <Monitor className="h-6 w-6" />
                )}
                <span className="font-medium text-sm capitalize">{t}</span>
                {theme === t && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block font-medium text-sm">Quick Toggle</label>
          <Button variant="outline" onClick={toggleTheme} className="w-full">
            {isDark ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            Switch to {isDark ? "Light" : "Dark"} Mode
          </Button>
        </div>

        <div className="border-t pt-4">
          <p className="text-muted-foreground text-sm">
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
          className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
        />

        <div className="max-h-96 space-y-2 overflow-y-auto">
          {filteredLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLang(lang.code)}
              className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 transition-colors ${
                currentLang === lang.code
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border"
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <div className="flex-1 text-left">
                <p className="font-medium">{lang.nativeName}</p>
                <p className="text-muted-foreground text-sm">{lang.name}</p>
              </div>
              {currentLang === lang.code && (
                <Check className="h-5 w-5 text-primary" />
              )}
              {lang.direction === "rtl" && (
                <span className="rounded bg-warning/15 px-2 py-1 text-warning text-xs">
                  RTL
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="border-t pt-4">
          <p className="text-muted-foreground text-sm">
            Current language:{" "}
            <span className="font-medium">{currentLanguage?.nativeName}</span>
            <span className="ml-1">({currentLanguage?.name})</span>
            {isRTL && (
              <span className="ml-2 text-warning">(Right-to-Left)</span>
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
          <h4 className="mb-3 font-medium">Notification Channels</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-muted-foreground text-sm">
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
                <p className="text-muted-foreground text-sm">
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
                <p className="text-muted-foreground text-sm">
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

        <div className="border-t pt-4">
          <h4 className="mb-3 font-medium">Notification Types</h4>
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
                className="flex items-center justify-between rounded-lg bg-muted p-3"
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

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Recent Notifications</p>
              <p className="text-muted-foreground text-sm">
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
          <p className="text-muted-foreground text-sm">
            Showing {visibleWidgets.length} of {allWidgets.length} widgets
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddWidget(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
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
              className={`flex items-center justify-between rounded-lg border p-4 ${
                widget.visible
                  ? "border-border bg-card"
                  : "border-border bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{widget.title}</span>
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    widget.size === "large"
                      ? "bg-primary/10 text-primary"
                      : widget.size === "medium"
                        ? "bg-primary/10 text-primary"
                        : "bg-success/15 text-success"
                  }`}
                >
                  {widget.size}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVisibility(widget.id)}
                  className="rounded p-2 hover:bg-muted"
                  title={widget.visible ? "Hide" : "Show"}
                >
                  {widget.visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  title="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddWidget && (
          <div className="rounded-lg border border-border bg-muted p-4">
            <h4 className="mb-3 font-medium">Add Widget</h4>
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
                    className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <span className="font-medium text-sm">{widget.title}</span>
                    <Plus className="ml-auto h-4 w-4" />
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
            <label className="font-medium text-sm">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="mt-1 flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="font-medium text-sm">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="mt-1 flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="font-medium text-sm">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="mt-1 flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
            />
          </div>
          <Button variant="outline">Change Password</Button>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-muted-foreground text-sm">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Active Sessions</p>
              <p className="text-muted-foreground text-sm">
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
