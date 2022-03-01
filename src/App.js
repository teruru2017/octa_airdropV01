// import React from "react"
import { Route, Switch } from 'react-router-dom';

import MainHeader from './components/MainHeader';

import Home from './pages/Home'
import Airdrop from './pages/Airdrop'
import Marketplace from './pages/Marketplace'
import Inventory from './pages/Inventory'

function App() {
  return <div>

    <MainHeader />

    <div>
      <Switch>
        <Route path='/' exact><Home /></Route>
        <Route path='/airdrop'><Airdrop /></Route>
        <Route path='/marketplace'><Marketplace /></Route>
        <Route path='/inventory'><Inventory /></Route>

      </Switch>
    </div>

  </div>
}

export default App