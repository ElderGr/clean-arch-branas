import axios from "axios";
import { PaymentGateway } from "../../application/gateway/PaymentGateway";

export class PaymentGatewayHttp implements PaymentGateway {
    async processPayment(input: any): Promise<void> {
        await axios.post("http://localhost:3002/process-payment", input);
    }
}