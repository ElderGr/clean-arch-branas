import { AccountDAODatabase } from "./AccountDAODatabase";

export class GetAccount {
	constructor(private accountDAODatabase: AccountDAODatabase){}
	execute(accountId: string){
		const account = this.accountDAODatabase.getById(accountId);
		return account;
	}
}