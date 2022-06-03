/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let nftStore = require('nft.storage');
require('ipfs-car/pack');
require("hardhat");
require("dotenv").config();

let svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2250" viewBox="0 0 2250 2250" height="2250" version="1.0"> <style> @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i"); </style> <defs> <clipPath id="b"> <path d="M 0.5 0 L 2249.5 0 L 2249.5 2249 L 0.5 2249 Z M 0.5 0" /> </clipPath> <clipPath id="e"> <path d="M 0.5 0 L 2249.351562 0 L 2249.351562 2249 L 0.5 2249 Z M 0.5 0" /> </clipPath> <clipPath id="d"> <path d="M0 0H2250V2249H0z" /> </clipPath> <clipPath id="g"> <path d="M 567.492188 566.992188 L 1682.140625 566.992188 L 1682.140625 1681.640625 L 567.492188 1681.640625 Z M 567.492188 566.992188" /> </clipPath> <clipPath id="h"> <path d="M 1124.816406 1681.640625 C 817.761719 1681.640625 567.492188 1431.371094 567.492188 1124.316406 C 567.492188 817.261719 817.761719 566.992188 1124.816406 566.992188 C 1431.871094 566.992188 1682.140625 817.261719 1682.140625 1124.316406 C 1682.140625 1431.371094 1431.871094 1681.640625 1124.816406 1681.640625 Z M 1124.816406 672.148438 C 875.597656 672.148438 672.648438 875.097656 672.648438 1124.316406 C 672.648438 1373.535156 875.597656 1576.488281 1124.816406 1576.488281 C 1374.035156 1576.488281 1576.984375 1373.535156 1576.984375 1124.316406 C 1576.984375 875.097656 1374.035156 672.148438 1124.816406 672.148438 Z M 1124.816406 672.148438" /> </clipPath> <clipPath id="j"> <path d="M 1004.199219 841 L 1245.632812 841 L 1245.632812 1409 L 1004.199219 1409 Z M 1004.199219 841" /> </clipPath> <linearGradient x1=".173" gradientTransform="matrix(0 -4035.78953 2269.9908 0 -20.638 3607.925)" xmlns:xlink="http://www.w3.org/1999/xlink" y1=".173" x2=".947" gradientUnits="userSpaceOnUse" y2=".947" xlink:type="simple" xlink:actuate="onLoad" id="f" xlink:show="other"> <stop stop-color="#E0D8F1" offset="0" /> <stop stop-color="#5527B4" offset="1" /> </linearGradient> <linearGradient x1="0" gradientTransform="matrix(10.51557 0 0 10.51557 567.492 566.992)" xmlns:xlink="http://www.w3.org/1999/xlink" y1="53.005" x2="106" gradientUnits="userSpaceOnUse" y2="53.005" xlink:type="simple" xlink:actuate="onLoad" id="i" xlink:show="other"> <stop stop-color="#FF6DAF" offset="0" /> <stop stop-color="#4C1BB0" offset="1" /> </linearGradient>';
let svgPartTwo = ' <filter x="0%" y="0%" width="100%" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:actuate="onLoad" height="100%" id="a" xlink:show="other"> <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" color-interpolation-filters="sRGB" /> </filter> <mask id="c"> <g filter="url(#a)"> <path fill-opacity=".6" d="M-225 -225H2475V2475H-225z" /> </g> </mask> </defs> <g clip-path="url(#b)"> <path fill="#FFF" d="M 0.5 0 L 2249.5 0 L 2249.5 2256.496094 L 0.5 2256.496094 Z M 0.5 0" /> <path fill="#FFF" d="M 0.5 0 L 2249.5 0 L 2249.5 2249 L 0.5 2249 Z M 0.5 0" /> <path fill="#4C1BB0" d="M 0.5 0 L 2249.5 0 L 2249.5 2249 L 0.5 2249 Z M 0.5 0" /> <g mask="url(#c)"> <g> <g clip-path="url(#d)"> <g clip-path="url(#e)"> <path fill="url(#f)" d="M 0.5 2249 L 2249.351562 2249 L 2249.351562 0 L 0.5 0 Z M 0.5 2249" /> </g> </g> </g> </g> </g> <g clip-path="url(#g)"> <g clip-path="url(#h)"> <path fill="url(#i)" d="M 567.492188 566.992188 L 567.492188 1681.640625 L 1682.140625 1681.640625 L 1682.140625 566.992188 Z M 567.492188 566.992188" /> </g> </g> <g clip-path="url(#j)"> <path fill="#FFF" d="M 1245.632812 1061.660156 L 1132.527344 1061.660156 L 1241.28125 841.566406 L 1117.304688 841.566406 L 1004.199219 1127.035156 L 1108.601562 1127.035156 L 1030.300781 1408.148438 Z M 1245.632812 1061.660156" /> </g> <text font-family="Open Sans" x="50%" y="90%" class="base" dominant-baseline="middle" text-anchor="middle" font-size="10em" stroke="white" fill="white"> <tspan>';
let svgPartThree = "{0}</tspan></text></svg>";
let svgString = svgPartOne + svgPartTwo + svgPartThree;
// Run local node - npx hardhat node
// local execution up 1 - npx hardhat run ../scripts/1-init.js --network localhost
// local execution - npx hardhat run scripts/1-init.js --network localhost
// network deploy - npx hardhat run scripts/1-init.js --network mumbai
//console.log(nftStore);
// NFT Storage
const nftStorageApiKey = process.env.NFT_STORAGE_API_KEY;
const nftStorageClient = new nftStore.NFTStorage({ token: nftStorageApiKey })

const mainTest = async (worksManager, channelName, channelContract) => {
  let channelList = await mainChannels(worksManager, channelName);
  let channel = channelList[0];
  console.log(channel);
  let memberships = await mainMemberships(worksManager,channel, channelName);

  let txn = await worksManager.createPostContract(channelName, channel.toHexString());
  // Wait for it to be mined.
  await txn.wait();
  console.log('create post contract complete', txn.value);

  // 1.6
  let postContract = await worksManager.getChannelPostContract(channel.toHexString());
  console.log(postContract);

  //let channelOwner = await channelContract._ownerOf(channel);
  const accounts = await hre.ethers.getSigners();
  const toAddress = await hre.ethers.utils.getAddress("0x836C31094bEa1aE6b65F76D1C906b01329645a94");
  let txn2 = await channelContract.transferFrom(accounts[0].address,toAddress,channel)

  // Construct/Store Metadata
  const metadata1Image = String.format(svgString, channelName + ' Post');
  const metadata1Blob = new nftStore.Blob([metadata1Image], {type: 'image/svg+xml'});
  const metadata1 = await nftStorageClient.store({
    name: channelName,
    description: 'Post',
    image: metadata1Blob,
    channel: channel.toHexString()
  });

  // 1.8
  let today = new Date();
  let postData = {
    contractAddress: postContract,
    cost:  1,
    isBuyable: false,
    isPublic: true,
    airdrop: false,
    channelId: channel.toHexString(),
    computedUri: metadata1.ipnft,
    paywallUri: metadata1.ipnft,
    mintable: false,
    levels: ['0x00'],
    properties : {
      createdDate: today.toUTCString(),
      key: '353634-213213-j34b5324h-3445b325'
    }
  }
  let postTokenId = await worksManager.createPostToken(postData);
  await postTokenId.wait();
}

const mainPosts = async (worksManager, channel, channelName) => {
  // 1.7
  let txn = await worksManager.createPostContract(channelName, channel.toHexString());
  // Wait for it to be mined.
  await txn.wait();
  console.log('create post contract complete', txn.value);

  // 1.6
  let postContract = await worksManager.getChannelPostContract(channel.toHexString());
  console.log(postContract);

  // Construct/Store Metadata
  const metadata1Image = String.format(svgString, channelName + ' Post');
  const metadata1Blob = new nftStore.Blob([metadata1Image], {type: 'image/svg+xml'});
  const metadata1 = await nftStorageClient.store({
    name: channelName,
    description: 'Post',
    image: metadata1Blob,
    channel: channel.toHexString()
  });

  // 1.8
  let postTokenId = await worksManager.createPostToken(postContract, metadata1.url);
  await postTokenId.wait();
  
  console.log('create post complete', postTokenId.value);


  // 2.10
  let txn2 = await worksManager.postMint(postContract, postTokenId.value);
  await txn2.wait();
  console.log('mint post complete');

  // 2.8
  let postMetadata = await worksManager.getPostUri(postContract, postTokenId.value);
  console.log(postMetadata.value);
};

const mainMemberships = async (worksManager, channel, name_base) => {
  // 1.4a
  // Construct/Store Metadata
  const metadata1Image = String.format(svgString, 'VIP');
  const metadata1Blob = new nftStore.Blob([metadata1Image], {type: 'image/svg+xml'});
  const metadata1 = await nftStorageClient.store({
    name: 'VIP',
    description: 'Membership token',
    image: metadata1Blob,
    channel: channel.toHexString(),
    cost: 1,
    level: 'bronze'
  });

  // 1.5a
  // Call the function.
  let txn = await worksManager.membershipTokenCreate(channel.toHexString(), 1, metadata1.ipnft);
  // Wait for it to be mined.
  await txn.wait();
  console.log('create membership 1 complete', txn.value);

  // 2.5
  //await worksManager.membershipMint(channel.toHexString());
  //console.log('membershipMint complete');
  
};

const mainChannels = async (worksManager, channelName) => {
  //1.1
  // Construct/Store Metadata
  const metadata1Image = String.format(svgString, channelName);
  const metadata1Blob = new nftStore.Blob([metadata1Image], {type: 'image/svg+xml'});
  const metadata1 = await nftStorageClient.store({
    name: channelName,
    description: 'Reception.fm channel NFT for channel: ' + channelName,
    image: metadata1Blob
  });
  console.log(metadata1);
  // 1.2
  // Call the function.
  //channelName, channelUri, msg.sender, author, copyright, language
  let txn = await worksManager.mintChannel(metadata1.ipnft, channelName + ' r&b');
  // Wait for it to be mined.
  await txn.wait();
  console.log('mint channel complete');

  // 1.3
  let txn2 = await worksManager.getOwnerChannelIds();
  return txn2;
  
};

const deployContracts = async () => {
  const accounts = await hre.ethers.getSigners();
  const executor = await accounts[0].getAddress();
  const name = "ReceptionDAO"
  const symbol = "RFM"
  const supply = 10000 // 1000 Tokens

  // Deploy token
  const tokenFactory = await hre.ethers.getContractFactory('Token');
  const token = await tokenFactory.deploy(name, symbol, supply);
  await token.deployed();
  console.log('token address : ', token.address);
  const amount = 250;
  const voter1 = hre.ethers.utils.getAddress("0x836C31094bEa1aE6b65F76D1C906b01329645a94");
  await token.transfer(voter1, amount);
  // Deploy timelock
  const minDelay = 1 // How long do we have to wait until we can execute after a passed proposal

  // In addition to passing minDelay, we also need to pass 2 arrays.
  // The 1st array contains addresses of those who are allowed to make a proposal.
  // The 2nd array contains addresses of those who are allowed to make executions.
  const timelockFactory = await hre.ethers.getContractFactory('TimeLock');
  const timelock = await timelockFactory.deploy(minDelay, [voter1, executor], [voter1, executor]);
  await timelock.deployed();
  console.log('timelock address : ', timelock.address);
  
  // Deploy governanace
  const quorum = 5 // Percentage of total supply of tokens needed to aprove proposals (5%)
  const votingDelay = 0 // How many blocks after proposal until voting becomes active
  const votingPeriod = 5 // How many blocks to allow voters to vote
  const daoFactory = await hre.ethers.getContractFactory('ReceptionDAO');
  const dao = await daoFactory.deploy(token.address, timelock.address, quorum, votingDelay, votingPeriod);
  await dao.deployed();
  console.log('dao address : ',dao.address);

  // Deploy Treasury
  const funds = hre.ethers.utils.parseEther('0.5');
  const treasuryFactory = await hre.ethers.getContractFactory('Treasury');
  const treasury = await treasuryFactory.deploy(executor, {value: funds});
  await treasury.deployed();
  console.log('treasury deployed : ', treasury.address);
  await treasury.transferOwnership(timelock.address, { from: executor });

  // Grant Treasury Roles
  const proposerRole = await timelock.PROPOSER_ROLE();
  const executorRole = await timelock.EXECUTOR_ROLE();

  await timelock.grantRole(proposerRole, dao.address, { from: executor });
  await timelock.grantRole(executorRole, dao.address, { from: executor });
  console.log('timelock roles granted');

  // Deploy WorksManager
  const worksManagerFactory = await hre.ethers.getContractFactory('WorksManager');
  const worksManager = await worksManagerFactory.deploy();
  await worksManager.deployed();
  console.log('worksManager address : ',worksManager.address);

  // Grant WorksManager Token Ownership
  await token.transferTokenOwnership(worksManager.address);
  await worksManager.setTokenAddress(token.address);
  
  // Deploy Channel
  const channelContractFactory = await hre.ethers.getContractFactory('Channels');
  const channelContract = await channelContractFactory.deploy(worksManager.address);
  await channelContract.deployed();
  console.log('channels address : ' + channelContract.address);
  
  await worksManager.setChannelsAddress(channelContract.address);
  const channelCost = hre.ethers.utils.parseEther('0');
  await worksManager.setChannelCost(channelCost);

  // Deploy Channel
  const membershipsContractFactory = await hre.ethers.getContractFactory('Memberships');
  const membershipsContract = await membershipsContractFactory.deploy("RFMChannels", worksManager.address, channelContract.address);
  await membershipsContract.deployed();
  console.log('memberships address : ' + membershipsContract.address);
  
  const membershipCommission = hre.ethers.utils.parseEther('0');
  await worksManager.setMembershipsAddress(membershipsContract.address);
  await membershipsContract.setCommission(2);
  //await membershipsContract.setChannelsAddress(channelContract.address);
  
  const postFactoryContractFactory = await hre.ethers.getContractFactory('PostFactory');
  const postFactoryContract = await postFactoryContractFactory.deploy(worksManager.address, channelContract.address, membershipsContract.address);
  await postFactoryContract.deployed();
  console.log(postFactoryContract.address);
  console.log('postFactory address : ' + postFactoryContract.address);
  
  await worksManager.setPostFactoryAddress(postFactoryContract.address);
  console.log('Contract deployment complete');

  return [worksManager,channelContract];
}

const sendMoney = async () => {
  const accounts = await hre.ethers.getSigners();
  const gas_price = await hre.ethers.provider.getGasPrice();
  let account1 = accounts[0];

  console.log("Account balance:", (await account1.getBalance()).toString());
  

  let results = await account1.sendTransaction({
    to: '0x836C31094bEa1aE6b65F76D1C906b01329645a94',
    value : hre.ethers.utils.parseEther('100'),
  });

  let results2 = await account1.sendTransaction({
    to: '0xF1D3Ae318edd8dAA3Bd97B24a6CCb6c3A8b581cF',
    value : hre.ethers.utils.parseEther('100'),
  });


  let results3 = await account1.sendTransaction({
    to: '0x90096700E912D140931701d986F979b413488f5B',
    value : hre.ethers.utils.parseEther('100'),
  });

  let results4 = await account1.sendTransaction({
    to: '0xe33a4454824D32259D532057De08aC871d3bE8e5',
    value : hre.ethers.utils.parseEther('100'),
  });
  
}

const main = async () => {
  try {
    await hre.network.provider.send("hardhat_reset");
    let [worksManager, channelContract] = await deployContracts();
    console.log('runMain - worksManager address : ', worksManager.address);
    
    //let sendMoney1 = await sendMoney();
    //let testResult = await mainTest(worksManager, 'TestChannel1', channelContract);

    //let channelId = await mainChannels(worksManager, channelName);
    //console.log(channelId);
    //await mainMemberships(worksManager, channelId[0], channel_base);
    //await mainPosts(worksManager, channelId[0], channelName);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

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



main();