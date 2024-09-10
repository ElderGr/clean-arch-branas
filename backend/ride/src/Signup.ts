import { Logger } from "./Logger";
import { AccountRepository } from "./AccountRepository";
import Account from "./Account";

export class Signup{
	accountDAO: AccountRepository
	logger: Logger;

	constructor(accountDAO: AccountRepository, logger: Logger){
		this.accountDAO = accountDAO
		this.logger = logger
	}
	
	async execute(input: any){
		this.logger.log(`signup ${input.name}`)
		const existingAccount = await this.accountDAO.getByEmail(input.email)
		if (existingAccount) throw new Error("Duplicated account");
		const account = Account.create(
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

