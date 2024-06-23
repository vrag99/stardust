import DashboardLayoutWrapper from "@/components/dashboard/commons/dashboard-layout-wrapper";
import RecentActivity from "@/components/dashboard/commons/recent-activity";
import AddressBook from "@/components/dashboard/governance-dashboard/address-book";

export default function GovernanceDashboard() {
  return (
    <>
      <DashboardLayoutWrapper>
        <h1 className="text-4xl font-semibold text-primary mb-4">
          Governance <span className="text-foreground">Dashboard</span>
        </h1>
        <AddressBook />
        <RecentActivity />
      </DashboardLayoutWrapper>
    </>
  );
}
