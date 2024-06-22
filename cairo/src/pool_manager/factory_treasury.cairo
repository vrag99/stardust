pub use starknet::{ContractAddress,ClassHash};

#[starknet::interface]
pub trait ITreasuryFactory<TContractState> {
    fn create_treasury(ref self: TContractState, pool_id: u128) -> ContractAddress;
    fn update_treasury_class_hash(ref self: TContractState, counter_class_hash: ClassHash);
}


#[starknet::contract]
pub mod TreasuryFactory{
    use starknet::{ContractAddress, ClassHash, SyscallResultTrait, syscalls::deploy_syscall};


    #[storage]
    struct Storage {
        /// Store the constructor arguments of the contract to deploy
        pool_id: u32,
        class_hash: ClassHash,
    }


    #[constructor]
    fn constructor(ref self: ContractState,treasury_class_hash: ClassHash) {
        self.class_hash.write(treasury_class_hash);
    }
}