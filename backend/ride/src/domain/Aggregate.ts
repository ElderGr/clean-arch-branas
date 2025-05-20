import { DomainEvent } from "./event/DomainEvent";

export class Aggregate {
    private listeners: {callback: Function } [];

    constructor(){
        this.listeners = [];
    }

    register(callback: Function){
        this.listeners.push({ callback })
    }

    notify(event: DomainEvent){
        for(const listeners of this.listeners){
            listeners.callback(event)
        }
    }
}