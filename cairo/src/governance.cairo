use argent::signer::signer_signature::{Signer, SignerSignature,StarknetSigner};
use starknet::{ContractAddress, account::Call};

#[starknet::interface]
pub trait IstardustMultisig<TContractState> {
    fn change_threshold(ref self: TContractState, new_threshold: usize);

    fn add_signers(ref self: TContractState, new_threshold: usize, signers_to_add: Array<Signer>);

    fn remove_signers(ref self: TContractState, new_threshold: usize, signers_to_remove: Array<Signer>);

    fn replace_signer(ref self: TContractState, signer_to_remove: Signer, signer_to_add: Signer);

    fn get_threshold(self: @TContractState) -> usize;
    fn get_signer_guids(self: @TContractState) -> Array<felt252>;
    fn is_signer(self: @TContractState, signer: Signer) -> bool;
    fn is_signer_guid(self: @TContractState, signer_guid: felt252) -> bool;

    fn is_valid_signer_signature(self: @TContractState, hash: felt252, signer_signature: SignerSignature) -> bool;
}

#[starknet::contract]
pub mod Dao{
    use super::IstardustMultisigDispatcher;
    use super::IstardustMultisigDispatcherTrait;
    use starknet::ContractAddress;
    use starknet::contract_address_const;
    use super::Signer;
    use super::StarknetSigner;

    #[storage]
    struct Storage{
        multisig:ContractAddress
    }

    #[constructor]
    fn constructor(ref self:ContractState) {
        self.multisig.write(contract_address_const::<
            0x0467Bf94aC49e459AEB00c3689E0064140EEb7Af2Bd2b48De4A310b86e149281
        >());
    }

    #[external(v0)]
    fn add_signers(ref self:ContractState, signer_to_add:felt252 ) {
        let multisig = self.multisig.read();
        let signer_to_add: felt252 = 3376183409820967487218811821902436201925151954904615748218292610642950160747;
        let signer_to_add = starknet_signer_from_pubkey(signer_to_add);
        let mut dispatcher = IstardustMultisigDispatcher{contract_address:multisig};
        let mut a  = ArrayTrait::new();
        a.append(signer_to_add);
        dispatcher.add_signers(3, a);
    }


    fn starknet_signer_from_pubkey(pubkey: felt252) -> Signer {
        Signer::Starknet(StarknetSigner { pubkey: pubkey.try_into().expect('argent/zero-pubkey') })
    }

    #[external(v0)]
    fn change_threshold(ref self: ContractState, new_threshold: u32) {
        let multisig = self.multisig.read();
        let mut dispatcher = IstardustMultisigDispatcher { contract_address: multisig };
        dispatcher.change_threshold(new_threshold);
    }

    #[external(v0)]
    fn remove_signers(ref self: ContractState, new_threshold: u32, signers_to_remove: Array<felt252>) {
        let multisig = self.multisig.read();
        let mut dispatcher = IstardustMultisigDispatcher { contract_address: multisig };
        let mut signers = ArrayTrait::new();
        for signer in signers_to_remove {
            let signer_converted = starknet_signer_from_pubkey(signer);
            signers.append(signer_converted);
        }
        dispatcher.remove_signers(new_threshold, signers);
    }

    #[external(v0)]
    fn replace_signer(ref self: ContractState, signer_to_remove: felt252, signer_to_add: felt252) {
        let multisig = self.multisig.read();
        let signer_to_remove = starknet_signer_from_pubkey(signer_to_remove);
        let signer_to_add = starknet_signer_from_pubkey(signer_to_add);
        let mut dispatcher = IstardustMultisigDispatcher { contract_address: multisig };
        dispatcher.replace_signer(signer_to_remove, signer_to_add);
    }

    #[external(v0)]
    fn get_threshold(self: @ContractState) -> u32 {
        let multisig = self.multisig.read();
        let mut dispatcher = IstardustMultisigDispatcher { contract_address: multisig };
        dispatcher.get_threshold()
    }

    #[external(v0)]
    fn get_signer_guids(self: @ContractState) -> Array<felt252> {
        let multisig = self.multisig.read();
        let mut dispatcher = IstardustMultisigDispatcher { contract_address: multisig };
        dispatcher.get_signer_guids()
    }

    #[external(v0)]
    fn is_signer(self: @ContractState, signer: felt252) -> bool {
        let multisig = self.multisig.read();
        let signer = starknet_signer_from_pubkey(signer);
        let mut dispatcher = IstardustMultisigDispatcher { contract_address: multisig };
        dispatcher.is_signer(signer)
    }

    #[external(v0)]
    fn is_signer_guid(self: @ContractState, signer_guid: felt252) -> bool {
        let multisig = self.multisig.read();
        let mut dispatcher = IstardustMultisigDispatcher { contract_address: multisig };
        dispatcher.is_signer_guid(signer_guid)
    }

    #[external(v0)]
    fn is_valid_signer_signature(self: @ContractState, hash: felt252, signer_signature: SignerSignature) -> bool {
        let multisig = self.multisig.read();
        let mut dispatcher = IstardustMultisigDispatcher { contract_address: multisig };
        dispatcher.is_valid_signer_signature(hash, signer_signature)
    }
}