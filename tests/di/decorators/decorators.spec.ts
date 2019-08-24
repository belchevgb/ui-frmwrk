import { Injectable, PropertyInjection, registerType, resolve, registerSingleton, Inject } from "../../../src/di";

describe("decorators tests", () => {
    describe("@PropertyInjection()", () => {
        it("should resolve single injection", () => {
            @Injectable class B { }
            @Injectable class A { @PropertyInjection({ injectionKey: B }) injectedProp; }

            registerType(A);
            registerType(B);

            const result: A = resolve(A);

            expect(result.injectedProp instanceof B).toBe(true);
        });

        it("should resolve multiple injection", () => {
            @Injectable class Base { }
            @Injectable class B { }
            @Injectable class S { }
            @Injectable class A { @PropertyInjection({ injectionKey: Base, multi: true }) injectedProp; }

            registerType(A);
            registerType(B, Base, true);
            registerSingleton(S, Base, true);

            const result: A = resolve(A);
            const prop: any[] = result.injectedProp;

            expect(prop.length).toBe(2);
            expect(prop[0] instanceof B).toBe(true);
            expect(prop[1] instanceof S).toBe(true);
        });
    });

    describe("@Inject()", () => {
        it("should resolve single injection", () => {
            @Injectable class B { }
            @Injectable class A { constructor(@Inject({ injectionKey: B }) public injectedProp: string) { } }

            registerType(A);
            registerType(B);

            const result: A = resolve(A);

            expect(<any>result.injectedProp instanceof B).toBe(true);
        });

        it("should resolve multiple injection", () => {
            @Injectable class Base { }
            @Injectable class B { }
            @Injectable class S { }
            @Injectable class A { constructor(@Inject({ injectionKey: Base, multi: true }) public injectedProp: string) { } }

            registerType(A);
            registerType(B, Base, true);
            registerSingleton(S, Base, true);

            const result: A = resolve(A);
            const prop = result.injectedProp as any;

            expect(prop.length).toBe(2);
            expect(prop[0] instanceof B).toBe(true);
            expect(prop[1] instanceof S).toBe(true);
        });
    });
});