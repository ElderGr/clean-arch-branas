import { RideRepository } from "./RideRepository";
import { AccountRepository } from "./AccountRepository";

export class AcceptRide{
	constructor(
		private rideDAO: RideRepository,
		private accountDAO: AccountRepository
	){}
	
	async execute(input: any){
		const account = await this.accountDAO.getById(input.driverId);
		if(account && !account.isDriver) throw new Error("Only drivers can accept rides");
		const ride = await this.rideDAO.getById(input.rideId);
		if(!ride) throw new Error("Ride not found");
		ride.accept(input.driverId)

		await this.rideDAO.update(ride);
	}
}

