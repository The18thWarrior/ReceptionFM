// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "hardhat/console.sol";

import { Posts } from "./Posts.sol";
import { Channels } from "./Channels.sol";


/// @custom:security-contact ReceptionFM
contract PostFactory is Initializable, PausableUpgradeable, AccessControlUpgradeable  {
  using CountersUpgradeable for CountersUpgradeable.Counter;

  CountersUpgradeable.Counter private _postContractIndex;
  //Posts[] public children;
  //address[] public postList;
  address contractOwner;
  address channelsAddress;
  address membershipsAddress;
  address broadcastsAddress;
  Channels channelContract;


  mapping(uint256 => uint256) channelToIndex;
  mapping(uint256 => address) postToAddress;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  constructor(address _contractOwner, address _channelsAddress, address _membershipsAddress) initializer{
    
    __AccessControl_init();
    __Pausable_init();

    _grantRole(ADMIN_ROLE, _contractOwner);
    _grantRole(DEFAULT_ADMIN_ROLE, _contractOwner);

    contractOwner = _contractOwner;
    channelsAddress = _channelsAddress;
    channelContract = Channels(channelsAddress);
    membershipsAddress = _membershipsAddress;
  }
  
  function initialize(address _contractOwner) initializer public{
    __AccessControl_init();
    __Pausable_init();

    _grantRole(ADMIN_ROLE, _contractOwner);
    _grantRole(DEFAULT_ADMIN_ROLE, _contractOwner);
  }

  function createPostContract(string calldata tokenName, uint256 tokenChannel, address to) public{
    // TODO : Add function for verifiying ownership
    address channelOwner = channelContract.ownerOf(tokenChannel);
    require(to == channelOwner, "Must be Owner");

    Posts child = new Posts(tokenName, tokenChannel, to, contractOwner, channelsAddress, membershipsAddress);
    //children.push(child);
    //uint256 tokenIndex = children.length;
    uint256 tokenIndex = _postContractIndex.current();
    _postContractIndex.increment();
    postToAddress[tokenChannel] = address(child);
    channelToIndex[tokenChannel] = tokenIndex;
  }

  function getChannelPostContract(uint256 tokenChannel) public view returns(address) {
    uint256 postIndex = channelToIndex[tokenChannel];
    if (tokenChannel != 0) {
      require(postIndex != 0, 'No contract');
    }
    
    return postToAddress[postIndex];
  }
}