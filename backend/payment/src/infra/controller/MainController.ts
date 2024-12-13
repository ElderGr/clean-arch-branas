import { GetTransactionByRideId } from "../../application/usecases/GetTransactionByRideId";
import { ProcessPayment } from "../../application/usecases/ProcessPayment";
import { inject, Registry } from "../di/Registry";
import { HttpServer } from "../http/HttpServer";

export class MainController {
    @inject('httpServer')
    httpServer?: HttpServer;

    @inject('processPayment')
    processPayment?: ProcessPayment

    @inject('getTransactionByRideId')
    getTransactionByRideId?: GetTransactionByRideId

    constructor(){
        this.httpServer?.register("post", "/process-payment", async (params: any, body: any) => {
            const output = await this.processPayment?.execute(body);
            return output;
        })

        this.httpServer?.register("get", "/rides/:rideId/transactions", async (params: any, body: any) => {
            const output = await this.getTransactionByRideId?.execute(params.rideId);
            return output;
        })

    }
}