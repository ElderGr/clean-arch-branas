import Ride from "./Ride";

export abstract class RideStatus {
    abstract value: string;

    constructor(readonly ride: Ride) {}

    abstract request(): void;
    abstract accept(): void;
    abstract start(): void;
    abstract finish(): void;
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
    finish() {
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
    finish() {
        throw new Error("Invalid status");
    }
}

export class CompletedStatus extends RideStatus {
    value: string;
    constructor(ride: Ride) { 
        super(ride);
        this.value = "completed";
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
    finish() {
        throw new Error("Invalid status");
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
    finish() {
        this.ride.status = new CompletedStatus(this.ride);
    }
}

export class RideStatusFactory {
    static create(ride: Ride, status: string) {
        if(status === "requested") return new RequestedStatus(ride);
        if(status === "accepted") return new AcceptedStatus(ride);
        if(status === "in_progress") return new InProgressStatus(ride)
        if(status === "completed") return new CompletedStatus(ride);
        throw new Error();
    }
}