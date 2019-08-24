import { IConstructible } from "../interfaces";

export class InstantiateProvider {
    constructor(public use: IConstructible, public as: any) {}
}