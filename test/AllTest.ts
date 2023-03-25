import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Lottery", function () {
  async function deployFixture() {
    const [owner, p1, p2, p3, p4, p5] = await ethers.getSigners();
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.connect(owner).deploy();
    await lottery.connect(p1).enter({ value: ethers.utils.parseEther("1.0") });
    await lottery.connect(p2).enter({ value: ethers.utils.parseEther("0.5") });
    await lottery.connect(p3).enter({ value: ethers.utils.parseEther("0.25") });
    await lottery.connect(p4).enter({ value: ethers.utils.parseEther("0.25") });
    await lottery.connect(p5).enter({ value: ethers.utils.parseEther("0.5") });
    const totalMoney = ethers.utils.parseEther("2.5");
    return { owner, lottery, p1, p2, p3, p4, p5, totalMoney };
  }

  describe("Deployment", function () {
    it("sets the manager as the deployer address", async function () {
      const [owner] = await ethers.getSigners();
      const Lottery = await ethers.getContractFactory("Lottery");
      const lottery = await Lottery.connect(owner).deploy();
      const manager = await lottery.manager();
      expect(manager).to.equal(owner.address);
    });
  });

  describe("Entering", function () {
    it("allows a player to enter the lottery", async function () {
      const { lottery, p1 } = await loadFixture(deployFixture);
      await expect(lottery.connect(p1).enter({ value: ethers.utils.parseEther("0.11") })).to.not.be.reverted;
    });

    it("does not allow a player to enter the lottery with less than 0.1 ether", async function () {
      const { lottery, p1 } = await loadFixture(deployFixture);
      await expect(lottery.connect(p1).enter({ value: ethers.utils.parseEther("0.05") })).to.be.revertedWith("Please send at least 0.1 ETH.");
    });
  });

  describe("Getting Players", function () {
    it("returns the correct list of players", async function () {
      const { lottery, p1, p2, p3, p4, p5 } = await loadFixture(deployFixture);
      const players = await lottery.getPlayers();
      expect(players).to.have.lengthOf(5);
      expect(players[0]).to.equal(p1.address);
      expect(players[1]).to.equal(p2.address);
      expect(players[2]).to.equal(p3.address);
      expect(players[3]).to.equal(p4.address);
      expect(players[4]).to.equal(p5.address);
    });
  });

  describe("Picking Winner", function () {
    it("does not allow the manager to pick a winner if there are no players", async function () {
      const [owner] = await ethers.getSigners();
      const Lottery = await ethers.getContractFactory("Lottery");
      const lottery = await Lottery.connect(owner).deploy();
      await expect(lottery.connect(owner).pickWinner()).to.be.revertedWith("Need at least one player.");
    });

    it("only allows owner to pick winner - lottery", async function () {
      const { owner, lottery, p1 } = await loadFixture(deployFixture);
      await expect(lottery.connect(p1).pickWinner()).to.be.reverted;
      await expect(lottery.connect(owner).pickWinner()).to.not.be.reverted;
    });

    it("returns the player the winning prize - lottery", async function () {
      const { owner, lottery, p1, p2, p3, p4, p5, totalMoney } =
        await loadFixture(deployFixture);

      const initBalances = [];
      initBalances.push(await p1.getBalance());
      initBalances.push(await p2.getBalance());
      initBalances.push(await p3.getBalance());
      initBalances.push(await p4.getBalance());
      initBalances.push(await p5.getBalance());

      await lottery.connect(owner).pickWinner();

      const ps = [p1, p2, p3, p4, p5];
      let idx = 0;
      for await (const p of ps) {
        const bal = await ps[idx].getBalance();
        const initBal = initBalances[idx];
        if (bal.gt(initBal)) {
          expect(bal).to.be.equal(initBal.add(totalMoney));
        } else {
          expect(bal).to.be.equal(initBal);
        }
        idx++;
      }
    });
  });
});
