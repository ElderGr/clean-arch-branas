import { Position } from "../../domain/Position";

export interface PositionRepository {
    save(position: Position): Promise<void>;
    listByRideId(rideId: string): Promise<Position[]>;
}