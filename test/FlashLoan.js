const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString())
}

describe("FlashLoan", () => {
    let token, flashLoan, flashLoanReceiver
    let deployer

    beforeEach(async () => {
        //Setup accounts
        accounts = await ethers.getSigners()
        deployer = accounts[0]

        //Load Account
        const FlashLoan = await ethers.getContractFactory("FlashLoan")
        const FlashLoanReceiver = await ethers.getContractFactory("FlashLoanReceiver")
        const Token = await ethers.getContractFactory("Token")
        //Deploy Token
        token = await Token.deploy("Dapp University", "DAPP", "1000000")

        //Deploy Flash Loan Pool
        flashLoan = await FlashLoan.deploy(token.address)

        //approve tokens before depositing
        transaction = await flashLoan.connect(deployer).approve(flashLoan.address, tokens(1000000))
        await transaction.wait()

        //Deposit tokens into the pool
        let transaction = await flashLoan.connect(player).depositTokens(token(1000000))
        await transaction.wait()

        //Deploy Flashloan receiver
        flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.address)
    })

    describe("Deployment", () => {
        it("Sends tokens to the flash loan pool contract", async () => {
            expect(await token.balanceOf(flashLoan.address)).to.equal(tokens(1000000))
        })
    })

    describe("Borrowing funds", () => {
        it("borrows funds from the pool", async () => {
            let amount = tokens(100)
            let transaction = await flashLoanReceiver.connect(player).executeFlashLoan(amount)
            let result = await transaction.wait()

            await expect(transaction)
                .to.emit(flashLoanReceiver, "LoanReceived")
                .withArgs(token.address, amount)
        })
    })
})
