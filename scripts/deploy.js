const hre = require("hardhat");

async function main() {
    const CreditRecord = await hre.ethers.getContractFactory("CreditRecord");
    const creditRecord = await CreditRecord.deploy();

    await creditRecord.waitForDeployment();

    console.log("CreditRecord deployed to:", await creditRecord.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 