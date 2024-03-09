import crypto from "crypto";
import { AccountDAO } from "./AccountDAO";


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


export async function signup (input: any): Promise<any> {
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


export async function getAccount(accountId: string){
	const accountDAO = new AccountDAO();
	const account = await accountDAO.getById(accountId);
	return account;
}