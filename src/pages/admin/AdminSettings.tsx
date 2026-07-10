import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const AdminSettings = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display">Settings</h1>
        <p className="text-muted-foreground font-body text-sm mt-1">Account and application preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Account</CardTitle>
          <CardDescription>Your admin account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email ?? "Admin"}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <Button variant="destructive" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
