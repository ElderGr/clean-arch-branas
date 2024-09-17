import { Logger } from "../logger/Logger";
import Ride from "../../domain/Ride";
import { AccountRepository } from "../repository/AccountRepository";
import { RideRepository } from "../repository/RideRepository";

export class RequestRide{
	constructor(
		private rideDAO: RideRepository,
		private accountDAO: AccountRepository,
		private logger: Logger
	){}
	
	async execute(input: Input): Promise<Output>{
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

type Input = {
	passengerId: string
	fromLat: number
	fromLong: number
	toLat: number
	toLong: number
}
type Output = {
	rideId: string
}
