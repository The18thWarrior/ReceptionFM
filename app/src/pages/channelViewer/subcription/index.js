import ChannelList from './channelList.js';


function Subscription() {
  console.log('home');
  return (
    <div  className="dark-background" style={{ height: ' 100vh'}}>
      <ChannelList></ChannelList>
    </div>
  );
}

export default Subscription;
