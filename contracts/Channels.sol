// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

import { Structs } from "./libraries/ReceptionStructs.sol";

/// @custom:security-contact ReceptionFM
contract Channels is Initializable, ERC721Upgradeable, ERC721URIStorageUpgradeable, PausableUpgradeable, OwnableUpgradeable, ERC721BurnableUpgradeable {
  using CountersUpgradeable for CountersUpgradeable.Counter;

  CountersUpgradeable.Counter private _tokenIdCounter;
  mapping(uint256 => string) private _uris;
  mapping(address => string) private _profileUris;
  uint256 public cost;

  mapping(address => Structs.ChannelOwner) channelOwnerList;
  address private masterContract;
  address private apiAddress;
  event NewReceptionChannelMinted(address sender, uint256 tokenId);
  event ReceptionProfileSet(address sender);
  event CostChange(uint256 cost);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(address tempMasterContract, address _apiAddress) initializer {
    initialize(tempMasterContract, _apiAddress);
  }
  // Backend Initialization
  function initialize(address tempMasterContract, address _apiAddress) initializer public {
    __ERC721_init("TestChannel", "testCHANNEL");
    __ERC721URIStorage_init();
    __Pausable_init();
    __Ownable_init();
    __ERC721Burnable_init();
    require(tempMasterContract != address(0), "master contract required");
    transferOwnership(tempMasterContract);
    masterContract = tempMasterContract;
    apiAddress = _apiAddress;
  }

  function setCost(uint256 tempCost) external onlyOwner {
    cost = tempCost;
    emit CostChange(cost);
  }

  function getCost() view external returns(uint256) {
    return cost;
  }

  // 1.2
  function safeMint(
    string calldata channelUri, 
    address to
    ) external onlyOwner payable returns(uint256) {
    //require(msg.value > cost, "Not enough MATIC to complete transaction");
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    
    //require(newItemId >= NFT_LIMIT, "Maximum number of NFTs minted");
    // Get all the JSON metadata in place and base64 encode it.

    Structs.ChannelOwner storage owner2 = channelOwnerList[to];
    
    // owner channelId to index map
    owner2.channelMap[tokenId] = owner2.channels.length;
    // owner channel array
    //owner.channels.push(tokenId);

    emit NewReceptionChannelMinted(to, tokenId);
    setTokenUriInternal(tokenId, channelUri);
    _safeMint(to, tokenId);
    return tokenId;
  }
  // 1.3
  function getOwnerChannelIds(address ownerId) external view returns(uint256[] memory){
    Structs.ChannelOwner storage owner2 = channelOwnerList[ownerId];
    return owner2.channels;
  }
  
  // User Action
  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
      internal
      whenNotPaused
      override
  {
    Structs.ChannelOwner storage originalOwner = channelOwnerList[from];
    Structs.ChannelOwner storage newOwner = channelOwnerList[to];
    if (originalOwner.channels.length > 0) {
      uint256 channelIndex = originalOwner.channelMap[tokenId];
      delete originalOwner.channels[channelIndex];
      delete originalOwner.channelMap[tokenId];
    }
    
    newOwner.channelMap[tokenId] = newOwner.channels.length;
    // owner channel array
    newOwner.channels.push(tokenId);

    super._beforeTokenTransfer(from, to, tokenId);
  }
  // Admin Action
  function withdrawBalance() external onlyOwner {
    if (owner() != address(0)) {
      address payable ownerPayable = payable(owner());
      // send all Ether to owner
      // Owner can receive Ether since the address of owner is payable
      ownerPayable.transfer(address(this).balance);
    }    
  }

  function getCurrentIndex() external view returns(uint256) {
    return _tokenIdCounter.current()-1;
  }

  function uri(uint256 tokenId) external view returns (string memory) { 
    return(string(abi.encodePacked("ipfs://", _uris[tokenId], "/metadata.json")));
  }

  function setTokenUriInternal(uint256 tokenId, string memory newUri) internal{
    require(bytes(_uris[tokenId]).length == 0, "Cannot modify existing uri");
    _uris[tokenId] = newUri;
  }

  function setProfileUri(address to, string memory newUri) external onlyOwner {
    _profileUris[to] = newUri;
  }

  function getProfileUri(address to) external view returns (string memory) { 
    return(string(abi.encodePacked("ipfs://", _profileUris[to], "/metadata.json")));
  }

  // DEFAULT METHODS REQUIRED BY INTERFACES

  function pause() external onlyOwner {
      _pause();
  }

  function unpause() external onlyOwner {
      _unpause();
  }

  function _burn(uint256 tokenId)
      internal
      override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
  {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
      public
      view
      override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
      returns (string memory)
  {
    return(string(abi.encodePacked("ipfs://", _uris[tokenId], "/metadata.json")));
    //return super.tokenURI(tokenId);
  }
}