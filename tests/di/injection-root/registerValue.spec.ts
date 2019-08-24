import { registerValue, resolve } from "../../../src/di";

describe("injection-root: registerValue() tests", () => {
    it("registeregisterValue() should return corrrect object", () => {
        const values = ["str", 1, { message: "hello" }, function d () { }];

        for (const val of values) {
            registerValue(val, val);

            const dep = resolve(val);
            expect(dep).toBe(val);
        }
    });
});