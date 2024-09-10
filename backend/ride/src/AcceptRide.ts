import { RideDAO } from "./RideDAO";
import { AccountRepository } from "./AccountRepository";

export class AcceptRide{
	constructor(
		private rideDAO: RideDAO,
		private accountDAO: AccountRepository
	){}
	
	async execute(input: any){
		const account = await this.accountDAO.getById(input.driverId);
		if(account && !account.isDriver) throw new Error("Only drivers can accept rides");
		const ride = await this.rideDAO.getById(input.rideId);
		ride.status = "accepted";
		ride.driverId = input.driverId;

		await this.rideDAO.update(ride);
	}
}

