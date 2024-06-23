use starknet::ContractAddress;
#[starknet::interface]
pub trait ITreasury<TConractState>{
    fn get_total_balance(ref self: TConractState) -> u128;
    fn deposit(ref self: TConractState, amountCollateral:u128,collateralToken:ContractAddress) -> bool;
    fn get_user_balance(ref self: TConractState, user:ContractAddress) -> u128;
}


#[starknet::contract]
pub mod PoolManager{
    use starknet::ContractAddress;

   #[storage]
   pub struct Storage{
    // pool ID => treasury contract address for that pool
        poolTreasuryMap:LegacyMap<u128,ContractAddress>,
        poolCount:u128,
        //poolId => poolOwner Map
        poolOwnerMap:LegacyMap<u128,ContractAddress>,

        //Amount of fees a Lp has earned in a pool
        lpFeesMap:LegacyMap<ContractAddress,u128>,
   } 
}