import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lottery", function () {
  let Lottery: any, lottery: any, owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.connect(owner).deploy();
  });

  it("should set the manager to the address of the deployer", async function () {
    const manager = await lottery.manager();
    expect(manager).to.equal(owner.address);
  });
});
