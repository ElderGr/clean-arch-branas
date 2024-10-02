import { GetAccount } from "../src/application/usecases/GetAccount";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepositoryDatabase";
import { Logger } from "../src/infra/logger/LoggerConsole";
import { RequestRide } from "../src/application/usecases/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";
import { AcceptRide } from "../src/application/usecases/AcceptRide";
import { Signup } from "../src/application/usecases/Signup";
import { GetRide } from "../src/application/usecases/GetRide";
import { StartRide } from "../src/application/usecases/StartRide";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import { UpdatePosition } from "../src/application/usecases/UpdatePosition";
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepositoryDatabase";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let databaseConnection: PgPromiseAdapter;
let updatePosition: UpdatePosition;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const accountDAO = new AccountRepositoryDatabase(databaseConnection);
	const logger = new Logger();
	const rideDAO = new RideRepositoryDatabase();
	const positionRepository = new PositionRepositoryDatabase(databaseConnection);

	signup = new Signup(accountDAO, logger);
	getAccount = new GetAccount(accountDAO);
	requestRide = new RequestRide(rideDAO, accountDAO, logger);
	getRide = new GetRide(rideDAO, positionRepository, logger);
	acceptRide = new AcceptRide(rideDAO, accountDAO);
	startRide = new StartRide(rideDAO);
	updatePosition = new UpdatePosition(rideDAO, positionRepository);
})

test("Deve iniciar uma corrida", async function(){
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
	const inputUpdatePosition1 = {
		rideId: outputRequestRide.rideId,
		lat: -23.533773,
		long: -46.625290,
	};

	await updatePosition.execute(inputUpdatePosition1);

	const inputUpdatePosition2 = {
		rideId: outputRequestRide.rideId,
		lat: -23.550650,
		long: -46.633939
	};

	await updatePosition.execute(inputUpdatePosition2);

	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe('in_progress');
	console.log(outputGetRide.distance, 'TEST FLAG')
	expect(outputGetRide.distance).toBe(10);
});

afterEach(async () => {
	await databaseConnection.close();
})