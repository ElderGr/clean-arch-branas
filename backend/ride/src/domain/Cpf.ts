export class Cpf {
    constructor(readonly value: string) {
		if (!this.validateCpf(value)) throw new Error("Invalid cpf");
    }

    validateCpf (cpf: string) {
        if (!cpf) return false
        cpf = this.clean(cpf);
        if (this.isInvalidLength(cpf)) return false;
        if (this.allDigitsAreTheSame(cpf)) return false
        const dg1 = this.calculateDigit(cpf, 10)
        const dg2 = this.calculateDigit(cpf, 11)
        return this.extractCheckDigit(cpf) == `${dg1}${dg2}`;
    }
    
     clean (cpf: string){
        return cpf.replace(/\D/g,'')
    }
    
     isInvalidLength(cpf: string){
        return cpf.length !== 11
    }
    
     allDigitsAreTheSame(cpf: string){
        return cpf.split("").every(c => c === cpf[0])
    }
    
     calculateDigit(cpf: string, factor: number){
        let total = 0;
        for(const digit of cpf){
            if(factor > 1) total += parseInt(digit) * factor--;
        }
        const rest = total%11;
        return rest < 2 ? 0 : 11 - rest;
    }
    
    
     extractCheckDigit (cpf: string){
        return cpf.slice(9)
    }
}