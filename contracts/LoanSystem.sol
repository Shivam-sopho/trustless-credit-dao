// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LoanSystem {
    struct LoanRequest {
        address borrower;
        uint256 amount;
        uint256 duration;
        string purpose;
        string metadata;
        uint256 timestamp;
        bool isApproved;
        uint256 creditScore;
        uint256 fraudScore;
        string aiReasoning;
    }

    struct Loan {
        address borrower;
        uint256 amount;
        uint256 duration;
        uint256 interestRate;
        uint256 startTime;
        uint256 dueTime;
        bool isRepaid;
        uint256 creditScore;
        string aiReasoning;
    }

    address public owner;
    mapping(address => LoanRequest[]) public loanRequests;
    mapping(address => Loan[]) public activeLoans;
    uint256 public totalLoans;
    uint256 public constant MIN_CREDIT_SCORE = 600;
    uint256 public constant MAX_FRAUD_SCORE = 50;

    event LoanRequested(
        address indexed borrower,
        uint256 amount,
        uint256 duration,
        string purpose
    );
    event LoanApproved(
        address indexed borrower,
        uint256 amount,
        uint256 duration,
        uint256 creditScore
    );
    event LoanRejected(
        address indexed borrower,
        uint256 amount,
        uint256 creditScore,
        string reason
    );
    event LoanRepaid(
        address indexed borrower,
        uint256 amount,
        uint256 loanId
    );

    constructor() {
        owner = msg.sender;
    }

    function requestLoan(
        uint256 _amount,
        uint256 _duration,
        string calldata _purpose,
        string calldata _metadata,
        uint256 _creditScore,
        uint256 _fraudScore,
        string calldata _aiReasoning
    ) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(bytes(_purpose).length > 0, "Purpose cannot be empty");

        loanRequests[msg.sender].push(LoanRequest({
            borrower: msg.sender,
            amount: _amount,
            duration: _duration,
            purpose: _purpose,
            metadata: _metadata,
            timestamp: block.timestamp,
            isApproved: false,
            creditScore: _creditScore,
            fraudScore: _fraudScore,
            aiReasoning: _aiReasoning
        }));

        emit LoanRequested(msg.sender, _amount, _duration, _purpose);
    }

    function approveLoan(
        address _borrower,
        uint256 _requestId,
        uint256 _interestRate
    ) external {
        require(msg.sender == owner, "Only owner can approve loans");
        require(_requestId < loanRequests[_borrower].length, "Invalid request ID");
        
        LoanRequest storage request = loanRequests[_borrower][_requestId];
        require(!request.isApproved, "Loan already approved");
        require(request.creditScore >= MIN_CREDIT_SCORE, "Credit score too low");
        require(request.fraudScore <= MAX_FRAUD_SCORE, "Fraud risk too high");

        request.isApproved = true;
        
        activeLoans[_borrower].push(Loan({
            borrower: _borrower,
            amount: request.amount,
            duration: request.duration,
            interestRate: _interestRate,
            startTime: block.timestamp,
            dueTime: block.timestamp + request.duration,
            isRepaid: false,
            creditScore: request.creditScore,
            aiReasoning: request.aiReasoning
        }));

        totalLoans++;

        emit LoanApproved(
            _borrower,
            request.amount,
            request.duration,
            request.creditScore
        );
    }

    function rejectLoan(
        address _borrower,
        uint256 _requestId,
        string calldata _reason
    ) external {
        require(msg.sender == owner, "Only owner can reject loans");
        require(_requestId < loanRequests[_borrower].length, "Invalid request ID");
        
        LoanRequest storage request = loanRequests[_borrower][_requestId];
        require(!request.isApproved, "Loan already approved");

        emit LoanRejected(
            _borrower,
            request.amount,
            request.creditScore,
            _reason
        );
    }

    function repayLoan(uint256 _loanId) external payable {
        require(_loanId < activeLoans[msg.sender].length, "Invalid loan ID");
        Loan storage loan = activeLoans[msg.sender][_loanId];
        require(!loan.isRepaid, "Loan already repaid");
        
        uint256 totalAmount = loan.amount + 
            (loan.amount * loan.interestRate * loan.duration) / (365 days * 100);
        
        require(msg.value >= totalAmount, "Insufficient payment");

        loan.isRepaid = true;
        
        emit LoanRepaid(msg.sender, loan.amount, _loanId);
    }

    function getLoanRequests(address _borrower) external view returns (LoanRequest[] memory) {
        return loanRequests[_borrower];
    }

    function getActiveLoans(address _borrower) external view returns (Loan[] memory) {
        return activeLoans[_borrower];
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
    }
} 