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
  mapping(uint256 => Structs.Level[5]) private _tokenLevel;
  mapping(address => uint256[]) private _redemptions;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(string memory tokenName, uint256 _channelToken, address to, address _channelAddress, address _membershipsAddress) initializer {
    name = tokenName;
    channelToken = _channelToken;
    depositorAddress = to;
    channelAddress = _channelAddress;
    channelContract = Channels(channelAddress);
    membershipsAddress = _membershipsAddress;
    membershipsContract = Memberships(membershipsAddress);
  }

  function initialize(string memory tokenName, address to) initializer public {
    //require(msg.sender == RECEPTION_ACCOUNT, "Wrong Account Deployer");
    __ERC1155_init(tokenName);
    __ERC1155Burnable_init();
    __ERC1155Supply_init();
    __Pausable_init();
    __AccessControl_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
    _grantRole(OWNER_ROLE, to);

    levelMap["bronze"] = Structs.Level.BRONZE;
    levelMap["silver"] = Structs.Level.SILVER;
    levelMap["gold"] = Structs.Level.GOLD;
    levelMap["platinum"] = Structs.Level.PLATINUM;
    levelMap["all"] = Structs.Level.ALL;
  }

  function transferOwnership(address to) public onlyRole(ADMIN_ROLE) {
    _grantRole(OWNER_ROLE, to);
  }

  function createPostToken(address owner, uint256 cost, bool buyable, bool isPublic, string calldata computedUri, string calldata paywallUri_, bool mintable, string[] calldata levels) public returns(uint256) {
      // TODO : Add function to validate that the msg.sender owns channel
      
      require(channelOwnershipMatch(owner), "You must be the channel owner to create posts");
      // Required inputs
      if (!isPublic) {
        require(levels.length > 0, "You must include at least 1 level to create a non-public post");
      }
      
      uint256 tokenId = _tokenIdCounter.current();
      _tokenIdCounter.increment();
      setTokenUriInternal(tokenId, computedUri);
      setPaywallUriInternal(tokenId, paywallUri_);
      _paywallUriAccess[tokenId] = isPublic;
      _buyable[tokenId] = buyable;
      _mintable[tokenId] = mintable;
      _cost[tokenId] = cost;
      
      if (!isPublic && levels.length > 0) {
        Structs.Level[5] memory lvlList;
        for (uint i = 0; i < levels.length; i++) {
          lvlList[i] = levelMap[levels[i]];
        }
        setTokenLevelsInternal(tokenId, lvlList);
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
    require(membershipsContract.balanceOf(to, membershipId) == 1 || hasPaid, "You must be a member of the channel to mint post NFTs");

    require(membershipMatch(tokenId, to) || hasPaid, "Your membership level does not give you minting access");  

    require(_mintable[tokenId] == true, "This post is not mintable");

    for(uint256 i = 0; i < _redemptions[to].length; i++) {
      require(_redemptions[to][i] != tokenId, 'Sorry, you have already redeemed this NFT');
    }

    _mint(to, tokenId, 1, "");
    _redemptions[to].push(tokenId); 
    emit NewPostMinted(to, tokenId);

    if (hasPaid) {
      address ownerPayable = payable(depositorAddress);
      
      (bool success, ) = ownerPayable.call{value: msg.value}("");
      require(success, "Failed to send MATIC");

    }
  }
  
  function withdrawBalance() public onlyRole(OWNER_ROLE) {
    address ownerPayable = payable(msg.sender);
    // send all Ether to owner
    // Owner can receive Ether since the address of owner is payable
    (bool success, ) = ownerPayable.call{value: address(this).balance}("");
    require(success, "Failed to send MATIC");
  }

  function isMintable(uint256 tokenId) public view returns (bool) {
    return _mintable[tokenId];
  }

  function isBuyable(uint256 tokenId) public view returns (bool) {
    return _buyable[tokenId];
  }

  function getCost(uint256 tokenId) public view returns (uint256) {
    return _cost[tokenId];
  }
  
  function uri(uint256 tokenId) override public view returns (string memory) {
    if (membershipMatch(tokenId, msg.sender) || channelOwnershipMatch(msg.sender) || ownershipMatch(msg.sender, tokenId) || _paywallUriAccess[tokenId]) {
      return _paywallUri[tokenId];
    } else {
      return(_uris[tokenId]);
    }
  }

  function uri2(uint256 tokenId, address to) public view returns (string memory) {    
    if (membershipMatch(tokenId, to) || channelOwnershipMatch(to) || ownershipMatch(to, tokenId) || _paywallUriAccess[tokenId]) {
      return _paywallUri[tokenId];
    } else {
      return(_uris[tokenId]);
    }
  }

  function membershipMatch(uint256 tokenId, address to) public view returns (bool) {
    uint256[] memory membershipList = membershipsContract.getMembershipList(channelToken);
    bool isMembershipMatch = false;
    uint256 membershipId;
    for(uint256 i = 0; i < membershipList.length; i++) {
      if (membershipsContract.balanceOf(to, membershipList[i]) == 1) {
        membershipId = membershipList[i];
        isMembershipMatch = true;
      }
    }
    if (isMembershipMatch) {
      isMembershipMatch = false;
      Structs.Level[5] memory tokenLevels = _tokenLevel[tokenId];
      for (uint256 i = 0; i < tokenLevels.length; i++) {
        if (tokenLevels[i] == Structs.Level.ALL) {
          isMembershipMatch = true;
        } else if (membershipsContract.getTokenLevel(membershipId) == tokenLevels[i]){
          isMembershipMatch = true;
        }
      }
    }

    return isMembershipMatch;
  }

  function channelOwnershipMatch(address owner) public view returns (bool) {
    uint256[] memory channelList = channelContract.getOwnerChannelIds(owner);
    //bool isOwnerMatch = false;
    if (channelList.length == 0) {
      return false;
    } else {
      for(uint256 i = 0; i < channelList.length; i++) {
        if (channelToken == channelList[i]) {
          return true;
        }
      }
    }
    

    return false;
  }

  function ownershipMatch(address to, uint256 tokenId) public view returns (bool) {
    if (getPostTokenBalance(tokenId, to) > 0) {
      return true;
    }

    return false;
  }

  function paywallUri(address to, uint256 tokenId, uint256 membershipId, uint256 broadcastId) public view returns (string memory) {
    require(broadcastsContract.balanceOf(msg.sender, broadcastId) == 1, "You must be a member of the syndicate to retrieve paywallUris.");
    
    if (!_paywallUriAccess[tokenId]) {
      require(membershipsContract.balanceOf(to, membershipId) == 1, "You must be a member of the channel to retrieve paywallUris.");
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

  function setTokenLevelsInternal(uint256 tokenId, Structs.Level[5] memory newLevels) internal{
    //require(_tokenLevel[tokenId].length == 0, "Cannot modify existing level allocation");
    _tokenLevel[tokenId] = newLevels;
  }

  function setTokenUri(uint256 tokenId, string memory newUri) public onlyRole(OWNER_ROLE){
    require(bytes(_uris[tokenId]).length == 0, "Cannot modify existing uri");
    _uris[tokenId] = newUri;
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

  function supportsInterface(bytes4 interfaceId)
      public
      view
      override(ERC1155Upgradeable, AccessControlUpgradeable)
      returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }
  
}