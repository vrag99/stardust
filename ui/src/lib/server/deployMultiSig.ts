import { deployer, deployMultisig, KeyPair, manager } from ".";
import { Contract,Account } from "starknet";
interface ReturnParams{
    account: Account,
    keys: KeyPair[],
    accountContract: Contract
}
export async function deployMultisigWallet() :Promise<ReturnParams>  {
    console.log("Deploying new multisig");

    const { account, accountContract, keys } = await deployMultisig({
        threshold: 1,
        signersLength: 2,
        classHash: "0x06f71765c9250a0d4f1326bad595ff79f51b567ede025b544a77ca99fa6934c6",
        fundingAmount: 0.0002 * 1e18,
        useTxV3: false,
        selfDeploy: true,
    });

    console.log("Account address:", account.address);
    console.log("Account keys:", keys);
    return {
        account,
        keys,
        accountContract
    };
}