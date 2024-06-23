import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RpcProvider, Contract, Account, BigNumberish,cairo , num} from 'starknet';

import axios from "axios";
export default function Dao() {
    console.log("Dao page")
    const [account, setAccount] = useState("")
    const [contractAddress, setContractAddress] = useState("")
    function hexToFelt(val:any) {
        return parseInt(val, 16);
    }

    const callContract = async () => {
        const provider = new RpcProvider({ nodeUrl: import.meta.env.VITE_RPC_URL });
        console.log(provider)
        const testAddress = '0x02e20661a72c3c195f9fa3e2c8999396e2c55df997cc3b55fd6a1e8ad544e67a';
        const { abi: testAbi } = await provider.getClassAt(testAddress);
        const myTestContract = new Contract(testAbi, testAddress, provider);

        const account0 = new Account(provider, import.meta.env.VITE_ADDRESS, import.meta.env.VITE_PRIV);
        myTestContract.connect(account0)
        const second  = num.toHex("0x0776Da22B210b87c3cEEe404339B49B39dc1D172C1E24F727a650E10E433016b")
        
        console.log(second)
        const myCall = await myTestContract.populate(
            'add_signers',
            [3, second]
        )
        console.log(myCall.calldata)
        const res = await myTestContract.add_signers(myCall.calldata);
        console.log(res)
        await provider.waitForTransaction(res.transaction_hash);

    }

    const onClick = async () => {
        axios.post(
            "http://localhost:8080/create-multisig",
            {
                pk: "0x068364fDE241623D21cF4CeB61d0B77EfD3c081B0e6c784b8dCAAbaCAA28cde4"
            }
            , {
                withCredentials: true,
            }).then((res) => {
                console.log(res.data)
                setAccount(res.data.account)
                // setKeys(res.data.keys)
                setContractAddress(res.data.accountContract)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <div>
            <Button onClick={callContract}>Click me</Button>
            <div>Account: {account}</div>
            <div>Contract Address: {contractAddress}</div>
        </div>
    )
}
