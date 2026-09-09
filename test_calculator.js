/**
 * Borrowing Power Calculator Test Suite
 */


const assert = require('assert');
const { BorrowingPowerCalculator } = require('./BorrowingPowerCalculator');
require('dotenv').config();

describe('Borrowing Power Calculator Tests', () => {

  const calculator = new BorrowingPowerCalculator();

  it('should use the correct URL and bearer', () => {
    assert.strictEqual(calculator.apiUrl, 'http://localhost:3000/');
    assert.strictEqual(calculator.bearerToken, 'pat_abcdefghijklmnopqrstuvwxyz0123456789');
  });

  it('should get tax from the API', async () => {
    const result = await calculator.getTax(125000);
    assert.strictEqual( result, 25750 );
  });

  it('should get HEM from the API', async () => {
    const result = await calculator.getHEM(125000, 2);
    assert.strictEqual( result, 3100 );
  });

  it('should handle API error ', async () => {
    await assert.rejects( calculator.fetchJSON('api/tax?income='), { message: 'Response not ok! Error: Income is required - Provide income parameter.' } );
  });

  it('should calculate borrowing power for standard values', async () => {
    const result = await calculator.calculateBorrowingPower( 120000, 2, 3000, 10000, 7.5 );
    assert.ok( result.maxLoanAmount > 0, 'Should yield a positive borrowing power amount' );
    assert.strictEqual( result.monthlyRepayment, 4600 );
  });

  it('should return 0 when repayment capacity is not enough (zero or negative)', async () => {
    const result = await calculator.calculateBorrowingPower( 30000, 3, 4000, 5000, 7.5 );
    assert.strictEqual( result.maxLoanAmount, 0 );
    assert.strictEqual( result.monthlyRepayment, 0 );
  });

});
