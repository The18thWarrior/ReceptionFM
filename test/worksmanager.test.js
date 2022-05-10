const hre = require("hardhat");
const { assert } = require("chai");
require('mocha');
let nftStore = require('nft.storage');

let svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2250" viewBox="0 0 2250 2250" height="2250" version="1.0"> <style> @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i"); </style> <defs> <clipPath id="b"> <path d="M 0.5 0 L 2249.5 0 L 2249.5 2249 L 0.5 2249 Z M 0.5 0" /> </clipPath> <clipPath id="e"> <path d="M 0.5 0 L 2249.351562 0 L 2249.351562 2249 L 0.5 2249 Z M 0.5 0" /> </clipPath> <clipPath id="d"> <path d="M0 0H2250V2249H0z" /> </clipPath> <clipPath id="g"> <path d="M 567.492188 566.992188 L 1682.140625 566.992188 L 1682.140625 1681.640625 L 567.492188 1681.640625 Z M 567.492188 566.992188" /> </clipPath> <clipPath id="h"> <path d="M 1124.816406 1681.640625 C 817.761719 1681.640625 567.492188 1431.371094 567.492188 1124.316406 C 567.492188 817.261719 817.761719 566.992188 1124.816406 566.992188 C 1431.871094 566.992188 1682.140625 817.261719 1682.140625 1124.316406 C 1682.140625 1431.371094 1431.871094 1681.640625 1124.816406 1681.640625 Z M 1124.816406 672.148438 C 875.597656 672.148438 672.648438 875.097656 672.648438 1124.316406 C 672.648438 1373.535156 875.597656 1576.488281 1124.816406 1576.488281 C 1374.035156 1576.488281 1576.984375 1373.535156 1576.984375 1124.316406 C 1576.984375 875.097656 1374.035156 672.148438 1124.816406 672.148438 Z M 1124.816406 672.148438" /> </clipPath> <clipPath id="j"> <path d="M 1004.199219 841 L 1245.632812 841 L 1245.632812 1409 L 1004.199219 1409 Z M 1004.199219 841" /> </clipPath> <linearGradient x1=".173" gradientTransform="matrix(0 -4035.78953 2269.9908 0 -20.638 3607.925)" xmlns:xlink="http://www.w3.org/1999/xlink" y1=".173" x2=".947" gradientUnits="userSpaceOnUse" y2=".947" xlink:type="simple" xlink:actuate="onLoad" id="f" xlink:show="other"> <stop stop-color="#E0D8F1" offset="0" /> <stop stop-color="#5527B4" offset="1" /> </linearGradient> <linearGradient x1="0" gradientTransform="matrix(10.51557 0 0 10.51557 567.492 566.992)" xmlns:xlink="http://www.w3.org/1999/xlink" y1="53.005" x2="106" gradientUnits="userSpaceOnUse" y2="53.005" xlink:type="simple" xlink:actuate="onLoad" id="i" xlink:show="other"> <stop stop-color="#FF6DAF" offset="0" /> <stop stop-color="#4C1BB0" offset="1" /> </linearGradient>';
let svgPartTwo = ' <filter x="0%" y="0%" width="100%" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:actuate="onLoad" height="100%" id="a" xlink:show="other"> <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" color-interpolation-filters="sRGB" /> </filter> <mask id="c"> <g filter="url(#a)"> <path fill-opacity=".6" d="M-225 -225H2475V2475H-225z" /> </g> </mask> </defs> <g clip-path="url(#b)"> <path fill="#FFF" d="M 0.5 0 L 2249.5 0 L 2249.5 2256.496094 L 0.5 2256.496094 Z M 0.5 0" /> <path fill="#FFF" d="M 0.5 0 L 2249.5 0 L 2249.5 2249 L 0.5 2249 Z M 0.5 0" /> <path fill="#4C1BB0" d="M 0.5 0 L 2249.5 0 L 2249.5 2249 L 0.5 2249 Z M 0.5 0" /> <g mask="url(#c)"> <g> <g clip-path="url(#d)"> <g clip-path="url(#e)"> <path fill="url(#f)" d="M 0.5 2249 L 2249.351562 2249 L 2249.351562 0 L 0.5 0 Z M 0.5 2249" /> </g> </g> </g> </g> </g> <g clip-path="url(#g)"> <g clip-path="url(#h)"> <path fill="url(#i)" d="M 567.492188 566.992188 L 567.492188 1681.640625 L 1682.140625 1681.640625 L 1682.140625 566.992188 Z M 567.492188 566.992188" /> </g> </g> <g clip-path="url(#j)"> <path fill="#FFF" d="M 1245.632812 1061.660156 L 1132.527344 1061.660156 L 1241.28125 841.566406 L 1117.304688 841.566406 L 1004.199219 1127.035156 L 1108.601562 1127.035156 L 1030.300781 1408.148438 Z M 1245.632812 1061.660156" /> </g> <text font-family="Open Sans" x="50%" y="90%" class="base" dominant-baseline="middle" text-anchor="middle" font-size="10em" stroke="white" fill="white"> <tspan>';
let svgPartThree = "{0}</tspan></text></svg>";
let svgString = svgPartOne + svgPartTwo + svgPartThree;
const nftStorageApiKey = process.env.NFT_STORAGE_API_KEY;
const nftStorageClient = new nftStore.NFTStorage({ token: nftStorageApiKey });
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}
describe("All contracts deployment", function () {
  it("Deployment should create all contracts and add sub contract addresses to worksmanager", async function () {
    const worksManagerFactory = await hre.ethers.getContractFactory('WorksManager');
    const worksManager = await worksManagerFactory.deploy();
    await worksManager.deployed();
    assert(worksManager.address != null, 'works manager should be deployed');

    const channelContractFactory = await hre.ethers.getContractFactory('Channels');
    const channelContract = await channelContractFactory.deploy(worksManager.address);
    await channelContract.deployed();
    assert(channelContract.address != null, 'channelContract should be deployed');

    await worksManager.setChannelsAddress(channelContract.address);
    const _channelAddress = await worksManager.getChannelsAddress();
    assert(channelContract.address === _channelAddress, 'channel address should match works manager');
    
    const channelCostUpdate = await worksManager.setChannelCost(hre.ethers.utils.parseEther('1'));
    const newChannelCost = await channelContract.getCost();
    assert(newChannelCost > 0, 'channel cost should be greater than 0: '+newChannelCost);

    const membershipsContractFactory = await hre.ethers.getContractFactory('Memberships');
    const membershipsContract = await membershipsContractFactory.deploy("RFMChannels", worksManager.address, channelContract.address);
    await membershipsContract.deployed();
    assert(membershipsContract.address != null, 'membershipsContract should be deployed');
    
    await worksManager.setMembershipsAddress(membershipsContract.address);
    const _membershipsContract = await worksManager.getMembershipsAddress();
    assert(membershipsContract.address === _membershipsContract, 'membership address should match works manager');

    const postFactoryContractFactory = await hre.ethers.getContractFactory('PostFactory');
    const postFactoryContract = await postFactoryContractFactory.deploy(worksManager.address, channelContract.address, membershipsContract.address);
    await postFactoryContract.deployed();
    assert(postFactoryContract.address != null, 'postFactoryContract should be deployed');
    
    await worksManager.setPostFactoryAddress(postFactoryContract.address);
    
  });
});


describe('Minting checks', function() {
  let _worksManager;
  let _channelContract;
  let _channelList;
  // eslint-disable-next-line no-undef
  before(async function () {
    const worksManagerFactory = await hre.ethers.getContractFactory('WorksManager');
    const worksManager = await worksManagerFactory.deploy();
    await worksManager.deployed();

    const channelContractFactory = await hre.ethers.getContractFactory('Channels');
    const channelContract = await channelContractFactory.deploy(worksManager.address);
    await channelContract.deployed();
    
    await worksManager.setChannelsAddress(channelContract.address);
    const _channelAddress = await worksManager.getChannelsAddress();

    const channelCostUpdate = await worksManager.setChannelCost(hre.ethers.utils.parseEther('1'));
    
    const membershipsContractFactory = await hre.ethers.getContractFactory('Memberships');
    const membershipsContract = await membershipsContractFactory.deploy("RFMChannels", worksManager.address, channelContract.address);
    await membershipsContract.deployed();
    
    await worksManager.setMembershipsAddress(membershipsContract.address);
    const _membershipsContract = await worksManager.getMembershipsAddress();
    
    const postFactoryContractFactory = await hre.ethers.getContractFactory('PostFactory');
    const postFactoryContract = await postFactoryContractFactory.deploy(worksManager.address, channelContract.address, membershipsContract.address);
    await postFactoryContract.deployed();
    
    await worksManager.setPostFactoryAddress(postFactoryContract.address);
    _worksManager = worksManager;
    _channelContract = channelContract;
  });
  it('Channel / Membership / Post mint', async function() {
    let channelName = 'testChannel';
    // 1.2
    // Call the function.
    //channelName, channelUri, msg.sender, author, copyright, language
    const generalOptions = {value: hre.ethers.utils.parseEther("1")};
    let txn = await _worksManager.mintChannel('test', channelName + ' r&b', generalOptions);
    // Wait for it to be mined.
    await txn.wait();

    // 1.3
    let txn2 = await _worksManager.getOwnerChannelIds();
    assert(txn2 != null, 'channel should be deployed');
    const channel = txn2[0];
    // 1.4a
    // 1.5a
    // Call the function.
    let txn3 = await _worksManager.membershipTokenCreate(channel.toHexString(), 1, 'test');
    // Wait for it to be mined.
    await txn3.wait();
    assert(txn3 != null, 'membership token should be deployed');

    let txn4 = await _worksManager.createPostContract(channelName, channel.toHexString());
    // Wait for it to be mined.
    await txn4.wait();
    assert(txn4 != null, 'post contract should be deployed');

    // 1.6
    let postContract = await _worksManager.getChannelPostContract(channel.toHexString());
    
    assert(postContract != null, 'postContract should be deployed');

    //let channelOwner = await channelContract._ownerOf(channel);
    const accounts = await hre.ethers.getSigners();
    const toAddress = await hre.ethers.utils.getAddress("0x836C31094bEa1aE6b65F76D1C906b01329645a94");
    await _channelContract.transferFrom(accounts[0].address,toAddress,channel)

    // 1.8
    let today = new Date();
    let postData = {
      contractAddress: postContract,
      cost:  1,
      isBuyable: true,
      isPublic: true,
      airdrop: false,
      channelId: channel.toHexString(),
      computedUri: 'test',
      paywallUri: 'test2',
      mintable: true,
      levels: ['0x00'],
      properties : {
        createdDate: today.toUTCString(),
        key: '353634-213213-j34b5324h-3445b325'
      }
    }
    let postTokenId = await _worksManager.createPostToken(postData);
    await postTokenId.wait();
    
    assert(postTokenId != null, 'postToken nft should be deployed');

    // 2.10
    const options = {value: hre.ethers.utils.parseEther("1")};
    let postMint = await _worksManager.postMint(postContract, postTokenId.value, options);
    await postMint.wait();
    assert(postMint.confirmations > 0, 'post nft should be minted');

    // 2.8
    let postMetadata = await _worksManager.getPostUri(postContract, postTokenId.value);
    assert(postMetadata != null, 'post nft metadata url should return');

    let postMessage = await _worksManager.createPostMessage(postContract, channel, 'testmessage');
    await postMessage.wait();
    assert(postMint.confirmations > 0, 'post message event should be created');
  });
});

describe('GET Request Checks', function() {
  let _worksManager;
  let _channelContract;
  let _channelList;
  // eslint-disable-next-line no-undef
  before(async function () {
    const worksManagerFactory = await hre.ethers.getContractFactory('WorksManager');
    const worksManager = await worksManagerFactory.deploy();
    await worksManager.deployed();

    const channelContractFactory = await hre.ethers.getContractFactory('Channels');
    const channelContract = await channelContractFactory.deploy(worksManager.address);
    await channelContract.deployed();
    
    await worksManager.setChannelsAddress(channelContract.address);
    const _channelAddress = await worksManager.getChannelsAddress();
    const channelCostUpdate = await worksManager.setChannelCost(hre.ethers.utils.parseEther('1'));
    
    const membershipsContractFactory = await hre.ethers.getContractFactory('Memberships');
    const membershipsContract = await membershipsContractFactory.deploy("RFMChannels", worksManager.address, channelContract.address);
    await membershipsContract.deployed();
    
    await worksManager.setMembershipsAddress(membershipsContract.address);
    const _membershipsContract = await worksManager.getMembershipsAddress();
    
    const postFactoryContractFactory = await hre.ethers.getContractFactory('PostFactory');
    const postFactoryContract = await postFactoryContractFactory.deploy(worksManager.address, channelContract.address, membershipsContract.address);
    await postFactoryContract.deployed();
    
    await worksManager.setPostFactoryAddress(postFactoryContract.address);
    _worksManager = worksManager;
    _channelContract = channelContract;

    let channelName = 'testChannel';
    // 1.2
    // Call the function.
    //channelName, channelUri, msg.sender, author, copyright, language
    
    const generalOptions = {value: hre.ethers.utils.parseEther("1")};
    let txn = await _worksManager.mintChannel('test', channelName + ' r&b', generalOptions);
    // Wait for it to be mined.
    await txn.wait();

    // 1.3
    let txn2 = await _worksManager.getOwnerChannelIds();
    const channel = txn2[0];

    // 1.5a
    // Call the function.
    let txn3 = await _worksManager.membershipTokenCreate(channel.toHexString(), 1, 'test');
    // Wait for it to be mined.
    await txn3.wait();

    let txn4 = await _worksManager.createPostContract(channelName, channel.toHexString());
    // Wait for it to be mined.
    await txn4.wait();

    // 1.6
    let postContract = await _worksManager.getChannelPostContract(channel.toHexString());

    //let channelOwner = await channelContract._ownerOf(channel);
    const accounts = await hre.ethers.getSigners();
    const toAddress = await hre.ethers.utils.getAddress("0x836C31094bEa1aE6b65F76D1C906b01329645a94");
    await _channelContract.transferFrom(accounts[0].address,toAddress,channel)

    // 1.8
    let today = new Date();
    let postData = {
      contractAddress: postContract,
      cost:  1,
      isBuyable: true,
      isPublic: true,
      airdrop: false,
      channelId: channel.toHexString(),
      computedUri: 'test',
      paywallUri: 'test2',
      mintable: true,
      levels: ['0x00'],
      properties : {
        createdDate: today.toUTCString(),
        key: '353634-213213-j34b5324h-3445b325'
      }
    }
    let postTokenId = await _worksManager.createPostToken(postData);
    await postTokenId.wait();

    // 2.10
    const options = {value: hre.ethers.utils.parseEther("1")};
    let postMint = await _worksManager.postMint(postContract, postTokenId.value, options);
    await postMint.wait();

    // 2.8
    await _worksManager.getPostUri(postContract, postTokenId.value);
  });
  it('Channel Contract', async function() {
    
    let ownerChannelIds = await _worksManager.getOwnerChannelIds();
    assert(ownerChannelIds.length > 0, 'channel list should be returned');
    
    const accounts = await hre.ethers.getSigners(); 
    
    let artistChannelIds = await _worksManager.getArtistChannelIds(accounts[0].address);
    assert(artistChannelIds.length > 0, 'artist list should be returned: '+ artistChannelIds);
    
    let channelIndex = await _worksManager.getCurrentChannelIndex();
    assert(hre.ethers.BigNumber.from("0").eq(channelIndex), 'channel index should be 0: ' + channelIndex);

    let channelMetadata = await _worksManager.getChannelMetadata(channelIndex);
    assert(channelMetadata.length > 0, 'channel metadata should return');

    let profileUri = await _worksManager.setProfileUri('test', 'test2');
    await profileUri.wait();
    let profileUrl = await _worksManager.getProfileUri(accounts[0].address);
    assert(profileUrl.length > 0, 'profile url should return');
  });
  it('Memberships Contract', async function() {
    
    let membershipsList = await _worksManager.getMembershipList(hre.ethers.BigNumber.from('0'));
    assert(membershipsList.length > 0, 'membership list should be returned');

    const membershipMintOptions = {value: hre.ethers.utils.parseEther("1")};
    let membershipMint = await _worksManager.membershipMint(membershipsList[0], membershipMintOptions);
    await membershipMint.wait();

    let membership = await _worksManager.getMembership(membershipsList[0]);
    assert(hre.ethers.BigNumber.from("1").eq(membership), 'user should have membership: '+ membership);

    let membershipUri = await _worksManager.membershipUri(membershipsList[0]);
    assert(membershipUri.length > 0, 'membership URI should be returned: '+ membershipUri);

    let ownershipMap = await _worksManager.membershipGetOwnershipMap(membershipsList[0]);
    assert(ownershipMap.length > 0, 'ownership list should be returned');
    
  });
  
  it('Post Contract', async function() {
    let ownerChannelIds = await _worksManager.getOwnerChannelIds();
    let postContract = await _worksManager.getChannelPostContract(ownerChannelIds[0]);
    assert(postContract !== '', 'post contract address should be returned');

    let nextTokenIndex = await _worksManager.getPostTokenIndex(postContract);
    assert(hre.ethers.BigNumber.from("1").eq(nextTokenIndex), 'post token index should be 1:'+nextTokenIndex);
    
    let tokenIndex = hre.ethers.BigNumber.from("0");
    let postUri = await _worksManager.getPostUri(postContract, tokenIndex);
    assert(postUri !== '', 'post uri should be returned');

    let tokenBalance = await _worksManager.getPostTokenBalance(postContract, tokenIndex);
    assert(hre.ethers.BigNumber.from("1").eq(tokenBalance), 'user should have post balance: '+tokenBalance);
    
    let postMintable = await _worksManager.postIsMintable(postContract, tokenIndex);
    assert(postMintable === true, 'post should be mintable:'+ postMintable);

    let postBuyable = await _worksManager.postIsBuyable(postContract, tokenIndex);
    assert(postBuyable === true, 'post should be buyable');

    let postCost = await _worksManager.postGetCost(postContract, tokenIndex);
    assert(hre.ethers.BigNumber.from("1").eq(postCost), 'post cost should be 1:'+postCost);
  });
})
