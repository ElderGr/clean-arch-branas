import axios from "axios"
import { GetAccount } from "../src/application/usecases/GetAccount";
import sinon from 'sinon'
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepositoryDatabase";
import { Logger } from "../src/infra/logger/LoggerConsole";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import { Signup } from "../src/application/usecases/Signup";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import Account from "../src/domain/Account";

axios.defaults.validateStatus = function() {
	return true;
}

let signup: Signup;
let getAccount: GetAccount;
let databaseConnection: DatabaseConnection;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const accountDAO = new AccountRepositoryDatabase(databaseConnection);
	const logger = new Logger();
	signup = new Signup(accountDAO, logger);
	getAccount = new GetAccount(accountDAO);
})

test("Deve criar conta para o passageiro com stub", async function(){
	// const stubAccountDAOSave = sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
	// const stubAccountDAOGetByEmail = sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves(undefined);
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	// const stubAccountDAOGetById = sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(Account.create(
	// 	inputSignup.name,
	// 	inputSignup.email,
	// 	inputSignup.cpf,
	// 	inputSignup.password,
	// 	inputSignup.isPassenger,
	// 	false
	// ));

	const outputGetAccount = await getAccount.execute(outputSignup.accountId);

	expect(outputGetAccount?.name).toBe(inputSignup.name);
	expect(outputGetAccount?.email).toBe(inputSignup.email);
	// stubAccountDAOGetByEmail.restore();
	// stubAccountDAOSave.restore();
	// stubAccountDAOGetById.restore();
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

	expect(outputGetAccount?.name).toBe(inputSignup.name);
	expect(outputGetAccount?.email).toBe(inputSignup.email);
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
	expect(outputGetAccount?.name).toBe(inputSignup.name);
	expect(outputGetAccount?.email).toBe(inputSignup.email);
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

	const logger: Logger = {
		log (message: string): void {}
	}

	const accountDAO = new AccountRepositoryDatabase(databaseConnection);

	const signup = new Signup(accountDAO, logger);
	const getAccount = new GetAccount(accountDAO);

	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();

	const outputGetAccount = await getAccount.execute(outputSignup.accountId);

	expect(outputGetAccount?.name).toBe(inputSignup.name);
	expect(outputGetAccount?.email).toBe(inputSignup.email);
})

afterEach(async () => {
	await databaseConnection.close();
})