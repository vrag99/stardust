
/// @notice fees are calculated every 24hours and not on every transaction
/// The money from treasury is transfered to the protcol and they have to maintain the balance
/// Whenever the treasury makes a trasaction it should be of type swap of equal amount

use starknet::ContractAddress;
#[starknet::interface]
pub trait IProtocolTreasury<TContractState>{
    fn make_trade(ref self:TContractState,amountInCollateral:u128,amountOutCollateral:ContractAddress,collateral:ContractAddress,to:ContractAddress , fee:u128);
}

#[starknet::interface]
pub trait IAggregatorPriceConsumer<TContractState> {
    fn get_latest_price(self: @TContractState) -> u128;
}




#[starknet::interface]
trait IERC20<TContractState> {
    fn name(self: @TContractState) -> felt252;

    fn symbol(self: @TContractState) -> felt252;

    fn decimals(self: @TContractState) -> u8;

    fn total_supply(self: @TContractState) -> u128;

    fn balance_of(self: @TContractState, account: ContractAddress) -> u128;

    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u128;

    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u128) -> bool;

    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u128
    ) -> bool;

    fn approve(ref self: TContractState, spender: ContractAddress, amount: u128) -> bool;
}


#[starknet::contract]
pub mod Treasury{
    use starknet::ContractAddress;
    use alexandria_storage::{List,ListTrait};
    use super::IERC20Dispatcher;
    use super::IERC20DispatcherTrait;
    use starknet::get_caller_address;
    use starknet::get_contract_address;

    #[storage]
    struct Storage{
        pool_id:u128,
        protocol_proxy:ContractAddress, // This for the treasury owner
        totalFees:u128,
        dailyFees:u128,
        collaterals:List<ContractAddress>,
        collateralAmountMap:LegacyMap<ContractAddress,u128>,
        liquidityProviders:Array<ContractAddress>, 
        // Map of A liquidity provider to the amount of liquidity they have provided useful for dashboard
        // And calculating the fees
        lpCollateralAmountMap:LegacyMap<(ContractAddress,ContractAddress),u128>,
        // Map of protcol Users to their balance
        feePercentage:u128,
    }


    #[constructor]
    fn constructor(ref self: ContractState,tokens:Span<ContractAddress>,pool_id:u128,protocol_proxy:ContractAddress , feePercentage:u128){
        self.pool_id.write(pool_id);
        self.protocol_proxy.write(protocol_proxy);
        let mut tokens_list : List<ContractAddress> = self.collaterals.read();
        assert!(ListTrait::append_span(ref tokens_list,tokens) == Result::Ok(()) , "Failed to append tokens");
        self.collaterals.write(tokens_list);
    }

    #[abi_embed(v0)]
    impl Treasury of super::IProtocolTreasury<ContractState>{
        fn make_trade(
            ref self:ContractState,
            amountInCollateral:u128,
            amountOutCollateral:ContractAddress,
            collateral:ContractAddress,
            to:ContractAddress,
            fees:u128
        ){
            _ensureProofProxy(ref self,get_caller_address());
            _validCollateral(ref self,collateral);
            let erc20 = IERC20Dispatcher{ contract_address: collateral};
            assert!(erc20.balance_of(get_contract_address()) <= amountInCollateral,"Insufficient balance");
            erc20.transfer(to,amountOutCollateral);
            self.totalFees.write(self.totalFees.read() + fees);
            self.dailyFees.write(self.dailyFees.read() + fees);
        }
    }


    fn _validCollateral(ref self:Storage,collateral:ContractAddress)->bool{
       let mut counter = 0;
       let mut collateral = self.collaterals.read(); 
       let mut found = false;
       loop{
              if counter == collateral.len(){
                break;
              }
              if collateral[counter] == collateral{
                return true;
              }
              counter+=1;
       }
       assert!(found,"Collateral is not valid");
    }

    fn _ensureProofProxy(
        ref self:Storage,
        caller:ContractAddress
    ){
        assert!(caller == self.protocol_proxy.read(),"Caller is not the protocol proxy");
    }

// Lp -> wETH -> kill_switch -> will transfer eth to the owner
// Protcol wETH (pool) -> swap -> treasury -> wETH swap
// Whatever user submitted -> WUsdc


}