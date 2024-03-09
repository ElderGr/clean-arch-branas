import crypto from "crypto";
import { AccountDAO } from "./AccountDAO";
import { validateCpf } from "./CpfValidator";

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
