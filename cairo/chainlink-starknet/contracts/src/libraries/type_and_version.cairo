#[starknet::interface]
pub trait ITypeAndVersion<TContractState> {
    fn type_and_version(self: @TContractState) -> felt252;
}
