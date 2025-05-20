import { RequestRide } from "../../application/usecases/RequestRide";
import { SendReceipt } from "../../application/usecases/SendReceipt";
import { UpdateRideProjection } from "../../application/usecases/UpdateRideProjection";
import { inject } from "../di/Registry";
import { Queue } from "./Queue";

export class QueueController {
    @inject("queue")
    queue?: Queue;

    @inject("sendReceipt")
    sendReceipt?: SendReceipt;

    @inject("requestRide")
    requestRide?: RequestRide;

    @inject('updateRideProjection')
    updateRideProjection?: UpdateRideProjection;

    constructor (){
        this.queue?.consume("paymentApproved", "paymentApproved.sendReceipt", async (input: any) => {
            await this.sendReceipt?.execute(input);
        })

        this.queue?.consume("requestRide", "requestRide.requestRide",  async (input: any) => {
            await this.requestRide?.execute(input);
        })

        this.queue?.consume("rideCompleted", "rideCompleted.updateProjection",async (input: any) => {
            // await this.requestRide?.execute(input);
            console.log('updateProjection', input)
            await this.updateRideProjection?.execute(input);
        })
    }
}