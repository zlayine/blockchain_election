import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Election from '../abis/Election.json'

class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			account: '0x0',
			contract: null,
			candidates: [],
			totalVotes: 0,
			addCandidate: false,
			candidateName: null,
			candidateAddress: null,
			registered: false,
			loading: true,
			electionDate: null,
			voter: null,
			owner: false,
		}
	}

	async componentWillMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
		this.listenEthEvents();
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3('ws://localhost:7545')
			await window.ethereum.enable()
		}
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		}
		else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}
	}

	async loadBlockchainData() {
		const web3 = window.web3
		const accounts = await web3.eth.getAccounts()
		this.setState({ account: accounts[0] })
		// Load smart contract
		const networkId = await web3.eth.net.getId()
		const networkData = Election.networks[networkId]
		if (networkData) {
			const abi = Election.abi
			const address = networkData.address
			const contract = new web3.eth.Contract(abi, address)
			this.setState({ contract })
			const owner = await contract.methods.owner().call();
			this.setState({
				...this.state,
				owner: owner == accounts[0]
			});
			const voterId = await contract.methods.addressToVoterId(accounts[0]).call();
			if (voterId.toNumber() > 0) {
				const voter = await contract.methods.voters(voterId.toNumber()).call();
				this.setState({
					...this.state,
					voter: voter
				})
			}
			const electionDate = (await contract.methods.electionDate().call()).toNumber() * 1000;
			this.setState({
				...this.state,
				electionDate
			})
			const totalVotes = await contract.methods.votersCount().call()
			this.setState({ totalVotes: totalVotes })
			// Load Candidates
			let totalCandidates = await contract.methods.candidatesCount().call()
			for (let i = 1; i <= totalCandidates.toNumber(); i++) {
				let candidate = await contract.methods.candidates(i).call()
				this.setState({
					candidates: [...this.state.candidates, candidate]
				})
			}
		} else {
			alert('Smart contract not deployed to detected network.')
		}
	}

	listenEthEvents() {
		this.state.contract.events.ElectionDateUpdated().on('data', async (event) => {
			console.log(event.returnValues);
		})

		this.state.contract.events.CandidateAdded().on('data', async (event) => {

		})
	}

	setElectionDate = () => {
		const date = new Date();
		const electDate = date.getTime() + 5 * 60 * 1000;
		this.state.contract.methods.setElectionDate(parseInt(electDate / 1000)).send({ from: this.state.account }).on('transactionHash', (hash) => {
			this.setState({
				...this.state,
				electionDate: electDate
			})
		})
	}

	enableAdd = () => {
		this.setState({
			...this.state,
			addCandidate: !this.state.addCandidate,
		})
	}

	addCandidate = () => {
		if (!this.state.owner)
			return;
		this.state.contract.methods.addCandidate(this.state.candidateName, this.state.candidateAddress).send({ from: this.state.account }).on('transactionHash', (hash) => {
		});
	}

	registerVoter = () => {
		if (this.state.electionDate < (new Date()).getTime())
			alert("Registrations are closed");
		else
			this.state.contract.methods.registerVoter("Voter").send({ from: this.state.account }).on('transactionHash', (hash) => {
				window.location.reload();
			});
	}

	castVote = (id) => {
		if (this.state.voter.voted)
			alert("Already voted");
		else
			this.state.contract.methods.castVote(id).send({ from: this.state.account }).on('transactionHash', () => {
				this.setState({
					...this.state,
					voter: {
						...this.state.voter,
						voted: true,
					}
				})
			});
	}

	handleChange = (e) => {
		this.setState({
			...this.state,
			[e.target.name]: e.target.value,
		})
	}

	getDate = (time) => {
		let d = new Date(time);
		let seconds = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();
		let minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
		let hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
		let day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
		let month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
		return `${day} ${month} ${d.getFullYear()} at ${hours}:${minutes}:${seconds}`;
	}


	render() {
		const isElectStarted = this.state.electionDate < (new Date()).getTime();
		return (
			<div>
				<nav className="navbar navbar-dark bg-dark flex-md-nowrap p-3 shadow">
					<a
						className="navbar-brand col-sm-3 col-md-2 mr-0"
						target="_blank"
						rel="noopener noreferrer"
					>
						Election DApp
          </a>
					<ul className="navbar-nav px-3">
						<li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
							<small className="text-muted"><span id="account">{this.state.account}</span></small>
						</li>
					</ul>
				</nav>
				<div className="container-fluid mt-5">
					<div className="row">
						<main role="main" className="container d-flex flex-column text-center">
							{this.state.owner ? (
								<div className="d-flex flex-row justify-content-between">
									<button className="btn" onClick={this.setElectionDate} >Set Election date</button>
									<button className="btn" onClick={this.enableAdd} >Add Candidate</button>
								</div>
							) : ""}
							{this.state.addCandidate ? (
								<div className="mx-auto d-flex flex-row mb-4">
									<input type="text" className="mr-3" onChange={this.handleChange} name="candidateName" placeholder="Candidate Name" />
									<input type="text" className="mr-3" onChange={this.handleChange} name="candidateAddress" placeholder="Candidate address" />
									<button className="btn" onClick={this.addCandidate}>Save</button>
								</div>
							) : ""}
							{
								this.state.electionDate > 0 ? (
									<div className="content mr-auto ml-auto">
										{
											isElectStarted ? (
												<h1 className="d-4 mb-3">Election ends : {this.getDate(this.state.electionDate + 2 * 60 * 60 * 1000)}</h1>
											) : (
												<h1 className="d-4 mb-3">Election starts : {this.getDate(this.state.electionDate)}</h1>
											)
										}
										<h5 className="mb-3">Candidates</h5>
										<div className="d-flex flex-row justify-content-between mb-4" >
											{this.state.candidates.map(c => {
												return (
													<div className="candidate flex-column mx-3" key={c.id.toNumber()} onClick={() => this.castVote(c.id.toNumber())}>
														<img className="img" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2600&q=80" alt="profile candindate" />
														<div className="d-flex justify-content-between mt-auto p-2">
															<label className="name">{c.name}</label>
															<label className="vote">{c.voteCount.toNumber()}</label>
														</div>
													</div>
												)
											})}
										</div>
									</div>
								) : ""
							}

							<div className="d-flex flex-column">
								{this.state.voter ?
									this.state.voter.voted ? (
										<div className="btn mx-auto">Voted</div>
									) : isElectStarted ? (
										<div className="btn mx-auto">Vote for a candidate</div>
									) : (
										<div className="btn mx-auto">Registered..Wait for election to start</div>
									) : !isElectStarted ? (
										<button className="btn mx-auto mb-3" onClick={this.registerVoter}>Register To Vote</button>
									) : (
										<div className="btn mx-auto">Registrations are closed</div>
									)}
							</div>

						</main>
					</div>
				</div>
			</div >
		);
	}
}

export default App;