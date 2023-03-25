import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Lottery", function () {
  async function deployFixture() {
    const [owner] = await ethers.getSigners();
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.connect(owner).deploy();
    return { owner, lottery };
  }

  describe("Deployment", function () {
    it("Is the manager same as the contract deployer ?", async function () {
      const { owner, lottery } = await loadFixture(deployFixture);
      const manager = await lottery.manager();
      expect(manager).to.equal(owner.address);
    });
  });
});