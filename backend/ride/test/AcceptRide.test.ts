import { Logger } from "../src/infra/logger/LoggerConsole";
import { RequestRide } from "../src/application/usecases/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";
import { AcceptRide } from "../src/application/usecases/AcceptRide";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import { GetRide } from "../src/application/usecases/GetRide";
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepositoryDatabase";
import { AccountGatewayHttp } from "../src/infra/gateway/AccountGatewayHttp";

let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let databaseConnection: DatabaseConnection;
let accountGatewayHttp: AccountGatewayHttp;

beforeEach(() => {	
	databaseConnection = new PgPromiseAdapter();
	const logger = new Logger();
	const rideRepository = new RideRepositoryDatabase(databaseConnection);
	const positionRepository = new PositionRepositoryDatabase(databaseConnection);

	accountGatewayHttp = new AccountGatewayHttp();
	requestRide = new RequestRide(rideRepository, accountGatewayHttp, logger);
	getRide = new GetRide(rideRepository, positionRepository, logger);
	acceptRide = new AcceptRide(rideRepository, accountGatewayHttp);
})

test("Deve aceitar uma corrida", async function(){
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupPassenger = await accountGatewayHttp.signup(inputSignupPassenger);
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

	const outputSignupDriver = await accountGatewayHttp.signup(inputSignupDriver);
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
	const outputSignupPassenger = await accountGatewayHttp.signup(inputSignupPassenger);
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

	const outputSignupDriver = await accountGatewayHttp.signup(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}

	await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Only drivers can accept rides"));	
});

afterEach(async () =>{
	await databaseConnection.close();
})