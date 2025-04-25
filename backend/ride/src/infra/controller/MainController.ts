import { RequestRide } from "../../application/usecases/RequestRide";
import { inject, Registry } from "../di/Registry";
import { HttpServer } from "../http/HttpServer";
import { Queue } from "../queue/Queue";

export class MainController {
    @inject('httpServer')
    httpServer?: HttpServer;

    @inject('requestRide')
    requestRide?: RequestRide;

    @inject('queue')
    queue?: Queue;

    constructor(){
        this.httpServer?.register("post", "/request_ride", async (params: any, body: any) => {
            const output = await this.requestRide?.execute(body);
            return output;
        })

        this.httpServer?.register("post", "/request_ride_async", async (params: any, body: any) => {
            await this.queue?.publish("requestRide", body);
            return {
                message: "Ride requested"
            }
        })

        // this.httpServer?.register("get", "/accounts/:accountId", async (params: any, body: any) => {
        //     const output = await this.getAccount?.execute(params.accountId);  
        //     return output;
        // })
    }
}