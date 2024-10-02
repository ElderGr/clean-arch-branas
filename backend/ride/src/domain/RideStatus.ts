import Ride from "./Ride";

export abstract class RideStatus {
    abstract value: string;

    constructor(readonly ride: Ride) {}

    abstract request(): void;
    abstract accept(): void;
    abstract start(): void;
}

export class RequestedStatus extends RideStatus {
    value: string;
    constructor(ride: Ride) { 
        super(ride);
        this.value = "requested";
    }

    request() {
        throw new Error("Invalid status");
    }
    accept() {
        this.ride.status = new AcceptedStatus(this.ride);
    }
    start() {
        throw new Error("Invalid status");
    }
}

export class AcceptedStatus extends RideStatus {
    value: string;
    constructor(ride: Ride) { 
        super(ride);
        this.value = "accepted";
    }

    request() {
        throw new Error("Invalid status");
    }
    accept() {
        throw new Error("Invalid status");
    }
    start() {
        this.ride.status = new InProgressStatus(this.ride);
    }
}

export class InProgressStatus extends RideStatus {
    value: string;
    constructor(ride: Ride) { 
        super(ride);
        this.value = "in_progress";
    }

    request() {
        throw new Error("Invalid status");
    }
    accept() {
        throw new Error("Invalid status");
    }
    start() {
        throw new Error("Invalid status");
    }
}

export class RideStatusFactory {
    static create(ride: Ride, status: string) {
        switch (status) {
            case "requested":
                return new RequestedStatus(ride);
            case "accepted":
                return new AcceptedStatus(ride);
            case "in_progress":
                return new InProgressStatus(ride);
            default:
                throw new Error();
        }
    }
}