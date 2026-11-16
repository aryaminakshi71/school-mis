import { AnimatePresence, motion } from "framer-motion";
import { Edit, Plus, Search, Shield, Trash2, User } from "lucide-react";
import { useState } from "react";

export type Permission =
  | "students.view"
  | "students.create"
  | "students.edit"
  | "students.delete"
  | "teachers.view"
  | "teachers.create"
  | "teachers.edit"
  | "teachers.delete"
  | "classes.view"
  | "classes.manage"
  | "fees.view"
  | "fees.manage"
  | "fees.approve"
  | "attendance.view"
  | "attendance.mark"
  | "attendance.approve"
  | "exams.view"
  | "exams.create"
  | "exams.grade"
  | "reports.view"
  | "reports.generate"
  | "settings.view"
  | "settings.edit"
  | "users.manage"
  | "roles.manage"
  | "payroll.view"
  | "payroll.process"
  | "inventory.view"
  | "inventory.manage"
  | "library.view"
  | "library.manage"
  | "transport.view"
  | "transport.manage";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem?: boolean;
}

export interface UserRole {
  userId: string;
  userName: string;
  email: string;
  roles: string[];
  department?: string;
  lastActive: Date;
}

const PERMISSION_GROUPS = {
  Students: [
    "students.view",
    "students.create",
    "students.edit",
    "students.delete",
  ] as Permission[],
  Teachers: [
    "teachers.view",
    "teachers.create",
    "teachers.edit",
    "teachers.delete",
  ] as Permission[],
  Classes: ["classes.view", "classes.manage"] as Permission[],
  Fees: ["fees.view", "fees.manage", "fees.approve"] as Permission[],
  Attendance: [
    "attendance.view",
    "attendance.mark",
    "attendance.approve",
  ] as Permission[],
  Exams: ["exams.view", "exams.create", "exams.grade"] as Permission[],
  Reports: ["reports.view", "reports.generate"] as Permission[],
  Settings: ["settings.view", "settings.edit"] as Permission[],
  "Users & Roles": ["users.manage", "roles.manage"] as Permission[],
  Payroll: ["payroll.view", "payroll.process"] as Permission[],
  Inventory: ["inventory.view", "inventory.manage"] as Permission[],
  Library: ["library.view", "library.manage"] as Permission[],
  Transport: ["transport.view", "transport.manage"] as Permission[],
};

const DEFAULT_ROLES: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access",
    permissions: Object.values(PERMISSION_GROUPS).flat(),
    isSystem: true,
  },
  {
    id: "principal",
    name: "Principal",
    description: "School principal with oversight access",
    permissions: [
      "students.view",
      "teachers.view",
      "classes.view",
      "fees.view",
      "fees.approve",
      "attendance.view",
      "exams.view",
      "reports.view",
      "reports.generate",
      "payroll.view",
      "settings.view",
    ],
    isSystem: true,
  },
  {
    id: "teacher",
    name: "Teacher",
    description: "Class teacher permissions",
    permissions: [
      "students.view",
      "attendance.view",
      "attendance.mark",
      "exams.view",
      "exams.grade",
      "classes.view",
      "library.view",
    ],
    isSystem: true,
  },
  {
    id: "accountant",
    name: "Accountant",
    description: "Financial management access",
    permissions: [
      "fees.view",
      "fees.manage",
      "fees.approve",
      "payroll.view",
      "payroll.process",
      "reports.view",
      "reports.generate",
    ],
    isSystem: true,
  },
  {
    id: "librarian",
    name: "Librarian",
    description: "Library management access",
    permissions: ["library.view", "library.manage", "students.view"],
    isSystem: true,
  },
];

interface RoleBasedAccessControlProps {
  users: UserRole[];
  onUpdateUserRoles: (userId: string, roles: string[]) => Promise<void>;
  onCreateRole: (role: Omit<Role, "id">) => Promise<void>;
  onUpdateRole: (role: Role) => Promise<void>;
  onDeleteRole: (roleId: string) => Promise<void>;
}

export function RoleBasedAccessControl({
  users,
  onUpdateUserRoles,
  onCreateRole,
  onUpdateRole,
  onDeleteRole,
}: RoleBasedAccessControlProps) {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [activeTab, setActiveTab] = useState<"roles" | "users">("roles");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRole | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSaveRole = async () => {
    if (!editingRole) return;

    if (roles.find((r) => r.id === editingRole.id)) {
      await onUpdateRole(editingRole);
      setRoles((prev) =>
        prev.map((r) => (r.id === editingRole.id ? editingRole : r)),
      );
    } else {
      await onCreateRole(editingRole);
      setRoles((prev) => [
        ...prev,
        { ...editingRole, id: `role-${Date.now()}` },
      ]);
    }

    setShowRoleModal(false);
    setEditingRole(null);
  };

  const togglePermission = (permission: Permission) => {
    if (!editingRole) return;

    const hasPermission = editingRole.permissions.includes(permission);
    setEditingRole({
      ...editingRole,
      permissions: hasPermission
        ? editingRole.permissions.filter((p) => p !== permission)
        : [...editingRole.permissions, permission],
    });
  };

  const deleteRole = async (roleId: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      await onDeleteRole(roleId);
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-xl dark:text-gray-100">
                Role-Based Access Control
              </h2>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Manage roles and permissions
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("roles")}
              className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "roles"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              Roles
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "users"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              Users
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "roles" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                System Roles ({roles.length})
              </h3>
              <button
                onClick={() => {
                  setEditingRole({
                    id: "",
                    name: "",
                    description: "",
                    permissions: [],
                  });
                  setShowRoleModal(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Create Role
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {roles.map((role) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {role.name}
                        {role.isSystem && (
                          <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-300">
                            System
                          </span>
                        )}
                      </h4>
                      <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                        {role.description}
                      </p>
                      <p className="mt-2 text-gray-500 text-sm dark:text-gray-400">
                        {role.permissions.length} permissions
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingRole(role);
                          setShowRoleModal(true);
                        }}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-primary dark:hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {!role.isSystem && (
                        <button
                          onClick={() => deleteRole(role.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.userId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {user.userName}
                      </p>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.roles.map((roleId) => {
                      const role = roles.find((r) => r.id === roleId);
                      return role ? (
                        <span
                          key={roleId}
                          className="rounded-full bg-primary/10 px-2 py-1 text-primary text-xs"
                        >
                          {role.name}
                        </span>
                      ) : null;
                    })}
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="ml-2 text-primary text-sm hover:text-primary/80"
                    >
                      Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Role Edit Modal */}
      <AnimatePresence>
        {showRoleModal && editingRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            >
              <div className="border-gray-200 border-b p-6 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 text-lg dark:text-gray-100">
                  {editingRole.id ? "Edit Role" : "Create Role"}
                </h3>
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={editingRole.name}
                    onChange={(e) =>
                      setEditingRole({ ...editingRole, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editingRole.description}
                    onChange={(e) =>
                      setEditingRole({
                        ...editingRole,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="mb-3 block font-medium text-gray-700 text-sm dark:text-gray-300">
                    Permissions ({editingRole.permissions.length} selected)
                  </label>
                  <div className="max-h-96 space-y-4 overflow-y-auto">
                    {Object.entries(PERMISSION_GROUPS).map(
                      ([group, permissions]) => (
                        <div
                          key={group}
                          className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                        >
                          <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-100">
                            {group}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {permissions.map((permission) => (
                              <label
                                key={permission}
                                className="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <input
                                  type="checkbox"
                                  checked={editingRole.permissions.includes(
                                    permission,
                                  )}
                                  onChange={() => togglePermission(permission)}
                                  className="h-4 w-4 rounded text-primary"
                                />
                                <span className="text-gray-700 text-sm capitalize dark:text-gray-300">
                                  {permission.split(".")[1]}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 border-gray-200 border-t p-6 dark:border-gray-800">
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setEditingRole(null);
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRole}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-white"
                >
                  Save Role
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RoleBasedAccessControl;
