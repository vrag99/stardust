import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function CopyAddress({ address }: { address: string }) {
    const truncatedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
    const { toast } = useToast();
    return (
      <Button
        className="font-mono"
        size={"sm"}
        variant={"ghost"}
        onClick={() => {
          toast({
            description: "Address copied to clipboard",
          });
          navigator.clipboard.writeText(address);
        }}
      >
        {truncatedAddress}
      </Button>
    );
  }
  