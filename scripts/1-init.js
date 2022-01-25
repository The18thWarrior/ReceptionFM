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
// local execution - npx hardhat run scripts/1-init.js --network localhost
// network deploy - npx hardhat run scripts/2-deploy.js --network mumbai
//console.log(nftStore);
// NFT Storage
const nftStorageApiKey = process.env.NFT_STORAGE_API_KEY;
const nftStorageClient = new nftStore.NFTStorage({ token: nftStorageApiKey })

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
  const metadata1Image = String.format(svgString, String.format(name_base, 'Bronze'));
  const metadata1Blob = new nftStore.Blob([metadata1Image], {type: 'image/svg+xml'});
  const metadata1 = await nftStorageClient.store({
    name: String.format(name_base, 'Bronze'),
    description: 'Membership token',
    image: metadata1Blob,
    channel: channel.toHexString(),
    level: 'bronze'
  });

  // 1.5a
  // Call the function.
  let txn = await worksManager.membershipTokenCreate(channel.toHexString(), 0, 'bronze', metadata1.url);
  // Wait for it to be mined.
  await txn.wait();
  console.log('create membership 1 complete', txn.value);

  // 1.4b
  // Construct Metadata
  const metadata2Image = String.format(svgString, String.format(name_base, 'Silver'));
  const metadata2Blob = new nftStore.Blob([metadata2Image], {type: 'image/svg+xml'});
  const metadata2 = await nftStorageClient.store({
    name: String.format(name_base, 'Silver'),
    description: 'Membership token',
    image:  metadata2Blob,
    channel: channel.toHexString(),
    level: 'silver'
  });
  
  // 1.5b
  let txn2 = await worksManager.membershipTokenCreate(channel.toHexString(), 0, 'silver', metadata2.url);
  // Wait for it to be mined.
  await txn2.wait();
  console.log('create membership 2 complete', txn2.value);
  
  // 2.4a
  let txn3 = await worksManager.membershipUri(0);
  console.log(txn3);
  
  // 2.4b
  let txn4 = await worksManager.membershipUri(1);
  console.log(txn4);

  // 2.3
  let txn5 = await worksManager.getMembershipList(channel.toHexString());
  console.log(txn5);

  // 2.5
  await worksManager.membershipMint(channel.toHexString(), 'silver');
  console.log('membershipMint complete');
  
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

  // 1.2
  // Call the function.
  let txn = await worksManager.mintChannel(channelName, metadata1.url);
  // Wait for it to be mined.
  await txn.wait();
  console.log('mint channel complete');

  // 1.3
  let txn2 = await worksManager.getOwnerChannelIds();
  return txn2;
  
};

const deployContracts = async () => {
  
  const worksManagerFactory = await hre.ethers.getContractFactory('WorksManager');
  const worksManager = await worksManagerFactory.deploy();
  await worksManager.deployed();
  //console.log('worksManager address : ',worksManager.address);
  
  const channelContractFactory = await hre.ethers.getContractFactory('Channels');
  const channelContract = await channelContractFactory.deploy(worksManager.address);
  await channelContract.deployed();
  //console.log('channels address : ' + channelContract.address);

  await worksManager.setChannelsAddress(channelContract.address);
  //console.log('setChannelsAddress complete');

  const membershipsContractFactory = await hre.ethers.getContractFactory('Memberships');
  const membershipsContract = await membershipsContractFactory.deploy("RFMChannels", worksManager.address);
  await membershipsContract.deployed();
  //console.log(membershipsContract.address);
  //console.log('memberships address : ' + membershipsContract.address);
  
  await worksManager.setMembershipsAddress(membershipsContract.address);
  //console.log('setMembershipsAddress complete');

  
  const postContractFactory = await hre.ethers.getContractFactory('Posts');
  const postContract = await postContractFactory.deploy("default Post", "DFLT", worksManager.address);
  await postContract.deployed();
  //console.log(postFactoryContract.address);
  //console.log('postFactory address : ' + postFactoryContract.address);
  
  await worksManager.setPostAddress(postContract.address);
  
  const postFactoryContractFactory = await hre.ethers.getContractFactory('PostFactory');
  const postFactoryContract = await postFactoryContractFactory.deploy(worksManager.address, postContract.address);
  await postFactoryContract.deployed();
  //console.log(postFactoryContract.address);
  //console.log('postFactory address : ' + postFactoryContract.address);
  
  await worksManager.setPostFactoryAddress(postFactoryContract.address);
  console.log('Contract deployment complete');

  return worksManager;
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
  
  console.log(results);
}

const runMain = async () => {
  try {
    //let channelName = 'Our House Channel';
    //let channel_base = 'Our House - {0} Membership';
    //await hre.network.provider.send("hardhat_reset");
    let worksManager = await deployContracts();
    console.log('runMain - worksManager address : ', worksManager.address);
    //let sendMoney1 = await sendMoney();

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



runMain();