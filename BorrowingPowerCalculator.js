/**
 * Borrowing Power Calculator
 *
 * Handles API communication and borrowing power calculations.
 */
require('dotenv').config(); // For ENV

class BorrowingPowerCalculator {
    constructor( {
                     apiUrl = process.env.URL,
                     bearerToken = process.env.BEARER_TOKEN,
                     loanTermMonths = 360,  // 30 Years
                 } = {} ) {
        this.apiUrl = apiUrl;
        this.bearerToken = bearerToken;
        this.loanTermMonths = loanTermMonths;
    }

    async fetchJSON( path ) {
        const resp = await fetch( `${ this.apiUrl }${ path }`, {
            headers: { Authorization: `Bearer ${ this.bearerToken }` },
        } );
        if ( !resp.ok ) {
            const errorData = await resp.json();
            throw new Error( `Response not ok! Error: ${ errorData.error } - ${ errorData.message }` );
        }
        const result = await resp.json();
        // console.log('Full API response: ', result); // debug output
        return result;
    }

    async getTax( income ) {
        const taxData = await this.fetchJSON(`api/tax?income=${income}`);
        const { tax } = taxData;    // destructuring
        return tax;
    }

    async getHEM( income, dependents ) {
        const hemData = await this.fetchJSON(`api/hem?income=${income}&dependents=${dependents}`);
        const { hem } = hemData;    // destructuring
        return hem;
    }

    // Calculates the total borrowing power amount and the monthly repayment configuration
    async calculateBorrowingPower(income, dependents, expenses, creditLimits, annualAssessmentRate) {

        // 1. Calculate Net Monthly Income after tax deductions
        const annualTax = await this.getTax(income);
        const netMonthlyIncome = (income - annualTax) / 12;

        // 2. Determine living expenses (User declared expenses vs HEM baseline, whichever is higher)
        const baselineHEM = await this.getHEM(income, dependents);
        const totalLivingExpenses = Math.max(expenses, baselineHEM);

        // 3. Calculate credit card liability (~3% of total limits)
        const creditCardLiability = creditLimits * 0.03;

        // 4. Calculate monthly repayment capacity
        const maxMonthlyRepayment = netMonthlyIncome - totalLivingExpenses - creditCardLiability;

        // Return early if user cannot afford a loan at all
        if (maxMonthlyRepayment <= 0) {
            return { maxLoanAmount: 0, monthlyRepayment: 0 };
        }

        // 5. Calculate the monthly interest rate
        const monthlyRate = (annualAssessmentRate / 100) / 12;

        // 6. Calculate maximum borrowing power using the following formula:
        // P = M * (1 - (1 + R)^-N) / R
        const maxLoanAmount = maxMonthlyRepayment * ((1 - Math.pow(1 + monthlyRate, - this.loanTermMonths)) / monthlyRate);

        return {
            maxLoanAmount: Number(maxLoanAmount.toFixed(2)),
            monthlyRepayment: Number(maxMonthlyRepayment.toFixed(2))
        };
    }
}


module.exports = { BorrowingPowerCalculator };