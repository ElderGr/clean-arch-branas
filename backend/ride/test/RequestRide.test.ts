import axios from "axios"
import { Signup } from "../src/Signup";
import { GetAccount } from "../src/GetAccount";
import { AccountRepositoryDatabase } from "../src/AccountRepositoryDatabase";
import { Logger } from "../src/LoggerConsole";
import { RequestRide } from "../src/RequestRide";
import { GetRide } from "../src/GetRide";
import { RideDAODatabase } from "../src/RideDAODatabase";

axios.defaults.validateStatus = function() {
	return true;
}

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
	const accountDAO = new AccountRepositoryDatabase();
	const logger = new Logger();
	const rideDAO = new RideDAODatabase();

	signup = new Signup(accountDAO, logger);
	getAccount = new GetAccount(accountDAO);
	requestRide = new RequestRide(rideDAO, accountDAO, logger);
	getRide = new GetRide(rideDAO, logger);
})

test("Deve solicitar uma corrida", async function(){
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -23.533773,
		fromLong: -46.625290,
		toLat: -23.550650,
		toLong: -46.633939
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	expect(outputRequestRide.rideId).toBeDefined();
	const outputGetRide = await getRide.execute(outputRequestRide.rideId)
	expect(outputGetRide.status).toBe('requested');
})

test("Não deve poder solicitar uma corrida se a conta não for de um passageiro", async function(){
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isDriver: true,
		carPlate: 'AAA9999',
		isPassenger: false,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -23.533773,
		fromLong: -46.625290,
		toLat: -23.550650,
		toLong: -46.633939
	}
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Only passengers can request a ride"));
})

test("Não deve poder solicitar uma corrida se o passageiro já tiver outra corrida ativa", async function(){
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -23.533773,
		fromLong: -46.625290,
		toLat: -23.550650,
		toLong: -46.633939
	}
	await requestRide.execute(inputRequestRide);
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Passenger has an active ride"));
})


test("Não deve poder solicitar uma corrida se a conta não existir", async function(){
	
	const inputRequestRide = {
		passengerId: "5ce99f48-b455-49f4-81d7-5d28d81aebf4",
		fromLat: -23.533773,
		fromLong: -46.625290,
		toLat: -23.550650,
		toLong: -46.633939
	}
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account does not exist"));

})