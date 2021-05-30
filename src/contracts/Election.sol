pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Election is Ownable {
	string public name = "Election";

	struct Candidate {
		uint id;
		uint voteCount;
		string name;
		address owner;
	}

	mapping(address => bool) public voters;
	mapping(uint => Candidate) public candidates;
	mapping(address => uint) public addressToCandidateId;

	event CandidateAdded(
		uint id,
		uint voteCount,
		string name,
		address owner
	);

	event VoterRegistered(
		address voter
	);

	event ElectionDateUpdated(
		uint time
	);

	event VoteCasted(
		address voter,
		uint candidateId
	);

	uint public candidatesCount;
	uint public votersCount;

	uint public electionDate;

	constructor(uint _time) {
		require(_time > block.timestamp, "Time must be higher than current time");
		electionDate = _time;
		
	}

	function addCandidate(string memory _name, address _candidate) public onlyOwner {
		require(addressToCandidateId[_candidate] != 0, "Candidate already exists");
		candidatesCount++;
		candidates[candidatesCount] = Candidate(candidatesCount, 0, _name, _candidate);
		addressToCandidateId[_candidate] = candidatesCount;
		emit CandidateAdded(candidatesCount, 0, _name, _candidate);
	}

	// test voter already voted
	// add register time limit
	function registerVoter() public {
		require(!voters[msg.sender], "Voter already exists");
		votersCount++;
		voters[msg.sender] = true;
		emit VoterRegistered(msg.sender);
	}

	// disable voting when time ends 
	function castVote(uint _candidateId) public {
		require(voters[msg.sender], "Voter not registered");
		require(candidates[_candidateId].owner == msg.sender, "Candidate does not exist");
		Candidate memory candidate = candidates[_candidateId];
		candidate.voteCount++;
		candidates[_candidateId] = candidate;
		voters[msg.sender] = false;
		emit VoteCasted(msg.sender, _candidateId);
	}

	// must get the candidate with the higher votes
	// function getWinnerCandidate(uint _candidateId) view public returns(uint) {
	// 	require(candidates[_candidateId], "Candidate does not exist");
	// 	return candidates[_candidateId];
	// }

}