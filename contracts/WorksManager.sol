// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "hardhat/console.sol";


import { PostFactory } from "./PostFactory.sol";
import { Memberships } from "./Memberships.sol";
import { Channels } from "./Channels.sol";
import { Posts } from "./Posts.sol";
import { Base64 } from "./libraries/Base64.sol";


/// @custom:security-contact ReceptionFM
contract WorksManager is Initializable, PausableUpgradeable, AccessControlUpgradeable  {
  address private postFactoryAddress;
  address private membershipsAddress;
  address private channelsAddress;

  PostFactory postFactoryContract;
  Memberships membershipContract;
  Channels channelContract;

  mapping(uint256 => address) private channelPostAddressMap;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  constructor(){
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
  }
  
  function initialize() initializer public{
    __Pausable_init();
    __AccessControl_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
  }

  // UI Interfaces
  // 1.2
  function mintChannel(string calldata channelName, string calldata channelUri) public {
    return channelContract.safeMint(channelName, channelUri, msg.sender);
  }

  // 1.3
  function getOwnerChannelIds() public view returns(uint256[] memory) {
    return channelContract.getOwnerChannelIds(msg.sender);
  }

  // 1.5
  function membershipTokenCreate(uint256 channel, uint256 cost, string calldata level, string calldata computedUri) public {
    return membershipContract.membershipTokenCreate(channel, cost, level, computedUri);
  }
  
  // 1.5
  function createPostChannel(string calldata tokenName, uint256 tokenChannel) public {
    return postFactoryContract.createPost(tokenName, tokenChannel);
  }

  // 2.1
  function getCurrentChannelIndex() public view returns(uint256){
    return channelContract.getCurrentIndex();
  }

  // 2.2
  function getChannelMetadata(uint256 tokenId) public view returns(string memory) {
    return channelContract.uri(tokenId);
  }
  
  // 2.3
  function getMembershipList(uint256 channel) public view returns (uint256[] memory) {
    return membershipContract.getMembershipList(channel);
  }
  
  // 2.4
  function membershipUri(uint256 tokenId) public view returns (string memory) {
    return membershipContract.uri(tokenId);
  }
  
  // 2.5
  function membershipMint(uint256 channel, string calldata level) public payable{
    return membershipContract.membershipMint(channel, level, msg.sender);
  }

  // Functions for setting static variables
  function setPostFactoryAddress(address _postFactoryAddress) public onlyRole(ADMIN_ROLE) {
    postFactoryAddress = _postFactoryAddress;
    postFactoryContract = PostFactory(_postFactoryAddress);
  }

  function setMembershipsAddress(address _membershipsAddress) public onlyRole(ADMIN_ROLE) {
    membershipsAddress = _membershipsAddress;
    membershipContract = Memberships(_membershipsAddress);
  }

  function setChannelsAddress(address _channelsAddress) public onlyRole(ADMIN_ROLE) {
    channelsAddress = _channelsAddress;
    channelContract = Channels(_channelsAddress);
  }
}