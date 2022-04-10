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

  
  event NewPost(uint256 postId, uint256 indexed channelId, address postContractAddress);
  event NewPostMessage(uint256 indexed channelId, string msg);
  event NewChannel(uint256 indexed channelId, string keywords);
  event ProfileSet(address indexed sender, string keywords);

  constructor() initializer {
    __Pausable_init();
    __AccessControl_init();

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
    string calldata channelUri,
    string calldata keywords
  ) external payable{
    emit NewChannel(channelContract.safeMint(channelUri, msg.sender), keywords);
  }

  // 1.3
  function getOwnerChannelIds() external view returns(uint256[] memory) {
    return channelContract.getOwnerChannelIds(msg.sender);
  }

  
  function getArtistChannelIds(address sender) external view returns(uint256[] memory) {
    return channelContract.getOwnerChannelIds(sender);
  }


  // 1.4 (UI Only) - mint IPFS URI

  // 1.5 / 2.6
  function membershipTokenCreate(uint256 channel, uint256 cost, string calldata computedUri) external {
    return membershipContract.membershipTokenCreate(msg.sender, channel, cost, computedUri);
  }

  /*function broadcastTokenCreate(uint256 channel, uint256 cost, string calldata level, string calldata computedUri) public {
    return broadcastContract.broadcastTokenCreate(msg.sender, channel, cost, level, computedUri);
  }*/

  // 1.6
  function getChannelPostContract(uint256 channelToken) external view returns(address) {
    return postFactoryContract.getChannelPostContract(channelToken);
  }

  // 1.7
  function createPostContract(string calldata tokenName, uint256 channel) external{
    return postFactoryContract.createPostContract(tokenName, channel, msg.sender);
  }

  // 1.8
  //address owner, bool isPublic, string calldata computedUri, string calldata paywallUri_, bool mintable, string[] calldata levels
  struct CreatePost {
      address contractAddress;
      uint256 cost;
      bool isBuyable;
      bool isPublic;
      bool airdrop;
      string computedUri;
      uint256 channelId;
      string paywallUri; 
      bool mintable;
      uint256[] levels;
  }
  function createPostToken(CreatePost calldata post) external returns(uint256){
    Posts postContract = Posts(post.contractAddress);
    uint256 result = 0;
    { 
      result = postContract.createPostToken(Posts.CreatePost(msg.sender, post.cost, post.isBuyable, post.isPublic, post.airdrop, post.computedUri, post.paywallUri, post.mintable, post.levels)); 
    }
    emit NewPost(result, post.channelId, post.contractAddress);
    return result;
  }

  // Artist UI Interfaces
  // 2.1
  function getCurrentChannelIndex() external view returns(uint256){
    return channelContract.getCurrentIndex();
  }

  // 2.2
  function getChannelMetadata(uint256 tokenId) external view returns(string memory) {
    return channelContract.uri(tokenId);
  }
  
  // 2.3
  function getMembershipList(uint256 channel) external view returns (uint256[] memory) {
    return membershipContract.getMembershipList(channel);
  }

  function getMembership(uint256 membershipId) external view returns (uint256) {
    return membershipContract.getMembership(membershipId, msg.sender);
  }

  /*function getBroadcastList(uint256 channel) public view returns (uint256[] memory) {
    return broadcastContract.getBroadcastList(channel);
  }*/
  
  // 2.4
  function membershipUri(uint256 tokenId) external view returns (string memory) {
    return membershipContract.uri(tokenId);
  }
  
  /*function broadcastUri(uint256 tokenId) public view returns (string memory) {
    return broadcastContract.uri(tokenId);
  }*/
  
  // 2.5
  function membershipMint(uint256 membership) external payable{
    return membershipContract.membershipMint{ value: msg.value }(membership, msg.sender);
  }

  /*function broadcastMint(uint256 channel, string calldata level) public payable{
    return broadcastContract.broadcastMint{ value: msg.value }(channel, level, msg.sender);
  }*/

  // 2.7
  function getPostTokenIndex(address contractAddress) external view returns(uint256){
    Posts postContract = Posts(contractAddress);
    return postContract.getTokenIndex();
  }
  
  // 2.8
  function getPostUri(address contractAddress, uint256 tokenId) external view returns(string memory){
    Posts postContract = Posts(contractAddress);
    return postContract.uri2(tokenId, msg.sender);
  }

  // 2.9
  function getPostTokenBalance(address contractAddress, uint256 tokenId) external view returns(uint256){
    Posts postContract = Posts(contractAddress);
    return postContract.balanceOf(msg.sender, tokenId);
  }

  // 2.10
  function postMint(address contractAddress, uint256 tokenId) external payable{
    Posts postContract = Posts(contractAddress);
    return postContract.postMint{ value: msg.value }(msg.sender, tokenId);
  }

  function postIsMintable(address contractAddress, uint256 tokenId) external view returns(bool){
    Posts postContract = Posts(contractAddress);
    return postContract.isMintable(tokenId);
  }

  function postIsBuyable(address contractAddress, uint256 tokenId) external view returns(bool){
    Posts postContract = Posts(contractAddress);
    return postContract.isBuyable(tokenId);
  }

  function postGetCost(address contractAddress, uint256 tokenId) external view returns(uint256 ){
    Posts postContract = Posts(contractAddress);
    return postContract.getCost(tokenId);
  }

  function membershipGetOwnershipMap(uint256 tokenId) external view returns(address[] memory){
    return membershipContract.getOwnershipMap(tokenId);
  }
  

  // Functions for setting static variables
  function setPostFactoryAddress(address _postFactoryAddress) external onlyRole(ADMIN_ROLE) {
    postFactoryAddress = _postFactoryAddress;
    postFactoryContract = PostFactory(_postFactoryAddress);
  }

  function setMembershipsAddress(address _membershipsAddress) external onlyRole(ADMIN_ROLE) {
    membershipsAddress = _membershipsAddress;
    membershipContract = Memberships(_membershipsAddress);
  }

  /*function setBroadcastsAddress(address _broadcastsAddress) public onlyRole(ADMIN_ROLE) {
    broadcastsAddress = _broadcastsAddress;
    broadcastContract = Broadcasts(_broadcastsAddress);
  }*/

  function setChannelsAddress(address _channelsAddress) external onlyRole(ADMIN_ROLE) {
    channelsAddress = _channelsAddress;
    channelContract = Channels(_channelsAddress);
  }
  
  function setPostAddress(address _postAddress) external onlyRole(ADMIN_ROLE) {
    postsAddress = _postAddress;
  }

  function setProfileUri(string calldata computedUri, string calldata keywords) external  {
    channelContract.setProfileUri(msg.sender, computedUri);
    emit ProfileSet(msg.sender, keywords);
  }

  function getProfileUri(address to) external view returns(string memory) {
    return channelContract.getProfileUri(to);
  }

  function getChannelsAddress() external view returns(address) {
    return channelsAddress;
  }

  function getMembershipsAddress() external view returns(address) {
    return membershipsAddress;
  }

  function createPostMessage(address contractAddress, uint256 channelId, string calldata message) public {
      Posts postContract = Posts(contractAddress);
      require(postContract.channelOwnershipMatch(msg.sender), "Not owner");
      emit NewPostMessage(channelId, message);
  }

}