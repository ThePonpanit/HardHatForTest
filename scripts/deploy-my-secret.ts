import { ethers } from "hardhat";

async function main() {
  const Secret = await ethers.getContractFactory("MySecret");
  const secret = await Secret.deploy("My Super Secret!");
}

main()
  .then(() => console.log("Deploy Successfully"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });