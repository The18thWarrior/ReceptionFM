import { Routes,  Route } from 'react-router-dom';
import ChannelCreator from './components/channelCreator';
import ChannelList from './components/channelList';
import ChannelDetail from './components/channelDetail';


function ChannelManager() {
  return (
    <Routes>
      <Route exact path="/manage"  element={<ChannelList />}/>
      <Route exact path="/manage/create"  element={<ChannelCreator />}/>
      <Route exact path="/manage/:id"  element={<ChannelDetail />}/>
    </Routes>
  );
}

export default ChannelManager;
