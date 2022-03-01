import { NavLink } from 'react-router-dom';

import classes from './MainHeader.module.scss';
import logo from './logo.png';

import ConnectWallet from '../ConnectWallet';

const MainHeader = () => {
    return (
        <header className={classes.header}>
            <NavLink to='/' className={classes.navbarBrand}><img src={logo} alt="" /></NavLink>

            <div className={classes.navbarNav}>
                <nav>
                    <NavLink exact activeClassName={classes.active} to='/'><span>Welcome</span></NavLink>
                    <NavLink activeClassName={classes.active} to='/airdrop'><span>Airdrop</span></NavLink>
                    <NavLink activeClassName={classes.active} to='/marketplace'><span>Marketplace</span></NavLink>
                    <NavLink activeClassName={classes.active} to='/inventory'><span>Inventory</span></NavLink>
                    <a href="https://whitepaper.dragonary.com/dragonary-whitepaper/v/english-whitepaper/" target={`_blank`}><span>Whitepaper</span></a>
                </nav>

                <div className='ml-3'>
                    <ConnectWallet />
                </div>
            </div>
        </header>
    );
};

export default MainHeader;