use starknet::ContractAddress;

#[starknet::interface]
trait IstarUSD<T>{
    fn mint(ref self: T, recipient: ContractAddress, amount: u256);
    fn burn(ref self: T, amount: u256 , recipient: ContractAddress);
}

#[starknet::contract]
mod Vault{
    use starknet::ContractAddress;
    use openzeppelin::security::ReentrancyGuardComponent;
    //TODO: Add oracle for various assets
    //const LIQUIDATION_THRESHOLD: u128 = 50; //TODO: Make this dynamic
    //const LIQUIDATION_BONUS: u128 = 10;
    //const LIQUIDATION_PRECISION: u128 = 100;
    const MIN_HEALTH_FACTOR: u128 = 1000000000000000000;// 10^18
    const PRECISION:u128 = 1000000000000000000;
    const ADDITIONAL_FEED_PRECISION: u128 = 10000000000; // 10^10
    const FEED_PRECISION: u128 = 100000000;
    
    #[storage]
    struct Storage{
        liquidation_threshold: u128,
        liquidation_bonus: u128,
        liquidation_precision: u128,
        // mapping of collateralToken => contract address
        priceFeeds: LegacyMap<ContractAddress,ContractAddress>,
        // mapping of user => collateralToken => amount
        collateralDeposited: LegacyMap<ContractAddress,LegacyMap<ContractAddress,u128>>,
        // mapping of user => collateralToken => timeBorrowed
        collateralTime: LegacyMap<ContractAddress,LegacyMap<ContractAddress,u64>>,
        // Amount of mUSD midnted by user
        mUSDminted: LegacyMap<ContractAddress,u128>,
        // Acceptable Collateral
        collateral: Array<ContractAddress>,
        mUSDAddr: ContractAddress,
        reenctracyGuard: ReentrancyGuardComponent::Storage,
    }

    #[derive(Drop,starknet::event)]
    struct CollateralDeposit{
        #[key]
        user: ContractAddress,
        #[key]  
        collateralToken: ContractAddress,
        amount: u128,
    }

    #[derive(Drop,starknet::event)]
    struct CollateralRedeemed{
        #[key]
        user: ContractAddress,
        #[key]
        collateralToken: ContractAddress,
        amount: u128,
    }


    #[constructor]
    fn constructor(ref self: ContractState,tokens: Array<ContractAddress>,mUSDAddr:ContractAddress ){
        self.liquidation_threshold.write(50);
        self.liquidation_bonus.write(10);
        self.liquidation_precision.write(100);
        self.mUSDAddr.write(mUSDAddr);
        self.collateral.write(tokens);
    }

}