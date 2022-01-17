// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";

/// @custom:security-contact ReceptionFM
contract Memberships is Initializable, ERC1155Upgradeable, ERC1155SupplyUpgradeable, PausableUpgradeable, AccessControlUpgradeable, ERC1155BurnableUpgradeable {
  using CountersUpgradeable for CountersUpgradeable.Counter;
  bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  string public name;
	string public symbol;

  address public RECEPTION_ACCOUNT = 0x836C31094bEa1aE6b65F76D1C906b01329645a94;

  CountersUpgradeable.Counter private _tokenIdCounter;
  
  event NewMembershipTokenCreated(address sender, uint256 tokenId);
  event NewMembershipMinted(address sender, uint256 tokenId);

  // ============ Structs ============
  enum Levels{ BRONZE, SILVER, GOLD, PLATINUM }
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

  mapping(string => Levels) public levelMapping;
  //mapping(address => Membership) public membershipOwnershipMap;
  mapping(uint256 => string) private _uris;
  mapping(uint256 => uint256[]) private _channelMap;
  mapping(uint256 => uint256) private _tokenCost;
  mapping(uint256 => Levels) private _tokenLevel;

  uint256 maxMemberships = 10;
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(string memory tokenName, string memory tokenCode) initializer {}

  function initialize(string memory tokenName, string memory tokenCode) initializer public {
    //require(msg.sender == RECEPTION_ACCOUNT, "Wrong Account Deployer");
    __ERC1155_init(tokenName);
    __ERC1155Burnable_init();
    __ERC1155Supply_init();
    __Pausable_init();
    __AccessControl_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
    _grantRole(OWNER_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
    _grantRole(OWNER_ROLE, 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);

    levelMapping["bronze"] = Levels.BRONZE;
    levelMapping["silver"] = Levels.SILVER;
    levelMapping["gold"] = Levels.GOLD;
    levelMapping["platinum"] = Levels.PLATINUM;

    name = tokenName;
    symbol = tokenCode;
  }

  function transferOwnership(address to) public onlyRole(ADMIN_ROLE) {
    _grantRole(OWNER_ROLE, to);
  }

  function setMaxMemberships(string calldata maxMember) public onlyRole(OWNER_ROLE) {
    uint256 memberConv = parseInt(maxMember);
    maxMemberships = memberConv;
  }

  function membershipTokenCreate(uint256 channel, uint256 cost, string calldata level, string calldata computedUri) public {
      // TODO : Add function to validate that the msg.sender owns channel
      
      uint256 tokenId = _tokenIdCounter.current();
      _tokenIdCounter.increment();
      _channelMap[channel].push(tokenId); 
      _tokenCost[tokenId] = cost;
      _tokenLevel[tokenId] = levelMapping[level];
      /*Membership memory newMembership = Membership({
        membershipOwner: to,
        tokenIndex : tokenId,
        indefinite : false,
        level: levelMapping[level],
        channel: channel
      });*/

      //membershipOwnershipMap[to] = newMembership;
      setTokenUriInternal(tokenId, computedUri);
      
      emit NewMembershipTokenCreated(msg.sender, tokenId);
  }

  function membershipMint(uint256 channel, string calldata level) public payable {
    uint256[] memory memberships = _channelMap[channel];
    require(memberships.length > 0, 'No memberships minted for this channel');
    uint256 tokenId;
    for (uint256 i = 0;i<memberships.length;i++) {
      Levels tokenLevel = _tokenLevel[memberships[i]];
      if (tokenLevel == levelMapping[level]) {
        tokenId = memberships[i];
      }
    }

    // TODO : add function to validate that this membership is not outside the membership limits ()
    
    // TODO : add function to require value & submit as a transaction to owner (may require getting nft owner from Channels.sol)
    //require(msg.value > cost, 'Not enough value included in transaction');
    uint256 cost = _tokenCost[tokenId];
    if (cost >= msg.value) {
      console.log('not enough moneybags');
    }
    
    _mint(msg.sender, tokenId, 1, "");
    _channelMap[channel].push(tokenId); 
    
    emit NewMembershipMinted(msg.sender, tokenId);
  }
  
  function withdrawBalance() public onlyRole(OWNER_ROLE) {
    address ownerPayable = payable(msg.sender);
    uint amount = address(this).balance;

    // send all Ether to owner
    // Owner can receive Ether since the address of owner is payable
    (bool success, ) = ownerPayable.call{value: amount}("");
    require(success, "Failed to send MATIC");
  }
  
  function uri(uint256 tokenId) override public view returns (string memory) {
    return(_uris[tokenId]);
  }

  function setTokenUriInternal(uint256 tokenId, string memory newUri) internal{
    require(bytes(_uris[tokenId]).length == 0, "Cannot modify existing uri");
    _uris[tokenId] = newUri;
  }

  function setTokenUri(uint256 tokenId, string memory newUri) public onlyRole(OWNER_ROLE){
    require(bytes(_uris[tokenId]).length == 0, "Cannot modify existing uri");
    _uris[tokenId] = newUri;
  }

  function getTokenIndex() public view returns (uint256) {
    return _tokenIdCounter.current();
  }

  function getMembershipList(uint256 channel) public view returns (uint256[] memory) {
    return _channelMap[channel];
  }

  function getMembership(uint256 tokenId) public view returns (uint256) {
    return balanceOf(msg.sender, tokenId);
  }


  // DEFAULT METHODS REQUIRED BY INTERFACES
  function pause() public onlyRole(OWNER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(OWNER_ROLE) {
      _unpause();
  }

  function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
      internal
      whenNotPaused
      override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
  {
      super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }

  function setURI(string memory newuri) public onlyRole(ADMIN_ROLE) {
    _setURI(newuri);
  }

  function parseInt(string memory _value) internal pure returns (uint _ret) {
    bytes memory _bytesValue = bytes(_value);
    uint j = 1;
    for(uint i = _bytesValue.length-1; i >= 0 && i < _bytesValue.length; i--) {
        assert(uint8(_bytesValue[i]) >= 48 && uint8(_bytesValue[i]) <= 57);
        _ret += (uint8(_bytesValue[i]) - 48)*j;
        j*=10;
    }
  }

  function supportsInterface(bytes4 interfaceId)
      public
      view
      override(ERC1155Upgradeable, AccessControlUpgradeable)
      returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }
  
}