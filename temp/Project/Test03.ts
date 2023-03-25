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

  describe("Pick Winner", function () {
    it("does not allow picking a winner with no players", async function () {
      const { owner, lottery } = await loadFixture(deployFixture);
      await expect(lottery.connect(owner).pickWinner()).to.be.revertedWith("Need at least one player.");
    });
  });
});
