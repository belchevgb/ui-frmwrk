export class FactoryProvider {
    constructor(public factory: () => any, public as: any) {}
}