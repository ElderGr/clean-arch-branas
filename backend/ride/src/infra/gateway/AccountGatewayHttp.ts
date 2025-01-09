import axios from "axios"
import { AccountGateway } from "../../application/gateway/AccountGateway"

export class AccountGatewayHttp implements AccountGateway {
    async getById(accountId: string): Promise<any> {
        const response = await axios.get(`http://localhost:3001/accounts/${accountId}`)
        console.log(response)
        return response.data
    }
    async signup(input: any): Promise<any> {
        const response = await axios.post("http://localhost:3001/signup", input)
        return response.data
    }
}