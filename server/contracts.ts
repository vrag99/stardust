import { readFileSync } from "fs";
import {
  Abi,
  AccountInterface,
  CompiledSierra,
  Contract,
  DeclareContractPayload,
  ProviderInterface,
  UniversalDeployerContractPayload,
  UniversalDetails,
  json,
} from "starknet";
import { deployer } from "./accounts";
import { WithDevnet } from "./devnet";

export const contractsFolder = "./argent/argent_";
export const fixturesFolder = "./tests-integration/fixtures/argent_";

export const WithContracts = <T extends ReturnType<typeof WithDevnet>>(Base: T) =>
  class extends Base {
    protected classCache: Record<string, string> = {};

    removeFromClassCache(contractName: string) {
      delete this.classCache[contractName];
    }

    clearClassCache() {
      for (const contractName of Object.keys(this.classCache)) {
        delete this.classCache[contractName];
      }
    }

    async restartDevnetAndClearClassCache() {
      if (this.isDevnet) {
        await this.restart();
        this.clearClassCache();
      }
    }

    // Could extends Account to add our specific fn but that's too early.
    async declareLocalContract(contractName: string, wait = true, folder = contractsFolder): Promise<string> {
      const cachedClass = this.classCache[contractName];
      if (cachedClass) {
        return cachedClass;
      }
      const payload = getDeclareContractPayload(contractName, folder);
      const skipSimulation = this.isDevnet;
      // max fee avoids slow estimate
      const maxFee = skipSimulation ? 1e18 : undefined;
      console.log(deployer.address)
      const { class_hash, transaction_hash } = await deployer.declareIfNot(payload, { maxFee });
      console.log(`\t${class_hash}`);
      if (wait && transaction_hash) {
        await this.waitForTransaction(transaction_hash);
        console.log(`\t${contractName} declared`);
      }
      this.classCache[contractName] = class_hash;
      return class_hash;
    }

    async declareFixtureContract(contractName: string, wait = true): Promise<string> {
      return await this.declareLocalContract(contractName, wait, fixturesFolder);
    }

    async loadContract(contractAddress: string, classHash?: string): Promise<ContractWithClass> {
      const { abi } = await this.getClassAt(contractAddress);
      classHash ??= await this.getClassHashAt(contractAddress);
      return new ContractWithClass(abi, contractAddress, this, classHash);
    }

    async deployContract(
      contractName: string,
      payload: Omit<UniversalDeployerContractPayload, "classHash"> | UniversalDeployerContractPayload[] = {},
      details?: UniversalDetails,
      folder = contractsFolder,
    ): Promise<ContractWithClass> {
      const classHash = await this.declareLocalContract(contractName, true, folder);
      const { contract_address } = await deployer.deployContract({ ...payload, classHash }, details);

      // TODO could avoid network request and just create the contract using the ABI
      return await this.loadContract(contract_address, classHash);
    }
  };

export class ContractWithClass extends Contract {
  constructor(
    abi: Abi,
    address: string,
    providerOrAccount: ProviderInterface | AccountInterface,
    public readonly classHash: string,
  ) {
    super(abi, address, providerOrAccount);
  }
}

export function getDeclareContractPayload(contractName: string, folder = contractsFolder): DeclareContractPayload {
  const contract: CompiledSierra = readContract(`${folder}${contractName}.contract_class.json`);
  console.log("con",contract)
  const payload: DeclareContractPayload = { contract };
  if ("sierra_program" in contract) {
    payload.casm = readContract(`${folder}${contractName}.compiled_contract_class.json`);
  }
  return payload;
}

export function readContract(path: string) {
  return json.parse(readFileSync(path).toString("ascii"));
}
