// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import { Structs } from "./libraries/ReceptionStructs.sol";
import { Channels } from "./Channels.sol";

/// @custom:security-contact ReceptionFM
contract Memberships is Initializable, ERC1155Upgradeable, ERC1155SupplyUpgradeable, PausableUpgradeable, AccessControlUpgradeable, ERC1155BurnableUpgradeable {
  using CountersUpgradeable for CountersUpgradeable.Counter;
  bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  string public name;
  address private channelAddress;
  address private payableAddress;
  uint256 private commission;
  uint256 private treasuryBalance;

  Channels channelContract;

  //address public RECEPTION_ACCOUNT = 0x836C31094bEa1aE6b65F76D1C906b01329645a94;

  CountersUpgradeable.Counter private _tokenIdCounter;
  
  event NewMembershipTokenCreated(address sender, uint256 tokenId);
  event NewMembershipMinted(address sender, uint256 tokenId);

  // ============ Structs ============
  /*struct Membership {
    // The account that will receive sales revenue.
    address membershipOwner;
    // Index of this token
    uint256 tokenIndex;
    // Marks if membership level is indefinite
    bool indefinite;
    // Marks membership level
    Levels level;
    // Marks Channel for Membership
    address channel;
  }*/

  //mapping(address => Membership) public membershipOwnershipMap;
  mapping(uint256 => string) private _uris;
  mapping(uint256 => uint256[]) private _channelMap;
  mapping(uint256 => address[]) private _ownershipMap;
  mapping(uint256 => uint256) private _tokenCost;
  mapping(uint256 => uint256) private _membershipToChannel;
  mapping(uint256 => uint256) private _channelBalance;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(string memory tokenName, address tempOwnerContract, address tempChannelAddress, uint256 tempCommission) initializer {
    initialize(tokenName, tempOwnerContract, tempChannelAddress, tempCommission);
  }

  function initialize(string memory tokenName, address tempOwnerContract, address tempChannelAddress, uint256 tempCommission) initializer public {
    __ERC1155_init(tokenName);
    __ERC1155Burnable_init();
    __ERC1155Supply_init();
    __Pausable_init();
    __AccessControl_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
    _grantRole(OWNER_ROLE, msg.sender);
    
    require(tempOwnerContract != address(0), "ownerCon required");
    _grantRole(ADMIN_ROLE, tempOwnerContract);
    _grantRole(OWNER_ROLE, tempOwnerContract);
    
    
    payableAddress = msg.sender;

    name = tokenName;
    require(tempChannelAddress != address(0), "channelAddress required");
    channelAddress = tempChannelAddress;
    channelContract = Channels(channelAddress);
    commission = tempCommission; 
    treasuryBalance = 0;   
  }

  function transferOwnership(address to) external onlyRole(ADMIN_ROLE) {
    require(to != address(0), "to required");
    _grantRole(OWNER_ROLE, to);
    payableAddress = to;    
  }

  function membershipTokenCreate(address from, uint256 channel, uint256 cost, string calldata computedUri) external onlyRole(OWNER_ROLE){
      // TODO : Add function to validate that the msg.sender owns channel
      channelContract = Channels(channelAddress);
      address channelOwner = channelContract.ownerOf(channel);
      require(from == channelOwner, "You must be the channel owner to create memberships");

      uint256 tokenId = _tokenIdCounter.current();
      _tokenIdCounter.increment();
      _channelMap[channel].push(tokenId); 
      _tokenCost[tokenId] = cost;
      _membershipToChannel[tokenId] = channel;

      //membershipOwnershipMap[to] = newMembership;
      setTokenUriInternal(tokenId, computedUri);
      
      emit NewMembershipTokenCreated(msg.sender, tokenId);
  }

  function getChannelBalance(uint256 channel) view external onlyRole(OWNER_ROLE) returns(uint256){
    return _channelBalance[channel];
  }

  function withdrawChannelBalance(address from, uint256 channel) external onlyRole(OWNER_ROLE) {
    channelContract = Channels(channelAddress);
    address channelOwner = channelContract.ownerOf(channel);
    require(from == channelOwner, "You must be the channel owner to withdraw");
    address payable ownerPayable = payable(channelContract.ownerOf(channel));
    require(ownerPayable != address(0), "owner must not be 0");
    uint256 oldChannelBalance = _channelBalance[channel] + 0;
    _channelBalance[channel] = 0;
    ownerPayable.transfer(oldChannelBalance);
  }

  function membershipMint(uint256 membership, address to) external payable {
    // TODO : add function to validate that this membership is not outside the membership limits ()
    
    // TODO : add function to require value & submit as a transaction to owner (may require getting nft owner from Channels.sol)
    //require(msg.value > cost, 'Not enough value included in transaction');
    uint256 cost = _tokenCost[membership];
    require( msg.value >= cost, 'Not enough $$ :( ');
    emit NewMembershipMinted(to, membership);

    //Settle Reception.fm commission
    uint yield = commissionYield(msg.value, commission);
    treasuryBalance += yield;
    _channelBalance[_membershipToChannel[membership]] = _channelBalance[_membershipToChannel[membership]] + (msg.value-yield);
        
    _mint(to, membership, 1, "");    
  }
  
  function withdrawBalance() external onlyRole(OWNER_ROLE) {
    address payable ownerPayable = payable(payableAddress);
    // send all Ether to owner
    // Owner can receive Ether since the address of owner is payable
    uint256 currentBalance = treasuryBalance + 0;
    treasuryBalance = 0; 
    ownerPayable.transfer(currentBalance);
  }
  
  function uri(uint256 tokenId) override public view returns (string memory) {
    return(string(abi.encodePacked("ipfs://", _uris[tokenId], "/metadata.json")));
  }

  function setTokenUriInternal(uint256 tokenId, string memory newUri) internal{
    require(bytes(_uris[tokenId]).length == 0, "Cannot modify existing uri");
    _uris[tokenId] = newUri;
  }

  function setTokenUri(uint256 tokenId, string memory newUri) external onlyRole(OWNER_ROLE){
    require(bytes(_uris[tokenId]).length == 0, "Cannot modify existing uri");
    _uris[tokenId] = newUri;
  }

  function setChannelsAddress(address tempChannelAddress) external onlyRole(OWNER_ROLE){
    
    require(tempChannelAddress != address(0), "channelAddress required");
    channelAddress = tempChannelAddress;
    channelContract = Channels(tempChannelAddress);
    
  }

  function setCommission(uint256 tempCommission) external onlyRole(OWNER_ROLE) {
    commission = tempCommission;
  }

  function getTokenIndex() external view returns (uint256) {
    return _tokenIdCounter.current();
  }

  function getMembershipList(uint256 channel) external view returns (uint256[] memory) {
    return _channelMap[channel];
  }

  function getMembership(uint256 tokenId, address to) external view returns (uint256) {
    return balanceOf(to, tokenId);
  }

  function getOwnershipMap(uint256 tokenId) external view returns(address[] memory) {
    return _ownershipMap[tokenId];
  }    

  // DEFAULT METHODS REQUIRED BY INTERFACES
  function pause() external onlyRole(OWNER_ROLE) {
    _pause();
  }

  function unpause() external onlyRole(OWNER_ROLE) {
      _unpause();
  }

  function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
      internal
      whenNotPaused
      override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
  {
    for (uint i = 0; i < ids.length; i++) {
      for (uint j = 0; j < _ownershipMap[ids[i]].length; j++) {
        if (_ownershipMap[ids[i]][j] == from) {
          _ownershipMap[ids[i]][j] = _ownershipMap[ids[i]][_ownershipMap[ids[i]].length - 1];
          _ownershipMap[ids[i]].pop();
          break;
        }
      }
      _ownershipMap[i].push(to);
    }
    
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }

  function setURI(string memory newuri) external onlyRole(ADMIN_ROLE) {
    _setURI(newuri);
  }

  function supportsInterface(bytes4 interfaceId)
      public
      view
      override(ERC1155Upgradeable, AccessControlUpgradeable)
      returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }

  function divider(uint numerator, uint denominator, uint precision) public pure returns(uint) {
    return (numerator*(uint(10)**uint(precision+1))/denominator + 5)/uint(10);
  }

  function commissionYield(uint total, uint percentage) public pure returns(uint) {
    return divider(total * percentage, 100, 0);
  }
  
}