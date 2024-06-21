use starknet::ContractAddress;

#[starknet::interface]
trait IstarUSD<T>{
    fn mint(ref self: T, recipient: ContractAddress, amount: u256);
    fn burn(ref self: T, amount: u256 , recipient: ContractAddress);
}


#[starknet::interface]
trait IERC20<TContractState> {
    fn name(self: @TContractState) -> felt252;

    fn symbol(self: @TContractState) -> felt252;

    fn decimals(self: @TContractState) -> u8;

    fn total_supply(self: @TContractState) -> u256;

    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;

    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;

    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;

    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;

    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256) -> bool;
}

#[starknet::contract]
mod Vault{
    use super::IERC20Dispatcher;
    use super::IERC20DispatcherTrait;
    use super::IstarUSDDispatcher;
    use super::IstarUSDDispatcherTrait;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_contract_address;
    //const LIQUIDATION_THRESHOLD: u256 = 50; //TODO: Make this dynamic
    //const LIQUIDATION_BONUS: u256 = 10;
    //const LIQUIDATION_PRECISION: u256 = 100;
    const MIN_HEALTH_FACTOR: u256 = 1000000000000000000;// 10^18
    const PRECISION:u256 = 1000000000000000000;
    const ADDITIONAL_FEED_PRECISION: u256 = 10000000000; // 10^10
    const FEED_PRECISION: u256 = 100000000;
    
    #[storage]
    struct Storage{
        liquidation_threshold: u256,
        liquidation_bonus: u256,
        liquidation_precision: u256,
        // mapping of collateralToken => contract address
        priceFeeds: LegacyMap<ContractAddress,ContractAddress>,
        // mapping of user collateralToken => amount
        collateralDeposited: LegacyMap<(ContractAddress,ContractAddress),u256>,
        // Amount of mUSD midnted by user
        mUSDminted: LegacyMap<ContractAddress,u256>,
        // Acceptable Collateral
        // collateral: Span<ContractAddress>,
        mUSDAddr: ContractAddress,
        //Toatal amount of mUSD/vaule/TVL in platform
        totalValue: u256,
        //mapping of collateralToken => Total Value
        collateralValue: LegacyMap<ContractAddress,u256>,
    }

    #[derive(Drop,starknet::event)]
    struct CollateralDeposit{
        #[key]
        user: ContractAddress,
        #[key]  
        collateralToken: ContractAddress,
        amount: u256,
    }

    #[derive(Drop,starknet::event)]
    struct CollateralRedeemed{
        #[key]
        user: ContractAddress,
        #[key]
        collateralToken: ContractAddress,
        amount: u256,
    }

    #[abi(embed_v0)]


    #[constructor]
    fn constructor(ref self: ContractState,tokens: Span<ContractAddress>,mUSDAddr:ContractAddress ){
        self.liquidation_threshold.write(50);
        self.liquidation_bonus.write(10);
        self.liquidation_precision.write(100);
        self.mUSDAddr.write(mUSDAddr);
        // self.collateral.write(tokens);
    }

    #[external(v0)]
    fn depositCollaterlAndMintMusd(
        ref self: ContractState,
        collateralToken: ContractAddress,
        amount: u256
    ){
        let user = get_caller_address();
        let user_bal = self.collateralDeposited.read((user,collateralToken));
        let final_bal = user_bal + amount;
        self.collateralDeposited.write((user,collateralToken),final_bal);
        let erc20 = IERC20Dispatcher { contract_address: collateralToken };
        let success = erc20.transfer_from(user,get_contract_address(),amount);
        assert!(success,"Transfer failed");
        let mUSD = IstarUSDDispatcher { contract_address: self.mUSDAddr.read() };
        mUSD.mint(user,amount);
        self.mUSDminted.write(user,self.mUSDminted.read(user)+amount);
    }

    #[external(v0)]
    fn redeemCollateral(
        ref self: ContractState,
        collateralToken: ContractAddress,
        amount: u256
    ){
        //TODO: create a vairable value which gives the vaule for collateral used and mint or burn the same amount of mUSD 
        // according to a collateral ratio
        let user = get_caller_address();
        _reedemCollateral(ref self,user,collateralToken,amount);
        let erc20 = IERC20Dispatcher { contract_address: collateralToken };
        let success = erc20.transfer(user,amount);
        assert!(success,"Transfer failed");
        _burnMUSD(ref self,user,amount);

    }

    fn _reedemCollateral(
        ref self: ContractState,
        user:ContractAddress,
        collateralToken: ContractAddress,
        amount: u256
    ){
        let user_bal = self.collateralDeposited.read((user,collateralToken));
        assert!(user_bal >= amount,"Insufficient balance");
        let final_bal = user_bal - amount;
        self.collateralDeposited.write((user,collateralToken),final_bal); 
    }

    fn _burnMUSD(
        ref self: ContractState,
        user: ContractAddress,
        amount: u256
    ){
        let mUSD = IstarUSDDispatcher { contract_address: self.mUSDAddr.read() };
        mUSD.burn(amount,user);
        self.mUSDminted.write(user,self.mUSDminted.read(user)-amount);
    }


    // The erc20 token which is used to make the contract solvent again prority order -> eth > usdc > strk
    #[external(v0)]
    fn liquidateInVault(
        ref self: ContractState,
        collateralToken: ContractAddress,
        debtToConver: u256
    ){
        let amount = _getAmontFromUsd(debtToConver,collateralToken);
        let user = get_caller_address();
        let bonus_collateral = (amount * (self.liquidation_bonus.read()))/ self.liquidation_precision.read();
        _reedemCollateral(ref self,user,collateralToken,amount+bonus_collateral);
        let erc20 = IERC20Dispatcher { contract_address: collateralToken };
        let success = erc20.transfer(user,amount);
        assert!(success,"Transfer failed");
        _burnMUSD(ref self,user,debtToConver);
    }


    //TODO: Call Oracle here
    fn _getAmontFromUsd(amount: u256 , collateralToken: ContractAddress) -> u256{
        amount
    }




}