import { Injectable, registerType, resolve } from "../../../src/di";


describe("injection-root: errors tests", () => {
    it("resolve() of not registered member should throw", () => {
        @Injectable
        class A { }

        @Injectable
        class B { }

        registerType(A);

        expect(() => resolve(B)).toThrowMatching((err: Error) => {
            if (err.message.includes(`There is no registration for ${B}`)) {
                return true;
            }

            return false;
        });
    });
});