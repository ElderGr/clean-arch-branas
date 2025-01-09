import { Logger } from "../src/infra/logger/LoggerConsole";
import { RequestRide } from "../src/application/usecases/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";
import { AcceptRide } from "../src/application/usecases/AcceptRide";
import { GetRide } from "../src/application/usecases/GetRide";
import { StartRide } from "../src/application/usecases/StartRide";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import { UpdatePosition } from "../src/application/usecases/UpdatePosition";
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepositoryDatabase";
import { FinishRide } from "../src/application/usecases/FinishRide";
import { AccountGateway } from "../src/application/gateway/AccountGateway";
import { AccountGatewayHttp } from "../src/infra/gateway/AccountGatewayHttp";
import { PaymentGatewayHttp } from "../src/infra/gateway/PaymentGatewayHttp";
import { Queue } from "../src/infra/queue/Queue";

let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let databaseConnection: PgPromiseAdapter;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;
let accountGateway: AccountGateway;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const logger = new Logger();
	const rideRepository = new RideRepositoryDatabase();
	const positionRepository = new PositionRepositoryDatabase(databaseConnection);

	accountGateway = new AccountGatewayHttp();
	requestRide = new RequestRide(rideRepository, accountGateway, logger);
	getRide = new GetRide(rideRepository, positionRepository, logger);
	acceptRide = new AcceptRide(rideRepository, accountGateway);
	startRide = new StartRide(rideRepository);
	updatePosition = new UpdatePosition(rideRepository, positionRepository);
	// const mediator = new Mediator();
	// mediator.register("rideCompleted", processPayment);
	// mediator.register("rideCompleted", new SendReceipt());
	const paymentGateway = new PaymentGatewayHttp();
	const queue = new Queue();
    finishRide = new FinishRide(rideRepository, paymentGateway, queue);
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
	console.log(outputRequestRide, "ride")
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: 'AAA9999',
		isDriver: true,
		password: "123456"
	};

	const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
	console.log(outputSignupDriver, "driver")
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
		lat: -27.584905257808835,
		long: -48.545022195325124,
	};

	await updatePosition.execute(inputUpdatePosition1);

	const inputUpdatePosition2 = {
		rideId: outputRequestRide.rideId,
		lat: -27.496887588317275,
		long: -48.522234807851476
	};

	await updatePosition.execute(inputUpdatePosition2);
    const inputFinishRide = {
        rideId: outputRequestRide.rideId
    };

    await finishRide.execute(inputFinishRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe('completed');
	expect(outputGetRide.distance).toBe(10);
	expect(outputGetRide.fare).toBe(21);
});

afterEach(async () => {
	await databaseConnection.close();
})