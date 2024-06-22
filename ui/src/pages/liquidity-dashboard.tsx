import DashboardLayoutWrapper from "@/components/dashboard/commons/dashboard-layout-wrapper";
import LiquidityPools from "@/components/dashboard/liquidity-dashboard/liquidity-pools";

export default function LiquidityDashboard() {
  return (
    <>
      <DashboardLayoutWrapper>
        <div className="space-y-2 mb-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary">
            Liquidity <span className="text-foreground">Dashboard</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground tracking-wide">
            Provide liquidity for the next generation of permission-less
            protocols.
          </p>
        </div>
        <LiquidityPools />
      </DashboardLayoutWrapper>
    </>
  );
}
