import crypto from 'crypto';
import { RideStatus, RideStatusFactory } from './RideStatus';
import { DistanceCalculator } from './DistanceCalculator';
import { Position } from './Position';
import { Coord } from './Coord';
import { FareCalculatorFactory } from './FareCalculator';
import { RideCompletedEvent } from './event/RideCompletedEvent';
import { Aggregate } from './Aggregate';

export default class Ride extends Aggregate {
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
        readonly toLong: number,
        private fare: number = 0,
        private distance: number = 0,
        private lastPosition?: Coord
    ) {
        super();
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

    finish() {
        const fareCalculator = FareCalculatorFactory.create(this.date);
        this.fare = fareCalculator.calculate(this.distance);
        this.status.finish();
        this.notify(new RideCompletedEvent(this.rideId, this.getFare()));
    }

    updatePosition(position: Position) {
        if(this.lastPosition){
            this.distance += DistanceCalculator.calculate(this.lastPosition, position.coord);
        }
        this.lastPosition = position.coord;
    }

    getFare() {
        return this.fare;
    }

    getDistance() {
        return this.distance;
    }

    getLastPosition() {
        return this.lastPosition;
    }
}