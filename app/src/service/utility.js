import env from "react-dotenv";
import { basicSvg } from "../static/constants";
import { NFTStorage, File, Blob } from 'nft.storage';
//Static References
const nftStorageAddress = env.REACT_APP_NFT_STORAGE_API_KEY;

//const contract = new Contract(wethContractAddress, wethInterface);
const storageClient = new NFTStorage({ token: nftStorageAddress });

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

export const storeNFTMetadata = async (name, description, image, type, mapping) => {
  let rawObj;
  if (image) {
    rawObj = {
      name: name,
      description: description,
      image: new File(
        [
          image
        ],
        'image',
        { type: image.type }
      )
    };
  } else {
    
    let svgString = basicSvg.svgPartOne + basicSvg.svgPartTwo + basicSvg.svgPartThree;
    const metadata1Image = String.format(svgString, name + ' '+ type);
    const metadata1Blob = new Blob([metadata1Image], {type: 'image/svg+xml'});
    rawObj = {
      name: name,
      description: description,
      image: metadata1Blob
    };
  }

  if (mapping) {
    for(let m in mapping) {
      rawObj[m] = mapping[m];
    }
  }
  
  let metadata = await storageClient.store(rawObj);
  return metadata;
}

export const storeRawMetadata = async (metadata) => {
  const cid = await storageClient.storeBlob(new Blob(metadata))
  return cid;
}

export const cleanImageUrl = (uri) => {
  return "https://ipfs.io/ipfs/"+uri.replace('ipfs://', '');
}

export const fetchMetadata = async (token, metadataUri) => {
  let metadataResponse = null;
  if (metadataUri && !metadataUri.includes('ipfs')) {
    let metadataRequest = await fetch("https://ipfs.io/ipfs/"+metadataUri+'/metadata.json');
    metadataResponse = await metadataRequest.json();
    metadataResponse["key"] = token.toHexString();
    metadataResponse["id"] = token.toHexString();
    metadataResponse["parse_image"] = cleanImageUrl(metadataResponse.image);
  }
  return metadataResponse;
}