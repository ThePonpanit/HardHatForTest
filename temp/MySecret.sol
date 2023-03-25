// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
contract Secret {
    string public secret;
    address public owner;
    constructor(string memory _secret) {
        owner = msg.sender;
        secret = _secret;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can change the message.");
        _;
    }
    function changeSecret(string memory _secret) public onlyOwner {
        secret = _secret;
    }
}