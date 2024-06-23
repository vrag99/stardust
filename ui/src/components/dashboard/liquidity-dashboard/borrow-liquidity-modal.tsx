import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

export default function BorrowLiquidityModal() {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button variant={"gooeyRight"} size={"lg"}>
            Borrow Liquidity
          </Button>
        </DialogTrigger>
        <DialogContent className="font-medium">
          <DialogHeader>
            <DialogTitle>Borrow Liquidity</DialogTitle>
          </DialogHeader>
          <Label className="text-muted-foreground" htmlFor="amount" />
          <Input
            id="amount"
            name="amount"
            placeholder="Enter Loan Amount (USDC)"
          />
          <Input
            id="time"
            placeholder="Enter time period for the loan (say 5 months)"
          />

          <div className="flex flex-row gap-2">
            <Input className="flex-1" placeholder="Your wallet Address"></Input>
            <Button variant={"ghost"} size={"icon"}>
              h
            </Button>
          </div>

          <Button>Apply</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
