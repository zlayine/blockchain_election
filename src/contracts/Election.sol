pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Election is Ownable {
    string public name = "Election";

    struct Candidate {
        uint256 id;
        uint256 voteCount;
        string name;
        address candidate;
    }

    struct Voter {
        uint256 id;
        bool voted;
        string name;
        address voter;
    }

    mapping(uint256 => Voter) public voters;
    mapping(uint256 => Candidate) public candidates;

    mapping(address => uint256) public addressToCandidateId;
    mapping(address => uint256) public addressToVoterId;

    event CandidateAdded(
        uint256 id,
        uint256 voteCount,
        string name,
        address candidate
    );

    event VoterRegistered(uint256 id, string name, address voter);

    event ElectionDateUpdated(uint256 time);

    event VoteCasted(
        uint256 id,
        bool voted,
        string name,
        address voter,
        uint256 candidateId
    );

    event Log(uint256 data);

    uint256 public candidatesCount;
    uint256 public votersCount;

    uint256 public electionDate;

    function addCandidate(string memory _name, address _candidate)
        public
        onlyOwner
    {
        require(
            addressToCandidateId[_candidate] == 0,
            "Candidate already exists"
        );
        candidatesCount++;
        candidates[candidatesCount] = Candidate(
            candidatesCount,
            0,
            _name,
            _candidate
        );
        addressToCandidateId[_candidate] = candidatesCount;
        emit CandidateAdded(candidatesCount, 0, _name, _candidate);
    }

    function setElectionDate(uint256 _time) public {
        require(
            _time >= block.timestamp,
            "Time must be higher than the current time"
        );
        electionDate = _time;
        emit ElectionDateUpdated(_time);
    }

    function registerVoter(string memory _name) public {
        require(addressToVoterId[msg.sender] == 0, "Voter already exists");
        require(block.timestamp < electionDate, "Registrations are closed");
        votersCount++;
        voters[votersCount] = Voter(votersCount, false, _name, msg.sender);
        addressToVoterId[msg.sender] = votersCount;
        emit VoterRegistered(votersCount, _name, msg.sender);
    }

    function castVote(uint256 _candidateId) public {
        uint256 voterId = addressToVoterId[msg.sender];
        require(voterId != 0, "Voter not registered");
        require(_candidateId > 0, "Candidate does not exist");
        require(
            candidates[_candidateId].candidate != address(0),
            "Candidate does not exist"
        );
        require(
            block.timestamp >= electionDate,
            "Election has ended, Votes cannot be accepted"
        );
        Voter memory voter = voters[voterId];
        require(voter.voted == false, "Voter already voted");
        voter.voted = true;
        voters[voterId] = voter;
        Candidate memory candidate = candidates[_candidateId];
        candidate.voteCount++;
        candidates[_candidateId] = candidate;
        emit VoteCasted(
            voter.id,
            voter.voted,
            voter.name,
            msg.sender,
            candidate.id
        );
    }

    function getWinnerCandidate()
        public
        view
        returns (uint256 id, uint voteCount, string memory name)
    {
        Candidate memory winner;
        winner = candidates[1];
        for (uint256 i = 1; i <= candidatesCount; i++) {
					if (candidates[i].voteCount > winner.voteCount)
						winner = candidates[i];
				}
        return (winner.id, winner.voteCount, winner.name);
    }
}
