#[starknet::interface]
pub trait IAggregatorPriceConsumer<TContractState> {
    fn get_latest_price(self: @TContractState) -> u128;
}

#[starknet::contract]
pub mod AggregatorPriceConsumer {
    use starknet::ContractAddress;


    use chainlink::ocr2::aggregator::Round;
    use chainlink::ocr2::aggregator_proxy::IAggregator;
    use chainlink::ocr2::aggregator_proxy::IAggregatorDispatcher;
    use chainlink::ocr2::aggregator_proxy::IAggregatorDispatcherTrait;
    #[storage]
    pub struct Storage {
        _uptime_feed_address: ContractAddress,
        _aggregator_address: ContractAddress,
    }

    // Sequencer-aware aggregator consumer
    // retrieves the latest price from the data feed only if
    // the uptime feed is not stale (stale = older than 60 seconds)
    #[constructor]
    fn constructor(
        ref self: ContractState,
        uptime_feed_address: ContractAddress,
        aggregator_address: ContractAddress
    ) {
        self._uptime_feed_address.write(uptime_feed_address);
        self._aggregator_address.write(aggregator_address);
    }


    #[abi(embed_v0)]
    impl AggregatorPriceConsumerImpl of super::IAggregatorPriceConsumer<ContractState> {
        fn get_latest_price(self: @ContractState) -> u128 {
            assert_sequencer_healthy(self);
            let round = IAggregatorDispatcher { contract_address: self._aggregator_address.read() }
                .latest_round_data();
            round.answer
        }
    }

    fn assert_sequencer_healthy(self: @ContractState) {
        let round = IAggregatorDispatcher { contract_address: self._uptime_feed_address.read() }
            .latest_round_data();
        let timestamp = starknet::get_block_info().unbox().block_timestamp;

        // After 60 sec the report is considered stale
        let report_stale = timestamp - round.updated_at > 60_u64;

        // 0 if the sequencer is up and 1 if it is down. No other options besides 1 and 0
        match round.answer.into() {
            0 => { assert(!report_stale, 'L2 seq up & report stale'); },
            _ => {
                assert(!report_stale, 'L2 seq down & report stale');
                assert(false, 'L2 seq down & report ok');
            }
        }
    }
}
