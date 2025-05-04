import { ethers } from "hardhat";

async function main() {
    try {
        const [deployer] = await ethers.getSigners();
        console.log("Deploying LoanSystem contract with the account:", deployer.address);

        // Get balance using provider
        const balance = await ethers.provider.getBalance(deployer.address);
        console.log("Account balance:", ethers.formatEther(balance), "SMR");

        const LoanSystem = await ethers.getContractFactory("LoanSystem");

        // Deploy with minimum required gas price
        const loanSystem = await LoanSystem.deploy({
            gasLimit: 5000000,
            gasPrice: ethers.parseUnits("10", "gwei"), // Minimum required gas price
            nonce: await ethers.provider.getTransactionCount(deployer.address),
        });

        console.log("Waiting for deployment...");
        await loanSystem.waitForDeployment();

        const address = await loanSystem.getAddress();
        console.log("LoanSystem deployed to:", address);

        // Verify deployment
        const code = await ethers.provider.getCode(address);
        if (code === "0x") {
            console.error("Contract deployment failed - no code at address");
        } else {
            console.log("Contract deployed successfully!");
            console.log("Contract code length:", code.length);
        }

    } catch (error) {
        console.error("Deployment failed with error:");
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            if (error.stack) {
                console.error("Error stack:", error.stack);
            }
        } else {
            console.error("Unknown error:", error);
        }
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 