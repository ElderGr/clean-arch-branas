import axios from "axios"
import { Signup } from "../src/Signup";
import { GetAccount } from "../src/GetAccount";
import { AccountDAODatabase } from "../src/AccountDAODatabase";
import { Logger } from "../src/LoggerConsole";

axios.defaults.validateStatus = function() {
	return true;
}

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	const logger = new Logger();
	signup = new Signup(accountDAO, logger);
	getAccount = new GetAccount(accountDAO);
})

test("Deve solicitar uma corrida", async function(){
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();

	const outputGetAccount = await getAccount.execute(outputSignup.accountId);

	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
})