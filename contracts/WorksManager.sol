// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "hardhat/console.sol";


import { PostFactory } from "./PostFactory.sol";
import { Memberships } from "./Memberships.sol";
import { Channels } from "./Channels.sol";
import { Broadcasts } from "./Broadcasts.sol";
import { Posts } from "./Posts.sol";
import { Base64 } from "./libraries/Base64.sol";
import { Structs } from "./libraries/ReceptionStructs.sol";


/// @custom:security-contact ReceptionFM
contract WorksManager is Initializable, PausableUpgradeable, AccessControlUpgradeable  {
  address private postFactoryAddress;
  address private membershipsAddress;
  address private broadcastsAddress;
  address private channelsAddress;
  address private postsAddress;

  PostFactory postFactoryContract;
  Memberships membershipContract;
  Channels channelContract;
  Broadcasts broadcastContract;

  mapping(uint256 => address) private channelPostAddressMap;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  constructor(){
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(ADMIN_ROLE, msg.sender);
  }
  
  function initialize() initializer public{
    __Pausable_init();
    __AccessControl_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
  }

  // Artist UI Interfaces
  // 1.2
  function mintChannel(
    string calldata channelName, 
    string calldata channelUri, 
    string calldata author,
    string calldata copyright,
    string calldata language
  ) public payable{
    return channelContract.safeMint(channelName, channelUri, msg.sender, author, copyright, language);
  }

  // 1.3
  function getOwnerChannelIds() public view returns(uint256[] memory) {
    return channelContract.getOwnerChannelIds(msg.sender);
  }
  
  function getOwnerChannelList(uint256[] calldata channelIds) public view returns(Structs.Channel[] memory) {
    return channelContract.getOwnerChannelList(channelIds);
  }

  // 1.4 (UI Only) - mint IPFS URI

  // 1.5 / 2.6
  function membershipTokenCreate(uint256 channel, uint256 cost, string calldata level, string calldata computedUri) public {
    return membershipContract.membershipTokenCreate(msg.sender, channel, cost, level, computedUri);
  }

  /*function broadcastTokenCreate(uint256 channel, uint256 cost, string calldata level, string calldata computedUri) public {
    return broadcastContract.broadcastTokenCreate(msg.sender, channel, cost, level, computedUri);
  }*/

  // 1.6
  function getChannelPostContract(uint256 channelToken) public view returns(Posts) {
    return postFactoryContract.getChannelPostContract(channelToken);
  }

  // 1.7
  function createPostContract(string calldata tokenName, uint256 channel) public{
    return postFactoryContract.createPostContract(tokenName, channel, msg.sender);
  }

  // 1.8
  //address owner, bool isPublic, string calldata computedUri, string calldata paywallUri_, bool mintable, string[] calldata levels
  function createPostToken(address contractAddress, uint256 cost, bool isBuyable, bool isPublic, string calldata computedUri,  string calldata paywallUri, bool mintable, string[] calldata levels) public returns(uint256){
    Posts postContract = Posts(contractAddress);
    return postContract.createPostToken(msg.sender, cost, isBuyable, isPublic, computedUri, paywallUri, mintable, levels);
  }

  // Artist UI Interfaces
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

  function getMembership(uint256 membershipId) public view returns (uint256) {
    return membershipContract.getMembership(membershipId, msg.sender);
  }

  /*function getBroadcastList(uint256 channel) public view returns (uint256[] memory) {
    return broadcastContract.getBroadcastList(channel);
  }*/
  
  // 2.4
  function membershipUri(uint256 tokenId) public view returns (string memory) {
    return membershipContract.uri(tokenId);
  }
  
  /*function broadcastUri(uint256 tokenId) public view returns (string memory) {
    return broadcastContract.uri(tokenId);
  }*/
  
  // 2.5
  function membershipMint(uint256 channel, string calldata level) public payable{
    return membershipContract.membershipMint{ value: msg.value }(channel, level, msg.sender);
  }

  /*function broadcastMint(uint256 channel, string calldata level) public payable{
    return broadcastContract.broadcastMint{ value: msg.value }(channel, level, msg.sender);
  }*/

  // 2.7
  function getPostTokenIndex(address contractAddress) public view returns(uint256){
    Posts postContract = Posts(contractAddress);
    return postContract.getTokenIndex();
  }
  
  // 2.8
  function getPostUri(address contractAddress, uint256 tokenId) public view returns(string memory){
    Posts postContract = Posts(contractAddress);
    return postContract.uri2(tokenId, msg.sender);
  }

  // 2.9
  function getPostTokenBalance(address contractAddress, uint256 tokenId) public view returns(uint256){
    Posts postContract = Posts(contractAddress);
    return postContract.getPostTokenBalance(tokenId, msg.sender);
  }

  // 2.10
  function postMint(address contractAddress, uint256 membershipId, uint256 tokenId) public payable{
    Posts postContract = Posts(contractAddress);
    return postContract.postMint{ value: msg.value }(msg.sender, membershipId, tokenId);
  }

  function getPostContracts() public view returns(Posts[] memory){
    return postFactoryContract.getChildren();
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

  /*function setBroadcastsAddress(address _broadcastsAddress) public onlyRole(ADMIN_ROLE) {
    broadcastsAddress = _broadcastsAddress;
    broadcastContract = Broadcasts(_broadcastsAddress);
  }*/

  function setChannelsAddress(address _channelsAddress) public onlyRole(ADMIN_ROLE) {
    channelsAddress = _channelsAddress;
    channelContract = Channels(_channelsAddress);
  }
  
  function setPostAddress(address _postAddress) public onlyRole(ADMIN_ROLE) {
    postsAddress = _postAddress;
  }
}