async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

   const FundingPool = await ethers.getContractFactory("FundingPool");
  const fundingPool = await FundingPool.deploy();
 console.log("FundingPool deployed to:", fundingPool.target);

   const Governance = await ethers.getContractFactory("Governance");
 const governance = await Governance.deploy(fundingPool.target); 
  console.log("Governance deployed to:", governance.target);
console.log("Setting governance contract address in FundingPool...");
const tx = await fundingPool.setGovernanceContract(governance.target);
  await tx.wait(); 
  console.log("Contracts linked successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});