import { Coord } from "./Coord";

export class DistanceCalculator{
    static calculate (from: Coord, to: Coord): number {
        const earthRadius = 6371;
        const degreesToRadians = Math.PI / 180;
        const deltaLat = (to.lat - from.lat) * degreesToRadians;
        const deltaLong = (to.long - from.long) * degreesToRadians;
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(from.lat * degreesToRadians) * 
            Math.cos(to.lat * degreesToRadians) *
            Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(earthRadius * c);
    }
}