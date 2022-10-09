const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Reentrancy", () => {
    let deployer
    let bank, attackerContract

    beforeEach(async () => {
        ;[deployer, user, attacker] = await ethers.getSigners()

        const Bank = await ethers.getContractFactory("Bank", deployer)
        bank = await Bank.deploy()

        await bank.deposit({ value: ethers.utils.parseEther("100") })
        await bank.connect(user).deposit({ value: ethers.utils.parseEther("50") })

        const Attacker = await ethers.getContractFactory("Attacker", attacker)
        attackerContract = await Attacker.deploy(bank.address)
    })

    describe("facilitates deposits and withdraw", () => {
        it("accepts deposits", async () => {
            const depoyerBalance = await bank.balanceOf(deployer.address)
            expect(depoyerBalance).to.equal(ethers.utils.parseEther("100"))

            const userBalance = await bank.balanceOf(user.address)
            expect(userBalance).to.equal(ethers.utils.parseEther("50"))
        })
        it("accepts withdraws", async () => {
            await bank.withdraw()

            const deployerBalance = await bank.balanceOf(deployer.address)
            const userBalance = await bank.balanceOf(user.address)

            expect(deployerBalance).to.equal(0)
            expect(userBalance).to.equal(ethers.utils.parseEther("50"))
        })
        it("allows attacker to drain funds from #withdraw()", async () => {
            console.log("***before***")
            console.log(
                `Bank balance ${ethers.utils.formatEther(
                    await ethers.provider.getBalance(bank.address)
                )}`
            )
            console.log(
                `Attacker balance ${ethers.utils.formatEther(
                    await ethers.provider.getBalance(bank.address)
                )}`
            )
            //perform attack
            await attackerContract.attack({ value: ethers.utils.parseEther("10") })

            //Check bank balance
            expect(await ethers.provider.getBalance(bank.address)).to.equal("0")
        })
    })
})
