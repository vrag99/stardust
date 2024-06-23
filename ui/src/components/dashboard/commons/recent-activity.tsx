import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";
import CopyAddress from "@/components/dashboard/commons/copy-address";

interface VoyagerResponse {
  lastPage: number;
  items: {
    status:
      | "Received"
      | "Accepted on L2"
      | "Accepted on L1"
      | "Rejected"
      | "Reverted";
    type: "DEPLOY" | "INVOKE" | "DECLARE" | "L1_HANDLER" | "DEPLOY_ACCOUNT";
    blockNumber: number;
    hash: string;
    index: number;
    l1VerificationHash: string;
    classHash: string | null;
    contractAddress: string;
    timestamp: number;
    actualFee: string | null;
    actions: string | null;
    contractAlias: string | null;
    classAlias: string | null;
  }[];
}

export default function RecentActivity() {
  const [recentActivity, setRecentActivity] = useState<VoyagerResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = () => {
      const options = {
        method: "GET",
        url: "https://sepolia-api.voyager.online/beta/txns",
        params: {
          to: "contract_address",
          block: "block",
          rejected: "false",
          ps: "10",
          p: "1",
        },
        headers: {
          accept: "application/json",
          "x-api-key": import.meta.env.VITE_VOYAGER_X_API_KEY as string,
        },
      };
      setLoading(true);
      axios
        .request(options)
        .then((response) => {
          console.log(response);
          setRecentActivity(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      setLoading(false);
    };

    fetchRecentActivity();
  }, []);

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Recent Activity</h1>
      {loading ? (
        <div className="flex justify-center">
          <Spinner className="w-6 h-6" />
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader className="font-semibold">
            <TableRow className="*:text-center">
              <TableHead>Block Number</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contract Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actual Fee (Gwei)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-medium text-center">
            {recentActivity?.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.blockNumber}</TableCell>
                <TableCell>{item.timestamp}</TableCell>
                <TableCell>
                  <Badge
                    variant={"secondary"}
                    className="px-4 py-1.5 font-mono w-32 justify-center"
                  >
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <CopyAddress address={item.contractAddress} />
                </TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.actualFee || "zero"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
