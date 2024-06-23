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
    // this defines the collateralization ratio
    fn dynamic_collateralization_ratio(ref self:T,contract_address:ContractAddress ,amount:u128) -> u128;
}


#[starknet::contract]
pub mod CollateralManager {
    use super::IVaultDispatcherTrait;
    use super::IVaultDispatcher;
    use starknet::{ContractAddress,get_caller_address}; 
    use super::ICollateralManager;
    #[storage]
    pub struct Storage{
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
        //now it will be sent to the frontend where in the js file , it would be used 
        // witht the expression 150 * (1+x+x^2/2)/(e^x) to calculate the collateralization ratio
        // x would be the diffference b/w average collateralization ratio and the contribution

        
        return contribution;
        // here this contribution will be used to calculate the collateralization ratio
        // we cannot perfrom decimal calculations here in starknet as it only supports integers


      
    }

    
    
}