import { Logger } from "./Logger";
import { RideRepository } from "./RideRepository";
import { AccountRepository } from "./AccountRepository";
import Ride from "./Ride";

export class RequestRide{
	constructor(
		private rideDAO: RideRepository,
		private accountDAO: AccountRepository,
		private logger: Logger
	){}
	
	async execute(input: any){
		this.logger.log(`signup ${input.name}`)
		const account = await this.accountDAO.getById(input.passengerId);
		if(!account) throw new Error("Account does not exist");
		if(!account.isPassenger) throw new Error("Only passengers can request a ride");
		const activeRide = await this.rideDAO.getActiveRideByPassengerId(input.passengerId);
		if(activeRide) throw new Error("Passenger has an active ride");
		const ride = Ride.create(
			input.passengerId,
			input.fromLat,
			input.fromLong,
			input.toLat,
			input.toLong
		)
		await this.rideDAO.save(ride);
		return {
			rideId: ride.rideId
		};
	}
}

