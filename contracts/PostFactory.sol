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
import { Channels } from "./Channels.sol";


/// @custom:security-contact ReceptionFM
contract PostFactory is CloneFactory, Initializable, PausableUpgradeable, AccessControlUpgradeable  {
  using CountersUpgradeable for CountersUpgradeable.Counter;

  CountersUpgradeable.Counter private _postContractIndex;
  Posts[] public children;
  address[] public postList;
  address contractOwner;
  address originalContract;
  address channelsAddress;
  address membershipsAddress;
  address broadcastsAddress;
  Channels channelContract;


  mapping(uint256 => uint256) channelToIndex;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  constructor(address _contractOwner, address _originalContract, address _channelsAddress, address _membershipsAddress, address _broadcastsAddress){
    contractOwner = _contractOwner;
    originalContract = _originalContract;
    channelsAddress = _channelsAddress;
    channelContract = Channels(channelsAddress);
    membershipsAddress = _membershipsAddress;
    broadcastsAddress = _broadcastsAddress;
  }
  
  function initialize(address _contractOwner) initializer public{
    __AccessControl_init();
    __Pausable_init();

    _grantRole(ADMIN_ROLE, _contractOwner);
    _grantRole(DEFAULT_ADMIN_ROLE, _contractOwner);
  }

  function createPostContract(string calldata tokenName, uint256 tokenChannel, address to) public{
    // TODO : Add function for verifiying ownership
    address channelOwner = channelContract.getApproved(tokenChannel);
    require(to == channelOwner, "You must be the channel owner to create memberships");

    Posts child = Posts(createClone(originalContract));
    child.initialize(tokenName, tokenChannel, to, channelsAddress, membershipsAddress, broadcastsAddress);
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