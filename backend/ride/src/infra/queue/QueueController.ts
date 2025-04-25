import { RequestRide } from "../../application/usecases/RequestRide";
import { SendReceipt } from "../../application/usecases/SendReceipt";
import { inject } from "../di/Registry";
import { Queue } from "./Queue";

export class QueueController {
    @inject("queue")
    queue?: Queue;

    @inject("sendReceipt")
    sendReceipt?: SendReceipt;

    @inject("requestRide")
    requestRide?: RequestRide;

    constructor (){
        this.queue?.consume("paymentApproved", async (input: any) => {
            await this.sendReceipt?.execute(input);
        })

        this.queue?.consume("requestRide", async (input: any) => {
            await this.requestRide?.execute(input);
        })
    }
}