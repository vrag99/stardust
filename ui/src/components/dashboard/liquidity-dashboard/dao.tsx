import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface daoItem {
  name: string;
  token: {
    name: string;
    value: number;
  }[];
}

export default function Dao(props: daoItem) {
  return (
    <Card className="transition-all bg-popover duration-200 hover:border-primary">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <CardTitle>{props.name}</CardTitle>
          </div>
          <div className="flex text-base font-medium items-center gap-4">
            <TooltipProvider>
            {props.token.map((token, index) => (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      key={index}
                      className="px-4 py-1.5 bg-accent text-accent-foreground w-20 justify-center hover:bg-primary hover:text-primary-foreground"
                    >
                      {token.name}
                    </Badge>
                  </TooltipTrigger>{" "}
                  <TooltipContent>
                    <p>${token.value}</p>
                  </TooltipContent>
                </Tooltip>
            ))}
            </TooltipProvider>
          </div>
        </div>
        <CardDescription className="font-medium">
          Total Value:{" "}
          <span className="font-semibold text-foreground">
            ${props.token.reduce((acc, token) => acc + token.value, 0)}
          </span>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
