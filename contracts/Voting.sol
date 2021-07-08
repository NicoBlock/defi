 // SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.0.0/contracts/access/Ownable.sol";
import "@OpenZeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus status;

    event VoterRegistered(address voterAddress);
    event ProposalsRegistrationStarted();
    event ProposalsRegistrationEnded();
    event ProposalRegistered(uint proposalId);
    event VotingSessionStarted();
    event VotingSessionEnded();
    event Voted (address voter, uint proposalId);
    event VotesTallied();
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    mapping(address => Voter) voters;
    mapping(uint => Proposal) proposals;
    string desc;
    uint proposalId;
    uint nbrVotes;
    uint winningProposalId;

    /// @dev contract's owner registers voters adding address to a whitelist
    function registerToVote(address _address) public onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Registering closed");
        require(!voters[_address].isRegistered, "Voter already registered");

        voters[_address].isRegistered = true;

        emit VoterRegistered(_address);
    }

    /// @dev owner starts the proposal registration session
    function openProposalRegistration() public onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Not yet open");
        status = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /// @dev registered voters can send their proposition while the session is open
    /// @param _description string is proposal's description
    function sendYourProposition(string memory _description) public {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Proposal session closed");
        require(voters[msg.sender].isRegistered, "You are not registered");

        proposalId++;
        proposals[proposalId].description = _description;

        emit ProposalRegistered(proposalId);
    }

    /// @dev contract's owner ends the proposal registration session
    function closeProposalRegistration() public onlyOwner {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Not yet open");
        status = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /// @dev contract's owner starts the proposal voting session
    function openVoteSession() public onlyOwner {
        require(status == WorkflowStatus.ProposalsRegistrationEnded, "Not yet possible");
        status = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /// @dev registered voters vote for their favorite proposition
    /// @notice nbrVotes holds current max count, if new vote get higher value, it replaces it & proposal ID is stored in winningProposalId
    /// @notice desc holds description string corresponding to nbrVotes
    function voteFor(uint _proposalId) public returns (uint) {
        require(status == WorkflowStatus.VotingSessionStarted, "Voting session closed");
        require(voters[msg.sender].isRegistered, "Unregistered, cannot vote");
        require(!voters[msg.sender].hasVoted, "Already voted");

        voters[msg.sender].votedProposalId = _proposalId;
        voters[msg.sender].hasVoted = true;

        proposals[_proposalId].voteCount++;

        if (proposals[_proposalId].voteCount > nbrVotes) {
            nbrVotes = proposals[_proposalId].voteCount;
            winningProposalId = _proposalId;
            desc = proposals[_proposalId].description;
        }

        emit Voted(msg.sender, _proposalId);
        return winningProposalId;
    }

    /// @dev contract's owner ends the proposal voting session
    function closeVoteSession() public onlyOwner {
        require(status == WorkflowStatus.VotingSessionStarted, "Not yet open");
        status = WorkflowStatus.VotingSessionEnded;

        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /// @dev contract's owner ends voting session
    /// @notice winning proposal ID is officially the winningProposalId value already set
    function countVotes() public onlyOwner {
        require(status == WorkflowStatus.VotingSessionEnded, "Nothing to count yet");
        status = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
        emit VotesTallied();
    }

    /// @dev proposition ID is publically viewable once session has ended
    /// @return winning proposition ID and corresponding description string
    function winner() public view returns (uint, string memory) {
        require(status == WorkflowStatus.VotesTallied, "No winner yet");

        return (winningProposalId, desc);
    }

    /// @dev get status for handling the corresponding UI components
    function getStatus() public view returns (WorkflowStatus) {
      return status;
    }

    /// @dev get winning proposition description to return to the UI
    function getPropositionDescription() public view returns (string memory) {
      return desc;
    }

    /// @dev get submitted proposition ID to return to the UI
    function getProposalId() public view returns (uint) {
      return proposalId;
    }

    /// @dev get number of votes to return to the UI
    function getNumberOfVotes() public view returns (uint) {
      return nbrVotes;
    }

    /// @dev get winning proposition ID to return to the UI
    function getWinningProposalId() public view returns (uint) {
      return winningProposalId;
    }

}
