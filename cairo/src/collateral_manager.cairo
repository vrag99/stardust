/// This code for the collateral Manger
/// It takes in a bucket of assets and send them to the vault of each asset

use starknet::{ContractAddress,get_caller_address};

#[starknet::interface]
pub trait ICollateralManager<T>{
    fn deposit_collateral(ref self:T , asset:Array<ContractAddress>, amount:Array<u128>) -> u128;
    //have to check the types of the assets and the amount
    fn dynamic_collateralization_ratio() -> u128;
}


#[starknet::contract]
mod CollateralManager {
    
    #[storage]
    struct Storage{

    }

    #[abi(embed_v0)]
    Impl CollateralManager of super::ICollateralManager<Storage> for Storage{
        fn deposit_collateral(ref self:Storage , asset:Array<ContractAddress>, amount:Array<u128>) -> u128{
            let caller = get_caller_address();
            let vault = ContractAddress::new("vault contract address");
            // calling the deposit function from the vault contract


        fn dynamic_collateralization_ratio()-> u128 {
            let vault = ContractAddress::new("vault contract address");
            // call the functions and get the ratio of the contribution of the person 
            // calculate this ratio 150 * (k * (1 + x + x^2/2 )/ (e^x) ) where x is the person's contribution - the avg contribution going on , 
            // avg contribution will be calculated by the vault contract or can be taken constant 


        }
    
}