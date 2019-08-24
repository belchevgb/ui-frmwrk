import { Injectable, registerType, registerSingleton, registerValue, registerFactory } from "../../../src/di";
import { resolveAll } from "../../../src/di/resolver";

describe("injection-root: resolveAll() tests", () => {
    it("resolveAll() should return corrrect objects", () => {
        @Injectable
        class Base { }

        @Injectable
        class A { }

        @Injectable
        class C { }

        const str = "str";
        const factoryValue = "value";
        const factory = { create() { return factoryValue; } };

        registerType(A, Base, true);
        registerSingleton(C, Base, true);
        registerValue(Base, str, true);
        registerFactory(factory.create, Base, true);

        const values = resolveAll(Base);

        expect(values.find(x => x instanceof A)).toBeTruthy();
        expect(values.find(x => x instanceof C)).toBeTruthy();
        expect(values.find(x => x === factoryValue)).toBeTruthy();
        expect(values.find(x => x === str)).toBeTruthy();
    });
});