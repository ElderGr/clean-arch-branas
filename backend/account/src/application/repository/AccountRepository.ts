import Account from "../../domain/Account";

export interface AccountRepository {
    save(account: Account): Promise<void>;
    getById(accountId: string): Promise<Account | undefined>;
    getByEmail(email: string): Promise<Account | undefined>;
}