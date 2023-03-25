import { expect } from "chai";

function double(a: number) {
  return a * 2;
}

describe("Set 3", function () {
  it("equals 1", function () {
    expect(double(1)).to.be.equal(2);
  });
  it("is greater than 1", function () {
    expect(double(2)).to.be.greaterThan(3);
  });
  it("is not equal to itself", function () {
    expect(double(10)).to.not.be.equal(10);
  });
});