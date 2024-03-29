import { AccountDAO } from "./AccountDAO";

export class GetAccount {
	accountDAO: AccountDAO;
	constructor(){
		this.accountDAO = new AccountDAO();
	}
	execute(accountId: string){
		const account = this.accountDAO.getById(accountId);
		return account;
	}
}