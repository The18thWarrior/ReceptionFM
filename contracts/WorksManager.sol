// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";


import { PostFactory } from "./PostFactory.sol";
import { Memberships } from "./Memberships.sol";
import { Channels } from "./Channels.sol";
//import { Broadcasts } from "./Broadcasts.sol";
import { Posts } from "./Posts.sol";
import { Token } from "./Token.sol";
import { Structs } from "./libraries/ReceptionStructs.sol";


/// @custom:security-contact ReceptionFM
contract WorksManager is Initializable, PausableUpgradeable, AccessControlUpgradeable  {
  address private postFactoryAddress;
  address private membershipsAddress;
  //address private broadcastsAddress;
  address private channelsAddress;
  address private postsAddress;
  address private depositorAddress;
  address private tokenAddress;
  address private apiUserAddress;

  PostFactory postFactoryContract;
  Memberships membershipContract;
  Channels channelContract;
  Token tokenContract;
  //Broadcasts broadcastContract;

  //mapping(uint256 => address) private channelPostAddressMap;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant API_ROLE = keccak256("API_ROLE");
  uint256 private constant CHANNEL_REWARD = 1000000000000000000000;
  uint256 private constant MEMBERSHIP_REWARD = 100000000000000000000;
  uint256 private constant POST_REWARD = 25000000000000000000;
  
  event NewPost(uint256 postId, uint256 indexed channelId, address postContractAddress);
  event NewPostMessage(uint256 indexed channelId, string msg);
  event NewChannel(uint256 indexed channelId, address owner, string keywords);
  event ProfileSet(address indexed sender, string keywords);

  constructor(address _apiUserAddress) initializer {
    __Pausable_init();
    __AccessControl_init();

    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(ADMIN_ROLE, msg.sender);
    depositorAddress = msg.sender;
    apiUserAddress = _apiUserAddress;
    _setupRole(API_ROLE, apiUserAddress);
  }
  
  function initialize(address _apiUserAddress) initializer external{
    __Pausable_init();
    __AccessControl_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
    depositorAddress = msg.sender;
    apiUserAddress = _apiUserAddress;
    _grantRole(API_ROLE, apiUserAddress);
  }

  /* Treasury Actions */
  function withdrawTreasury() external onlyRole(ADMIN_ROLE) {
    address payable ownerPayable = payable(depositorAddress);
    // send all Ether to owner
    // Owner can receive Ether since the address of owner is payable
    ownerPayable.transfer(address(this).balance);
  }
  
  function withdrawPostTreasuryBalance(address contractAddress) external onlyRole(ADMIN_ROLE) {
    Posts postContract = Posts(contractAddress);
    postContract.withdrawTreasuryBalance();
  }
  
  
  /* Artist Actions */

  //Create/Mint
  function mintChannel(
    string calldata channelUri,
    string calldata keywords
  ) external payable returns(uint256){
    uint256 channelId = channelContract.safeMint(channelUri, msg.sender);
    emit NewChannel(channelId, msg.sender, keywords);
    {
      tokenContract.mint(msg.sender, CHANNEL_REWARD);
    }    
    return channelId;
  }

  // API Mint
  function mintApiChannel(
    string calldata channelUri,
    string calldata tokenName,
    string calldata keywords
  ) external payable {
    uint256 channelId = channelContract.safeMint(channelUri, msg.sender);
    emit NewChannel(channelId, msg.sender, keywords);
    {
      tokenContract.mint(msg.sender, CHANNEL_REWARD);
    }    
    postFactoryContract.createPostContract(tokenName, channelId, msg.sender);
  }


  function membershipTokenCreate(uint256 channel, uint256 cost, string calldata computedUri) external {
    return membershipContract.membershipTokenCreate(msg.sender, channel, cost, computedUri);
  }

  function createPostContract(string calldata tokenName, uint256 channel) external{
    return postFactoryContract.createPostContract(tokenName, channel, msg.sender);
  }

  function createPostToken(Structs.CreatePost calldata post) external returns(uint256){
    Posts postContract = Posts(post.contractAddress);
    uint256 result = postContract.getCurrentCount();
    emit NewPost(result, post.channelId, post.contractAddress);
    { 
      postContract.createPostToken(Structs.CreatePost(
        msg.sender, 
        post.contractAddress,
        post.cost, 
        post.isBuyable, 
        post.isPublic, 
        post.airdrop, 
        post.premine,
        post.premineAmount,
        post.computedUri,
        post.channelId, 
        post.paywallUri, 
        post.mintable, 
        post.levels)); 
    }
    return result;
  }

  function createPostTokenApi(Structs.CreatePost calldata post) external onlyRole(API_ROLE) returns(uint256) {
    Posts postContract = Posts(post.contractAddress);
    uint256 result = postContract.getCurrentCount();
    emit NewPost(result, post.channelId, post.contractAddress);
    { 
      postContract.createPostToken(Structs.CreatePost(
        post.owner, 
        post.contractAddress,
        post.cost, 
        post.isBuyable, 
        post.isPublic, 
        post.airdrop, 
        post.premine,
        post.premineAmount,
        post.computedUri,
        post.channelId, 
        post.paywallUri, 
        post.mintable, 
        post.levels)); 
    }
    return result;
  }

  function setProfileUri(string calldata computedUri, string calldata keywords) external  {
    emit ProfileSet(msg.sender, keywords);
    channelContract.setProfileUri(msg.sender, computedUri);
  }

  function createPostMessage(address contractAddress, uint256 channelId, string calldata message) external {
    Posts postContract = Posts(contractAddress);
    emit NewPostMessage(channelId, message);
    require(postContract.channelOwnershipMatch(msg.sender), "Not owner");
  }

  // Withdrawal
  function withdrawPostBalance(address contractAddress) external onlyRole(ADMIN_ROLE) {
    Posts postContract = Posts(contractAddress);
    postContract.withdrawTreasuryBalance();
  }

  function withdrawChannelBalance(uint256 channel) external {
    return membershipContract.withdrawChannelBalance(msg.sender, channel);
  }

  /* Fan Actions */
  function membershipMint(uint256 membership) external payable{
    tokenContract.mint(msg.sender, MEMBERSHIP_REWARD);
    return membershipContract.membershipMint{ value: msg.value }(membership, msg.sender);
  }

  function postMint(address contractAddress, uint256 tokenId) external payable{
    Posts postContract = Posts(contractAddress);
    tokenContract.mint(msg.sender, POST_REWARD);
    return postContract.postMint{ value: msg.value }(msg.sender, tokenId);
  }


  /* UI Getters */

  // Channels 
  function getOwnerChannelIds() external view returns(uint256[] memory) {
    return channelContract.getOwnerChannelIds(msg.sender);
  }

  function getArtistChannelIds(address sender) external view returns(uint256[] memory) {
    return channelContract.getOwnerChannelIds(sender);
  }

  function getCurrentChannelIndex() external view returns(uint256){
    return channelContract.getCurrentIndex();
  }

  function getChannelMetadata(uint256 tokenId) external view returns(string memory) {
    return channelContract.uri(tokenId);
  }
  
  function getChannelOwner(uint256 tokenId) external view returns(address) {
    return channelContract.ownerOf(tokenId);
  }

  function getProfileUri(address to) external view returns(string memory) {
    return channelContract.getProfileUri(to);
  }

  // Memberships
  function getChannelBalance(uint256 channel) view external returns(uint256) {
    return membershipContract.getChannelBalance(channel);
  }

  function getMembershipList(uint256 channel) external view returns (uint256[] memory) {
    return membershipContract.getMembershipList(channel);
  }

  function getMembership(uint256 membershipId) external view returns (uint256) {
    return membershipContract.getMembership(membershipId, msg.sender);
  }

  function membershipUri(uint256 tokenId) external view returns (string memory) {
    return membershipContract.uri(tokenId);
  }

  function membershipGetOwnershipMap(uint256 tokenId) external view returns(address[] memory){
    return membershipContract.getOwnershipMap(tokenId);
  }

  // Post Factory
  function getChannelPostContract(uint256 channelToken) external view returns(address) {
    return postFactoryContract.getChannelPostContract(channelToken);
  }

  // Posts
  function getPostTokenIndex(address contractAddress) external view returns(uint256){
    Posts postContract = Posts(contractAddress);
    return postContract.getTokenIndex();
  }

  function getPostContractBalance(address contractAddress) external view returns(uint256){
    Posts postContract = Posts(contractAddress);
    return postContract.getBalance();
  }

  function getPostUri(address contractAddress, uint256 tokenId) external view returns(string memory){
    Posts postContract = Posts(contractAddress);
    return postContract.uri2(tokenId, msg.sender);
  }

  function getPostTokenBalance(address contractAddress, uint256 tokenId) external view returns(uint256){
    Posts postContract = Posts(contractAddress);
    return postContract.balanceOf(msg.sender, tokenId);
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
  
  // Works Manager
  function getChannelsAddress() external view returns(address) {
    return channelsAddress;
  }

  function getMembershipsAddress() external view returns(address) {
    return membershipsAddress;
  }

  /* Backend Administration */

  // Functions for setting static variables
  function setPostFactoryAddress(address tempPostFactoryAddress) external onlyRole(ADMIN_ROLE) {
    require(tempPostFactoryAddress != address(0), "postFactory required");
    postFactoryAddress = tempPostFactoryAddress;
    postFactoryContract = PostFactory(tempPostFactoryAddress);
  }

  function setMembershipsAddress(address tempMembershipAddress) external onlyRole(ADMIN_ROLE) {
    require(tempMembershipAddress != address(0), "memberships required");
    membershipsAddress = tempMembershipAddress;
    membershipContract = Memberships(tempMembershipAddress);
  }

  function setTokenAddress(address tempTokenAddress) external onlyRole(ADMIN_ROLE) {
    require(tempTokenAddress != address(0), "memberships required");
    tokenAddress = tempTokenAddress;
    tokenContract = Token(tempTokenAddress);
  }

  function setChannelsAddress(address tempChannelsAddress) external onlyRole(ADMIN_ROLE) {
    require(tempChannelsAddress != address(0), "channelAddress required");
    channelsAddress = tempChannelsAddress;
    channelContract = Channels(tempChannelsAddress);
  }
  
  function setPostAddress(address tempPostAddress) external onlyRole(ADMIN_ROLE) {
    require(tempPostAddress != address(0), "postAddress required");
    postsAddress = tempPostAddress;
  }

  function setChannelCost(uint256 cost) external onlyRole(ADMIN_ROLE) {
    channelContract.setCost(cost);
  }

}