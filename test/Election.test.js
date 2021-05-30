
const Election = artifacts.require("./Election.sol");

require('chai')
	.use(require('chai-as-promised'))
	.should();

contract("Election", ([alice, bob]) => {
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
			const name = election.name;
			assert.equal(name, "Election");
		})

	});

	describe("election workflow", async () => {
		let result;

		it
		it("add candidates", )
	});

})