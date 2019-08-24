import { Injectable, registerSingleton, resolve, registerType } from "../../../src/di";

describe("injection-root: registerSingleton() tests", () => {
    it("registerSingleton() should return the same object everytime", () => {
        let timesCreated = 0;

        @Injectable
        class A {
            constructor() {
                timesCreated++;
            }
        }

        registerSingleton(A);

        for (let i = 0; i < 5; i++) {
            const dep = resolve(A);
            expect(dep instanceof A).toBe(true);
        }

        expect(timesCreated).toBe(1);
    });

    it("should resolve singleton parameter correctly", () => {
        let timesCreated = 0;

        @Injectable
        class A {
            constructor() {
                timesCreated++;
            }
        }

        @Injectable
        class B { constructor(public a: A) { } }

        registerSingleton(A);
        registerType(B);

        for (let i = 0; i < 5; i++) {
            const dep = resolve(B);

            expect(dep instanceof B).toBe(true);
            expect(dep.a instanceof A).toBe(true);
        }

        expect(timesCreated).toBe(1);
    });

    it("should resolve singleton by other type", () => {
        @Injectable
        class A { }

        @Injectable
        class AA { }

        registerSingleton(A, AA);

        const dep = resolve(AA);
        expect(dep instanceof A).toBe(true);
    });
});