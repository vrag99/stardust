import { GradientHeading } from "@/components/ui/gradient-heading";
import Meteors from "@/components/ui/meteors";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { useAccount } from "wagmi";

export default function Home() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center gap-2 overflow-hidden">
      <Meteors number={32} />
      <div className="flex flex-col -space-y-1 items-center">
        <GradientHeading
          className="tracking-wide"
          weight={"semi"}
          size={"sm"}
          variant={"color"}
        >
          Welcome to
        </GradientHeading>
        <h1></h1>
        <GradientHeading size={"xxl"} weight={"bold"} variant={"color"}>
          StarDust
        </GradientHeading>
      </div>
      <p className="text-sm md:text-lg text-muted-foreground text-center w-[32ch] leading-6">
        A revolutionary interoperable DeFi Lending Mesh made for{" "}
        <span className="font-display text-foreground font-medium">
          StarkNet
        </span>
      </p>
      <div className="mt-2">
        <DynamicWagmiConnector>
          <DynamicWidget />
          {/* <AccountInfo /> */}
        </DynamicWagmiConnector>
      </div>
    </div>
  );
}

function AccountInfo() {
  const { address, isConnected, chain } = useAccount();

  return (
    <div>
      <p>wagmi connected: {isConnected ? "true" : "false"}</p>
      <p>wagmi address: {address}</p>
      <p>wagmi network: {chain?.id}</p>
    </div>
  );
}
