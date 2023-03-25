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

  describe("Enter Lottery", function () {
    it("does not allow entering with less than 0.1 ether", async function () {
      const { owner, lottery } = await loadFixture(deployFixture);
      const [p1] = await ethers.getSigners();
      const value = ethers.utils.parseEther("0.05");
      await expect(lottery.connect(p1).enter({ value })).to.be.revertedWith("Please send at least 0.1 ETH.");
    });
  });
});
