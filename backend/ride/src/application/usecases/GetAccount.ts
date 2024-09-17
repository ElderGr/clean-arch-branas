import { AccountRepositoryDatabase } from "../../infra/repository/AccountRepositoryDatabase";

export class GetAccount {
	constructor(private accountDAODatabase: AccountRepositoryDatabase){}
	execute(accountId: string){
		const account = this.accountDAODatabase.getById(accountId);
		return account;
	}
}