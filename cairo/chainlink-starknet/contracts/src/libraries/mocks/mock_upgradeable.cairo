use starknet::class_hash::ClassHash;

#[starknet::interface]
pub trait IMockUpgradeable<TContractState> {
    fn foo(self: @TContractState) -> bool;
    fn upgrade(ref self: TContractState, new_impl: ClassHash);
}

#[starknet::contract]
pub mod MockUpgradeable {
    use starknet::class_hash::ClassHash;

    use chainlink::libraries::upgradeable::Upgradeable;

    #[storage]
    pub struct Storage {}

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[abi(embed_v0)]
    impl MockUpgradeableImpl of super::IMockUpgradeable<ContractState> {
        fn foo(self: @ContractState) -> bool {
            true
        }

        fn upgrade(ref self: ContractState, new_impl: ClassHash) {
            Upgradeable::upgrade(new_impl)
        }
    }
}
