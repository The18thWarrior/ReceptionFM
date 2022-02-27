

//const provider = new ethers.providers.Web3Provider(window.Ethereum);
function ConnectWalletButton(props) {
    
  const connectWallet = (event) => {
    console.log(window.Ethereum);
    //console.log(ethers);
  };

  return (
    <button onClick={connectWallet} className="connect-button">Connect</button>
  )
}

function Player(props){
  //it returns the reusable code that
  //we want to render on actual html page
  return(
      //we are adding the first player div info
      <div className="player">
        <h1>{props.name}</h1>
        <p>My hobby: {props.hobby}</p>
        <ConnectWalletButton></ConnectWalletButton>
      </div>
  );
}
var app= (
  <div>
      <Player name="Steve" hobbey="Cricket"/>
  </div>
);
ReactDOM.render(app,document.querySelector('#app'));