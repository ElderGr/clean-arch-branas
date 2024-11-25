import { GetAccount } from "../../application/usecases/GetAccount";
import { Signup } from "../../application/usecases/Signup";
import { inject, Registry } from "../di/Registry";
import { HttpServer } from "../http/HttpServer";

export class MainController {
    @inject('httpServer')
    httpServer?: HttpServer;

    @inject('signup')
    signup?: Signup;

    @inject('getAccount')
    getAccount?: GetAccount;

    constructor(){
        this.httpServer?.register("post", "/signup", async (params: any, body: any) => {
            const output = await this.signup?.execute(body);
            return output;
        })

        this.httpServer?.register("get", "/accounts/:accountId", async (params: any, body: any) => {
            const output = await this.getAccount?.execute(params.accountId);  
            return output;
        })
    }
}