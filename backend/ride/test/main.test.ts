import axios from "axios"

axios.defaults.validateStatus = function() {
	return true;
}

test.each([
	"97456321558",
	"71428793860",
	"87748248800",
])("Deve criar uma conta para o passageiro pela API", async function(cpf: string){
	//given
	const inputSignup = {
		name: "John doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf,
		isPassenger: true,
		password: "123456"
	};

	//when
	const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup)
	const outputSignup = responseSignup.data
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`)
	const outputGetAccount = responseGetAccount.data
	//then
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe("John doe");
	expect(outputGetAccount.email).toBe(inputSignup.email);
})

test("Não deve criar conta se o nome for inválido", async function(){
	//given
	const inputSignup = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};

	//when
	const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
	expect(responseSignup.status).toBe(422);
	const outputSignup = responseSignup.data;
	expect(outputSignup.message).toBe('Invalid name');
})

test("Não deve criar conta se o email for inválido", async function(){
	//given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};

	//when
	const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
	expect(responseSignup.status).toBe(422);
	const outputSignup = responseSignup.data;
	expect(outputSignup.message).toBe('Invalid email');
})

test.each([
	"",
	undefined,
	null,
	"11111111111",
	"111",
	"1111111111111"
])("Não deve criar conta se o cpf for inválido", async function(cpf: any){
	//given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf,
		isPassenger: true,
		password: "123456"
	};

	//when
	const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
	expect(responseSignup.status).toBe(422);
	const outputSignup = responseSignup.data;
	expect(outputSignup.message).toBe('Invalid cpf');
})

test("Não deve criar conta se o email for duplicado", async function(){
	//given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};

	//when
	await axios.post("http://localhost:3000/signup", inputSignup);
	const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
	expect(responseSignup.status).toBe(422);
	const outputSignup = responseSignup.data;
	expect(outputSignup.message).toBe('Duplicated account');
})

test("Deve criar conta para o motorista", async function(){
	//given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: 'AAA9999',
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};

	//when
	const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup)
	const outputSignup = responseSignup.data
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`)
	const outputGetAccount = responseGetAccount.data
	
	//then
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
})

test("Não deve criar conta para o motorista com a placa inválida", async function(){
	//given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: 'AAA999',
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};

	//when
	const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
	expect(responseSignup.status).toBe(422);
	const outputSignup = responseSignup.data;
	expect(outputSignup.message).toBe('Invalid car plate');	
})