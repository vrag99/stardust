#[starknet::interface]
pub trait IMockNonUpgradeable<TContractState> {
    fn bar(self: @TContractState) -> bool;
}

#[starknet::contract]
pub mod MockNonUpgradeable {
    #[storage]
    pub struct Storage {}

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[abi(embed_v0)]
    impl MockNonUpgradeableImpl of super::IMockNonUpgradeable<ContractState> {
        fn bar(self: @ContractState) -> bool {
            true
        }
    }
}
