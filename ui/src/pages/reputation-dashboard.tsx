import DashboardLayoutWrapper from "@/components/dashboard/commons/dashboard-layout-wrapper";
import Points from "@/components/dashboard/reputation-dashboard/points";
import RecentActivity from "@/components/dashboard/commons/recent-activity";

export default function ReputationDashboard() {
  return (
    <DashboardLayoutWrapper>
      <h1 className="text-4xl font-semibold text-primary">
        Reputation <span className="text-foreground">Dashboard</span>
      </h1>
      <Points percent={0.8} />
      <RecentActivity />
    </DashboardLayoutWrapper>
  );
}
