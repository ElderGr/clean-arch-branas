import DatabaseConnection from "../../infra/database/DatabaseConnection";

export class GetRideQueryProjection{
    constructor(readonly connection: DatabaseConnection){}

    async execute(rideId: string): Promise<Output>{
        const [rideData] = await this.connection.query(`
                select 
                    ride_id,
                    fare,
                    distance,
                    status,
                    passenger_id,
                    driver_id,
                    passenger_name,
                    passenger_cpf,
                    driver_car_plate
                from cccat14.ride_projection
                where
                    r.ride_id = $1
            `, [rideId]);
        return {
            rideId: rideData.ride_id,
            status: rideData.status,
            driverId: rideData.driver_id,
            passengerId: rideData.passenger_id,
            distance: parseFloat(rideData.distance),
            fare: parseFloat(rideData.fare),
            passengerName: rideData.passenger_name,
            passengerCpf: rideData.passenger_cpf,
            driverCarPlate: rideData.driver_car_plate
        }
    }
}

type Output = {
	rideId: string;
	status: string;
	driverId: string;
	passengerId: string;
	distance?: number;
	fare?: number;
	passengerName: string;
	driverCarPlate?: string;
	passengerCpf: string;
}