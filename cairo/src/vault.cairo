use starknet::ContractAddress;

use starknet::SyscallResultTrait;
use starknet::{Store, SyscallResult};
use starknet::storage_access::StorageBaseAddress;
use starknet::contract_address_const;

// // ANCHOR: StorageAccessImpl
// impl StoreContractAddressArray of Store<Array<ContractAddress>> {
//     fn read(address_domain: u32, base: StorageBaseAddress) -> SyscallResult<Array<ContractAddress>> {
//         StoreContractAddressArray::read_at_offset(address_domain, base, 0)
//     }

//     fn write(
//         address_domain: u32, base: StorageBaseAddress, value: Array<ContractAddress>
//     ) -> SyscallResult<()> {
//         StoreContractAddressArray::write_at_offset(address_domain, base, 0, value)
//     }


//     fn read_at_offset(
//         address_domain: u32, base: StorageBaseAddress, mut offset: u8
//     ) -> SyscallResult<Array<ContractAddress>> {
//         let mut arr: Array<ContractAddress> = array![];

//         // Read the stored array's length. If the length is greater than 255, the read will fail.
//         let len: u8 = Store::<u8>::read_at_offset(address_domain, base, offset)
//             .expect('Storage Span too large');
//         offset += 1;

//         // Sequentially read all stored elements and append them to the array.
//         let exit = len + offset;
//         loop {
//             if offset >= exit {
//                 break;
//             }

//             let value = Store::<ContractAddress>::read_at_offset(address_domain, base, offset).unwrap();
//             arr.append(value);
//             offset += Store::<ContractAddress>::size();
//         };

//         // Return the array.
//         Result::Ok(arr)
//     }

//     fn write_at_offset(
//         address_domain: u32, base: StorageBaseAddress, mut offset: u8, mut value: Array<ContractAddress>
//     ) -> SyscallResult<()> {
//         // Store the length of the array in the first storage slot.
//         let len: u8 = value.len().try_into().expect('Storage - Span too large');
//         Store::<u8>::write_at_offset(address_domain, base, offset, len).unwrap();
//         offset += 1;

//         // Store the array elements sequentially
//         while let Option::Some(element) = value
//             .pop_front() {
//                 Store::<ContractAddress>::write_at_offset(address_domain, base, offset, element).unwrap();
//                 offset += Store::<ContractAddress>::size();
//             };

//         Result::Ok(())
//     }

//     fn size() -> u8 {
//         255 * Store::<ContractAddress>::size()
//     }
// }

#[starknet::interface]
pub trait IstarUSD<T>{
    fn mint(ref self: T, recipient: ContractAddress, amount: u128);
    fn burn(ref self: T, amount: u128 , recipient: ContractAddress);
}


#[starknet::interface]
pub trait IERC20<TContractState> {
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

#[starknet::interface]
pub trait IAggregatorPriceConsumer<TContractState> {
    fn get_latest_price(self: @TContractState) -> u128;
}

#[starknet::interface]
#[starknet::interface]
pub trait IVault<TContractState>{
    fn getTotalValue(ref self: TContractState) -> u128;
    fn getAccountCollateralValue(ref self: TContractState, user: ContractAddress) -> u128;

}

#[starknet::contract]
pub mod Vault{
    use starknet::ContractAddress;
    use core::result::ResultTrait;
    use core::starknet::event::EventEmitter;
    use alexandria_storage::{List,ListTrait};
    use super::IERC20Dispatcher;
    use super::IERC20DispatcherTrait;
    use super::IstarUSDDispatcher;
    use super::IstarUSDDispatcherTrait;
    use starknet::get_caller_address;
    use starknet::get_contract_address;
    use super::IAggregatorPriceConsumerDispatcher;
    use super::IAggregatorPriceConsumerDispatcherTrait;

    use openzeppelin::security::reentrancyguard::{
        ReentrancyGuardComponent,
        ReentrancyGuardComponent::InternalTrait as InternalReentrancyGuardImpl
    };
    //const LIQUIDATION_THRESHOLD: u128 = 50; //TODO: Make this dynamic
    //const LIQUIDATION_BONUS: u128 = 10;
    //const LIQUIDATION_PRECISION: u128 = 100;
    const MIN_HEALTH_FACTOR: u128 = 1000000000000000000;// 10^18
    const PRECISION:u128 = 1000000000000000000;
    const ADDITIONAL_FEED_PRECISION: u128 = 10000000000; // 10^10
    const FEED_PRECISION: u128 = 100000000;

    component!(
        path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent
    );
    #[storage]
    pub struct Storage{
        liquidation_threshold: u128,
        liquidation_bonus: u128,
        liquidation_precision: u128,
        // mapping of collateralToken => contract address
        priceFeeds: LegacyMap<ContractAddress,ContractAddress>,
        // mapping of user collateralToken => amount
        collateralDeposited: LegacyMap<(ContractAddress,ContractAddress),u128>,
        // Amount of mUSD midnted by user
        mUSDminted: LegacyMap<ContractAddress,u128>,
        // Acceptable Collateral
        collaterals: List<ContractAddress>,
        mUSDAddr: ContractAddress,
        //Total amount of mUSD/vault/TVL in platform
        //Total amount of mUSD/vault/TVL in platform
        totalValue: u128,
        //mapping of collateralToken => Total Value
        collateralValue: LegacyMap<ContractAddress,u128>,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage,
    
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        CollateralDepositEvent: CollateralDeposit,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
        CollateralRedeemedEvent: CollateralRedeemed,
    }

    #[derive(Drop,starknet::Event)]
    pub struct CollateralDeposit{
        #[key]
        user: ContractAddress,
        #[key]  
        collateralToken: ContractAddress,
        amount: u128,
    }

    #[derive(Drop,starknet::Event)]
    pub struct CollateralRedeemed{
        #[key]
        user: ContractAddress,
        #[key]
        collateralToken: ContractAddress,
        amount: u128,
    }

    #[constructor]
    fn constructor(ref self: ContractState,tokens:Span<ContractAddress>,mUSDAddr:ContractAddress ){
        self.liquidation_threshold.write(50);
        self.liquidation_bonus.write(10);
        self.liquidation_precision.write(100);
        self.mUSDAddr.write(mUSDAddr);
        let mut tokens_list : List<ContractAddress> = self.collaterals.read();
        assert!(ListTrait::append_span(ref tokens_list,tokens) == Result::Ok(()) , "Failed to append tokens");
        self.collaterals.write(tokens_list);
    }

    #[external(v0)]
    fn set_price_feeds(ref self: ContractState,collateral: ContractAddress, priceConsumerAddr: ContractAddress){
        self.priceFeeds.write(collateral,priceConsumerAddr);
    }

    #[external(v0)]
    fn depositCollaterlAndMintMusd(
        ref self: ContractState,
        collateralToken: ContractAddress,
        amountCollateral: u128,
        amountMusdMint: u128
    ){
        self.reentrancy_guard.start();
        let user = get_caller_address();
        self.collateralDeposited.write((user,collateralToken),self.collateralDeposited.read((user,collateralToken))+amountCollateral);
        let erc20 = IERC20Dispatcher { contract_address: collateralToken };
        let success = erc20.transfer_from(user,get_contract_address(),amountCollateral);
        assert!(success,"Transfer failed");
        let mUSD = IstarUSDDispatcher { contract_address: self.mUSDAddr.read() };
        mUSD.mint(user,amountMusdMint);
        self.mUSDminted.write(user,self.mUSDminted.read(user)+amountMusdMint);
        self.totalValue.write(self.totalValue.read()+amountMusdMint);
        self.reentrancy_guard.end();
        self.emit(
            CollateralDeposit{
                user: user,
                collateralToken: collateralToken,
                amount: amountCollateral
            }
        )
    }

    #[external(v0)]
    fn redeemCollateral(
        ref self: ContractState,
        collateralToken: ContractAddress,
        amount: u128,
        amountMusdBurn: u128
    ){
        self.reentrancy_guard.start();
        let user = get_caller_address();
        _reedemCollateral(ref self,user,collateralToken,amount);
        let erc20 = IERC20Dispatcher { contract_address: collateralToken };
        let success = erc20.transfer(user,amount);
        assert!(success,"Transfer failed");
        _burnMUSD(ref self,user,amountMusdBurn); 
        self.reentrancy_guard.end();
    }

     // The erc20 token which is used to make the contract solvent again prority order -> eth > usdc > strk
     #[external(v0)]
     fn liquidateInVault(
         ref self: ContractState,
        collateralToken: ContractAddress,
        debtToConver: u128
    ){
        let amount = _getAmontFromUsd(ref self,debtToConver,collateralToken);
        let user = get_caller_address();
        let bonus_collateral = (amount * (self.liquidation_bonus.read()))/ self.liquidation_precision.read();
        _reedemCollateral(ref self,user,collateralToken,amount+bonus_collateral);
        let erc20 = IERC20Dispatcher { contract_address: collateralToken };
        let success = erc20.transfer(user,amount);
        assert!(success,"Transfer failed");
        _burnMUSD(ref self,user,debtToConver);
     }

    #[abi(embed_v0)]
    impl Vault of super::IVault<ContractState> {
        fn getTotalValue(ref self: ContractState) -> u128{
            self.totalValue.read()
        }

        fn getAccountCollateralValue(
            ref self: ContractState,
            user: ContractAddress
        ) -> u128{
            let mut totalValue = 0;
            let mut arr = self.collaterals.read();
            loop {
                match arr.pop_front().unwrap(){
                    Option::Some(token)=>{
                        let amount = self.collateralDeposited.read((user,token));
                        let value = _getUsdValue(ref self,amount,token);
                        totalValue += value;
                    },
                    Option::None=>{
                        break;
                    }
                };
            };
            totalValue
        }
    }



    //TODO: Call Oracle here 
    // amount -> usd 
    fn _getAmontFromUsd(ref self:ContractState,amount: u128 , collateralToken: ContractAddress) -> u128{
        let priceConsumer = self.priceFeeds.read(collateralToken);
        // price -> 2000e8 if eth vaulue $2000
        let price = IAggregatorPriceConsumerDispatcher { contract_address: priceConsumer }.get_latest_price();
        (amount / price) * PRECISION // in wei
    }


    fn _getUsdValue(ref self:ContractState,amount: u128 , collateralToken: ContractAddress) -> u128{
        let priceConsumer = self.priceFeeds.read(collateralToken);
        // price -> 2000e8 if eth vaulue $2000
        let price = IAggregatorPriceConsumerDispatcher { contract_address: priceConsumer }.get_latest_price();
        return ((price * ADDITIONAL_FEED_PRECISION) * amount) / PRECISION;

    }



    fn _reedemCollateral(
        ref self: ContractState,
        user:ContractAddress,
        collateralToken: ContractAddress,
        amount: u128
    ){
        let user_bal = self.collateralDeposited.read((user,collateralToken));
        assert!(user_bal >= amount,"Insufficient balance");
        let final_bal = user_bal - amount;
        self.collateralDeposited.write((user,collateralToken),final_bal); 
    }

    fn _burnMUSD(
        ref self: ContractState,
        user: ContractAddress,
        amount: u128
    ){
        let mUSD = IstarUSDDispatcher { contract_address: self.mUSDAddr.read() };
        mUSD.burn(amount,user);
        self.mUSDminted.write(user,self.mUSDminted.read(user)-amount);
        self.totalValue.write(self.totalValue.read()-amount);
    }


}