// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CreditRecord {
    struct Record {
        uint256 amount;
        string description;
        uint256 timestamp;
        address creator;
    }

    mapping(address => Record[]) private _creditRecords;
    address public immutable owner;
    uint256 public totalDeposits;

    event RecordCreated(address indexed creator, uint256 amount, string description, uint256 timestamp);
    event DepositReceived(address indexed depositor, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function createCreditRecord(uint256 _amount, string calldata _description) external payable {
        require(_amount > 0, "Amount must be greater than 0");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(msg.value == _amount, "Payment amount must match the credit amount");

        _creditRecords[msg.sender].push(Record({
            amount: _amount,
            description: _description,
            timestamp: block.timestamp,
            creator: msg.sender
        }));

        totalDeposits += msg.value;
        
        emit RecordCreated(msg.sender, _amount, _description, block.timestamp);
        emit DepositReceived(msg.sender, msg.value);
    }

    function getCreditRecords(address _user) external view returns (Record[] memory) {
        return _creditRecords[_user];
    }

    function getRecordCount(address _user) external view returns (uint256) {
        return _creditRecords[_user].length;
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
} 