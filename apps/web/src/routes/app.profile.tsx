import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Edit, Mail, MapPin, Phone, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@springfield.edu",
    phone: "+91 98765 43210",
    address: "123 Education Lane, Springfield",
    dob: "1985-06-15",
    joiningDate: "2020-01-01",
    bio: "School Administrator with 10+ years of experience in educational management.",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Profile updated successfully");
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    toast.info("Changes discarded");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-foreground">My Profile</h1>
        <p className="text-muted-foreground">View and manage your profile</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary font-bold text-3xl text-primary-foreground">
                {profile.firstName.charAt(0)}
                {profile.lastName.charAt(0)}
              </div>
              <h2 className="font-bold text-foreground text-xl">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-muted-foreground text-sm">Administrator</p>
              <p className="mt-1 text-muted-foreground text-xs">ID: ADM-001</p>

              {!editing && (
                <Button
                  onClick={() => setEditing(true)}
                  variant="outline"
                  className="mt-4 w-full"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="mt-6 space-y-3 border-t pt-6">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="h-4 w-4" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>{profile.address}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                <span>Joined {profile.joiningDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-foreground text-sm">
                    First Name
                  </label>
                  {editing ? (
                    <Input
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground">{profile.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block font-medium text-foreground text-sm">
                    Last Name
                  </label>
                  {editing ? (
                    <Input
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground">{profile.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium text-foreground text-sm">
                  Email
                </label>
                {editing ? (
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-foreground">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block font-medium text-foreground text-sm">
                  Phone
                </label>
                {editing ? (
                  <Input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-foreground">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block font-medium text-foreground text-sm">
                  Address
                </label>
                {editing ? (
                  <Input
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-foreground">{profile.address}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block font-medium text-foreground text-sm">
                  Date of Birth
                </label>
                {editing ? (
                  <Input
                    type="date"
                    value={profile.dob}
                    onChange={(e) =>
                      setProfile({ ...profile, dob: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-foreground">{profile.dob}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <p className="text-muted-foreground">{profile.bio}</p>
              )}
            </CardContent>
          </Card>

          {editing && (
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
