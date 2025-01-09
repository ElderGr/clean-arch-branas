import { ProcessPayment } from "../../application/usecases/ProcessPayment";
import { inject } from "../di/Registry";
import { Queue } from "./Queue";

export class QueueController {
    @inject("queue")
    queue?: Queue;

    @inject("processPayment")
    processPayment?: ProcessPayment;

    constructor (){
        this.queue?.consume("rideCompleted", async (input: any) => {
            await this.processPayment?.execute(input);
        })
    }
}