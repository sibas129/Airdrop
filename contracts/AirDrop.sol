// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the AccessControl library from OpenZeppelin
import "../openzeppelin-contracts-master/contracts/access/AccessControl.sol";

// Import the ERC20 token interface
import "../openzeppelin-contracts-master/contracts/token/ERC20/ERC20.sol";

contract TokenSender is AccessControl {

    // Define the ERC20 token contract interface
    IERC20 public tokenContract;

    // Roles for the contract administrator and operator
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    constructor(address _tokenContract, address _admin) {
        tokenContract = IERC20(_tokenContract);

        // Assign the contract administrator role to the provided address
        _setupRole(ADMIN_ROLE, _admin);

        // Assign the contract operator role to the contract deployer
        _setupRole(OPERATOR_ROLE, msg.sender);
    }

    // Event to log token transfers
    event TokenTransfer(address indexed sender, address indexed recipient, uint amount);

    // Modifier to restrict access to administrators and operators
    modifier onlyAdminOrOperator() {
        require(hasRole(ADMIN_ROLE, msg.sender) || hasRole(OPERATOR_ROLE, msg.sender), "Sender must have ADMIN_ROLE or OPERATOR_ROLE");
        _;
    }

    // Send tokens to multiple recipients
    function sendTokens(address[] memory recipients, uint[] memory amounts) public onlyAdminOrOperator {
        require(recipients.length > 0, "Recipients array cannot be empty");
        require(recipients.length == amounts.length, "Recipients and amounts arrays must have the same length");
        uint totalAmount = 0;
        for (uint i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Recipient address cannot be zero");
            require(amounts[i] > 0, "Amount to transfer must be greater than zero");
            totalAmount += amounts[i];
        }
        require(tokenContract.allowance(msg.sender, address(this)) >= totalAmount, "Contract is not authorized to spend enough tokens");
        require(tokenContract.balanceOf(msg.sender) >= totalAmount, "Sender does not have enough tokens");

        bool success;
        for (uint i = 0; i < recipients.length; i++) {
            (success,) = address(tokenContract).call(abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, recipients[i], amounts[i]));
            require(success, "Token transfer failed");
            emit TokenTransfer(msg.sender, recipients[i], amounts[i]);
        }
    }

    // Grant the operator role to a new address
    function grantOperatorRole(address operator) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Sender must have ADMIN_ROLE");
        grantRole(OPERATOR_ROLE, operator);
    }

    // Revoke the operator role from an address
    function revokeOperatorRole(address operator) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Sender must have ADMIN_ROLE");
        revokeRole(OPERATOR_ROLE, operator);
    }
}