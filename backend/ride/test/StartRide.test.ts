import { Logger } from "../src/infra/logger/LoggerConsole";
import { RequestRide } from "../src/application/usecases/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";
import { AcceptRide } from "../src/application/usecases/AcceptRide";
import { GetRide } from "../src/application/usecases/GetRide";
import { StartRide } from "../src/application/usecases/StartRide";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepositoryDatabase";
import { AccountGateway } from "../src/application/gateway/AccountGateway";
import { AccountGatewayHttp } from "../src/infra/gateway/AccountGatewayHttp";

let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let databaseConnection: PgPromiseAdapter;
let accountGateway: AccountGateway;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const logger = new Logger();
	const rideDAO = new RideRepositoryDatabase(databaseConnection);
	const positionRepository = new PositionRepositoryDatabase(databaseConnection);
	accountGateway = new AccountGatewayHttp();

	requestRide = new RequestRide(rideDAO, accountGateway, logger);
	getRide = new GetRide(rideDAO, positionRepository, logger);
	acceptRide = new AcceptRide(rideDAO, accountGateway);
	startRide = new StartRide(rideDAO);
})

test("Deve iniciar uma corrida", async function(){
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);
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

	const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
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