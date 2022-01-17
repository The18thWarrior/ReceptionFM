// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "hardhat/console.sol";


import { CloneFactory } from "./libraries/CloneFactory.sol";
import { Posts } from "./Posts.sol";
import { Base64 } from "./libraries/Base64.sol";


/// @custom:security-contact ReceptionFM
contract PostFactory is CloneFactory, Initializable, PausableUpgradeable, AccessControlUpgradeable  {
  Posts[] public children;
  address masterContract;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  constructor(address _masterContract){
    masterContract = _masterContract;
  }
  
  function initialize(address _masterContract) initializer public{
    __Pausable_init();
    __AccessControl_init();

    _grantRole(DEFAULT_ADMIN_ROLE, _masterContract);
    _grantRole(ADMIN_ROLE, _masterContract);
  }

  function createPost(string calldata tokenName, uint256 tokenChannel) public onlyRole(ADMIN_ROLE){
    Posts child = Posts(createClone(masterContract));
    child.initialize(tokenName, tokenChannel);
    children.push(child);
  }

  function getChildren() external view returns(Posts[] memory){
      return children;
  }
}