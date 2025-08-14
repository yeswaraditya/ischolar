module aidefund_addr::Governance {
    use std::signer;
    use aptos_std::table::{Self, Table};
    // This allows this module to call the `release_funds` function in the other module.
    friend aidefund_addr::funding_pool;

    /// Defines the structure of a single proposal.
    struct Proposal has store, drop, key {
        id: u64,
        applicant: address,
        requested_amount: u64,
        for_votes: u64,
        against_votes: u64,
        voters: Table<address, bool>,
    }

    /// A resource to hold the table of all proposals.
    struct ProposalStore has key {
        proposals: Table<u64, Proposal>,
        next_proposal_id: u64,
    }

    /// This function is called once by the deployer to create the proposal store.
    public fun initialize(sender: &signer) {
        move_to(sender, ProposalStore { proposals: table::new(), next_proposal_id: 0 });
    }

    /// Function for your backend to create a new proposal.
    public entry fun create_proposal(owner: &signer, applicant: address, amount: u64) acquires ProposalStore {
        // Here you would add logic to verify the owner.
        let store = borrow_global_mut<ProposalStore>(@aidefund_addr);
        // ... Logic to add a new Proposal struct to the Table ...
    }

    /// Function for funders to vote.
    public entry fun vote(voter: &signer, proposal_id: u64, in_favor: bool) acquires ProposalStore {
        // ... Logic to update vote counts and prevent double-voting ...
    }

    /// Function to finalize a vote and trigger the fund release.
    public entry fun tally_votes(caller: &signer, proposal_id: u64) acquires ProposalStore {
        let store = borrow_global<ProposalStore>(@aidefund_addr);
        let proposal = table::borrow(&store.proposals, proposal_id);

        if (proposal.for_votes > proposal.against_votes) {
            // This is the cross-module call. The `friend` declaration makes it possible.
            funding_pool::release_funds(proposal.applicant, proposal.requested_amount);
        }
    }
}