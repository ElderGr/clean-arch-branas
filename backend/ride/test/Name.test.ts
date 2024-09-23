import { Name } from "../src/domain/Name";

test("Deve testar um nome válido", function(){
    const name = "John Doe";
    expect(name).toBe("John Doe");
})

test("Deve testar um nome inválido", function(){
    expect(() => new Name("Jonh")).toThrow(new Error("Invalid name"));
})