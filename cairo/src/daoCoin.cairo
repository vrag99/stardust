use starknet::ContractAddress;

#[starknet::interface]
pub trait IstarUSD<T>{
    fn mint(ref self: T, recipient: ContractAddress, amount: u256);
    fn burn(ref self: T, amount: u256 , recipient: ContractAddress);
}



#[starknet::contract]
pub mod starUSD{
    use openzeppelin::access::ownable::ownable::OwnableComponent::InternalTrait;
    use openzeppelin::token::erc20::{ERC20Component};
    
    use openzeppelin::access::ownable::OwnableComponent;

    use starknet::ContractAddress;

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    #[storage]
    pub struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        let name = "veStar";
        let symbol = "vStar";
        self.ownable.initializer(owner);
        self.erc20.initializer(name, symbol);
    }


    #[abi(embed_v0)]
    impl starUSD of super::IstarUSD<ContractState>{
        fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256) {
            self.ownable.assert_only_owner();
            self.erc20._mint(recipient, amount);
        }

        fn burn(ref self: ContractState, amount: u256 , recipient: ContractAddress) {
            self.ownable.assert_only_owner();
            self.erc20._burn(recipient,amount);
        }
    }


}