import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import {
  DynamicUserProfile,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";

interface navItem {
  name: string;
  link: string;
}

export default function NavBar() {
  const { setShowDynamicUserProfile } = useDynamicContext();
  const navItems: navItem[] = [
    { name: "Protocol", link: "/protocol-dashboard" },
    { name: "Liquidity", link: "/liquidity-dashboard" },
    { name: "Reputation", link: "/reputation-dashboard" },
  ];
  return (
    <>
      <header className="flex items-center justify-between bg-background py-1 shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-display">StarDust</span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item, index) => (
              <Link key={index} to={item.link}>
                <Button variant="linkHover2" size="sm">
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => setShowDynamicUserProfile(true)}
        >
          <CircleUser className="w-6 h-6" />
        </Button>
      </header>
      <DynamicUserProfile />
    </>
  );
}
