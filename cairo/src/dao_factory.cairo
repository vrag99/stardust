pub use starknet::{ContractAddress, ClassHash};

#[starknet::interface]
pub trait IDaoFactory<TContractState> {
    /// Create a new counter contract from stored arguments
    fn create_dao(ref self: TContractState, init_value: ContractAddress) -> ContractAddress;

    /// Update the class hash of the Counter contract to deploy when creating a new counter
    fn update_class_hash(ref self: TContractState, class_hash: ClassHash);
}

#[starknet::contract]
pub mod CounterFactory {
    use starknet::{ContractAddress, ClassHash, SyscallResultTrait, syscalls::deploy_syscall};

    #[storage]
    struct Storage {
        /// Store the class hash of the contract to deploy
        class_hash: ClassHash,
        owner:ContractAddress // Address of the multisig
    }

    #[constructor]
    fn constructor(ref self: ContractState, init_value: ContractAddress, class_hash: ClassHash) {
        self.owner.write(init_value);
        self.class_hash.write(class_hash);
    }

    #[abi(embed_v0)]
    impl Factory of super::ICounterFactory<ContractState> {
        // ANCHOR: deploy
        fn create_dao(ref self: ContractState, init_value: ContractAddress) -> ContractAddress {
            // Contructor arguments
            let mut constructor_calldata: Array::<felt252> = array![init_value.into()];

            // Contract deployment
            let (deployed_address, _) = deploy_syscall(
                self.class_hash.read(), 0, constructor_calldata.span(), false
            )
                .unwrap_syscall();

            deployed_address
        }


        fn update_class_hash(ref self: ContractState, counter_class_hash: ClassHash) {
            self.class_hash.write(counter_class_hash);
        }
    }
}