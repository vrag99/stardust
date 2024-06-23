import { RpcProvider } from "starknet";
import { WithContracts } from "./contracts";
import { WithDevnet, devnetBaseUrl } from "./devnet";
import { TokenManager } from "./tokens";
import dotenv from "dotenv";
dotenv.config({ override: true });

export class Manager extends WithContracts(WithDevnet(RpcProvider)) {
  tokens: TokenManager;

  constructor() {
    super({ nodeUrl: process.env.RPC_URL || `${devnetBaseUrl}` });
    this.tokens = new TokenManager(this);
  }
}

export const manager = new Manager();

console.log("Provider:", manager.channel.nodeUrl);
