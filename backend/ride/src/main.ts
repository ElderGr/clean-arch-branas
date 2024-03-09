import crypto from "crypto";
import pgp from "pg-promise";
import express, { Request, Response } from 'express'
import { AccountDAO } from "./AccountDAO";

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

function validateCpf (cpf: string) {
	if (!cpf) return false
	cpf = clean(cpf);
	if (isInvalidLength(cpf)) return false;
	if (allDigitsAreTheSame(cpf)) return false
	const dg1 = calculateDigit(cpf, 10)
	const dg2 = calculateDigit(cpf, 11)
	return extractCheckDigit(cpf) == `${dg1}${dg2}`;
}

function clean (cpf: string){
	return cpf.replace(/\D/g,'')
}

function isInvalidLength(cpf: string){
	return cpf.length !== 11
}

function allDigitsAreTheSame(cpf: string){
	return cpf.split("").every(c => c === cpf[0])
}

function calculateDigit(cpf: string, factor: number){
	let total = 0;
	for(const digit of cpf){
		if(factor > 1) total += parseInt(digit) * factor--;
	}
	const rest = total%11;
	return rest < 2 ? 0 : 11 - rest;
}


function extractCheckDigit (cpf: string){
	return cpf.slice(9)
}


async function signup (input: any): Promise<any> {
	const accountDAO = new AccountDAO()
	input.accountId = crypto.randomUUID();
	const account = await accountDAO.getByEmail(input.email)
	if (account) throw new Error("Duplicated account")
	if (isInvalidName(input.name)) throw new Error("Invalid name")
	if (isInvalidEmail(input.email)) throw new Error("Invalid email")
	if (!validateCpf(input.cpf)) throw new Error("Invalid cpf")
	if (input.isDriver && isInvalidCarPlate(input.carPlate)) throw new Error("Invalid car plate")
	await accountDAO.save(input)
	return {
		accountId: input.accountId
	};
}

function isInvalidName(name: string){
	return !name.match(/[a-zA-Z] [a-zA-Z]+/)
}

function isInvalidEmail(email: string){
	return !email.match(/^(.+)@(.+)$/)
}

function isInvalidCarPlate(carPlate: string){
	return !carPlate.match(/[A-Z]{3}[0-9]{4}/)
}


async function getAccount(accountId: string){
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [account] = await connection.query("select * from cccat14.account where account_id = $1", [accountId])
	await connection.$pool.end();

	return account;
}