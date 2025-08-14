module aidefund_addr::FundingPool {
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;

    /// A resource to hold all deposited funds. This will be stored
    /// under the account that publishes this module.
    struct Pool has key {
        funds: Coin<AptosCoin>,
    }

    /// This function is called once by the deployer to create the pool.
    public fun initialize(sender: &signer) {
        move_to(sender, Pool { funds: coin::zero<AptosCoin>() });
    }

    /// Public function for funders to deposit APT into the pool.
    public entry fun deposit(funder: &signer, amount: u64) acquires Pool {
        let pool = borrow_global_mut<Pool>(@aidefund_addr);
        let coins_to_deposit = coin::withdraw<AptosCoin>(funder, amount);
        coin::merge(&mut pool.funds, coins_to_deposit);
    }

    /// A function that can ONLY be called by our governance module.
    /// It moves funds from the pool to the applicant's account.
    public(friend) fun release_funds(applicant: address, amount: u64) acquires Pool {
        let pool = borrow_global_mut<Pool>(@aidefund_addr);
        let funds_to_release = coin::extract(&mut pool.funds, amount);
        coin::deposit(applicant, funds_to_release);
    }
}