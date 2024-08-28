import crypto from "crypto";
import { validateCpf } from "./CpfValidator";
import { Logger } from "./Logger";
import { AccountDAO } from "./AccountDAO";
import Account from "./Account";

export class Signup{
	accountDAO: AccountDAO
	logger: Logger;

	constructor(accountDAO: AccountDAO, logger: Logger){
		this.accountDAO = accountDAO
		this.logger = logger
	}
	
	async execute(input: any){
		this.logger.log(`signup ${input.name}`)
		const existingAccount = await this.accountDAO.getByEmail(input.email)
		if (existingAccount) throw new Error("Duplicated account");
		const account = new Account(
			input.name,
			input.email,
			input.cpf,
			input.carPlate,
			input.isPassenger,
			input.isDriver
		);
		await this.accountDAO.save(account)
		return {
			accountId: account.accountId
		};
	}
}

