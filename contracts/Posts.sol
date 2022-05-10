// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
//import "./libraries/Strings.sol";
import { Structs } from "./libraries/ReceptionStructs.sol";
import { Channels } from "./Channels.sol";
import { Memberships } from "./Memberships.sol";
import { Broadcasts } from "./Broadcasts.sol";



/// @custom:security-contact ReceptionFM
contract Posts is Initializable, ERC1155Upgradeable, ERC1155SupplyUpgradeable, PausableUpgradeable, AccessControlUpgradeable, ERC1155BurnableUpgradeable {
  using CountersUpgradeable for CountersUpgradeable.Counter;
  //using Strings2 for *;
  bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  string public name;
  //string public description;
	//string public symbol;
  address private depositorAddress;
  address private channelAddress;
  address private membershipsAddress;
  //address private broadcastsAddress;
  Channels channelContract;
  Memberships membershipsContract;
  //Broadcasts broadcastsContract;

  CountersUpgradeable.Counter private _tokenIdCounter;
  
  event NewPostTokenCreated(address sender, uint256 tokenId);
  event NewPostMinted(address sender, uint256 tokenId);

  // ============ Structs ============
  

  uint256 public channelToken;
  //mapping(address => Membership) public membershipOwnershipMap;
  mapping(uint256 => string) private _uris;
  mapping(uint256 => string) private _paywallUri;
  mapping(uint256 => bool) private _paywallUriAccess;
  mapping(uint256 => bool) private _mintable;
  mapping(uint256 => bool) private _buyable;
  mapping(uint256 => uint256) private _cost;
  mapping(uint256 => uint256[]) private _tokenLevelList;
  mapping(address => uint256[]) private _redemptions;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(string memory tokenName, uint256 tempChannelToken, address to, address tempOwnerAddress, address tempChannelAddress, address tempMembershipsAddress) initializer {
    __ERC1155_init(tokenName);
    __ERC1155Burnable_init();
    __ERC1155Supply_init();
    __Pausable_init();
    __AccessControl_init();
    
    name = tokenName;
    channelToken = tempChannelToken;
    
    require(to != address(0), "to required");
    depositorAddress = to;
    require(tempChannelAddress != address(0), "channelAddress required");
    channelAddress = tempChannelAddress;
    channelContract = Channels(channelAddress);
    require(tempMembershipsAddress != address(0), "membershipAddress required");
    membershipsAddress = tempMembershipsAddress;
    membershipsContract = Memberships(membershipsAddress);

    require(tempOwnerAddress != address(0), "owner required");
    _grantRole(DEFAULT_ADMIN_ROLE, tempOwnerAddress);
    _grantRole(ADMIN_ROLE, tempOwnerAddress);
    _grantRole(OWNER_ROLE, to);
    _grantRole(OWNER_ROLE, tempOwnerAddress);  
  }

  function initialize(string memory tokenName, address to) initializer external {
    //require(msg.sender == RECEPTION_ACCOUNT, "Wrong Account Deployer");
    __ERC1155_init(tokenName);
    __ERC1155Burnable_init();
    __ERC1155Supply_init();
    __Pausable_init();
    __AccessControl_init();
    
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
    _grantRole(OWNER_ROLE, to);    
    _grantRole(OWNER_ROLE, msg.sender);    
  }

  function transferOwnership(address to) external onlyRole(ADMIN_ROLE) {
    _grantRole(OWNER_ROLE, to);
  }

  struct CreatePost {
      address owner;
      uint256 cost;
      bool isBuyable;
      bool isPublic;
      bool airdrop;
      string computedUri;
      string paywallUri; 
      bool mintable;
      uint256[] levels;
  }
  function createPostToken(CreatePost calldata post) external onlyRole(OWNER_ROLE) returns(uint256) {
      // TODO : Add function to validate that the msg.sender owns channel
      
      require(channelOwnershipMatch(post.owner), "You must be the channel owner to create posts");
      // Required inputs
      if (!post.isPublic) {
        require(post.levels.length > 0, "You must include at least 1 level to create a non-public post");
      }
      
      uint256 tokenId = _tokenIdCounter.current();
      _tokenIdCounter.increment();
      setTokenUrisInternal(tokenId, post.computedUri, post.paywallUri);
      _paywallUriAccess[tokenId] = post.isPublic;
      _buyable[tokenId] = post.isBuyable;
      _mintable[tokenId] = post.mintable;
      _cost[tokenId] = post.cost;
      
      if (!post.isPublic && post.levels.length > 0) {
        setTokenLevelsInternal(tokenId, post.levels);
      }
      
      emit NewPostTokenCreated(post.owner, tokenId);
      
      /*if (post.airdrop && post.levels.length > 0) {
        string memory mintedOwners = '';
        for (uint256 i = 0; i < post.levels.length; i++) {
          address[] memory owners = membershipsContract.getOwnershipMap(post.levels[i]);
          for (uint256 j = 0; j < owners.length; j++) {
            Strings2.slice memory substring = mintedOwners.toSlice().copy().rfind(string(abi.encodePacked(owners[j])).toSlice());
            if (substring.empty()) {
              postMint(owners[j], tokenId);
              mintedOwners = mintedOwners.toSlice().concat(string(abi.encodePacked(owners[j])).toSlice()); 
            }
            
          }
        }
      }*/
      
      return tokenId;
  }

  function postMint(address to, uint256 tokenId) external payable{  
    bool hasPaid = false;
    if (msg.value > 0 && _buyable[tokenId] && msg.value >= _cost[tokenId]) {
      hasPaid = true;
    }

    // validate that the msg.sender owns membership
    //require(membershipsContract.balanceOf(to, membershipId) == 1 || hasPaid, "You must be a member of the channel to mint post NFTs");

    require(membershipMatch(tokenId, to) || hasPaid, "You do not have minting access");  

    require(_mintable[tokenId], "This post is not mintable");

    for(uint256 i = 0; i < _redemptions[to].length; i++) {
      require(_redemptions[to][i] != tokenId, 'Sorry, you have already redeemed this NFT');
    }
    _redemptions[to].push(tokenId); 
    emit NewPostMinted(to, tokenId);
    _mint(to, tokenId, 1, "");
  }

  function getBalance() view external returns(uint256){
    return address(this).balance;
  }

  function withdrawBalance() external onlyRole(OWNER_ROLE) {
    address payable ownerPayable = payable(depositorAddress);
    // send all Ether to owner
    // Owner can receive Ether since the address of owner is payable
    ownerPayable.transfer(address(this).balance);
  }

  function getChannelToken() external view returns(uint256) {
    return channelToken;
  }

  function getCurrentCount() external view returns(uint256) {
    return _tokenIdCounter.current();
  }

  function isMintable(uint256 tokenId) external view returns (bool) {
    return _mintable[tokenId];
  }

  function isBuyable(uint256 tokenId) external view returns (bool) {
    return _buyable[tokenId];
  }

  function getCost(uint256 tokenId) external view returns (uint256) {
    return _cost[tokenId];
  }
  
  function uri(uint256 tokenId) override public view returns (string memory) {
    if (membershipMatch(tokenId, msg.sender) || channelOwnershipMatch(msg.sender) || ownershipMatch(msg.sender, tokenId) || _paywallUriAccess[tokenId]) {
      return(string(abi.encodePacked("ipfs://", _paywallUri[tokenId], "/metadata.json")));
    } else {
      return(string(abi.encodePacked("ipfs://", _uris[tokenId], "/metadata.json")));
    }
  }

  function uri2(uint256 tokenId, address to) external view returns (string memory) {    
    if (membershipMatch(tokenId, to) || channelOwnershipMatch(to) || ownershipMatch(to, tokenId) || _paywallUriAccess[tokenId]) {
      return (string(abi.encodePacked("ipfs://", _paywallUri[tokenId], "/metadata.json")));
    } else {
      return(string(abi.encodePacked("ipfs://", _uris[tokenId], "/metadata.json")));
    }
  }

  function membershipMatch(uint256 tokenId, address to) public view returns (bool) {
    uint256[] memory membershipList = membershipsContract.getMembershipList(channelToken);
    bool isMembershipMatch = false;
    uint256 membershipId = 0;
    for(uint256 i = 0; i < membershipList.length; i++) {
      if (membershipsContract.balanceOf(to, membershipList[i]) == 1) {
        membershipId = membershipList[i];
        isMembershipMatch = true;
      }
    }
    if (isMembershipMatch) {
      isMembershipMatch = false;
      uint256[] memory tokenLevels = _tokenLevelList[tokenId];
      for (uint256 i = 0; i < tokenLevels.length; i++) {
        if (membershipId == tokenLevels[i]){
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
    if (balanceOf(to, tokenId) > 0) {
      return true;
    }

    return false;
  }

  function paywallUri(address to, uint256 tokenId, uint256 membershipId) external view returns (string memory) {
    //require(broadcastsContract.balanceOf(msg.sender, broadcastId) == 1, "You must be a member of the syndicate to retrieve paywallUris.");
    
    if (!_paywallUriAccess[tokenId]) {
      require(membershipsContract.balanceOf(to, membershipId) == 1, "You must be a member of the channel to retrieve paywallUris.");
    }
    
    return(_paywallUri[tokenId]);
  }

  function setTokenUrisInternal(uint256 tokenId, string memory newUri, string memory newPaywallUri) internal{
    _uris[tokenId] = newUri;
    _paywallUri[tokenId] = newPaywallUri;
  }

  function setTokenLevelsInternal(uint256 tokenId, uint256[] memory newLevels) internal{
    //require(_tokenLevelList[tokenId].length == 0, "Cannot modify existing level allocation");
    _tokenLevelList[tokenId] = newLevels;
  }

  function setTokenUri(uint256 tokenId, string memory newUri) external onlyRole(OWNER_ROLE){
    require(bytes(_uris[tokenId]).length == 0, "Cannot modify existing uri");
    _uris[tokenId] = newUri;
  }

  function getTokenIndex() external view returns (uint256) {
    return _tokenIdCounter.current();
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
  
}