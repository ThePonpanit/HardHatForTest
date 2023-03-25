import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lottery", function () {
  let Lottery: any, lottery: any, owner: any, player1: any, player2: any;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.connect(owner).deploy();
  });

  it("should revert if a player tries to enter with less than 0.1 ether", async function () {
    await expect(lottery.connect(player1).enter({ value: ethers.utils.parseEther("0.05") })).to.be.revertedWith(
      "Please send at least 0.1 ETH."
    );
    await expect(lottery.connect(player2).enter({ value: ethers.utils.parseEther("0.01") })).to.be.revertedWith(
      "Please send at least 0.1 ETH."
    );
  });
});
