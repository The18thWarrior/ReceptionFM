// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


library Structs {
  struct Channel {
    // Index of this token
    uint256 tokenIndex;
    // Channel Name
    string channelName;
    // Membership token Address
    address membershipToken;
    // Channel Author
    string author;
    // Channel copyright
    string copyright;
    // Channel language
    string language;
  }

  struct ChannelOwner {
    uint256[] channels;
    mapping(uint256 => uint256) channelMap;
  }

  enum Level{ BRONZE, SILVER, GOLD, PLATINUM, ALL }

  struct CreatePost {
      address owner;
      address contractAddress;
      uint256 cost;
      bool isBuyable;
      bool isPublic;
      bool airdrop;
      bool premine;
      uint256 premineAmount;
      string computedUri;
      uint256 channelId;
      string paywallUri; 
      bool mintable;
      uint256[] levels;
  }

  function divider(uint numerator, uint denominator, uint precision) public pure returns(uint) {
    return (numerator*(uint(10)**uint(precision+1))/denominator + 5)/uint(10);
  }

  function commissionYield(uint total, uint percentage) public pure returns(uint) {
    return divider(total * percentage, 100, 4);
  }
}