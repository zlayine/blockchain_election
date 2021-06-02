
const Election = artifacts.require("./Election.sol");

require('chai')
	.use(require('chai-as-promised'))
	.should();

contract("Election", ([alice, bob, john, frank, lee]) => {
	let election;

	before(async () => {
		election = await Election.deployed();
	});

	describe("deployment", async () => {
		it("deployed successfully", async () => {
			const address = election.address;
			assert.notEqual(address, 0x0);
			assert.notEqual(address, '');
			assert.notEqual(address, null);
			assert.notEqual(address, undefined);
		});

		it("has a name", async () => {
			const name = await election.name();
			assert.equal(name, "Election");
		})

	});

	describe("election workflow", async () => {
		let result;

		it("set election date", async () => {
			result = await election.setElectionDate(parseInt(new Date().getTime() / 1000) + 3600);
		})

		it("add candidate", async () => {
			result = await election.addCandidate("bob", bob, { from: alice });
			const event = result.logs[0].args;
			assert.equal(event.id, 1);
			assert.equal(event.voteCount, 0);
			assert.equal(event.name, "bob");
			assert.equal(event.candidate, bob);

			await election.addCandidate("bob", bob, { from: alice }).should.be.rejected;
			await election.addCandidate("john", john, { from: bob }).should.be.rejected;

		})

		it("add second candidate", async () => {
			result = await election.addCandidate("john", john, { from: alice });
			const event = result.logs[0].args;
			assert.equal(event.id, 2);
			assert.equal(event.voteCount, 0);
			assert.equal(event.name, "john");
			assert.equal(event.candidate, john);
		})

		it("register voter", async () => {
			result = await election.registerVoter("frank", { from: frank });
			const event = result.logs[0].args;
			assert.equal(event.id, 1);
			assert.equal(event.name, "frank");
			assert.equal(event.voter, frank);

			await election.registerVoter("frank", { from: frank }).should.be.rejected;
			
			await election.registerVoter("lee", { from: lee })

		})


		it("cast vote", async () => {
			await election.setElectionDate(parseInt(new Date().getTime() / 1000));

			result = await election.castVote(1, { from: frank });
			const event = result.logs[0].args;
			assert.equal(event.id, 1);
			assert.equal(event.voted, true);
			assert.equal(event.name, "frank");
			assert.equal(event.voter, frank);
			assert.equal(event.candidateId, 1);
			
			// tesing vote from invalid sender
			await election.castVote(1, { from: 0x0 }).should.be.rejected;
			// testing vote for invalid candidate
			await election.castVote(3).should.be.rejected;
			// testing vote from unregistered user
			await election.castVote(1, { from: lee });
			// testing revote from same person
			await election.castVote(1, { from: frank }).should.be.rejected;
		})

		it("check voting count", async () => {
			result = await election.votersCount();
			assert.equal(result.toNumber(), 2);
		})

		it("check candidate votes", async () => {
			result = await election.candidates(1);
			assert.equal(result.voteCount, 2);
		})

		it("get winner candidate", async () => {
			result = await election.getWinnerCandidate()
			assert.equal(result.id.toNumber(), 1);			
			assert.equal(result.voteCount.toNumber(), 2);			
			assert.equal(result._name, "bob");			
		});

	});

})