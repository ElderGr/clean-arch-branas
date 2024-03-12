import axios from "axios"
import { Signup } from "../src/Signup";
import { GetAccount } from "../src/GetAccount";

axios.defaults.validateStatus = function() {
	return true;
}

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
	signup = new Signup();
	getAccount = new GetAccount();
})

test("Deve criar conta para o passageiro", async function(){
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};

	const outputSignup = await signup.execute(inputSignup);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);

	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
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