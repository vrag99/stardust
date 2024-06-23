import express from 'express';
import { deployMultisigWallet } from '../deployMultiSig';
import cors from 'cors'; // Import cors module

const app = express();
const port = 8080;
import * as dotenv from 'dotenv';
dotenv.config();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
})); // Enable CORS

app.get('/', async (_, res) => {
    console.log('called')
    const { account, keys, accountContract } = await deployMultisigWallet();
    res.json({ account, keys, accountContract });
});

app.listen(port, () => {
    console.log(process.env.RPC_URL)
    console.log(`Server is running on port ${port}`);
});

