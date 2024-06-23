import { deployer, deployMultisig, EstimateStarknetKeyPair, KeyPair, manager, StarknetKeyPair } from ".";
import { Contract,Account } from "starknet";
interface ReturnParams{
    account: Account,
    keys: KeyPair[],
    accountContract: Contract
}
import {buf2bigint , hex2buf} from './bytes'

export async function deployMultisigWallet(pk:string) :Promise<ReturnParams>  {
    console.log("Deploying new multisig");

    const deployKeys =  [new EstimateStarknetKeyPair(buf2bigint(hex2buf(pk)))]


    const { account, accountContract, keys } = await deployMultisig({
        threshold:1,
        classHash: "0x06f71765c9250a0d4f1326bad595ff79f51b567ede025b544a77ca99fa6934c6",
        fundingAmount: 0.0002 * 1e18,
        useTxV3: false,
        selfDeploy: true,
        keys:deployKeys
    });

    console.log("Account address:", account.address);
    console.log("Account keys:", keys);
    console.log("Contract ADdress", accountContract.address)
    return {
        account,
        keys,
        accountContract
    };
}