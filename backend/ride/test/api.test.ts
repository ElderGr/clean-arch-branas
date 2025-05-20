import axios from "axios"
import { Logger } from "../src/infra/logger/LoggerConsole";
import { RequestRide } from "../src/application/usecases/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import { GetRide } from "../src/application/usecases/GetRide";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepositoryDatabase";
import { AccountGatewayHttp } from "../src/infra/gateway/AccountGatewayHttp";
import { AxiosAdapter } from "../src/infra/http/AxiosAdapter";

axios.defaults.validateStatus = function() {
	return true;
}

let requestRide: RequestRide;
let getRide: GetRide;
let databaseConnection: DatabaseConnection;
let accountGatewayHttp: AccountGatewayHttp;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const logger = new Logger();
	const rideRepository = new RideRepositoryDatabase(databaseConnection);
	const positionRepository = new PositionRepositoryDatabase(databaseConnection);

	accountGatewayHttp = new AccountGatewayHttp(new AxiosAdapter());
	requestRide = new RequestRide(rideRepository, accountGatewayHttp, logger);
	getRide = new GetRide(rideRepository, positionRepository, logger);
})

// test("Deve solicitar uma corrida", async function(){
// 	const inputSignup = {
// 		name: "John Doe",
// 		email: `john.doe${Math.random()}@gmail.com`,
// 		cpf: "97456321558",
// 		isPassenger: true,
// 		password: "123456"
// 	};
// 	const outputSignup = await accountGatewayHttp.signup(inputSignup);
// 	const inputRequestRide = {
// 		passengerId: outputSignup.accountId,
// 		fromLat: -23.533773,
// 		fromLong: -46.625290,
// 		toLat: -23.550650,
// 		toLong: -46.633939
// 	}
// 	await axios.post("http://localhost:3000/request_ride_async", inputRequestRide);
// 	// const outputRequestRide = await requestRide.execute(inputRequestRide);
// 	// expect(outputRequestRide.rideId).toBeDefined();
// 	// const outputGetRide = await getRide.execute(outputRequestRide.rideId)
// 	// expect(outputGetRide.status).toBe('requested');
// })


afterEach(async () => {
	await databaseConnection.close();
})