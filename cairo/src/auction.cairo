use starknet::ContractAddress;

#[starknet::interface]
pub trait IERC20<TContractState> {
    fn get_name(self: @TContractState) -> felt252;
    fn get_symbol(self: @TContractState) -> felt252;
    fn get_decimals(self: @TContractState) -> u8;
    fn get_total_supply(self: @TContractState) -> felt252;
    fn balance_of(self: @TContractState, account: ContractAddress) -> felt252;
    fn allowance(
        self: @TContractState, owner: ContractAddress, spender: ContractAddress
    ) -> felt252;
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: felt252);
    fn transfer_from(
        ref self: TContractState,
        sender: ContractAddress,
        recipient: ContractAddress,
        amount: felt252
    );
    fn approve(ref self: TContractState, spender: ContractAddress, amount: felt252);
    fn increase_allowance(ref self: TContractState, spender: ContractAddress, added_value: felt252);
    fn decrease_allowance(
        ref self: TContractState, spender: ContractAddress, subtracted_value: felt252
    );
}

#[starknet::interface]
pub trait IDutchAuction<TContractState> {
    fn buy(ref self: TContractState, amount: felt252);
    fn get_price(self: @TContractState) -> u64;
}

#[starknet::contract]
pub mod DutchAuction {
    use super::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};

    #[storage]
    struct Storage {
        erc20_token: ContractAddress,
        starting_price: u64,
        seller: ContractAddress,
        duration: u64,
        discount_rate: u64,
        start_at: u64,
        expires_at: u64,
        purchase_count: u128,
        total_supply: u128
    }

    mod Errors {
        pub const AUCTION_ENDED: felt252 = 'auction has ended';
        pub const LOW_STARTING_PRICE: felt252 = 'low starting price';
        pub const INSUFFICIENT_BALANCE: felt252 = 'insufficient balance';
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        erc20_token: ContractAddress,
        starting_price: u64,
        seller: ContractAddress,
        duration: u64,
        discount_rate: u64,
        total_supply: u128
    ) {
        assert(starting_price >= discount_rate * duration, Errors::LOW_STARTING_PRICE);

        self.erc20_token.write(erc20_token);
        self.starting_price.write(starting_price);
        self.seller.write(seller);
        self.duration.write(duration);
        self.discount_rate.write(discount_rate);
        self.start_at.write(get_block_timestamp());
        self.expires_at.write(get_block_timestamp() + duration * 1000);
        self.total_supply.write(total_supply);
    }

    #[abi(embed_v0)]
    impl DutchAuction of super::IDutchAuction<ContractState> {
        fn get_price(self: @ContractState) -> u64 {
            let time_elapsed = (get_block_timestamp() - self.start_at.read()) / 1000; // Ignore milliseconds
            let discount = self.discount_rate.read() * time_elapsed;
            self.starting_price.read() - discount
        }

        fn buy(ref self: ContractState, amount: felt252) {
            // Check duration
            assert(get_block_timestamp() < self.expires_at.read(), Errors::AUCTION_ENDED);
            // Check total supply
            assert(self.purchase_count.read() < self.total_supply.read(), Errors::AUCTION_ENDED);

            let erc20_dispatcher = IERC20Dispatcher { contract_address: self.erc20_token.read() };
            let caller = get_caller_address();
            // Get token price
            let price: felt252 = self.get_price().into();
            let buyer_balance: felt252 = erc20_dispatcher.balance_of(caller).into();
            // Ensure buyer has enough token for payment
            assert(buyer_balance >= price, Errors::INSUFFICIENT_BALANCE);
            // Transfer payment token from buyer to seller
            erc20_dispatcher.transfer_from(caller, self.seller.read(), price);
            // Transfer tokens to buyer
            erc20_dispatcher.transfer(caller, amount);
            // Increase purchase count
            self.purchase_count.write(self.purchase_count.read() + amount);
        }
    }
}
