/**
 * Borrowing Power Calculator Test Suite
 */


const assert = require('assert');
const { BorrowingPowerCalculator } = require('./BorrowingPowerCalculator');

describe('Term Deposit Calculator Tests', () => {

  const calculator = new BorrowingPowerCalculator();

  it('should calculate borrowing power for standard values', async () => {
    const result = await calculator.calculateBorrowingPower( 120000, 2, 3000, 10000, 7.5 );
    assert.ok( result.maxLoanAmount > 0, 'Should yield a positive borrowing power amount' );
    assert.strictEqual( result.monthlyRepayment, 4200 );
  });

  it('should return 0 for invalid negative inputs', async () => {
    const result = await calculator.calculateBorrowingPower( 30000, 3, 4000, 5000, 7.5 );
    assert.strictEqual( result.maxLoanAmount, 0 );
    assert.strictEqual( result.monthlyRepayment, 0 );
  });

});
