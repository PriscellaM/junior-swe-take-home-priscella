/**
 * Borrowing Power Calculator
 * 
 * Gen's incomplete prototype. 
 * This currently calculates what a user can borrow over 30 years.
 * Currently this code uses placeholder methods for Tax and HEM values. 
 * 
 * A server.js has been provided to supply these values.
 */

const { BorrowingPowerCalculator } = require('./BorrowingPowerCalculator');
const readline = require('readline');

// Global constant for mortgage simulation
// const LOAN_TERM_MONTHS = 360; // 30 Years
const INTEREST_RATE = 7.0; // 7.0% baseline interest rate
const ASSESSMENT_RATE_BUFFER = 3.0; // 3.0% buffer added to interest rates

/*// For ENV
require('dotenv').config();
const API_URL = process.env.URL;
const BEARER_TOKEN = process.env.BEARER_TOKEN;*/

// Legacy placeholder functions to replace with API calls
/*
async function getTax(income) {
    // REPLACE THIS
    // Write your TAX API call code here.
    try {
        const resp = await fetch(`${API_URL}tax?income=${income}`, {
            headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
        });
        if (!resp.ok) {
            const errorData = await resp.json();
            throw new Error(`Response not ok! Error: ${errorData.error} - ${errorData.message}`);
        }

        const taxData = await resp.json();
        // console.log('Full API response: ', taxData); // debug output
        let { tax } = taxData;    // destructuring
        // console.log(tax);   // debug output
        return tax;
    } catch (error) {
        console.error(error.message);
    }
}
async function getHEM(income, dependents) {
    // REPLACE THIS
    // Write your HEM API call code here.
     try {
        const resp = await fetch(`${API_URL}hem?income=${income}&dependents=${dependents}`, {
            headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
        });
        if (!resp.ok) {
            const errorData = await resp.json();
            throw new Error(`Response not ok! Error: ${errorData.error} - ${errorData.message}`);
        }

        const hemData = await resp.json();
        // console.log('Full API response: ', hemData); // debug output
        let { hem } = hemData;    // destructuring
        // console.log('HEM: ', hem);  // debug output
        return hem;

    } catch (error) {
        console.error(error.message);
    }
}
*/

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
