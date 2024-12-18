import { Transaction } from "../../domain/Transaction";
import { TransactionRepository } from "../repository/TransactionRepository";

export class ProcessPayment {
    constructor(
        private transactionRepository: TransactionRepository
    ){}

    async execute(input: Input): Promise<void>{
        const transaction = Transaction.create(input.rideId, input.amount);
        transaction.pay();
        await this.transactionRepository.save(transaction);
    }
}

type Input = {
    rideId: string,
    creditCardToken: string,
    amount: number
}