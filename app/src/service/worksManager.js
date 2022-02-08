
import { utils, ethers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import worksManagerAbi from '../static/worksManagerAbi.json';
import { env } from '../static/constants';
const { ethereum } = window;
const worksManagerAddress = env.REACT_APP_WORKSMANAGER_ADDRESS;

const provider = new ethers.providers.Web3Provider(ethereum)
const signer = provider.getSigner()
const nftContract = new ethers.Contract(
  worksManagerAddress,
  worksManagerAbi.abi,
  signer
);

const CHANNEL_COST = "0.25";

export const mintChannel = async function(channelName, channelMetadata) {
  const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  console.log(channelMetadata);
  let nftTx = await nftContract.mintChannel(channelName, channelMetadata, options);
  console.log('Mining....', nftTx.hash);

  let tx = await nftTx.wait();
  console.log(tx);

  return 'success';
}

export const getOwnerChannelIds = async function() {
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.getOwnerChannelIds();
  return nftTx;
}

export const getChannelMetadata = async function(channelId) {
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.getChannelMetadata(channelId);
  return nftTx;
}

export const membershipTokenCreate = async function(channel, cost, level, computedUri) {
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.membershipTokenCreate(channel, cost, level, computedUri);
  let tx = await nftTx.wait();
  console.log(tx);
  return 'success';
}

export const getMembershipList = async function(channelId) {
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.getMembershipList(channelId);
  return nftTx;
}

export const getMembershipUri = async function(membershipId) {
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.membershipUri(membershipId);
  return nftTx;
}


export const getChannelPostContract = async function(channelToken) {
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.getChannelPostContract(channelToken);
  return nftTx;
}

export const createPostContract = async function(tokenName, channel) {
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.createPostContract(tokenName, channel);
  let tx = await nftTx.wait();
  console.log(tx);
  return 'success';
}