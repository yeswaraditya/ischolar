module aidefund_addr::aidefund {
    use std::signer;
    use aptos_std::table::{Self, Table};
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event::{Self, EventHandle};
    // 1. ADD this import for the account module
    use aptos_framework::account;

    // --- Errors ---
    const EPROPOSAL_NOT_FOUND: u64 = 1;
    const EALREADY_VOTED: u64 = 2;
    const EVOTING_ENDED: u64 = 3;
    const EOWNER_ONLY: u64 = 4;
    const EPROPOSAL_NOT_PASSED: u64 = 5;
    const EFUNDS_ALREADY_CLAIMED: u64 = 6;
    const EINSUFFICIENT_FUNDS_IN_POOL: u64 = 7;

    // --- Structs & Resources ---
    struct ProposalCreatedEvent has drop, store {
        proposal_id: u64,
        applicant: address,
        requested_amount: u64,
    }

    struct FundingPool has key {
        funds: Coin<AptosCoin>,
    }

    struct Proposal has store, key {
        id: u64,
        applicant: address,
        description: vector<u8>,
        requested_amount: u64,
        for_votes: u64,
        against_votes: u64,
        voters: Table<address, bool>,
        is_active: bool,
        passed: bool,
        funds_claimed: bool,
    }

    struct ProposalStore has key {
        proposals: Table<u64, Proposal>,
        next_proposal_id: u64,
        proposal_created_events: EventHandle<ProposalCreatedEvent>,
    }

    // --- Module Initialization ---
    fun init_module(sender: &signer) {
        move_to(sender, FundingPool { funds: coin::zero<AptosCoin>() });
        move_to(sender, ProposalStore {
            proposals: table::new(),
            next_proposal_id: 0,
            // 2. CHANGE this line to use `account::new_event_handle`
            proposal_created_events: account::new_event_handle<ProposalCreatedEvent>(sender),
        });
    }

    // --- Public Functions ---
    public entry fun deposit(funder: &signer, amount: u64) acquires FundingPool {
        let pool = borrow_global_mut<FundingPool>(@aidefund_addr);
        let coins_to_deposit = coin::withdraw<AptosCoin>(funder, amount);
        coin::merge(&mut pool.funds, coins_to_deposit);
    }

    public entry fun create_proposal(
        owner: &signer,
        applicant: address,
        description: vector<u8>,
        requested_amount: u64
    ) acquires ProposalStore {
        assert!(signer::address_of(owner) == @aidefund_addr, EOWNER_ONLY);
        let store = borrow_global_mut<ProposalStore>(@aidefund_addr);
        let id = store.next_proposal_id;

        let new_proposal = Proposal {
            id,
            applicant,
            description,
            requested_amount,
            for_votes: 0,
            against_votes: 0,
            voters: table::new(),
            is_active: true,
            passed: false,
            funds_claimed: false,
        };

        table::add(&mut store.proposals, id, new_proposal);
        store.next_proposal_id = id + 1;

        event::emit_event(
            &mut store.proposal_created_events,
            ProposalCreatedEvent {
                proposal_id: id,
                applicant,
                requested_amount,
            }
        );
    }

    public entry fun vote(voter: &signer, proposal_id: u64, in_favor: bool) acquires ProposalStore {
        let store = borrow_global_mut<ProposalStore>(@aidefund_addr);
        assert!(table::contains(&store.proposals, proposal_id), EPROPOSAL_NOT_FOUND);
        let proposal = table::borrow_mut(&mut store.proposals, proposal_id);
        
        assert!(proposal.is_active, EVOTING_ENDED);
        assert!(!table::contains(&proposal.voters, signer::address_of(voter)), EALREADY_VOTED);

        table::add(&mut proposal.voters, signer::address_of(voter), true);
        if (in_favor) {
            proposal.for_votes = proposal.for_votes + 1;
        } else {
            proposal.against_votes = proposal.against_votes + 1;
        }
    }

    public entry fun tally_votes(caller: &signer, proposal_id: u64) acquires ProposalStore {
        let store = borrow_global_mut<ProposalStore>(@aidefund_addr);
        assert!(table::contains(&store.proposals, proposal_id), EPROPOSAL_NOT_FOUND);
        let proposal = table::borrow_mut(&mut store.proposals, proposal_id);
        
        assert!(proposal.is_active, EVOTING_ENDED);
        proposal.is_active = false; // End voting

        if (proposal.for_votes > proposal.against_votes) {
            proposal.passed = true;
        } else {
            proposal.passed = false;
        }
    }

    public entry fun claim_funds(applicant: &signer, proposal_id: u64) acquires FundingPool, ProposalStore {
        let store = borrow_global_mut<ProposalStore>(@aidefund_addr);
        assert!(table::contains(&store.proposals, proposal_id), EPROPOSAL_NOT_FOUND);
        let proposal = table::borrow_mut(&mut store.proposals, proposal_id);
        
        assert!(signer::address_of(applicant) == proposal.applicant, EOWNER_ONLY);
        assert!(!proposal.is_active, EVOTING_ENDED); // Voting must be over
        assert!(proposal.passed, EPROPOSAL_NOT_PASSED);
        assert!(!proposal.funds_claimed, EFUNDS_ALREADY_CLAIMED);
        
        let pool = borrow_global_mut<FundingPool>(@aidefund_addr);
        assert!(coin::value(&pool.funds) >= proposal.requested_amount, EINSUFFICIENT_FUNDS_IN_POOL);

        proposal.funds_claimed = true;
        
        let funds_to_release = coin::extract(&mut pool.funds, proposal.requested_amount);
        coin::deposit(proposal.applicant, funds_to_release);
    }
}