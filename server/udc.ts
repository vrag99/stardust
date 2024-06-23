import { CallData, RawCalldata } from "starknet";
import { deployer, manager } from ".";

export const udcAddress = "0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf";

export async function deployContractUDC(classHash: string, salt: string, calldata: RawCalldata) {
  const unique = 0; //false

  const udcContract = await manager.loadContract(udcAddress);

  udcContract.connect(deployer);

  const deployCall = udcContract.populate("deployContract", CallData.compile([classHash, salt, unique, calldata]));
  const { transaction_hash } = await udcContract.deployContract(deployCall.calldata);

  const transaction_response = await manager.waitForTransaction(transaction_hash);

  return transaction_response.events?.[0].from_address;
}
