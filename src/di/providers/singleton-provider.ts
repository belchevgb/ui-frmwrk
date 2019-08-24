import { IConstructible } from "../interfaces";

export class SingletonProvider {
    constructor(public use: IConstructible, public as: any) { }
}