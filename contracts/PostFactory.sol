// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

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
  address apiAddress;
  //address broadcastsAddress;
  Channels channelContract;


  mapping(uint256 => uint256) channelToIndex;
  mapping(uint256 => address) postToAddress;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  constructor(address tempContractOwner, address tempChannelsAddress, address tempMembershipsAddress, address tempApiAddress) initializer{
    
    __AccessControl_init();
    __Pausable_init();

    require(tempContractOwner != address(0), "owner required");
    _grantRole(ADMIN_ROLE, tempContractOwner);
    _grantRole(DEFAULT_ADMIN_ROLE, tempContractOwner);

    contractOwner = tempContractOwner;
    require(tempChannelsAddress != address(0), "channel required");
    channelsAddress = tempChannelsAddress;
    channelContract = Channels(channelsAddress);
    require(tempMembershipsAddress != address(0), "membership required");
    membershipsAddress = tempMembershipsAddress;
    apiAddress = tempApiAddress;
  }
  
  function initialize(address tempContractOwner) initializer external {
    __AccessControl_init();
    __Pausable_init();

    _grantRole(ADMIN_ROLE, tempContractOwner);
    _grantRole(DEFAULT_ADMIN_ROLE, tempContractOwner);
  }

  function withdrawBalance() external onlyRole(ADMIN_ROLE) {
    address payable ownerPayable = payable(contractOwner);
    // send all Ether to owner
    // Owner can receive Ether since the address of owner is payable
    ownerPayable.transfer(address(this).balance);
  }

  function createPostContract(string calldata tokenName, uint256 tokenChannel, address to) external {
    // TODO : Add function for verifiying ownership
    address channelOwner = channelContract.ownerOf(tokenChannel);
    require(to == channelOwner, "Must be Owner");

    Posts child = new Posts(tokenName, tokenChannel, to, contractOwner, channelsAddress, membershipsAddress, apiAddress);
    //children.push(child);
    //uint256 tokenIndex = children.length;
    uint256 tokenIndex = _postContractIndex.current();
    _postContractIndex.increment();
    postToAddress[tokenChannel] = address(child);
    channelToIndex[tokenChannel] = tokenIndex;
  }

  function getChannelPostContract(uint256 tokenChannel) external view returns(address) {
    uint256 postIndex = channelToIndex[tokenChannel];
    if (tokenChannel != 0) {
      require(postIndex != 0, 'No contract');
    }
    
    return postToAddress[postIndex];
  }
}