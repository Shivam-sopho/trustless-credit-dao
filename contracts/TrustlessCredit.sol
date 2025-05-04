// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TrustlessCredit {
    struct CreditRecord {
        address borrower;
        uint256 amount;
        uint256 interestRate;
        uint256 term;
        uint256 startTime;
        bool isActive;
    }

    mapping(uint256 => CreditRecord) public creditRecords;
    uint256 public recordCount;

    event CreditRecordCreated(
        uint256 indexed recordId,
        address indexed borrower,
        uint256 amount,
        uint256 interestRate,
        uint256 term
    );

    event CreditRecordClosed(uint256 indexed recordId);

    function createCreditRecord(
        uint256 _amount,
        uint256 _interestRate,
        uint256 _term
    ) external returns (uint256) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_interestRate > 0, "Interest rate must be greater than 0");
        require(_term > 0, "Term must be greater than 0");

        uint256 recordId = recordCount++;
        creditRecords[recordId] = CreditRecord({
            borrower: msg.sender,
            amount: _amount,
            interestRate: _interestRate,
            term: _term,
            startTime: block.timestamp,
            isActive: true
        });

        emit CreditRecordCreated(
            recordId,
            msg.sender,
            _amount,
            _interestRate,
            _term
        );

        return recordId;
    }

    function closeCreditRecord(uint256 _recordId) external {
        require(_recordId < recordCount, "Record does not exist");
        CreditRecord storage record = creditRecords[_recordId];
        require(record.isActive, "Record is already closed");
        require(
            msg.sender == record.borrower,
            "Only borrower can close the record"
        );

        record.isActive = false;
        emit CreditRecordClosed(_recordId);
    }

    function getCreditRecord(
        uint256 _recordId
    )
        external
        view
        returns (
            address borrower,
            uint256 amount,
            uint256 interestRate,
            uint256 term,
            uint256 startTime,
            bool isActive
        )
    {
        require(_recordId < recordCount, "Record does not exist");
        CreditRecord storage record = creditRecords[_recordId];
        return (
            record.borrower,
            record.amount,
            record.interestRate,
            record.term,
            record.startTime,
            record.isActive
        );
    }
} 