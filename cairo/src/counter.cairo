#[starknet::interface]
trait ICounter<T> {
    fn get_counter(self: @T) -> u32;
    fn increase_counter(ref self: T);
}


#[starknet::contract]
mod Counter {
    #[storage]
    struct Storage {
        counter: u32
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event{
        CounterIncreased :CounterIncreased  
    }

    #[derive(Drop, starknet::Event)]
    struct CounterIncreased {
        counter: u32
    }

    #[constructor]
    fn constructor(ref self: ContractState, input: u32){
        self.counter.write(input)
    }

    #[abi(embed_v0)]

    impl ICounterImpl of super::ICounter<ContractState>{
        fn get_counter(self: @ContractState) -> u32 {
            self.counter.read()
        }

        fn increase_counter(ref self: ContractState){
            self.counter.write(self.counter.read() + 1);
            self.emit(CounterIncreased{
                counter: self.counter.read()
            });
        }
    }
}