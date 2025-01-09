import { SendReceipt } from "../../application/usecases/SendReceipt";
import { inject } from "../di/Registry";
import { Queue } from "./Queue";

export class QueueController {
    @inject("queue")
    queue?: Queue;

    @inject("sendReceipt")
    sendReceipt?: SendReceipt;

    constructor (){
        this.queue?.consume("paymentApproved", async (input: any) => {
            await this.sendReceipt?.execute(input);
        })
    }
}