// these both will come to use from the contracts 
let value ;
let avg_contribution;
let k; // constant for proper valuation

function calculate() {
    let act_val = 1/value;
    let avg_contribution=1/avg_contribution;
    let x = act_val - avg_contribution;
    let e = Math.E;
    let collateralizatin_val = 150 * (1 + k*x + (k*x)**2/2) / (e**(kx))
    console.log(collateralizatin_val);// will give us the current values
    

}