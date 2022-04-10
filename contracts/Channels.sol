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
import "hardhat/console.sol";

import { Structs } from "./libraries/ReceptionStructs.sol";

/// @custom:security-contact ReceptionFM
contract Channels is Initializable, ERC721Upgradeable, ERC721URIStorageUpgradeable, PausableUpgradeable, OwnableUpgradeable, ERC721BurnableUpgradeable {
  using CountersUpgradeable for CountersUpgradeable.Counter;

  CountersUpgradeable.Counter private _tokenIdCounter;
  mapping(uint256 => string) private _uris;
  mapping(address => string) private _profileUris;
  uint256 public cost = 0.0000025 ether;

  mapping(address => Structs.ChannelOwner) channelOwnerList;
  address private masterContract;
  event NewReceptionChannelMinted(address sender, uint256 tokenId);
  event ReceptionProfileSet(address sender);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(address _masterContract) initializer {
    initialize(_masterContract);
  }
  // Backend Initialization
  function initialize(address _masterContract) initializer public {
    __ERC721_init("TestChannel", "testCHANNEL");
    __ERC721URIStorage_init();
    __Pausable_init();
    __Ownable_init();
    __ERC721Burnable_init();

    transferOwnership(_masterContract);
    console.log('owner: ', owner(), _masterContract);
    masterContract = _masterContract;
  }
  // 1.2
  function safeMint(
    string calldata channelUri, 
    address to
    ) public onlyOwner payable returns(uint256) {
    //require(msg.value > cost, "Not enough MATIC to complete transaction");
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    
    //require(newItemId >= NFT_LIMIT, "Maximum number of NFTs minted");
    // Get all the JSON metadata in place and base64 encode it.

    Structs.ChannelOwner storage owner = channelOwnerList[to];
    
    // owner channelId to index map
    owner.channelMap[tokenId] = owner.channels.length;
    // owner channel array
    //owner.channels.push(tokenId);

    _safeMint(to, tokenId);
    emit NewReceptionChannelMinted(to, tokenId);
    setTokenUriInternal(tokenId, channelUri);
    _setTokenURI(tokenId, channelUri);
    return tokenId;
  }
  // 1.3
  function getOwnerChannelIds(address ownerId) public view returns(uint256[] memory){
    Structs.ChannelOwner storage owner = channelOwnerList[ownerId];
    return owner.channels;
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
  function withdrawBalance() public onlyOwner {
    address ownerPayable = payable(msg.sender);
    uint amount = address(this).balance;

    // send all Ether to owner
    // Owner can receive Ether since the address of owner is payable
    (bool success, ) = ownerPayable.call{value: amount}("");
    require(success, "Failed to send MATIC");
  }

  function getCurrentIndex() public view returns(uint256) {
    return _tokenIdCounter.current()-1;
  }

  function uri(uint256 tokenId) public view returns (string memory) { 
    return(string(abi.encodePacked("ipfs://", _uris[tokenId], "/metadata.json")));
  }

  function setTokenUriInternal(uint256 tokenId, string memory newUri) internal{
    require(bytes(_uris[tokenId]).length == 0, "Cannot modify existing uri");
    _uris[tokenId] = newUri;
  }

  function setProfileUri(address to, string memory newUri) public onlyOwner {
    _profileUris[to] = newUri;
  }

  function getProfileUri(address to) public view returns (string memory) { 
    return(string(abi.encodePacked("ipfs://", _profileUris[to], "/metadata.json")));
  }

  // DEFAULT METHODS REQUIRED BY INTERFACES
  function _baseURI() internal pure override returns (string memory) {
      return "asdfsd";
  }

  function pause() public onlyOwner {
      _pause();
  }

  function unpause() public onlyOwner {
      _unpause();
  }

  function _burn(uint256 tokenId)
      internal
      override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
  {
    super._burn(tokenId);
  }

  function _ownerOf(uint256 tokenId) public view{
    super.ownerOf(tokenId);
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