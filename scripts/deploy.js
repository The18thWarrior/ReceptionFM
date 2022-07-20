/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let nftStore = require('nft.storage');
require('ipfs-car/pack');
require("hardhat");
const ethers = require('ethers');
require("dotenv").config();

// Run local node - npx hardhat node
// local execution up 1 - npx hardhat run ../scripts/1-init.js --network localhost
// local execution - npx hardhat run scripts/1-init.js --network localhost
// network deploy - npx hardhat run scripts/deploy.js --network mumbai


const nftStorageApiKey = process.env.NFT_STORAGE_API_KEY;
const nftStorageClient = new nftStore.NFTStorage({ token: nftStorageApiKey })
const apiAddress = process.env.API_ETH_ADDRESS;

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
  // Deploy timelock
  const minDelay = 1 // How long do we have to wait until we can execute after a passed proposal

  // In addition to passing minDelay, we also need to pass 2 arrays.
  // The 1st array contains addresses of those who are allowed to make a proposal.
  // The 2nd array contains addresses of those who are allowed to make executions.
  const timelockFactory = await hre.ethers.getContractFactory('TimeLock');
  const timelock = await timelockFactory.deploy(minDelay, [executor], [executor]);
  await timelock.deployed();
  
  // Deploy governanace
  const quorum = 5 // Percentage of total supply of tokens needed to aprove proposals (5%)
  const votingDelay = 0 // How many blocks after proposal until voting becomes active
  const votingPeriod = 5 // How many blocks to allow voters to vote
  const daoFactory = await hre.ethers.getContractFactory('ReceptionDAO');
  const dao = await daoFactory.deploy(token.address, timelock.address, quorum, votingDelay, votingPeriod);
  await dao.deployed();

  // Deploy Treasury
  const funds = hre.ethers.utils.parseEther('0.5');
  const treasuryFactory = await hre.ethers.getContractFactory('Treasury');
  const treasury = await treasuryFactory.deploy(executor, {value: funds});
  await treasury.deployed();


  await treasury.transferOwnership(timelock.address, { from: executor });
  const  timelockOwner = await treasury.owner();
  // Grant Treasury Roles
  const proposerRole = await timelock.PROPOSER_ROLE();
  const executorRole = await timelock.EXECUTOR_ROLE();

  await timelock.grantRole(proposerRole, dao.address, { from: executor });
  await timelock.grantRole(executorRole, dao.address, { from: executor });
  // add assert for timelock role granting
      
  const worksManagerFactory = await hre.ethers.getContractFactory('WorksManager');
  const worksManager = await worksManagerFactory.deploy(apiAddress);
  await worksManager.deployed();

  await token.transferTokenOwnership(worksManager.address);
  await worksManager.setTokenAddress(token.address);

  const channelContractFactory = await hre.ethers.getContractFactory('Channels');
  const channelContract = await channelContractFactory.deploy(worksManager.address, apiAddress);
  await channelContract.deployed();

  await worksManager.setChannelsAddress(channelContract.address);
  
  await worksManager.setChannelCost(hre.ethers.utils.parseEther('1'));
  await channelContract.getCost();

  const membershipsContractFactory = await hre.ethers.getContractFactory('Memberships');
  const membershipsContract = await membershipsContractFactory.deploy("RFMChannels", worksManager.address, channelContract.address, 5);
  await membershipsContract.deployed();
  
  await worksManager.setMembershipsAddress(membershipsContract.address);
  const _membershipsContract = await worksManager.getMembershipsAddress();

  const postFactoryContractFactory = await hre.ethers.getContractFactory('PostFactory');
  const postFactoryContract = await postFactoryContractFactory.deploy(worksManager.address, channelContract.address, membershipsContract.address, apiAddress);
  await postFactoryContract.deployed();
  
  await worksManager.setPostFactoryAddress(postFactoryContract.address);

  return [worksManager, token, channelContract, dao, timelock];
}


const runMain = async () => {
  try {
    //await hre.network.provider.send("hardhat_reset");
    let [worksManager, token, channelContract, dao, timelock] = await deployContracts();
    console.log('worksManager address : ', worksManager.address);
    console.log('token address : ', token.address);
    console.log('channel address : ', channelContract.address);
    console.log('dao address : ', dao.address);
    console.log('timelock address : ', timelock.address);
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