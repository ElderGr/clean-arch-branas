import express, { Request, Response } from 'express'
import { signup } from './Signup';
import { getAccount } from './GetAccount';

const app = express();
app.use(express.json())

app.post('/signup', async function (req: Request, res: Response) {
    try{
        const input = req.body;
        const output = await signup(input);
        res.json(output);
    }catch(e: any){
        res.status(422).json({
            message: e.message
        })
    }
})

app.get('/accounts/:accountId', async function (req: Request, res: Response) {
    const accountId = req.params.accountId;
    const output = await getAccount(accountId);
    res.json(output);
})

app.listen(3000);