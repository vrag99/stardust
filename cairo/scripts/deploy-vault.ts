import { Account, CallData, Contract, RpcProvider, stark, cairo } from "starknet";
import * as dotenv from "dotenv";
import { getCompiledCode } from "./utils";
dotenv.config();

async function main() {
  const provider = new RpcProvider({
    nodeUrl: process.env.RPC_ENDPOINT,
  });

  // initialize existing predeployed account 0
  console.log("ACCOUNT_ADDRESS=", process.env.DEPLOYER_ADDRESS);
  console.log("ACCOUNT_PRIVATE_KEY=", process.env.DEPLOYER_PRIVATE_KEY);
  const privateKey0 = process.env.DEPLOYER_PRIVATE_KEY ?? "";
  const accountAddress0: string = process.env.DEPLOYER_ADDRESS ?? "";
  const account0 = new Account(provider, accountAddress0, privateKey0);
  console.log("Account connected.\n");

  // Declare & deploy contract
  let sierraCode, casmCode;

  try {
    ({ sierraCode, casmCode } = await getCompiledCode("stardust_Vault"));
  } catch (error: any) {
    console.log("Failed to read contract files");
    process.exit(1);
  }
  const toknes = ["0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7","0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"]
  const myCallData = new CallData(sierraCode.abi);
  const constructor = myCallData.compile("constructor", {
    tokens:toknes,
    mUSDAddr:"0x239d1ecde6e651a45a103a367557e1b69306c6a206e5df3fa4982320dd64e54"
  });
  const deployResponse = await account0.declareAndDeploy({
    contract: sierraCode,
    casm: casmCode,
    constructorCalldata: constructor,
    salt: stark.randomAddress(),
  });

  // Connect the new contract instance :
  const myTestContract = new Contract(
    sierraCode.abi,
    deployResponse.deploy.contract_address,
    provider
  );
  console.log(
    `Contract has been deploy with the address: ${myTestContract.address}`
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

