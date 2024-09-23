export class Name {
    constructor(readonly value: string) {
		if (this.isInvalidName(value)) throw new Error("Invalid name");
        
    }

    isInvalidName(name: string){
		return !name.match(/[a-zA-Z] [a-zA-Z]+/)
	}
}