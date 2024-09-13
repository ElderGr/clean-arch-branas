import PgPromiseAdapter from "./PgPromiseAdapter";
import { AccountRepositoryDatabase } from "./AccountRepositoryDatabase";
import { Logger } from "./LoggerConsole";
import { Signup } from "./Signup";
import { GetAccount } from "./GetAccount";
import { ExpressAdapter } from "./ExpressAdapter";
import { MainController } from "./MainController";

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(databaseConnection);
const logger = new Logger();
const signup = new Signup(accountRepository, logger);
const getAccount = new GetAccount(accountRepository);

new MainController(httpServer, signup, getAccount)

httpServer.listen(3000)