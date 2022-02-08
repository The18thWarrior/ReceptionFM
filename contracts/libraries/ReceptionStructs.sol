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
}