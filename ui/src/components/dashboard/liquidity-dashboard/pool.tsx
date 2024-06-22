import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Pool() {
  return (
    <Card className="transition-all bg-popover duration-200 hover:border-primary">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <CardTitle>USDC Andromeda Yield</CardTitle>
            {/* <Badge variant={'destructive'} className="font-medium">High Risk</Badge> */}
            <Badge className="font-medium">Low Risk</Badge>
          </div>
          <div className="flex text-base font-medium items-center gap-4">
            <p><span className="text-muted-foreground mr-1">TVL</span>$4.5M</p>
            <p><span className="text-muted-foreground mr-1">APY</span>27.16%</p>
          </div>
        </div>
        <CardDescription>StarkNet</CardDescription>
      </CardHeader>
      <CardContent>
        <Button size={'lg'} variant={'shine'}>Deposit</Button>
      </CardContent>
    </Card>
  );
}
