import { expect } from "chai";
import { ethers } from "hardhat";

describe("Secret Message", function () {
  it("checks initial message", async function () {
    const MySecret = await ethers.getContractFactory("MySecret");
    const mySecret = await MySecret.deploy("My Super Secret!");
    expect(await mySecret.secret()).to.equal("My Super Secret!");
  });
});