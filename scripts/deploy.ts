import { ethers } from "hardhat";
 
async function main() {
  const K3LtokenFactory = await ethers.getContractFactory("K3Ltoken");
  const k3lToken = await K3LtokenFactory.deploy();
 
  await k3lToken.waitForDeployment();
  const address = await k3lToken.getAddress();
 
  console.log(`Contract K3Ltoken deployed to ${address}!`);
}
 
// Recomendado este padrão para poder usar async/await em todos os lugares
// e lidar corretamente com erros.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});