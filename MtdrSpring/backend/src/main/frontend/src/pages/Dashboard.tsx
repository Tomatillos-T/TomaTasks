import { useUserContext } from "@/contexts/UserContext";
import UserDashboard from "@/modules/dashboard/components/UserDashboard";
import ManagerDashboard from "@/modules/dashboard/components/ManagerDashboard";
import { ShieldAlert } from "lucide-react";
import { isAdminRole } from "@/utils/roleMapper";

export default function Dashboard() {
  const { user, isAuthenticated } = useUserContext();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-error-bg border border-error-main rounded-lg p-6 max-w-md">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-error-main flex-shrink-0" />
            <div>
              <h3 className="text-error-main font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-text-secondary text-sm">
                Please log in to view your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has Admin role for manager dashboard
  const isAdmin = isAdminRole(user.role);

  // Render appropriate dashboard based on role:
  // - Admin users: ManagerDashboard (team-wide metrics) by default
  // - Developer users: UserDashboard (personal metrics) by default
  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-4 py-6">
        {isAdmin ? <ManagerDashboard /> : <UserDashboard />}
      </div>
    </div>
  );
}
