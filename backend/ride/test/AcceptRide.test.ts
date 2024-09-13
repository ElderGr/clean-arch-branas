import { Signup } from "../src/Signup";
import { GetAccount } from "../src/GetAccount";
import { AccountRepositoryDatabase } from "../src/AccountRepositoryDatabase";
import { Logger } from "../src/LoggerConsole";
import { RequestRide } from "../src/RequestRide";
import { GetRide } from "../src/GetRide";
import { RideRepositoryDatabase } from "../src/RideRepositoryDatabase";
import { AcceptRide } from "../src/AcceptRide";
import PgPromiseAdapter from "../src/PgPromiseAdapter";
import DatabaseConnection from "../src/DatabaseConnection";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let databaseConnection: DatabaseConnection;

beforeEach(() => {	
	databaseConnection = new PgPromiseAdapter();
	const accountDAO = new AccountRepositoryDatabase(databaseConnection);
	const logger = new Logger();
	const rideDAO = new RideRepositoryDatabase();

	signup = new Signup(accountDAO, logger);
	getAccount = new GetAccount(accountDAO);
	requestRide = new RequestRide(rideDAO, accountDAO, logger);
	getRide = new GetRide(rideDAO, logger);
	acceptRide = new AcceptRide(rideDAO, accountDAO);
})

test.skip("Deve aceitar uma corrida", async function(){
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		fromLat: -23.533773,
		fromLong: -46.625290,
		toLat: -23.550650,
		toLong: -46.633939
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: 'AAA9999',
		isDriver: true,
		password: "123456"
	};

	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}

	await acceptRide.execute(inputAcceptRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe('accepted');
	expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

test("Não deve aceitar uma corrida se a conta não for de um motorista", async function(){
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		fromLat: -23.533773,
		fromLong: -46.625290,
		toLat: -23.550650,
		toLong: -46.633939
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};

	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}

	await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Only drivers can accept rides"));	
});

afterEach(async () =>{
	await databaseConnection.close();
})