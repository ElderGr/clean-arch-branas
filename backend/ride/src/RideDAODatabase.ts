import pgp from 'pg-promise'
import { RideDAO } from './RideDAO';
export class RideDAODatabase implements RideDAO {
    async getActiveRideByPassengerId(passengerId: string): Promise<any> {
        const connection = pgp()("postgres://admin:root@localhost:5432");
		const [ride] = await connection.query("select * from cccat14.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')", [passengerId]);
		await connection.$pool.end();
        return ride;
    }
    async save(ride: any) {
	    const connection = pgp()("postgres://admin:root@localhost:5432");
		await connection.query("insert into cccat14.ride (ride_id, passenger_id,  from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", 
        [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.status, ride.date]);
		await connection.$pool.end();
    }

    async getById(rideId: string){
        const connection = pgp()("postgres://admin:root@localhost:5432");
		const [ride] = await connection.query("select * from cccat14.ride where ride_id = $1", [rideId]);
		await connection.$pool.end();
        return ride;
    }
    async update(ride: any): Promise<void> {
	    const connection = pgp()("postgres://admin:root@localhost:5432");
		await connection.query("update cccat14.ride  set status = $1, driver_id = $2 where ride_id = $3", [ride.status, ride.driverId, ride.ride_id]);
		await connection.$pool.end();   
    }
}