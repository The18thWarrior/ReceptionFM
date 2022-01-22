import './App.css';
import Home from './pages/home';
import Account from './pages/account';
import ChannelManager from './pages/channelManager/routes';
import Header from './components/header/header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/account' element={<Account />} />
        <Route path='/manage' element={<ChannelManager />} />
      </Routes>
    </BrowserRouter>
    );
}

export default App;
