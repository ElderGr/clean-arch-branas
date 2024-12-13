import { AccountRepositoryDatabase } from "../../infra/repository/AccountRepositoryDatabase";

export class GetAccount {
	constructor(private accountRepositoryDatabase: AccountRepositoryDatabase){}
	async execute(accountId: string): Promise<Output> {
		const account = await this.accountRepositoryDatabase.getById(accountId);
		if(!account) throw new Error("Account not found");
		return {
			accountId: account.accountId,
			name: account.name.value,
			email: account.email.value,
			cpf: account.cpf.value,
			carPlate: account.carPlate.value,
			isPassenger: account.isPassenger,
			isDriver: account.isDriver,
		}
	}
}

type Output = {
	accountId: string;
	name: string;
	email: string;
	cpf: string;
	carPlate: string;
	isPassenger: boolean;
	isDriver: boolean;
}