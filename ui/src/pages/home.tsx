import { GradientHeading } from "@/components/ui/gradient-heading";
import Meteors from "@/components/ui/meteors";
import ShimmerButton from "@/components/ui/shimmer-button";

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
      <ShimmerButton className="shadow-2xl mt-2" shimmerColor="#a5b4fc">
        <span className="text-accent-foreground font-medium">
          Get Started
        </span>
      </ShimmerButton>
    </div>
  );
}
