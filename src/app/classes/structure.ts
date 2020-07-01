export class Structure {
    private name: string;

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    constructor(name: string) {
        this.name = name;
    }
}