import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
export default function Dao() {
    console.log("Dao page")
    const [account,setAccount] = useState("")
    const [contractAddress , setContractAddress] = useState("")
    
    const onClick = async () => {
        axios.get("http://localhost:8080").then((res) => {
            console.log(res.data)
            // setAccount(res.data.account)
            // setKeys(res.data.keys)
            // setContractAddress(res.data.accountContract)
        })
        .catch((err) => {
            console.log(err)
        })
   }
    return (
        <div>
            <Button onClick={onClick}>Click me</Button>
            <div>Account: {account}</div>
            <div>Contract Address: {contractAddress}</div>
        </div>
    )
}