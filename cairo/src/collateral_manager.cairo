/// This code for the collateral Manger
/// It takes in a bucket of assets and send them to the vault of each asset

use starknet::{ContractAddress,get_caller_address};



#[starknet::interface]
pub trait IVault<TContractState>{
    fn getTotalValue(ref self: TContractState) -> u128;
    fn getAccountCollateralValue(ref self: TContractState, user: ContractAddress) -> u128;
}


#[starknet::interface]
pub trait ICollateralManager<T>{
    fn deposit_collateral(ref self:T , contract_address:ContractAddress, amount:u128) -> u128;
    //have to check the types of the assets and the amount
    fn dynamic_collateralization_ratio(ref self:T,contract_address:ContractAddress ,amount:u128) -> u128;
}


#[starknet::contract]
mod CollateralManager {
    use super::IVaultDispatcherTrait;
    use super::IVaultDispatcher;
    use starknet::{ContractAddress,get_caller_address}; 
    use super::ICollateralManager;
    const PRECISION:u128 = 1000000000000000000;
    #[storage]
    struct Storage{
        //total collateral deposited
        totalValue: u128,
        // the collateral deposited by each asset
        collateralDeposited: LegacyMap<(ContractAddress,ContractAddress),u128>,
        //will be used to calculate the collateralization ratio


    }

    #[external(v0)]
    fn dynamic_collateralization_ratio(ref self : ContractState,
         contract_address:ContractAddress,
         amount:u128,) -> u128{
        let user = get_caller_address();
        let totalValue = IVaultDispatcher {contract_address}.getTotalValue();
        let userBalance = IVaultDispatcher {contract_address}.getAccountCollateralValue(user);
        let contribution = totalValue/userBalance;
        // here this contribution will be used to calculate the collateralization ratio

        
        return contribution;
        // here this contribution will be used to calculate the collateralization ratio
        // we cannot perfrom decimal calculations here in starknet as it only supports integers


      
    }

    
    
}