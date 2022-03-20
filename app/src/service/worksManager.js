
import { utils, ethers, FixedNumber } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import worksManagerAbi from '../static/worksManagerAbi.json';
import { env } from '../static/constants';
import {BigNumber} from '@ethersproject/bignumber';
const { ethereum } = window;
console.log(ethereum.networkVersion);


const CHANNEL_COST = ".002";

export const mintChannel = async function(channelName, channelMetadata, author, copyright, language) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.mintChannel(channelName, channelMetadata, author, copyright, language, options);
  console.log('Mining....', nftTx.hash);

  let tx = await nftTx.wait();

  return 'success';
}

export const getOwnerChannelIds = async function() {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.getOwnerChannelIds();
  return nftTx;
}

export const getChannelMetadata = async function(channelId) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.getChannelMetadata(channelId);
  return nftTx;
}

export const membershipTokenCreate = async function(channel, cost, level, computedUri) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let parsedCost = ethers.utils.parseEther(String(cost));
  console.log(parsedCost);
  let nftTx = await nftContract.membershipTokenCreate(channel, parsedCost, level, computedUri);
  let tx = await nftTx.wait();
  return 'success';
}

export const getMembershipList = async function(channelId) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.getMembershipList(channelId);
  return nftTx;
}

export const getMembershipUri = async function(membershipId) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.membershipUri(membershipId);
  return nftTx;
}

export const getMembership = async function(membershipId) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  let nftTx = await nftContract.getMembership(membershipId);
  return nftTx;
}

export const mintChannelMembership = async function(channel, level, cost) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  const options = {value: ethers.utils.parseEther(String(cost))}
  let nftTx = await nftContract.membershipMint(channel, level, options);

  let tx = await nftTx.wait();

  return 'success';
}

export const getChannelPostContract = async function(channelToken) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.getChannelPostContract(channelToken);
  return nftTx;
}

export const createPostContract = async function(tokenName, channel) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.createPostContract(tokenName, channel);
  let tx = await nftTx.wait();
  return 'success';
}

export const getPostIndex = async function(postAddress) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  let nftTx = await nftContract.getPostTokenIndex(postAddress);
  return nftTx;
}

export const getPostUri = async function(postAddress, postId) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  let nftTx = await nftContract.getPostUri(postAddress, postId);
  return nftTx;
}

export const getPostTokenBalance = async function(postAddress, postId) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  let nftTx = await nftContract.getPostTokenBalance(postAddress, postId);
  return nftTx;
}

export const postIsMintable = async function(postAddress, postId) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  let nftTx = await nftContract.postIsMintable(postAddress, postId);
  return nftTx;
}

export const postIsBuyable = async function(postAddress, postId) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  let nftTx = await nftContract.postIsBuyable(postAddress, postId);
  return nftTx;
}

export const postGetCost = async function(postAddress, postId) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  let nftTx = await nftContract.postGetCost(postAddress, postId);
  return nftTx;
}

export const postMint = async function(postAddress, membershipId, postId) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  let nftTx = await nftContract.postMint(postAddress, membershipId, postId);
  return nftTx;
}

export const postMintPayable = async function(postAddress, membershipId, postId, cost) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId ===  Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  const options = {value: ethers.utils.parseEther(String(cost))}
  let nftTx = await nftContract.postMint(postAddress, membershipId, postId, options);
  return nftTx;
}

export const createPostToken = async function(postAddress, cost, isBuyable, isPublic, computedUri, paywallUri, mintable, levels) {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId === Number(env.REACT_APP_CHAIN_ID)) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.createPostToken(postAddress, cost, isBuyable, isPublic, computedUri, paywallUri, mintable, levels);
  return nftTx;
}

export const getCurrentChannelIndex = async function() {
  const chainId = BigNumber.from(ethereum.chainId).toNumber();
  const worksManagerAddress = (chainId === Number( Number(env.REACT_APP_CHAIN_ID))) ? env.REACT_APP_WORKSMANAGER_ADDRESS : env.REACT_APP_WORKSMANAGER_ADDRESS_MUMBAI;
  //console.log(chainId,Number( Number(env.REACT_APP_CHAIN_ID)), worksManagerAddress);
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract(
    worksManagerAddress,
    worksManagerAbi.abi,
    signer
  );
  //const options = {value: ethers.utils.parseEther(CHANNEL_COST)}
  let nftTx = await nftContract.getCurrentChannelIndex();
  return nftTx;
}
