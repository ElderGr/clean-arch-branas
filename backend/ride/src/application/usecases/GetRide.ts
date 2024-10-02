import { Logger } from "../../infra/logger/LoggerConsole";
import { PositionRepository } from "../repository/PositionRepository";
import { RideRepository } from "../repository/RideRepository";


export class GetRide{
	constructor(
		private rideRepository: RideRepository,
		private positionRepository: PositionRepository,
		private logger: Logger
	){}
	
	async execute(rideId: string): Promise<Output>{
		this.logger.log(`getRide`)
        const ride = await this.rideRepository.getById(rideId);
		if(!ride) throw new Error("Ride not found");
		const positions = await this.positionRepository.listByRideId(rideId);
		let distance = 0;
		for(const [index, position] of positions.entries()) {
			if(!positions[index + 1]) break
			const from = { lat: position.coord.lat, long: position.coord.long };
			const to = { lat: positions[index + 1].coord.lat, long: positions[index + 1].coord.long };

			const earthRadius = 6371;
			const degreesToRadians = Math.PI / 180;
			const deltaLat = (to.lat - from.lat) * degreesToRadians;
			const deltaLong = (to.long - from.long) * degreesToRadians;
			const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
				Math.cos(from.lat * degreesToRadians) * 
				Math.cos(to.lat * degreesToRadians) *
				Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			distance += Math.round(earthRadius * c);
		}
		return {
			rideId: ride.rideId,
			status: ride.getStatus(),
			driverId: ride.getDriverId(),
			passengerId: ride.passengerId,
			distance: distance
		}
	}
}

type Output = {
	rideId: string;
	status: string;
	driverId: string;
	passengerId: string;
	distance?: number;
}