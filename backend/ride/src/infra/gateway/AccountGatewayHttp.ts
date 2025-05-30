import { AccountGateway } from "../../application/gateway/AccountGateway"
import { HttpClient } from "../http/HttpClient"

export class AccountGatewayHttp implements AccountGateway {
    constructor(readonly httpClient: HttpClient){

    }

    async getById(accountId: string): Promise<any> {
        const response = await this.httpClient.get(`http://localhost:3001/accounts/${accountId}`)
        return response
    }
    async signup(input: any): Promise<any> {
        const response = await this.httpClient.post("http://localhost:3001/signup", input)
        return response
    }
}