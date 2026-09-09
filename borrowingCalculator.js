/**
 * Borrowing Power Calculator
 *
 * Console interface for the BorrowingPowerCalculator class.
 */

const { BorrowingPowerCalculator } = require('./BorrowingPowerCalculator');
const readline = require('readline');

// Global constant for mortgage simulation
const INTEREST_RATE = 7.0; // 7.0% baseline interest rate
const ASSESSMENT_RATE_BUFFER = 3.0; // 3.0% buffer added to interest rates

function runConsoleMode() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    const calculator = new BorrowingPowerCalculator();

    console.log("Mortgage Borrowing Power Calculator");
    console.log("===================================");

    rl.question("Gross Annual Income: $", (income) => {
        rl.question("Number of Dependents: ", (dependents) => {
            rl.question("Declared Monthly Expenses: $", (expenses) => {
                rl.question("Total Credit Card Limits: $", async (creditLimits) => {
                    
                    // Banks assess loans using base rate + buffer for safety
                    const assessmentRate = INTEREST_RATE + ASSESSMENT_RATE_BUFFER;

                    try {
                        const result = await calculator.calculateBorrowingPower(
                            parseFloat(income),
                            parseInt(dependents),
                            parseFloat(expenses),
                            parseFloat(creditLimits),
                            assessmentRate
                        );

                        console.log("\n--- Calculation Summary ---");
                        console.log(`Maximum Borrowing Power at ${INTEREST_RATE}%: $${result.maxLoanAmount.toLocaleString()}`);
                        console.log(`Assumed Monthly Mortgage Repayment: $${result.monthlyRepayment.toLocaleString()} over 30 years`);
                    } catch ( error ) {
                        console.error(error.message);
                    } finally {
                        rl.close();
                    }
                });
            });
        });
    });
}

if (require.main === module) {
    runConsoleMode();
}
