import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Voting from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import RegisterVoters from "./components/RegisterVoters";
import SendProposal from "./components/SendProposal";
import OpenVoteSession from "./components/OpenVoteSession";
import VoteForProposal from "./components/VoteForProposal";
import TallyVotes from "./components/TallyVotes";
import SeeWinner from "./components/SeeWinner";
import "./App.css";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    owner: null,
    user: null,
    voterAddress: 0,
    status: 0,
    desc: "",
    proposalId: 0,
    nbrVotes: 0,
    winningProposalId: 0,
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Voting.networks[networkId];
      const instance = new web3.eth.Contract(
        Voting.abi,
        deployedNetwork && deployedNetwork.address
      );
      this.setState({ web3, accounts, contract: instance }, this.runInit);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runInit = async () => {
    const { contract } = this.state;
    const owner = await contract.methods.owner().call();
    const user = this.state.accounts[0];
    const status = await contract.methods.getStatus().call();
    const desc = await contract.methods.getPropositionDescription().call();
    const proposalId = await contract.methods.getProposalId().call();
    const nbrVotes = await contract.methods.getNumberOfVotes().call();
    const winningProposalId = await contract.methods
      .getWinningProposalId()
      .call();
    this.setState({
      owner,
      user,
      status,
      desc,
      proposalId,
      nbrVotes,
      winningProposalId,
    });

    contract.events
      .VoterRegistered()
      .on("data", (event) => this.cbRegisterEvent(event))
      .on("error", console.error);

    contract.events
      .ProposalRegistered()
      .on("data", (event) => this.cbProposalRegisteredEvent(event))
      .on("error", console.error);

    contract.events
      .Voted()
      .on("data", (event) => this.cbVotedEvent(event))
      .on("error", console.error);
  };

  switchStatus = async () => {
    const { status } = this.state;
    let switchStatus = status;
    switchStatus = parseInt(status) + 1;
    this.setState({ status: +switchStatus });
  };

  registerToVote = async (address) => {
    const { accounts, contract } = this.state;
    await contract.methods.registerToVote(address).send({ from: accounts[0] });
  };

  cbRegisterEvent = async (event) => {
    this.setState({ voterAddress: event.returnValues[0] });
    console.log(`added: ${this.state.voterAddress} to the list`);
  };

  openProposalRegistration = async () => {
    const { accounts, contract } = this.state;
    await contract.methods
      .openProposalRegistration()
      .send({ from: accounts[0] });
    this.switchStatus();
  };

  sendProposition = async (description) => {
    const { accounts, contract } = this.state;
    await contract.methods
      .sendYourProposition(description)
      .send({ from: accounts[0] });
  };

  cbProposalRegisteredEvent = async (event) => {
    this.setState({ proposalId: event.returnValues[0] });
  };

  closeProposalRegistration = async () => {
    const { accounts, contract } = this.state;
    await contract.methods
      .closeProposalRegistration()
      .send({ from: accounts[0] });
    this.switchStatus();
  };

  openVoteSession = async () => {
    const { accounts, contract } = this.state;
    await contract.methods.openVoteSession().send({ from: accounts[0] });
    this.switchStatus();
  };

  voteForProposal = async (proposalId) => {
    const { accounts, contract } = this.state;
    await contract.methods.voteFor(proposalId).send({ from: accounts[0] });
  };

  cbVotedEvent = async (event) => {
    this.setState({ proposalId: event.returnValues[1] });
  };

  closeVoteSession = async () => {
    const { accounts, contract } = this.state;
    await contract.methods.closeVoteSession().send({ from: accounts[0] });
    this.switchStatus();
  };

  countVotes = async () => {
    const { accounts, contract } = this.state;
    await contract.methods.countVotes().send({ from: accounts[0] });
    this.switchStatus();
  };

  showWinner = async () => {
    const { winningProposalId, desc } = this.state;
    this.setState({ winningProposalId, desc });
  };

  render() {
    const { status } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div>
          <h2 className="text-center">Système de vote</h2>
          <hr></hr>
          <br></br>
        </div>
        {status === "0" ? (
          <RegisterVoters
            registerToVote={this.registerToVote}
            owner={this.state.owner}
            user={this.state.user}
            openProposalRegistration={this.openProposalRegistration}
          />
        ) : status === "1" ? (
          <SendProposal
            sendProposition={this.sendProposition}
            owner={this.state.owner}
            user={this.state.user}
            closeProposalRegistration={this.closeProposalRegistration}
          />
        ) : status === "2" ? (
          <OpenVoteSession
            openVoteSession={this.openVoteSession}
            owner={this.state.owner}
            user={this.state.user}
          />
        ) : status === "3" ? (
          <VoteForProposal
            voteForProposal={this.voteForProposal}
            closeVoteSession={this.closeVoteSession}
            owner={this.state.owner}
            user={this.state.user}
          />
        ) : status === "4" ? (
          <TallyVotes
            countVotes={this.countVotes}
            owner={this.state.owner}
            user={this.state.user}
          />
        ) : (
          <SeeWinner
            winningProposalId={this.state.winningProposalId}
            desc={this.state.desc}
            nbrVotes={this.state.nbrVotes}
          />
        )}
        <br></br>
        <div>Adresse connectée: {this.state.user}</div>
        <div>Administrateur: {this.state.owner}</div>
      </div>
    );
  }
}

export default App;
