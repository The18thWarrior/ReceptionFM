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
  using CountersUpgradeable for CountersUpgradeable.Counter;

  CountersUpgradeable.Counter private _postContractIndex;
  Posts[] public children;
  address[] public postList;
  address contractOwner;
  address originalContract;
  mapping(uint256 => uint256) channelToIndex;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  constructor(address _contractOwner, address _originalContract){
    contractOwner = _contractOwner;
    originalContract = _originalContract;
  }
  
  function initialize(address _contractOwner) initializer public{
    __AccessControl_init();
    __Pausable_init();

    _grantRole(ADMIN_ROLE, _contractOwner);
    _grantRole(DEFAULT_ADMIN_ROLE, _contractOwner);
  }

  function createPostContract(string calldata tokenName, uint256 tokenChannel, address to) public{
    //console.log(msg.sender);
    //console.log(contractOwner);
    // TODO : Add function for verifiying ownership
    //require(hasRole(ADMIN_ROLE, msg.sender), 'Contract must be owned by executing user');
    Posts child = Posts(createClone(originalContract));
    child.initialize(tokenName, tokenChannel, to);
    children.push(child);
    uint256 tokenIndex = _postContractIndex.current();
    _postContractIndex.increment();
    channelToIndex[tokenChannel] = tokenIndex;
  }

  function getChannelPostContract(uint256 tokenChannel) public view returns(Posts) {
    uint256 postIndex = channelToIndex[tokenChannel];
    return children[postIndex];
  }

  function getChildren() external view returns(Posts[] memory){
    return children;
  }
}