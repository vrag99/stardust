import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <header className="flex items-center justify-between bg-background py-1 shadow-sm">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-display">StarDust</span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <Link to="/protocol-dashboard">
            <Button variant="linkHover2" size='sm'>Protocol</Button>
          </Link>
          <Link to="/liquidity-dashboard">
            <Button variant="linkHover2" size='sm'>Liquidity</Button>
          </Link>
        </nav>
      </div>
      <DynamicWidget />
    </header>
  );
}
