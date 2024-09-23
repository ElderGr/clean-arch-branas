import crypto from 'crypto';
import { RideStatus, RideStatusFactory } from './RideStatus';
export default class Ride {
    public status: RideStatus;

    constructor(
        readonly rideId: string, 
        readonly passengerId: string, 
        private driverId: string,
        status: string, 
        readonly date: Date,
        readonly fromLat: number,
        readonly fromLong: number,
        readonly toLat: number,
        readonly toLong: number
    ) {
        this.status = RideStatusFactory.create(this, status);
    }

    static create(
        passengerId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number
    ) {
        const rideId = crypto.randomUUID();
        const driverId = "";
        const status = "requested"
        const date = new Date();

        return new Ride(
            rideId, 
            passengerId,
            driverId,
            status, 
            date, 
            fromLat, 
            fromLong, 
            toLat, 
            toLong
        )
    }

    accept(driverId: string) {
        this.driverId = driverId;
        this.status.accept();
    }

    start() {
        this.status.start();
    }

    getStatus() {
        return this.status.value;
    }

    getDriverId() {
        return this.driverId;
    }
}