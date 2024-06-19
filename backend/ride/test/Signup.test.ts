import axios from "axios"
import { Signup } from "../src/Signup";
import { GetAccount } from "../src/GetAccount";
import sinon from 'sinon'
import { AccountDAODatabase } from "../src/AccountDAODatabase";
import { Logger } from "../src/LoggerConsole";
import { AccountDAO } from "../src/AccountDAO";

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

test("Deve criar conta para o passageiro com stub", async function(){
	const stubAccountDAOSave = sinon.stub(AccountDAODatabase.prototype, "save").resolves();
	const stubAccountDAOGetByEmail = sinon.stub(AccountDAODatabase.prototype, "getByEmail").resolves(null);
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const stubAccountDAOGetById = sinon.stub(AccountDAODatabase.prototype, "getById").resolves(inputSignup);

	const outputGetAccount = await getAccount.execute(outputSignup.accountId);

	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	stubAccountDAOGetByEmail.restore();
	stubAccountDAOSave.restore();
	stubAccountDAOGetById.restore();
})

test("Deve criar conta para o passageiro com mock", async function(){
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const mockLogger = sinon.mock(Logger.prototype);
	mockLogger.expects("log").withArgs("signup John Doe").calledOnce;

	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();

	const outputGetAccount = await getAccount.execute(outputSignup.accountId);

	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	mockLogger.verify();
	mockLogger.restore();
})

test("Não deve criar conta se o nome for inválido", async function(){
	const inputSignup = {
		name: "",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};

	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid name"));
})

test("Não deve criar conta se o email for inválido", async function(){
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid email"));
})

test("Não deve criar conta se o email for duplicado", async function(){
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	await signup.execute(inputSignup);
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Duplicated account"));
})

test("Não deve criar conta se o cpf for inválido", async function(){
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "11111111111",
		isPassenger: true,
		password: "123456"
	};

	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid cpf"));
})

test("Não deve criar conta se o email for duplicado", async function(){
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	await signup.execute(inputSignup);
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Duplicated account"));
})

test("Deve criar uma conta para o motorista", async function(){
	const spyLoggerLog = sinon.spy(Logger.prototype, "log")
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: 'AAA9999',
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	
	const outputSignup = await signup.execute(inputSignup);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);

	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(spyLoggerLog.calledOnce).toBeTruthy();
	expect(spyLoggerLog.calledWith("signup John Doe")).toBeTruthy();
	spyLoggerLog.restore();
})

test("Não deve criar conta para o motorista com a placa inválida", async function(){
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: 'AAA999',
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid car plate"));
})

test("Deve criar conta para o passageiro com fake", async function(){
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};

	const accountDAO: AccountDAO = {
		async save (account: any): Promise<void> {},
		async getById (accountId: string): Promise<any> {
			return inputSignup
		},
		async getByEmail (email: string): Promise<any> {
			return undefined
		}
	}

	const logger: Logger = {
		log (message: string): void {}
	}

	const signup = new Signup(accountDAO, logger);
	const getAccount = new GetAccount(accountDAO);

	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();

	const outputGetAccount = await getAccount.execute(outputSignup.accountId);

	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
})