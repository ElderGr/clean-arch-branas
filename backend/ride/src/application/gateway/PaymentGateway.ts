export interface PaymentGateway {
    processPayment(input: any): Promise<void>
}