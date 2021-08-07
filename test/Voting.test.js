const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const Voting = artifacts.require("Voting");

contract("Voting", function(accounts) {
	const [ admin, voter1, voter2, voter3, voter4, voter5, voter6, voter7, voter8, voter9 ] = accounts
	const WorkflowStatus = { RegisteringVoters: 0, ProposalsRegistrationStarted: 1, ProposalsRegistrationEnded: 2,
								        		VotingSessionStarted: 3, VotingSessionEnded: 4, VotesTallied: 5 }
	let voting

	before(async function() {
		voting = await Voting.new({ from: admin })
	});

	describe('Basic ownership', () => {
		it('has a owner', async () => {
			const owner = admin
			assert.equal(await voting.owner(), owner)
		});
	});

	describe('Registering Voters', () => {
		it('verifies current status is in correct WorkflowStatus', async () => {
			assert.equal(await voting.getStatus(), WorkflowStatus.RegisteringVoters)
		});

		it('reverts if user tries to register himself as only admin can call the function', async () => {
			await expectRevert(voting.registerToVote( voter1, { from: voter1 } ),
				"Ownable: caller is not the owner")
		});

		it('emits event after admin registers first address allowed to vote', async () => {
			res = await voting.registerToVote(voter1, { from: admin })
			expectEvent(res, "VoterRegistered")
		});

		it('emits event after owner registers second address allowed to vote', async () => {
			res = await voting.registerToVote(voter2, { from: admin })
			expectEvent(res, "VoterRegistered")
		});

		it('reverts if voter address is already registered', async () => {
			await expectRevert(voting.registerToVote(voter1, { from: admin }),
				"Voter already registered"
			)
		});
	});

	describe('Opening Proposal Registration', () => {
		it('changes WorkflowStatus and emits event', async () => {
			res = await voting.openProposalRegistration({ from: admin })
			assert.equal(await voting.getStatus(), WorkflowStatus.ProposalsRegistrationStarted)
			expectEvent(res, "WorkflowStatusChange")
		})

		it('verifies current status is in correct WorkflowStatus', async () => {
			assert.equal(await voting.getStatus(), WorkflowStatus.ProposalsRegistrationStarted)
		});
	})

	describe('Sending Proposition', () => {
		it('reverts if voter is not registered', async () => {
			await expectRevert(voting.sendYourProposition("test", { from: voter5 }),
				"You are not registered"
			)
		})

		it('checks proposalId before and after voter1 sends proposition and event is triggered', async () => {
			proposalIdBefore = await voting.getProposalId({ from: admin })
			expect(proposalIdBefore.toNumber()).to.equal(0)
			
			res = await voting.sendYourProposition("proposition 1", { from: voter1 })

			proposalIdAfter = await voting.getProposalId({ from: admin })
			expect(proposalIdAfter.toNumber()).to.equal(1)
			expectEvent(res, "ProposalRegistered")
		})

		it('checks proposalId before and after voter2 sends proposition and event is triggered', async () => {
			proposalIdBefore = await voting.getProposalId({ from: admin })
			expect(proposalIdBefore.toNumber()).to.equal(1)
			
			res = await voting.sendYourProposition("proposition 2", { from: voter2 })

			proposalIdAfter = await voting.getProposalId({ from: admin })
			expect(proposalIdAfter.toNumber()).to.equal(2)
			expectEvent(res, "ProposalRegistered")
		})
	})

	describe('Closing Proposal Registration', () => {
		it('changes WorkflowStatus and emits event', async () => {
			res = await voting.closeProposalRegistration({ from: admin })
			assert.equal(await voting.getStatus(), WorkflowStatus.ProposalsRegistrationEnded)
			expectEvent(res, "WorkflowStatusChange")
		})

		it('verifies current status is in correct WorkflowStatus', async () => {
			assert.equal(await voting.getStatus(), WorkflowStatus.ProposalsRegistrationEnded)
		});
	})

	describe('Opening Vote Session', () => {
		it('changes WorkflowStatus and emits event', async () => {
			res = await voting.openVoteSession({ from: admin })
			expectEvent(res, "WorkflowStatusChange")
		})

		it('verifies current status is in correct WorkflowStatus', async () => {
			assert.equal(await voting.getStatus(), WorkflowStatus.VotingSessionStarted)
		});
	})

	describe('Voting for proposition', () => {
		it('checks voter1 votes for proposition', async () => {
			res = await voting.voteFor(2, { from: voter1 })
			expectEvent(res, "Voted")
		})
		
		it('reverts when registered voter1 tries to vote again', async () => {
			await expectRevert(voting.voteFor(1, { from: voter1 }), 
				"Already voted"
			)
		})
		
		it('reverts when unregistered voter3 tries to vote', async () => {
			await expectRevert(voting.voteFor(1, { from: voter3 }),
				"Unregistered, cannot vote"
			)
		})

		it('checks voter2 votes for proposition', async () => {
			res = await voting.voteFor(2, { from: voter2 })
			expectEvent(res, "Voted")
		})
		
		it('checks current winningProposalId is correct', async () => {
			win = await voting.getWinningProposalId({ from: admin })
			expect(win.toNumber()).to.be.equal(2)
			expect(win.toNumber()).not.to.be.equal(1)
		})
	})

	describe('Closing Vote Session', () => {
		it('changes WorkflowStatus and emits event', async () => {
			res = await voting.closeVoteSession({ from: admin })
			expectEvent(res, "WorkflowStatusChange")
		})

		it('verifies current status is in correct WorkflowStatus', async () => {
			assert.equal(await voting.getStatus(), WorkflowStatus.VotingSessionEnded)
		});
	})

	describe('Counting Votes', () => {
		it('changes WorkflowStatus and emits events', async () => {
			res = await voting.countVotes({ from: admin })
			expectEvent(res, "WorkflowStatusChange")
			expectEvent(res, "VotesTallied")
		})

		it('verifies current status is in correct WorkflowStatus', async () => {
			assert.equal(await voting.getStatus(), WorkflowStatus.VotesTallied)
		});
	})

	describe('Showing Winning Proposal Data', () => {
		it('checks number of votes, Proposal ID and description for the winner', async () => {
			nbrVotes = await voting.getNumberOfVotes({ from: admin })
			expect(nbrVotes.toNumber()).to.be.equal(2)
			winId = await voting.getWinningProposalId({ from: admin })
			expect(winId.toNumber()).to.be.equal(2)
			winDesc = await voting.getPropositionDescription({ from: admin })
			expect(winDesc.toString()).to.be.equal("proposition 2")
		})

		it('checks all results are available to anyone', async () => {
			nbrVotes = await voting.getNumberOfVotes({ from: voter2 })
			expect(nbrVotes.toNumber()).to.be.equal(2)
			winId = await voting.getWinningProposalId({ from: voter2 })
			expect(winId.toNumber()).to.be.equal(2)
			winDesc = await voting.getPropositionDescription({ from: voter2 })
			expect(winDesc.toString()).to.be.equal("proposition 2")
		})
	})

});