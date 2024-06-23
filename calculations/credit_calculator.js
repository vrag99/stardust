let k;
// have to set this constant for normalization of the credit

function credit(amount, no_of_transactions, blocks) {
    for (let i = 9; i >= 1; i--) {  // Loop in descending order from 9 to 1
        if (k * amount * no_of_transactions / blocks > i) {
            return 1000 * i;
        }
        else {
            return 1000 * (i - 1);
        }
    }
    // Return 0 if no condition is met
}
module.exports = credit;