import env from "react-dotenv";
import { BigNumber } from "ethers";
import { useContractCall } from "@usedapp/core";

import worksManagerAbi from '../../../../static/worksManagerAbi.json';
const worksManagerAddress = env.REACT_APP_WORKSMANAGER_ADDRESS;


const useMintChannel = (channelName, metadataUri) => {
  /*if (channelName.length > 0 && metadataUri.length > 0) {
    const [[result]] =
    useContractCall({
      abi: worksManagerAbi,
      address: worksManagerAddress,
      method: "mintChannel",
      args: [channelName, metadataUri],
    }) ?? null;

    return { result };
  }*/
  
};

export { useMintChannel };