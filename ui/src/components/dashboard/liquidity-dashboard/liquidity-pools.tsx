import Pool from "./pool";

export default function LiquidityPools() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Pools</h1>
      <div className="h-[60vh] overflow-auto border-b space-y-4 no-scrollbar">
        <Pool />
      </div>
    </div>
  );
}
