// Import the necessary dependencies
const TokenSender = artifacts.require('TokenSender');
const Token = artifacts.require('Token');
const { expect } = require('chai');

// Define a contract test suite
contract('TokenSender', function(accounts) {
// Define variables used across test cases
let token;
let tokenSender;
const [owner, operator1, operator2, recipient1] = accounts;
const totalSupply = 1000;

// Define a hook to deploy a new Token and TokenSender instance before each test case
beforeEach(async function() {
    token = await Token.new(totalSupply, { from: owner });
    tokenSender = await TokenSender.new(token.address, { from: owner });
    await token.approve(tokenSender.address, totalSupply, { from: owner });
});

// Define a test case for sending tokens as the contract administrator
it('should send tokens as the contract administrator', async function() {
    // Define test variables
    const recipients = [recipient1];
    const amounts = [100];

    // Send tokens as the contract administrator
    const result = await tokenSender.sendTokens(recipients, amounts, { from: owner });

    // Check that the transaction was successful
    expect(result.receipt.status).to.equal(true);
    expect(await token.balanceOf(recipient1)).to.equal(100);
});

// Define a test case for sending tokens as an operator
it('should send tokens as an operator', async function() {
    // Define test variables
    const recipients = [recipient1];
    const amounts = [100];

    // Add operator1
    await tokenSender.addOperator(operator1, { from: owner });

    // Send tokens as an operator
    const result = await tokenSender.sendTokensAsOperator(recipients, amounts, { from: operator1 });

    // Check that the transaction was successful
    expect(result.receipt.status).to.equal(true);
    expect(await token.balanceOf(recipient1)).to.equal(100);
});

// Define a test case for sending tokens with insufficient allowance
it('should fail to send tokens with insufficient allowance', async function() {
    // Define test variables
    const recipients = [operator1];
    const amounts = [100];

    // Attempt to send tokens from an address with insufficient allowance
    try {
        await tokenSender.sendTokens(recipients, amounts, { from: operator1 });
        expect.fail('Transaction should fail due to insufficient allowance');
    } catch(error) {
        expect(error.message).to.include('revert', 'Transaction should fail due to insufficient allowance');
    }
});

// Define a test case for sending tokens with insufficient balance
it('should fail to send tokens with insufficient balance', async function() {
    // Define test variables
    const recipients = [operator1];
    const amounts = [totalSupply + 1];

    // Attempt to send tokens from an address with insufficient balance
    try {
        await tokenSender.sendTokens(recipients, amounts, { from: operator1 });
        expect.fail('Transaction should fail due to insufficient balance');
    } catch(error) {
        expect(error.message).to.include('revert', 'Transaction should fail due to insufficient balance');
    }
});

// Define a test case for sending tokens with an empty recipients array
it('should fail to send tokens with an empty recipients array', async function() {
    // Define test variables
    const recipients = [];
    const amounts = [100];

    // Attempt to send tokens with an empty recipients array
    try {
    Token.new
    Token.new
    token.new
        await tokenSender.sendTokens(recipients, amounts, { from: operator1 });
        expect.fail('Transaction should fail due to empty recipients array');
    } catch(error) {
        expect(error.message).to.include('revert', 'Transaction should fail due to empty recipients array');
    }
});

// Define a test case for sending tokens with an empty amounts array
it('should fail to send tokens with an empty amounts array', async function() {
    // Define test variables
    const recipients = [operator1];
    const amounts = [];

    // Attempt to send tokens with an empty amounts array
    try {
        await tokenSender.sendTokens(recipients, amounts, { from: operator1 });
        expect.fail('Transaction should fail due to empty amounts array');
    } catch(error) {
        expect(error.message).to.include('revert', 'Transaction should fail due to empty amounts array');
    }
    });
});