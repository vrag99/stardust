import DashboardLayoutWrapper from "@/components/dashboard/commons/dashboard-layout-wrapper";
import DaoList from "@/components/dashboard/liquidity-dashboard/dao-list";
import BorrowLiquidityModal from "@/components/dashboard/liquidity-dashboard/borrow-liquidity-modal";
export default function LiquidityDashboard() {
  return (
    <>
      <DashboardLayoutWrapper>
        <div className="flex flex-row justify-between">
          <div className="space-y-2 mb-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary">
              Liquidity <span className="text-foreground">Dashboard</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground tracking-wide">
              Create collaterized debt position for your organization.
            </p>
          </div>
          <BorrowLiquidityModal />
        </div>
        <DaoList />
      </DashboardLayoutWrapper>
    </>
  );
}
