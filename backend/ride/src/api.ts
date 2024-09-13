import express, { Request, Response } from 'express'
import { Signup } from './Signup';
import { GetAccount } from './GetAccount';
import { AccountRepositoryDatabase } from './AccountRepositoryDatabase';
import { Logger } from './LoggerConsole';
import PgPromiseAdapter from './PgPromiseAdapter';

const app = express();
app.use(express.json())

app.post('/signup', async function (req: Request, res: Response) {
    try{
        const input = req.body;
        
	    const databaseConnection = new PgPromiseAdapter();
        const accountDAO = new AccountRepositoryDatabase(databaseConnection);
        const logger = new Logger();
        const signup = new Signup(accountDAO, logger);
        const output = await signup.execute(input);
        res.json(output);
    }catch(e: any){
        res.status(422).json({
            message: e.message
        })
    }
})

app.get('/accounts/:accountId', async function (req: Request, res: Response) {
    const accountId = req.params.accountId;
    const databaseConnection = new PgPromiseAdapter();
    const accountDAO = new AccountRepositoryDatabase(databaseConnection);
    const getAccount = new GetAccount(accountDAO);
    const output = await getAccount.execute(accountId);
    res.json(output);
})

app.listen(3000);