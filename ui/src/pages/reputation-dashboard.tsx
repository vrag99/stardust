import DashboardLayoutWrapper from "@/components/dashboard/commons/dashboard-layout-wrapper";
import Points from "@/components/dashboard/reputation-dashboard/points";

export default function ReputationDashboard() {
  return (
    <DashboardLayoutWrapper>
      <h1 className="text-4xl font-semibold text-primary">
        Reputation <span className="text-foreground">Dashboard</span>
      </h1>
      <Points percent={0.8} />
    </DashboardLayoutWrapper>
  );
}
