import DashboardLayoutWrapper from "@/components/dashboard/commons/dashboard-layout-wrapper";
export default function ProtocolDashboard() {
  return (
    <>
      <DashboardLayoutWrapper>
        <h1 className="text-4xl font-semibold text-primary">
          Protocol <span className="text-foreground">Dashboard</span>
        </h1>
      </DashboardLayoutWrapper>
    </>
  );
}
