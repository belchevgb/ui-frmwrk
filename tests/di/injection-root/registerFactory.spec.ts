import { Injectable, registerFactory, resolve } from "../../../src/di";

describe("injection-root: registerFactory() tests", () => {
    it("registerFactory() should call the factory function", () => {
        @Injectable
        class A { }

        const factory = { create() { return new A(); } };
        const spy = spyOn(factory, "create");

        registerFactory(factory.create, A);
        resolve(A);

        expect(spy.calls.count()).toBe(1);
    });
});