import { Logger } from "./infra/logger/LoggerConsole";
import { ExpressAdapter } from "./infra/http/ExpressAdapter";
import { MainController } from "./infra/controller/MainController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import { Registry } from "./infra/di/Registry";

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const logger = new Logger();

const registry = Registry.getInstance();
registry.register("httpServer", httpServer);

new MainController();

httpServer.listen(3000)