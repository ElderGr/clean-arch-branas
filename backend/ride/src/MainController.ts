import { GetAccount } from "./GetAccount";
import { HttpServer } from "./HttpServer";
import { Signup } from "./Signup";

export class MainController {
    constructor(readonly httpServer: HttpServer, signup: Signup, getAccount: GetAccount){
        httpServer.register("post", "/signup", async (params: any, body: any) => {
            const output = await signup.execute(body);
            return output;
        })

        httpServer.register("get", "/accounts/:accountId", async (params: any, body: any) => {
            const output = await getAccount.execute(params.accountId);  
            return output;
        })
    }
}