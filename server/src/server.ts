import express from 'express';
import { deployMultisigWallet } from '../deployMultiSig';
import cors from 'cors'; // Import cors module

const app = express();
app.use(bodyParser.json());
const port = 8080;
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
dotenv.config();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
})); // Enable CORS

app.post('/create-multisig', async (req, res) => {
    const { pk } = req.body;
    const { account, keys, accountContract } = await deployMultisigWallet(pk);
    res.json({ account, keys, accountContract });
});

app.listen(port, () => {
    console.log(process.env.RPC_URL)
    console.log(`Server is running on port ${port}`);
});

