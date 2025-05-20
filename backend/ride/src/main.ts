import { Logger } from "./infra/logger/LoggerConsole";
import { ExpressAdapter } from "./infra/http/ExpressAdapter";
import { MainController } from "./infra/controller/MainController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import { Registry } from "./infra/di/Registry";
import { Queue } from "./infra/queue/Queue";
import { SendReceipt } from "./application/usecases/SendReceipt";
import { QueueController } from "./infra/queue/QueueController";
import { RequestRide } from "./application/usecases/RequestRide";
import { RideRepositoryDatabase } from "./infra/repository/RideRepositoryDatabase";
import { AccountGatewayHttp } from "./infra/gateway/AccountGatewayHttp";
import { UpdateRideProjectionAPIComposition } from "./application/usecases/UpdateRideProjectionAPIComposition";
import { FetchAdapter } from "./infra/http/FetchAdapter";
import { AxiosAdapter } from "./infra/http/AxiosAdapter";

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const logger = new Logger();
const queue = new Queue();
const rideRepository = new RideRepositoryDatabase(databaseConnection);
const accountGatewayHttp = new AccountGatewayHttp(new AxiosAdapter());

const sendReceipt = new SendReceipt();
const requestRide = new RequestRide(rideRepository, accountGatewayHttp, logger);
const updateRideProjection = new UpdateRideProjectionAPIComposition(databaseConnection, accountGatewayHttp);

const registry = Registry.getInstance();
registry.register("httpServer", httpServer);
registry.register("queue", queue)
registry.register("sendReceipt", sendReceipt)
registry.register("requestRide", requestRide)
registry.register("updateRideProjection", updateRideProjection)

new MainController();
new QueueController();

httpServer.listen(3000)