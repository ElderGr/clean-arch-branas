import Account from "../src/domain/Account";

test("Deve criar uma conta", function(){
    const account = Account.create(
        "Jonh Doe",
        'jonh.doe@gmail.com',
        "97456321558",
        '',
        true,
        false
    );

    expect(account.accountId).toBeDefined();
    expect(account.name.value).toBe('Jonh Doe');
    expect(account.email.value).toBe('jonh.doe@gmail.com');
    expect(account.cpf.value).toBe('97456321558');
})