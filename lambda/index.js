

// Used for testing in local env
require('dotenv').config();
var AWS = require('aws-sdk'),
    region = "us-west-2";
const https = require('https');
var querystring = require('querystring');
const utility = require('./scripts/utility.js');
const Web3 = require('web3');
const ABI = require('../artifacts/contracts/WorksManager.sol/WorksManager.json');
const { EventDetail, createEvent } = require('./scripts/db.js');

/*MongoClient.connect(
  connection_string2, {
      useNewUrlParser: true
  },
  function (err,client) {
      console.log(err,client);
  }
);*/


const contractAddress = process.env.WORKSMANAGER_ADDRESS_MUMBAI;
const wsUri = process.env.prod ? process.env.ALCHEMY_WS_URI : process.env.PUBLIC_WS_URI;
const days = 60;

const web3 = new Web3(new Web3.providers.WebsocketProvider(wsUri));

const getAllEvents = async () => {
  console.log('getAllEvents');
  const contract = new web3.eth.Contract(ABI.abi, contractAddress);
  const txn = await contract.getPastEvents('allEvents',{
    fromBlock: 0,
    toBlock: 'latest'
  });
  let finalEvents = [];
  
  for (let i = 0;i<txn.length;i++) {
    const txnEvent = txn[i];
    let event = EventDetail();
    event.blockNumber = txnEvent.blockNumber;
    event.type = txnEvent.event;
    event.transactionHash  = txnEvent.transactionHash;
    for (let e in txnEvent.returnValues) {
      if (e === 'role'){
        event.role = txnEvent.returnValues[e];
      } else if (e === 'account') {
        event.account = txnEvent.returnValues[e];
      } else if (e === 'sender') {
        event.sender = txnEvent.returnValues[e];
      } else if (e === 'keywords') {
        event.keywords = txnEvent.returnValues[e];
      } else if (e === 'channelId') {
        event.channelId = txnEvent.returnValues[e];
      } else if (e === 'postId') {
        event.postId = txnEvent.returnValues[e];
      } else if (e === 'channelId') {
        event.channelId = txnEvent.returnValues[e];
      } else if (e === 'postContractAddress') {
        event.postContractAddress = txnEvent.returnValues[e];
      } else if (e === 'msg') {
        event.msg = txnEvent.returnValues[e];
      }
    }
    finalEvents.push(createEvent(event));
  }

  return Promise.allSettled(finalEvents);
  
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
  //await getReceptionProfileSet();
  //await getNewPostMessage();
  //await getNewPost();
  const results = await getAllEvents();
  console.log(results);
  process.exit();
}
//setIPNSKeys();
//syncData();