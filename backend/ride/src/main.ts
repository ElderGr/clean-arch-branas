import { AccountRepositoryDatabase } from "./infra/repository/AccountRepositoryDatabase";
import { Logger } from "./infra/logger/LoggerConsole";
import { GetAccount } from "./application/usecases/GetAccount";
import { ExpressAdapter } from "./infra/http/ExpressAdapter";
import { MainController } from "./infra/controller/MainController";
import { Signup } from "./application/usecases/Signup";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(databaseConnection);
const logger = new Logger();
const signup = new Signup(accountRepository, logger);
const getAccount = new GetAccount(accountRepository);

new MainController(httpServer, signup, getAccount)

httpServer.listen(3000)