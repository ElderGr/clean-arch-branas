import crypto from "crypto";
import { Name } from "./Name";
import { Email } from "./Email";
import { Cpf } from "./Cpf";
import { CarPlate } from "./CarPlate";

export default class Account {
    name: Name;
    email: Email;
    cpf: Cpf;
    carPlate: CarPlate;
    isPassenger: boolean;
    isDriver: boolean;
    accountId: string;

    private constructor (
        accountId: string,
        name: Name, 
        email: Email, 
        cpf: Cpf, 
        carPlate: CarPlate,
        isPassenger: boolean,
        isDriver: boolean,
    ) {
        if (isDriver && this.isInvalidCarPlate(carPlate.value)) throw new Error("Invalid car plate")
        
        this.accountId = accountId;
        this.accountId = crypto.randomUUID();
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.carPlate = carPlate;
        this.isPassenger = isPassenger;
        this.isDriver = isDriver;
    }

    static create(name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
        const accountId = crypto.randomUUID();
        return new Account(accountId, new Name(name), new Email(email), new Cpf(cpf), new CarPlate(carPlate), isPassenger, isDriver);
    } 

    static restore(accountId: string, name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean){
        return new Account(accountId, new Name(name), new Email(email), new Cpf(cpf), new CarPlate(carPlate), isPassenger, isDriver);
    }

	isInvalidCarPlate(carPlate: string){
		return !carPlate.match(/[A-Z]{3}[0-9]{4}/)
	}
}