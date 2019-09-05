export abstract class ApplicationEvent<T> {
    constructor(public data: T) {}
}