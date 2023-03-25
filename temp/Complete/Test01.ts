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

  describe("Winning", function () {
    it("only allows owner to pick winner - lottery", async function () {
      const { owner, lottery, p1 } = await loadFixture(deployFixture);
      await expect(lottery.connect(p1).pickWinner()).to.be.reverted;
      await expect(lottery.connect(owner).pickWinner()).to.not.be.reverted;
    });

    it("return the player the winning price - lottery", async function () {
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