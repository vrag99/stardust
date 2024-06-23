import Dao from "./dao";
import { daoItem } from "./dao";

export default function DaoList() {
  // TODO: Replace with real data
  const daoItems: daoItem[] = [
    {
      name: "Frax DAO",
      token: [
        { name: "USDC", value: 1121.56 },
        { name: "ETH", value: 1996.97 },
      ],
    },
    {
      name: "My DAO",
      token: [
        { name: "BTC", value: 3001.00 },
        { name: "USDC", value: 4094.12 },
        { name: "ETH", value: 5000.00 },
      ],
    },
    {
      name: "Your DAO",
      token: [
        { name: "USDC", value: 6472.18 },
        { name: "BTC", value: 7039.1 },
      ],
    },
    {
      name: "Our DAO",
      token: [
        { name: "ETH", value: 8000.00 },
      ],
    },
    {
      name: "DAO5",
      token: [{ name: "TokenL", value: 1200 }],
    },
  ];
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Dao List</h1>
      <div className="h-[60vh] overflow-auto border-b space-y-4 no-scrollbar">
        {daoItems.map((dao, index) => (
          <Dao key={index} {...dao} />
        ))}
      </div>
    </div>
  );
}
