import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lottery", function () {
  let Lottery: any, lottery: any, owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.connect(owner).deploy();
  });

  it("should revert if the manager tries to pick a winner with no players", async function () {
    await expect(lottery.connect(owner).pickWinner()).to.be.revertedWith(
      "Need at least one player."
    );
  });
});
