import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CopyAddress from "../commons/copy-address";

export default function AddressBook() {
  const addresses = [
    {
      name: "Ether",
      address:
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    },
    {
      name: "DAI",
      address:
        "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3",
    },
    {
      name: "USDC",
      address:
        "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    },
  ];
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-semibold">Address Book</h1>
      <Table>
        <TableHeader className="font-semibold">
          <TableRow className="*:text-center">
            <TableHead>Name</TableHead>
            <TableHead>L2 Contract Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium text-center">
          {addresses.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <CopyAddress address={item.address} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
