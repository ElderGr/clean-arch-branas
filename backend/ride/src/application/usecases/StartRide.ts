import { RideRepository } from "../repository/RideRepository";

export class StartRide{
	constructor(
		private rideDAO: RideRepository,
	){}
	
	async execute(input: any){
		const ride = await this.rideDAO.getById(input.rideId);
		if(!ride) throw new Error("Ride not found");
		ride.start();
		await this.rideDAO.update(ride);
	}
}

