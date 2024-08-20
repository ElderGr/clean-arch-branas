import crypto from "crypto";
import { Logger } from "./Logger";
import { RideDAO } from "./RideDAO";
import { AccountDAO } from "./AccountDAO";

export class AcceptRide{
	constructor(
		private rideDAO: RideDAO,
		private accountDAO: AccountDAO
	){}
	
	async execute(input: any){
		const account = await this.accountDAO.getById(input.passengerId);
		const ride = await this.rideDAO.getById(input.rideId);
		ride.status = "accepted";
		ride.driverId = input.driverId;

		await this.rideDAO.update(input);
	}
}

