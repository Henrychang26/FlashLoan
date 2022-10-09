// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
import "./FlashLoan.sol";

contract FlashLoanReceiver {

    FlashLoan private pool;
    address private owner;

    event LoanReceived(address token, uint256 amount);

    constructor(address _poolAddress){
        pool = FlashLoan(_poolAddress);
        owner = msg.sender;
    }

    function receiveTokens(address _tokenAddress, uint256 _amount) external{
        require(msg.sender == address(pool), "Sender must be pool" );
        
        require(Token(_tokenAddress).balanceOf(address(this)) == _amount, "failed to get loan");
        emit LoanReceived(_tokenAddress, _amount);

        require(Token(_tokenAddress).transfer(msg.sender, _amount), "Transfer of token failed");

    }

    function executeFlashLoan(uint256 _amount) external {
        require(owner == msg.sender, "only owner can execute flashloan");
        pool.flashLoan(_amount);
    }
}