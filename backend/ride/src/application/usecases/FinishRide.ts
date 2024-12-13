import { PaymentGateway } from "../gateway/PaymentGateway";
import { RideRepository } from "../repository/RideRepository";

export class FinishRide {
	constructor(
		private rideRepository: RideRepository,
		private paymentGateway: PaymentGateway,
		// private mediator: Mediator
	){}
	
	async execute(input: Input){
		const ride = await this.rideRepository.getById(input.rideId);
		if(!ride) throw new Error("Ride not found");
		if(ride.getStatus() !== "in_progress") throw new Error("To update position ride must be in progress");
		ride.finish();
		await this.rideRepository.update(ride);
		await this.paymentGateway.processPayment({rideId: input.rideId, amount: ride.getFare()});
		
		// await this.mediator.publish("rideCompleted", {
		// 	rideId: input.rideId, 
		// 	amount: ride.getFare()
		// });
	}
}

type Input = {
	rideId: string,
}