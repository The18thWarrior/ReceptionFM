require('dotenv').config();
var { NFTStorage, File, Blob } = require('nft.storage');
var { create } = require('ipfs-http-client');

const projectId = process.env.INFURA_IPFS_ID;
const projectSecret = process.env.INFURA_IPFS_SECRET;
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

/*const client2 = create({
    host: 'reception.infura-ipfs.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});*/
const client = create();
//Static References
const nftStorageAddress = process.env.NFT_STORAGE_API_KEY;

//const contract = new Contract(wethContractAddress, wethInterface);
const storageClient = new NFTStorage({ token: nftStorageAddress });

exports.storeRawMetadata = async (metadata) => {
  const cid = await storageClient.storeBlob(new Blob(metadata));
  //console.log(cid);
  return cid;
}

exports.storeIPNS = async (cid, id) => {
  console.log('ipns store: ', id);
  const res = await client.name.publish(cid, {
    key: id
  });
  //console.log(`https://gateway.ipfs.io/ipns/${res.name}`);
  //console.log(res);
  return res;
}

exports.createKeys = async (keyname) => {
  const key = await client.key.gen(keyname, {
      type: 'rsa',
      size: 2048
  });
  return key;
}

exports.getKey = async (keyname) => {
  const keys = await client.key.list();
  for (let i of keys) {
    if (i.name === keyname) {
      return i;
    }
  }
}