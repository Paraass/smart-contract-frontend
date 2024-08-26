// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Function_Frontend {
    string public message;
    uint256 public counter;
    address public owner;

    event MessageSet(string message);
    event CounterIncremented(uint256 counter);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(string memory initialMessage) {
        message = initialMessage;
        counter = 0;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function incrementCounter() public {
        counter += 1;
        emit CounterIncremented(counter);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function appendToMessage(string memory additionalMessage) public {
        message = additionalMessage;
        emit MessageSet(message);
    }
}
