import { Logger } from "./infra/logger/LoggerConsole";
import { ExpressAdapter } from "./infra/http/ExpressAdapter";
import { MainController } from "./infra/controller/MainController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import { Registry } from "./infra/di/Registry";
import { Queue } from "./infra/queue/Queue";
import { SendReceipt } from "./application/usecases/SendReceipt";
import { QueueController } from "./infra/queue/QueueController";

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const logger = new Logger();
const queue = new Queue();

const sendReceipt = new SendReceipt();

const registry = Registry.getInstance();
registry.register("httpServer", httpServer);
registry.register("queue", queue)
registry.register("sendReceipt", sendReceipt)

new MainController();
new QueueController();

httpServer.listen(3000)