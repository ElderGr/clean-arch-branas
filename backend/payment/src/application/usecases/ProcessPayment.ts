import { Transaction } from "../../domain/Transaction";
import { Queue } from "../../infra/queue/Queue";
import { TransactionRepository } from "../repository/TransactionRepository";

export class ProcessPayment {
    constructor(
        private transactionRepository: TransactionRepository,
        readonly queue: Queue
    ){}

    async execute(input: Input): Promise<void>{
        const transaction = Transaction.create(input.rideId, input.amount);
        transaction.pay();
        await this.transactionRepository.save(transaction);
        await this.queue.publish("paymentApproved", { 
            transactionId: transaction.transactionId,
            rideId: transaction.rideId
        })
    }
}

type Input = {
    rideId: string,
    creditCardToken: string,
    amount: number
}