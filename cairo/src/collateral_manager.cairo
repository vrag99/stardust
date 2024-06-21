/// This code for the collateral Manger
/// It takes in a bucket of assets and send them to the vault of each asset

use starknet::ContractAddress;

#[starknet::interface]
pub trait ICollateralManager<T>{
    fn deposit_collateral(ref self:T , asset:Array<ContractAddress>, amount:Array<u128>) -> u128;
}


#[starknet::contract]
mod CollateralManager {
    
    #[storage]
    struct Storage{}
}