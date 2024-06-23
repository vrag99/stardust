import { GradientHeading } from "@/components/ui/gradient-heading";
import Meteors from "@/components/ui/meteors";
import ShimmerButton from "@/components/ui/shimmer-button";

import { Link } from "react-router-dom";

import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
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
        <GradientHeading size={"xxl"} weight={"bold"} variant={"color"}>
          StarDust
        </GradientHeading>
      </div>
      <p className="text-sm md:text-lg text-muted-foreground text-center w-[32ch] leading-6">
        A Liquidity lending protocol to empower DAO's{" "}
        <span className="font-display text-foreground font-medium">
          StarkNet
        </span>
      </p>
      <div className="mt-2 text-center">
        {!isConnected ? (
          <DynamicWidget />
        ) : (
          <Link to="/liquidity-dashboard">
            <ShimmerButton className="shadow-2xl" shimmerColor="#a5b4fc">
              <span className="text-accent-foreground font-medium">
                Get Started
              </span>
            </ShimmerButton>
          </Link>
        )}
      </div>
    </div>
  );
}
