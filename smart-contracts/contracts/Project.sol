pragma solidity ^0.8.20;

contract Project {
    struct Milestone {
        string description;
        uint256 fundingAmount;
        bool completed;
        bool fundsReleased;
    }

    address public projectApplicant;
    uint256 public totalFundingGoal;
    uint256 public fundsReceived;
    Milestone[] public milestones;

    constructor(address _applicant, uint256 _fundingGoal) {
        projectApplicant = _applicant;
        totalFundingGoal = _fundingGoal;
    }
}