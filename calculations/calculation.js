// these both will come to use from the contracts 
// will be given to the frontend 
// constant for proper valuation

function calculate(value,avg_contribution,k) {
    let act_val = 1 / value;
    let avg_contribution = 1 / avg_contribution;
    let x = act_val - avg_contribution;
    let e = Math.E;
    let collateralizatin_val = 150 * (e ** (kx) / 1 + (k * x) + (k * x) ** 2 / 2)
    // this formula is derived fomr the poisson approximation of the contributions of users
    console.log(collateralizatin_val);// will give us the current values



}

module.exports = calculate;