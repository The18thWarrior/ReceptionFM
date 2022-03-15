
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

const CHANNEL_COST = "2";

export const mintChannel = async function(channelName, channelMetadata, author, copyright, language) {
  const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.mintChannel(channelName, channelMetadata, author, copyright, language, options);
  console.log('Mining....', nftTx.hash);

  let tx = await nftTx.wait();

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

export const getMembership = async function(membershipId) {
  let nftTx = await nftContract.getMembership(membershipId);
  return nftTx;
}

export const mintChannelMembership = async function(channel, level, cost) {
  const options = {value: ethers.utils.parseEther(String(cost))}
  let nftTx = await nftContract.membershipMint(channel, level, options);

  let tx = await nftTx.wait();

  return 'success';
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
  return 'success';
}

export const getPostIndex = async function(postAddress) {
  let nftTx = await nftContract.getPostTokenIndex(postAddress);
  return nftTx;
}

export const getPostUri = async function(postAddress, postId) {
  let nftTx = await nftContract.getPostUri(postAddress, postId);
  return nftTx;
}

export const getPostTokenBalance = async function(postAddress, postId) {
  let nftTx = await nftContract.getPostTokenBalance(postAddress, postId);
  return nftTx;
}

export const postIsMintable = async function(postAddress, postId) {
  let nftTx = await nftContract.postIsMintable(postAddress, postId);
  return nftTx;
}

export const postIsBuyable = async function(postAddress, postId) {
  let nftTx = await nftContract.postIsBuyable(postAddress, postId);
  return nftTx;
}

export const postGetCost = async function(postAddress, postId) {
  let nftTx = await nftContract.postGetCost(postAddress, postId);
  return nftTx;
}

export const postMint = async function(postAddress, membershipId, postId) {
  let nftTx = await nftContract.postMint(postAddress, membershipId, postId);
  return nftTx;
}

export const postMintPayable = async function(postAddress, membershipId, postId, cost) {
  const options = {value: ethers.utils.parseEther(String(cost))}
  let nftTx = await nftContract.postMint(postAddress, membershipId, postId, options);
  return nftTx;
}

export const createPostToken = async function(postAddress, cost, isBuyable, isPublic, computedUri, paywallUri, mintable, levels) {
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.createPostToken(postAddress, cost, isBuyable, isPublic, computedUri, paywallUri, mintable, levels);
  return nftTx;
}

export const getCurrentChannelIndex = async function() {
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.getCurrentChannelIndex();
  return nftTx;
}
