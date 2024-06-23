let k;
// have to set this constant for normalization of the credit
// k would be approx some thousand
// here if the value of i becomes 1 and then we go to else the score will be zero which is not possible
// so at that point we change the value to 100

function credit(amount, no_of_transactions, blocks) {
    for (let i = 9; i >= 1; i--) {  // Loop in descending order from 9 to 1
        if (k * amount * no_of_transactions / blocks > i) {
            return 1000 * i;
        }
        else if (i>1) {
            return 1000 * (i - 1);
        }
        else {
            return 100;
        }
    }
    // Return 0 if no condition is met
}
module.exports = credit;