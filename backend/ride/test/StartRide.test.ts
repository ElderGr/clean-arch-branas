import { Signup } from "../src/Signup";
import { GetAccount } from "../src/GetAccount";
import { AccountRepositoryDatabase } from "../src/AccountRepositoryDatabase";
import { Logger } from "../src/LoggerConsole";
import { RequestRide } from "../src/RequestRide";
import { GetRide } from "../src/GetRide";
import { RideRepositoryDatabase } from "../src/RideRepositoryDatabase";
import { AcceptRide } from "../src/AcceptRide";
import { StartRide } from "../src/StartRide";
import PgPromiseAdapter from "../src/PgPromiseAdapter";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let databaseConnection: PgPromiseAdapter;

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
	startRide = new StartRide(rideDAO);
})

test.skip("Deve iniciar uma corrida", async function(){
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
    const inputStartRide = {
        rideId: outputRequestRide.rideId
    };
    await startRide.execute(inputStartRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe('in_progress');
});

afterEach(async () => {
	await databaseConnection.close();
})