// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Bank is ReentrancyGuard {
    using Address for address;

    mapping (address => uint256) balanceOf;

    function deposit() external payable {
        //deposit ether funds
        balanceOf[msg.sender] += msg.value;

    }

    //withdraw ether funds
    function withdraw() external nonReentrant {
        uint256 depositedAmount = balanceOf[msg.sender];
        payable(msg.sender).sendValue(depositedAmount);
        balanceOf[msg.sender] = 0;
    }
}