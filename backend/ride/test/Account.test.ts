import Account from "../src/Account";

test("Deve criar uma conta", function(){
    const account = new Account(
        "Jonh Doe",
        'jonh.doe@gmail.com',
        "97456321558",
        '',
        true,
        false
    );

    expect(account.accountId).toBeDefined();
    expect(account.name).toBe('Jonh Doe');
    expect(account.email).toBe('jonh.doe@gmail.com');
    expect(account.cpf).toBe('97456321558');
})