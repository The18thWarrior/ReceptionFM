

// Used for testing in local env
require('dotenv').config();
var AWS = require('aws-sdk'),
    region = "us-west-2";
const https = require('https');
var querystring = require('querystring');
const utility = require('./scripts/utility.js');
const Web3 = require('web3');
const ABI = require('../artifacts/contracts/WorksManager.sol/WorksManager.json');
const { util } = require('chai');

const contractAddress = process.env.WORKSMANAGER_ADDRESS_MUMBAI;
const wsUri = process.env.ALCHEMY_WS_URI;
const days = 14;

const web3 = new Web3(new Web3.providers.WebsocketProvider(wsUri));
/**
   * Main handler for Lambda function, wil only receive SNS event types
   * @param {!event} obj event object containing request details 
*/
exports.handler = (event) => {
  getReceptionProfileSet();
}; 

const getReceptionProfileSet = async () => {
  console.log('getReceptionProfileSet');
  const block = await web3.eth.getBlockNumber();
  console.log(block);
  let currblock = block - (43000 * days);
  let blockmod = (block - currblock)/10000;
  const contract = new web3.eth.Contract(ABI.abi, contractAddress);
  let transactionList = [];
  let oldestBlock = 0;
  for (let i = 0;i<blockmod;i++) {
    let toBlock = block - (i*10000);
    let fromBlock = block - ((i+1)*10000);
    const txn = await contract.getPastEvents('ReceptionProfileSet', {
      fromBlock,
      toBlock
    });
    //console.log('...'+i + ' of ' + blockmod);
    if (txn.length > 0) {
      console.log('found txn');
      transactionList = [...transactionList, ...txn];
      oldestBlock = i;
    }
  }
  const cid = await utility.storeRawMetadata(JSON.stringify(transactionList));
  const keyId = await utility.getKey('ReceptionProfileSet');
  console.log(keyId);
  const result = await utility.storeIPNS(cid, keyId['id']);
  
  console.log('ReceptionProfileSet', result);
  
  
  //const result = await utility.storeIPNS('bafkreicri2rp7t7kegjkaxh43lljlzdia43olz2nv7kjbz4f3uwx5gebgu');  
  
};

const getNewPostMessage = async () => {
  console.log('getNewPostMessage');
  const block = await web3.eth.getBlockNumber();
  let currblock = block - (43000 * days);
  let blockmod = (block - currblock)/10000;
  const contract = new web3.eth.Contract(ABI.abi, contractAddress);
  let transactionList = [];
  let oldestBlock = 0;
  for (let i = 0;i<blockmod;i++) {
    let toBlock = block - (i*10000);
    let fromBlock = block - ((i+1)*10000);
    const txn = await contract.getPastEvents('NewPostMessage', {
      fromBlock,
      toBlock
    });
    //console.log('...'+i + ' of ' + blockmod);
    if (txn.length > 0) {
      console.log('found txn');
      transactionList = [...transactionList, ...txn];
      oldestBlock = i;
    }
  }  
  const cid = await utility.storeRawMetadata(JSON.stringify(transactionList));
  const keyId = await utility.getKey('NewPostMessage');
  console.log(keyId);
  const result = await utility.storeIPNS(cid, keyId['id']);
  
  console.log('NewPostMessage', result);
};

const getNewPost = async () => {
  console.log('getNewPost');
  const block = await web3.eth.getBlockNumber();
  let currblock = block - (43000 * days);
  let blockmod = (block - currblock)/10000;
  const contract = new web3.eth.Contract(ABI.abi, contractAddress);
  let transactionList = [];
  let oldestBlock = 0;
  for (let i = 0;i<blockmod;i++) {
    let toBlock = block - (i*10000);
    let fromBlock = block - ((i+1)*10000);
    const txn = await contract.getPastEvents('NewPost', {
      fromBlock,
      toBlock
    });
    //console.log('...'+i + ' of ' + blockmod);
    if (txn.length > 0) {
      transactionList = [...transactionList, ...txn];
      oldestBlock = i;
    }
  }
  const cid = await utility.storeRawMetadata(JSON.stringify(transactionList));
  const keyId = await utility.getKey('NewPost');
  const result = await utility.storeIPNS(cid, keyId['id']);
  console.log('NewPost', result);
  
};

const setIPNSKeys = async() => {
  let val = await utility.createKeys('ReceptionProfileSet');
  console.log(val);
  let val2 = await utility.createKeys('NewPostMessage');
  console.log(val2);
  let val3 = await utility.createKeys('NewPost');
  console.log(val3);
}


const syncData = async() => {
  await getReceptionProfileSet();
  await getNewPostMessage();
  await getNewPost();
  //console.log(await utility.getKey('ReceptionProfileSet'));
  //await utility.storeIPNS('bafkreic2hyiqnxex2izyp6splwzvxyh55e6wi33mxaztp66m4oizutdivu', 'NewPost');
  process.exit();
}
//setIPNSKeys();
syncData();