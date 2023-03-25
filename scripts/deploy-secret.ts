import { ethers } from "hardhat";

async function main() {
  const Secret = await ethers.getContractFactory("Secret");
  const secret = await Secret.deploy("Really Secret Message");
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});