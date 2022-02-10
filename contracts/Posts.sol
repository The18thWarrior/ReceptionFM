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
import { Structs } from "./libraries/ReceptionStructs.sol";
import { Channels } from "./Channels.sol";
import { Memberships } from "./Memberships.sol";
import { Broadcasts } from "./Broadcasts.sol";



/// @custom:security-contact ReceptionFM
contract Posts is Initializable, ERC1155Upgradeable, ERC1155SupplyUpgradeable, PausableUpgradeable, AccessControlUpgradeable, ERC1155BurnableUpgradeable {
  using CountersUpgradeable for CountersUpgradeable.Counter;
  bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  string public name;
  string public description;
	string public symbol;
  address private depositorAddress;
  address private channelAddress;
  address private membershipsAddress;
  address private broadcastsAddress;
  Channels channelContract;
  Memberships membershipsContract;
  Broadcasts broadcastsContract;

  CountersUpgradeable.Counter private _tokenIdCounter;
  
  event NewPostTokenCreated(address sender, uint256 tokenId);
  event NewPostMinted(address sender, uint256 tokenId);

  // ============ Structs ============
  

  uint256 public channelToken;
  mapping(string => Structs.Level) public levelMap;
  //mapping(address => Membership) public membershipOwnershipMap;
  mapping(uint256 => string) private _uris;
  mapping(uint256 => string) private _paywallUri;
  mapping(uint256 => bool) private _paywallUriAccess;
  mapping(uint256 => bool) private _mintable;
  mapping(uint256 => bool) private _buyable;
  mapping(uint256 => uint256) private _cost;
  mapping(uint256 => Structs.Level[]) private _tokenLevel;
  mapping(address => uint256[]) private _redemptions;

  uint256 maxMemberships = 10;
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(string memory tokenName, string memory tokenCode, address to, address _channelAddress, address _broadcastsAddress) initializer {}

  function initialize(string memory tokenName, uint256 _channelToken, address to, address _channelAddress, address _membershipsAddress, address _broadcastsAddress) initializer public {
    //require(msg.sender == RECEPTION_ACCOUNT, "Wrong Account Deployer");
    __ERC1155_init(tokenName);
    __ERC1155Burnable_init();
    __ERC1155Supply_init();
    __Pausable_init();
    __AccessControl_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
    _grantRole(OWNER_ROLE, to);
    depositorAddress = to;

    levelMap["bronze"] = Structs.Level.BRONZE;
    levelMap["silver"] = Structs.Level.SILVER;
    levelMap["gold"] = Structs.Level.GOLD;
    levelMap["platinum"] = Structs.Level.PLATINUM;
    levelMap["all"] = Structs.Level.ALL;

    name = tokenName;
    channelToken = _channelToken;
    channelAddress = _channelAddress;
    channelContract = Channels(channelAddress);
    membershipsAddress = _membershipsAddress;
    membershipsContract = Memberships(membershipsAddress);
    broadcastsAddress = _broadcastsAddress;
    broadcastsContract = Broadcasts(broadcastsAddress);
  }

  function transferOwnership(address to) public onlyRole(ADMIN_ROLE) {
    _grantRole(OWNER_ROLE, to);
  }

  function createPostToken(address owner, uint256 cost, bool isBuyable, bool isPublic, string calldata computedUri, string calldata paywallUri_, bool mintable, string[] calldata levels) public returns(uint256) {
      // TODO : Add function to validate that the msg.sender owns channel
      address channelOwner = channelContract.getApproved(channelToken);
      require(owner == channelOwner, "You must be the channel owner to create posts");

      // Required inputs
      if (!isPublic) {
        require(levels.length > 0, "You must include at least 1 level to create a non-public post");
      }
      

      uint256 tokenId = _tokenIdCounter.current();
      _tokenIdCounter.increment();
      setTokenUriInternal(tokenId, computedUri);
      setPaywallUriInternal(tokenId, paywallUri_);
      _paywallUriAccess[tokenId] = isPublic;
      _buyable[tokenId] = isBuyable;
      _mintable[tokenId] = mintable;
      _cost[tokenId] = cost;
      Structs.Level[] memory levelList;
      for (uint256 i = 0; i < levels.length; i++) {
        Structs.Level lmap = levelMap[levels[i]];
        levelList[i] = lmap;
      }
      if (levelList.length > 0) {
        setTokenLevels(tokenId, levelList);
      }
      emit NewPostTokenCreated(owner, tokenId);
      return tokenId;
  }

  function postMint(address to, uint256 membershipId, uint256 tokenId) public payable{  
    bool hasPaid = false;
    if (msg.value > 0 && _buyable[tokenId] && msg.value >= _cost[tokenId]) {
      hasPaid = true;
    }

    // validate that the msg.sender owns membership
    uint256 membershipAmount = membershipsContract.balanceOf(to, membershipId);
    require(membershipAmount == 1 || hasPaid, "You must be a member of the channel to mint post NFTs");

    bool membershipMatch = false;
    Structs.Level membershipLevel = membershipsContract.getTokenLevel(membershipId);
    Structs.Level[] storage tokenLevels = _tokenLevel[tokenId];
    for (uint256 i = 0; i < tokenLevels.length; i++) {
      Structs.Level tokenLevel = tokenLevels[i];
      if (tokenLevel == Structs.Level.ALL) {
        membershipMatch = true;
      } else if (tokenLevel == membershipLevel){
        membershipMatch = true;
      } else if (hasPaid) {
        //Override in the scenario where this msg has paid and this post is payable
        membershipMatch = true;
      }
    }
    require(membershipMatch, "Your membership level does not give you minting access");  


    bool mintable = _mintable[tokenId];
    require(mintable == true, "This post is not mintable");

    uint256[] storage redemptions = _redemptions[to];
    for(uint256 i = 0; i < redemptions.length; i++) {
      require(redemptions[i] != tokenId, 'Sorry, you have already redeemed this NFT');
    }

    _mint(to, tokenId, 1, "");
    _redemptions[to].push(tokenId); 
    emit NewPostMinted(to, tokenId);

    if (hasPaid) {
      address ownerPayable = payable(depositorAddress);
      uint amount = msg.value;
      
      (bool success, ) = ownerPayable.call{value: amount}("");
      require(success, "Failed to send MATIC");

    }
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

  function paywallUri(address to, uint256 tokenId, uint256 membershipId, uint256 broadcastId) public view returns (string memory) {
    bool isPublic = _paywallUriAccess[tokenId];
    
    uint256 broadcastAmount = broadcastsContract.balanceOf(msg.sender, broadcastId);
    require(broadcastAmount == 1, "You must be a member of the syndicate to retrieve paywallUris.");
    
    if (!isPublic) {
      uint256 membershipAmount = membershipsContract.balanceOf(to, membershipId);
      require(membershipAmount == 1, "You must be a member of the channel to retrieve paywallUris.");
    }
    
    return(_paywallUri[tokenId]);
  }

  function setTokenUriInternal(uint256 tokenId, string memory newUri) internal{
    require(bytes(_uris[tokenId]).length == 0, "Cannot modify existing uri");
    _uris[tokenId] = newUri;
  }

  function setPaywallUriInternal(uint256 tokenId, string memory newUri) internal{
    require(bytes(_paywallUri[tokenId]).length == 0, "Cannot modify existing uri");
    _paywallUri[tokenId] = newUri;
  }

  function setTokenUri(uint256 tokenId, string memory newUri) public onlyRole(OWNER_ROLE){
    require(bytes(_uris[tokenId]).length == 0, "Cannot modify existing uri");
    _uris[tokenId] = newUri;
  }

  function setTokenLevels(uint256 tokenId, Structs.Level[] memory newLevels) public onlyRole(OWNER_ROLE){
    require(_tokenLevel[tokenId].length == 0, "Cannot modify existing level allocation");
    _tokenLevel[tokenId] = newLevels;
  }

  function getTokenIndex() public view returns (uint256) {
    return _tokenIdCounter.current();
  }

  function getPostTokenBalance(uint256 tokenId, address to) public view returns (uint256) {
    return balanceOf(to, tokenId);
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