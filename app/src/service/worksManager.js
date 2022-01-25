import env from "react-dotenv";
import { utils, ethers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import worksManagerAbi from '../static/worksManagerAbi.json';

const worksManagerAddress = env.REACT_APP_WORKSMANAGER_ADDRESS;
const { ethereum } = window;
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
        
  let nftTx = await nftContract.mintChannel(channelName, channelMetadata, options);
  console.log('Mining....', nftTx.hash);

  let tx = await nftTx.wait();
  console.log(tx);

  return 'success';
}