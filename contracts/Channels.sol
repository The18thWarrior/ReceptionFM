// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";

/// @custom:security-contact ReceptionFM
contract Channels is Initializable, ERC721Upgradeable, ERC721URIStorageUpgradeable, PausableUpgradeable, OwnableUpgradeable, ERC721BurnableUpgradeable {
  using CountersUpgradeable for CountersUpgradeable.Counter;

  CountersUpgradeable.Counter private _tokenIdCounter;
  mapping(uint256 => string) private _uris;
  uint256 public cost = 0.0000025 ether;

  struct Channel {
    // Index of this token
    uint256 tokenIndex;
    // Channel Name
    string channelName;
    // Membership token Address
    address membershipToken;
  }

  struct ChannelOwner {
    uint256[] channels;
    mapping(uint256 => uint256) channelMap;
  }

  mapping(address => ChannelOwner) channelOwnerList;
  mapping(uint256 => Channel) channelList;
  event NewReceptionChannelMinted(address sender, uint256 tokenId);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}
  // Backend Initialization
  function initialize() initializer public {
      __ERC721_init("TestChannel", "testCHANNEL");
      __ERC721URIStorage_init();
      __Pausable_init();
      __Ownable_init();
      __ERC721Burnable_init();
  }
  // User Action
  function safeMint(string calldata channelName, string calldata channelUri) public payable {
    //require(msg.value > cost, "Not enough MATIC to complete transaction");
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    
    //require(newItemId >= NFT_LIMIT, "Maximum number of NFTs minted");
    // Get all the JSON metadata in place and base64 encode it.

    ChannelOwner storage owner = channelOwnerList[msg.sender];
    Channel memory channel = Channel({
      tokenIndex : tokenId,
      channelName : channelName,
      membershipToken : address(0)
    });
    // global channel map
    channelList[tokenId] = channel;
    // owner channelId to index map
    owner.channelMap[tokenId] = owner.channels.length;
    // owner channel array
    owner.channels.push(tokenId);

    _safeMint(msg.sender, tokenId);
    emit NewReceptionChannelMinted(msg.sender, tokenId);
    _setTokenURI(tokenId, channelUri);
  }
  // App Load Step #1
  function getOwnerChannelIds() public view returns(uint256[] memory){
    ChannelOwner storage owner = channelOwnerList[msg.sender];
    return owner.channels;
  }
  // App Load Step #2
  function getOwnerChannelList(uint256[] calldata channelIds) public view returns(Channel[] memory) {
    Channel[] memory channelL;
    for (uint256 i = 0; i < channelIds.length; i++) {
      channelL[i]= channelList[channelIds[i]];
    }

    return channelL;
  } 
  // Backend Execution post Channel deploy
  function updateChannelAddress(uint256 tokenId, address contractAddress) public onlyOwner returns (bool){
    require(channelList[tokenId].membershipToken != address(0), "Channel has already been assigned.");
    channelList[tokenId].membershipToken = contractAddress;
    return true;
  }
  // User Action
  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
      internal
      whenNotPaused
      override
  {
    ChannelOwner storage originalOwner = channelOwnerList[from];
    ChannelOwner storage newOwner = channelOwnerList[to];
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

  function getChannelMetadata() public view returns(string memory) {

  }

  function getCurrentIndex() public view returns(uint256) {
    return _tokenIdCounter.current()-1;
  }

  function uri(uint256 tokenId) public view returns (string memory) {
    return(_uris[tokenId]);
  }

  function setTokenUriInternal(uint256 tokenId, string memory newUri) internal{
    require(bytes(_uris[tokenId]).length == 0, "Cannot modify existing uri");
    _uris[tokenId] = newUri;
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

  function tokenURI(uint256 tokenId)
      public
      view
      override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
      returns (string memory)
  {
      return super.tokenURI(tokenId);
  }
}