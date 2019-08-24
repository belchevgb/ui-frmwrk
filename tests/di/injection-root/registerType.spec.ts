import { Injectable, registerType, resolve } from "../../../src/di";

describe("injection-root: registerType() tests", () => {
    it("should register type with one dependency and should be resolved correctly", () => {
        @Injectable
        class B { }

        @Injectable
        class A { constructor(public b: B) { } }

        registerType(B);
        registerType(A);

        const dep: A = resolve(A);

        expect(dep instanceof A).toBe(true);
        expect(dep.b instanceof B).toBe(true);
    });

    it("should register type by another type", () => {
        @Injectable
        class B { }

        @Injectable
        class A { }

        registerType(A, B);

        const dep = resolve(B);
        expect(dep instanceof A).toBe(true);
    });

    it("should register type as self and should be resolved correctly", () => {
        @Injectable
        class A { constructor() { } }

        registerType(A);

        const dep: A = resolve(A);
        expect(dep instanceof A).toBe(true);
    });
});