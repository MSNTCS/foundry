import { expect } from "chai";
import "mocha";
import { blake256 } from "../utils";

it("result of blake256 is 64 hex decimal", () => {
    const hash = blake256("some string");
    expect(hash.length).to.equal(64);
});
